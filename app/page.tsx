'use client';

import { useState, useEffect } from 'react';
import { Player, GuessResponseWithValues } from '../types/player';
import { getDailyPlayer, checkGuess } from '../services/gameService';
import GuessResult from '../components/GuessResult';
import SearchBar from '../components/SearchBar';
import InstructionsModal from '../components/InstructionsModal';
import { GameState } from '../types/game';
import StatisticsModal from '../components/StatisticsModal';

const STORAGE_KEY = 'footle_game_state';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    currentGuess: '',
    dailyPlayer: null,
    gameOver: false,
    won: false,
  });
  const [showError, setShowError] = useState(false);
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);

  const maxGuesses = 5;

  const calculateStats = () => {
    if (typeof window === 'undefined') {
      return {
        gamesPlayed: 0,
        winPercentage: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: [0, 0, 0, 0, 0],
      };
    }

    const savedStats = localStorage.getItem('footle_stats');
    if (!savedStats) {
      return {
        gamesPlayed: 0,
        winPercentage: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: [0, 0, 0, 0, 0],
      };
    }
    return JSON.parse(savedStats);
  };

  useEffect(() => {
    // Load saved game state from localStorage
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Only restore if it's from today
        const today = new Date().toDateString();
        if (parsedState.date === today) {
          setGameState(parsedState.state);
          setGameStarted(true);
        } else {
          // Clear old state if it's from a different day
          localStorage.removeItem(STORAGE_KEY);
        }
      } else {
        // Initialize new game
        const player = getDailyPlayer();
        setGameState(prev => ({ ...prev, dailyPlayer: player }));
      }
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && gameStarted) {
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

    // Update statistics if game is over
    if (gameOver) {
      const currentStats = calculateStats();
      const lastPlayedDate = localStorage.getItem('footle_last_played');
      const today = new Date().toDateString();

      // Only update stats if this is the first game of the day
      if (lastPlayedDate !== today) {
        const newStats = {
          gamesPlayed: currentStats.gamesPlayed + 1,
          winPercentage: Math.round(((currentStats.gamesPlayed * (currentStats.winPercentage / 100) + (won ? 1 : 0)) / (currentStats.gamesPlayed + 1)) * 100),
          currentStreak: won ? currentStats.currentStreak + 1 : 0,
          maxStreak: won ? Math.max(currentStats.maxStreak, currentStats.currentStreak + 1) : currentStats.maxStreak,
          guessDistribution: currentStats.guessDistribution.map((count, index) => 
            index === newGuesses.length - 1 && won ? count + 1 : count
          ),
        };

        localStorage.setItem('footle_stats', JSON.stringify(newStats));
        localStorage.setItem('footle_last_played', today);
      }
    }

    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      currentGuess: '',
      gameOver,
      won,
    }));
  };

  const generateShareText = () => {
    const today = new Date();
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    const shareText = [
      `Footle #${daysSinceEpoch} - ${gameState.won ? gameState.guesses.length : 'X'}/5`,
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
      'https://footle.online'
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
      `Footle #${daysSinceEpoch} - ${gameState.won ? gameState.guesses.length : 'X'}/5`,
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
      'https://footle.online'
    ].join('\n');

    const encodedText = encodeURIComponent(shareText);
    const url = encodeURIComponent('https://footle.online');
    
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

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto relative">
        <div className="absolute -right-2 -top-2 flex gap-2">
          <button
            onClick={() => setShowStatistics(true)}
            className="w-10 h-10 flex items-center justify-center text-2xl bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="View statistics"
          >
            📊
          </button>
          <button
            onClick={() => setShowInstructions(true)}
            className="w-10 h-10 flex items-center justify-center text-2xl bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="How to play"
          >
            ℹ️
          </button>
        </div>

        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Footle</h1>
          {gameStarted ? (
            <p className="text-gray-400 text-lg">
              {!gameState.gameOver ? (
                `Guess ${Math.min(gameState.guesses.length + 1, maxGuesses)} of ${maxGuesses}`
              ) : (
                `${gameState.won ? 'Won' : 'Game Over'} in ${gameState.guesses.length} ${gameState.guesses.length === 1 ? 'guess' : 'guesses'}`
              )}
            </p>
          ) : (
            <p className="text-gray-400 text-lg">
              The Daily Football Player Guessing Game
            </p>
          )}
        </header>

        <div className="space-y-6">
          {!gameStarted ? (
            <div className="text-center space-y-6 py-8">
              <div className="space-y-4 max-w-xl mx-auto">
                <p className="text-lg">
                  Try to guess today's mystery football player in 5 attempts or less.
                </p>
                <p className="text-gray-400">
                  Get feedback on position, age, nationality, club, and more with each guess.
                  Green for exact matches, orange for close ones!
                </p>
              </div>
              <button
                onClick={() => setGameStarted(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Start Playing
              </button>
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
                  <p className="text-xl text-gray-400 mb-4">
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

              <div className="space-y-4">
                {[...gameState.guesses].reverse().map((guess, index) => (
                  <GuessResult
                    key={gameState.guesses.length - 1 - index}
                    guess={guess.result}
                    playerName={guess.playerName}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
      <StatisticsModal
        isOpen={showStatistics}
        onClose={() => setShowStatistics(false)}
        stats={calculateStats()}
      />
    </main>
  );
}