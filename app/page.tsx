'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Player, GuessResponseWithValues } from '../types/player';
import { getDailyPlayer, checkGuess } from '../services/gameService';
import GuessResult from '../components/GuessResult';
import SearchBar from '../components/SearchBar';
import InstructionsModal from '../components/InstructionsModal';
import Leaderboard from '../components/Leaderboard';
import StatsModal from '../components/StatsModal';
import GamePageContent from '../components/GamePageContent';
import { GameState } from '../types/game';
import { saveGameResult } from '../services/statsService';
import { trackEvent } from '../lib/analytics';
import { LEAGUE_OPTIONS } from '../lib/leagues';

const STORAGE_KEY = 'footle_game_state';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    currentGuess: '',
    dailyPlayer: null,
    gameOver: false,
    won: false,
    startTime: undefined,
    endTime: undefined,
  });
  const [showError, setShowError] = useState(false);
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const hasTrackedStartView = useRef(false);

  const maxGuesses = 10;
  const modeCards = [
    ...LEAGUE_OPTIONS.map((league) => ({
      href: `/league/${league.slug}`,
      title: league.name,
      description: `Daily ${league.name} guess`,
      accent: 'border-sky-500/30 text-sky-200',
    })),
    {
      href: '/grid',
      title: 'Football Grid',
      description: 'Fill a 3x3 club, league, and nation grid',
      accent: 'border-blue-500/30 text-blue-200',
    },
    {
      href: '/career',
      title: 'Career Mode',
      description: 'Guess the player from their club path',
      accent: 'border-emerald-500/30 text-emerald-200',
    },
    {
      href: '/player-of-the-season',
      title: 'Player of the Season',
      description: 'Build your footballer and simulate a season',
      accent: 'border-emerald-500/30 text-emerald-200',
    },
    {
      href: '/eight-zero',
      title: '8-0',
      description: 'Draft a World Cup XI and chase perfection',
      accent: 'border-emerald-500/30 text-emerald-200',
    },
    {
      href: '/archive',
      title: 'Archive Mode',
      description: 'Play footles from the last 30 days',
      accent: 'border-rose-500/30 text-rose-200',
    },
    {
      href: '/custom',
      title: 'Custom Game',
      description: 'Build your own challenge to share',
      accent: 'border-fuchsia-500/30 text-fuchsia-200',
    },
    {
      href: '/squadle',
      title: 'Squadle',
      description: 'The daily starting XI guessing game',
      accent: 'border-cyan-500/30 text-cyan-200',
    },
    {
      href: '/recall',
      title: 'Recall',
      description: 'Memorise stats, then pick the player',
      accent: 'border-indigo-500/30 text-indigo-200',
    },
    {
      href: '/transfer-generator',
      title: 'Transfer Generator',
      description: 'Create fake transfer rumors to share',
      accent: 'border-yellow-500/30 text-yellow-200',
    },
  ];

  const handleStartPlaying = () => {
    trackEvent('start_playing_click', {
      page_location: window.location.pathname,
      game: 'footle',
    });

    setGameStarted(true);
    setGameState(prev => ({ ...prev, startTime: Date.now() }));
  };

  useEffect(() => {
    // Load or initialize game state for today. Do NOT clear entire localStorage (preserve stats and other app data).
    if (typeof window !== 'undefined') {
      const today = new Date().toDateString();

      // Load saved game state from localStorage
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Only restore if it's from today
        if (parsedState.date === today) {
          setGameState(parsedState.state);
          setGameStarted(true);
        } else {
          // Remove stale state for this game only
          localStorage.removeItem(STORAGE_KEY);
          const player = getDailyPlayer();
          setGameState(prev => ({ ...prev, dailyPlayer: player }));
        }
      } else {
        // Initialize new game
        const player = getDailyPlayer();
        setGameState(prev => ({ ...prev, dailyPlayer: player }));
      }
    }
  }, []);

  useEffect(() => {
    if (!gameStarted && !hasTrackedStartView.current) {
      trackEvent('start_playing_view', {
        page_location: window.location.pathname,
        game: 'footle',
      });
      hasTrackedStartView.current = true;
    }
  }, [gameStarted]);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (gameStarted) {
      const stateToSave = {
        date: new Date().toDateString(),
        state: gameState,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [gameState, gameStarted]);

  const handleGuess = () => {
    if (!gameState.dailyPlayer || gameState.gameOver || !gameState.currentGuess.trim()) {
      return;
    }

    const result = checkGuess(gameState.dailyPlayer, gameState.currentGuess);
    
    if (!result) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const newGuesses = [
      ...gameState.guesses,
      { playerName: gameState.currentGuess, result }
    ];

    const won = result.isCorrect;
    const gameOver = won || newGuesses.length >= maxGuesses;

    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      currentGuess: '',
      gameOver,
      won,
      endTime: gameOver ? Date.now() : prev.endTime,
    }));

    // Save stats when game ends
    if (gameOver && gameState.startTime) {
      const timeTaken = Math.floor((Date.now() - gameState.startTime) / 1000);
      saveGameResult('all', won, newGuesses.length, timeTaken, maxGuesses);
    }
  };

  const generateShareText = () => {
    const today = new Date();
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    const shareText = [
      `Footle #${daysSinceEpoch} - ${gameState.won ? gameState.guesses.length : 'X'}/10`,
      '',
      ...gameState.guesses.map(guess => {
        return [
          guess.result.position === 'correct' ? '🟩' : guess.result.position === 'close' ? '🟨' : '⬜',
          guess.result.subPosition === 'correct' ? '🟩' : guess.result.subPosition === 'close' ? '🟨' : '⬜',
          guess.result.age === 'correct' ? '🟩' : guess.result.age === 'close' ? '🟨' : '⬜',
          guess.result.nationality === 'correct' ? '🟩' : guess.result.nationality === 'close' ? '🟨' : '⬜',
          guess.result.club === 'correct' ? '🟩' : guess.result.club === 'close' ? '🟨' : '⬜',
          guess.result.league === 'correct' ? '🟩' : guess.result.league === 'close' ? '🟨' : '⬜',
          guess.result.height === 'correct' ? '🟩' : guess.result.height === 'close' ? '🟨' : '⬜',
          guess.result.foot === 'correct' ? '🟩' : guess.result.foot === 'close' ? '🟨' : '⬜',
        ].join('');
      }),
      '',
      'https://footle.club'
    ].join('\n');

    return shareText;
  };

  const handleShare = async () => {
    const shareText = generateShareText();
    await copyToClipboard(shareText);
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook') => {
    const today = new Date();
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    const shareText = [
      `Footle #${daysSinceEpoch} - ${gameState.won ? gameState.guesses.length : 'X'}/10`,
      '',
      ...gameState.guesses.map(guess => {
        return [
          guess.result.position === 'correct' ? '🟩' : guess.result.position === 'close' ? '🟨' : '⬜',
          guess.result.subPosition === 'correct' ? '🟩' : guess.result.subPosition === 'close' ? '🟨' : '⬜',
          guess.result.age === 'correct' ? '🟩' : guess.result.age === 'close' ? '🟨' : '⬜',
          guess.result.nationality === 'correct' ? '🟩' : guess.result.nationality === 'close' ? '🟨' : '⬜',
          guess.result.club === 'correct' ? '🟩' : guess.result.club === 'close' ? '🟨' : '⬜',
          guess.result.league === 'correct' ? '🟩' : guess.result.league === 'close' ? '🟨' : '⬜',
          guess.result.height === 'correct' ? '🟩' : guess.result.height === 'close' ? '🟨' : '⬜',
          guess.result.foot === 'correct' ? '🟩' : guess.result.foot === 'close' ? '🟨' : '⬜',
        ].join('');
      }),
      'Follow us on X @footle_club',
      'https://footle.club'
    ].join('\n');

    const encodedText = encodeURIComponent(shareText);
    const url = encodeURIComponent('https://footle.club');
    
    let shareUrl = '';
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowShareConfirmation(true);
      setTimeout(() => setShowShareConfirmation(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getMysteryPlayerResult = (): GuessResponseWithValues | null => {
    if (!gameState.dailyPlayer) return null;

    const calculateAge = (dateOfBirth: string): number => {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age;
    };

    const playerAge = calculateAge(gameState.dailyPlayer.dateOfBirth);

    return {
      isCorrect: true,
      position: 'correct',
      subPosition: 'correct',
      age: 'correct',
      nationality: 'correct',
      club: 'correct',
      league: 'correct',
      height: 'correct',
      foot: 'correct',
      values: {
        position: gameState.dailyPlayer.position,
        subPosition: gameState.dailyPlayer.subPosition,
        age: playerAge,
        nationality: gameState.dailyPlayer.nationality,
        club: gameState.dailyPlayer.club,
        league: gameState.dailyPlayer.league,
        height: gameState.dailyPlayer.height,
        foot: gameState.dailyPlayer.foot,
      },
      targetValues: {
        age: playerAge,
        height: gameState.dailyPlayer.height,
      },
    };
  };

  return (
    <>
      <div className="relative">
        <div className="absolute top-0 right-0 flex flex-wrap justify-end gap-2 -mt-2 z-10">
          <button
            onClick={() => setShowStats(true)}
            className="w-10 h-10 flex items-center justify-center text-2xl bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="View statistics"
            type="button"
          >
            📊
          </button>
          <button
            onClick={() => setShowInstructions(true)}
            className="w-10 h-10 flex items-center justify-center text-2xl bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="How to play"
            type="button"
          >
            ℹ️
          </button>
        </div>

        <header className="text-center mb-8">
          <h1 className="mb-2 text-4xl font-bold text-[#03E690]">Footle</h1>
          {gameStarted ? (
            <p className="text-gray-400 text-lg">
              {!gameState.gameOver ? (
                `Guess ${Math.min(gameState.guesses.length + 1, maxGuesses)} of ${maxGuesses}`
              ) : (
                `${gameState.won ? 'Won' : 'Game Over'} in ${gameState.guesses.length} ${gameState.guesses.length === 1 ? 'guess' : 'guesses'}`
              )}
            </p>
          ) : (
            <h2 className="text-gray-400 text-lg">
              The Daily Football Player Guessing Game
            </h2>
          )}
        </header>

        <div className="space-y-6">
          {!gameStarted ? (
            <div className="text-center space-y-6 py-8">
              <div className="space-y-4 max-w-xl mx-auto">
                <p className="text-lg">
                  Try to guess today's mystery football player in 10 attempts or less.
                </p>
                <p className="text-gray-400">
                  Get feedback on position, age, nationality, club, and more with each guess.
                  Green for exact matches, orange for close ones!
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={handleStartPlaying}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
                >
                  Start Playing
                </button>
              </div>
              <section className="max-w-4xl mx-auto text-left bg-gray-800/80 border border-gray-700 rounded-2xl p-5">
                <div className="mb-4 text-center">
                  <p className="text-sm uppercase tracking-[0.2em] text-[#03E690]">Play More Modes</p>
                  <h3 className="text-xl font-semibold text-white mt-1">More ways to play Footle</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Jump into league-specific dailies, catch up in the archive, or try a different format.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {modeCards.map((card) => (
                    <Link
                      key={card.href}
                      href={card.href}
                      prefetch={false}
                      className={`rounded-xl border bg-gray-900/80 p-4 transition-all hover:bg-gray-800 hover:-translate-y-0.5 ${card.accent}`}
                    >
                      <p className="font-semibold text-white">{card.title}</p>
                      <p className="text-sm text-gray-400 mt-1 leading-snug">{card.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <>
              {!gameState.gameOver && (
                <div className="relative">
                  <div className="text-center mb-4 text-gray-400">
                    {gameState.guesses.length === 0 ? (
                      "Make your first guess!"
                    ) : (
                      "Keep guessing..."
                    )}
                  </div>
                  <SearchBar
                    value={gameState.currentGuess}
                    onChange={(value) => setGameState(prev => ({ ...prev, currentGuess: value }))}
                    onSubmit={handleGuess}
                    disabled={gameState.gameOver}
                  />
                  {showError && (
                    <div className="absolute top-full mt-2 w-full text-center text-red-500">
                      Player not found. Please try another name.
                    </div>
                  )}
                </div>
              )}

              {gameState.gameOver && (
                <div className="text-center p-6 bg-gray-800 rounded-lg mb-8">
                  <h2 className="text-3xl font-bold mb-3">
                    {gameState.won ? '🎉 Congratulations!' : '😔 Game Over'}
                  </h2>
                  <p className="text-xl text-gray-400 mb-6">
                    The player was <span className="font-bold text-white">{gameState.dailyPlayer?.name}</span>
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={handleShare}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Copy Results
                    </button>
                    <button
                      onClick={() => handleSocialShare('twitter')}
                      className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Share to X
                    </button>
                    <button
                      onClick={() => handleSocialShare('facebook')}
                      className="bg-[#4267B2] hover:bg-[#365899] text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Share to Facebook
                    </button>
                  </div>
                  {showShareConfirmation && (
                    <p className="mt-2 text-green-400">Results copied to clipboard!</p>
                  )}
                  <p className="mt-4 text-sm text-gray-500">
                    Come back tomorrow for a new player!
                  </p>
                </div>
              )}

              {gameState.gameOver && !gameState.won && gameState.dailyPlayer && getMysteryPlayerResult() && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4 text-center text-gray-300">Player Details</h3>
                  <GuessResult
                    guess={getMysteryPlayerResult()!}
                    playerName={gameState.dailyPlayer.name}
                    forceIncorrect={true}
                  />
                </div>
              )}

              {gameState.gameOver && gameState.won && gameState.startTime && gameState.endTime && (
                <div className="mb-8">
                  <Leaderboard
                    gameType="all"
                    guesses={gameState.guesses.length}
                    time={Math.floor((gameState.endTime - gameState.startTime) / 1000)}
                    showSubmitForm={true}
                  />
                </div>
              )}

              {gameState.guesses.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-4 text-center text-gray-300">Your Guesses</h3>
                  <div className="space-y-4">
                    {[...gameState.guesses].reverse().map((guess, index) => (
                      <GuessResult
                        key={gameState.guesses.length - 1 - index}
                        guess={guess.result}
                        playerName={guess.playerName}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        gameType="all"
        maxGuesses={maxGuesses}
        gameTitle="Footle"
      />
      <GamePageContent
        title="A daily football player guessing game"
        introduction={[
          'Footle is a free daily football player guessing game. You have ten attempts to identify the mystery player, choosing each guess from the game’s player list. After every valid guess, the result compares eight details: position, sub-position, age, nationality, club, league, height and preferred foot.',
          'The clues are designed to make each attempt useful, even when the name is wrong. Treat confirmed matches as anchors, use close matches to build a shortlist, and pay attention to the age and height arrows before committing to your next guess.',
        ]}
        sections={[
          {
            heading: 'How to interpret each Footle clue',
            paragraphs: [
              'Green means the attribute is an exact match; grey means it is not. Orange is reserved for specific near matches: an age within three years, a height within five centimetres, a nationality from the same continent, another club in the same league, or a different sub-position within the same broad position. Position, league and preferred foot must match exactly.',
              'For age and height, the arrow adds direction: it shows whether the mystery player is older or younger, or taller or shorter, than your guess. Use that direction alongside the displayed value instead of treating an orange result as an exact answer.',
              'Compare clues together. If a guess confirms the league and broad position but points to a different club in that league, keep those confirmed details and test a different candidate. A nationality from the same continent is a useful lead, but it does not confirm the player’s country.',
            ],
          },
          {
            heading: 'A practical way to narrow down the answer',
            paragraphs: [
              'Start with a player you can identify confidently in the searchable list, then read the whole result before making another guess. Note the exact matches first, then use each orange result to set a boundary: a maximum three-year age difference, a maximum five-centimetre height difference, or a shared continent or league.',
              'Choose a next guess that tests more than one open question. For example, if you have narrowed the answer to a league and broad position, pick a player from that league whose nationality or age can help distinguish between the remaining possibilities. Avoid repeating a guess that would only confirm information you already know.',
              'The player list is based on players from Europe’s five major leagues. It is a maintained dataset rather than a live roster, so a player or recent transfer may not always appear. If a name is not accepted, search for another listed player from the same competition.',
            ],
          },
          {
            heading: 'Choose another kind of football challenge',
            paragraphs: [
              'Footle also offers league-specific daily games, including Premier League Guess, alongside Football Grid, Career Mode, Squadle, Recall and the 8-0 World Cup draft. Each format tests a different kind of football knowledge: player attributes, club history, line-ups, memory or squad building.',
              'When you have finished today’s puzzle, the archive lets you revisit recent daily games. You can also browse all the games or read practical guides to player clues and football quiz strategy.',
            ],
          },
        ]}
        faqs={[
          { question: 'How many guesses do I get in Footle?', answer: 'You have up to 10 guesses to identify the daily mystery footballer. The game shows how each guess compares with the answer.' },
          { question: 'When does the daily Footle puzzle change?', answer: 'Footle provides a new daily puzzle each day. Your progress for the current puzzle is saved in your browser so you can come back and continue.' },
          { question: 'What do the clue colours and arrows mean?', answer: 'Green is an exact match and grey is not a match. Orange means a specific near match: age within three years, height within five centimetres, nationality on the same continent, a different club in the same league, or a different sub-position in the same broad position. The age and height arrows show whether the mystery player is older or younger, or taller or shorter, than your guess.' },
          { question: 'Why can’t I find a player to guess?', answer: 'Guesses must match a name in Footle’s player list. The list covers players from Europe’s five major leagues but is not a live roster, so some players or recent transfers may not be included.' },
          { question: 'Can I play other football quizzes on Footle?', answer: 'Yes. Footle includes league-specific puzzles, Football Grid, Career Mode, Squadle, Recall, the 8-0 World Cup draft, an archive and custom challenges.' },
        ]}
      />
    </>
  );
}
