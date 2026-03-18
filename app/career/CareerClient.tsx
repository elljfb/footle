'use client';

import { useEffect, useState } from 'react';
import SearchBar from '../../components/SearchBar';
import Leaderboard from '../../components/Leaderboard';
import StatsModal from '../../components/StatsModal';
import { saveGameResult } from '../../services/statsService';
import {
  CareerGamePlayer,
  checkCareerGuess,
  getCareerPlayerNames,
  getDailyCareerPlayer,
  getVisibleCareerClues,
} from '../../services/careerGameService';

interface CareerGameState {
  guesses: string[];
  currentGuess: string;
  dailyPlayer: CareerGamePlayer | null;
  gameOver: boolean;
  won: boolean;
  startTime?: number;
  endTime?: number;
}

const STORAGE_KEY = 'footle_career_state';
const MAX_GUESSES = 3;

const createEmptyState = (): CareerGameState => ({
  guesses: [],
  currentGuess: '',
  dailyPlayer: null,
  gameOver: false,
  won: false,
  startTime: undefined,
  endTime: undefined,
});

export default function CareerClient() {
  const [gameState, setGameState] = useState<CareerGameState>(createEmptyState);
  const [showError, setShowError] = useState(false);
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const playerNames = getCareerPlayerNames();

  useEffect(() => {
    const today = new Date().toDateString();
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (savedState) {
      const parsedState = JSON.parse(savedState);
      if (parsedState.date === today) {
        setGameState(parsedState.state);
        setGameStarted(parsedState.gameStarted);
        return;
      }
    }

    const player = getDailyCareerPlayer();
    setGameState({
      ...createEmptyState(),
      dailyPlayer: player,
    });
    setGameStarted(false);
  }, []);

  useEffect(() => {
    if (!gameState.dailyPlayer) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        date: new Date().toDateString(),
        gameStarted,
        state: gameState,
      })
    );
  }, [gameStarted, gameState]);

  const handleGuess = () => {
    if (!gameState.dailyPlayer || gameState.gameOver || !gameState.currentGuess.trim()) {
      return;
    }

    const guess = gameState.currentGuess.trim();
    const isValidPlayer = playerNames.some((name) => name.toLowerCase() === guess.toLowerCase());

    if (!isValidPlayer) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const newGuesses = [...gameState.guesses, guess];
    const won = checkCareerGuess(gameState.dailyPlayer, guess);
    const gameOver = won || newGuesses.length >= MAX_GUESSES;

    setGameState((prev) => ({
      ...prev,
      guesses: newGuesses,
      currentGuess: '',
      gameOver,
      won,
      endTime: gameOver ? Date.now() : prev.endTime,
    }));

    if (gameOver && gameState.startTime) {
      const timeTaken = Math.floor((Date.now() - gameState.startTime) / 1000);
      saveGameResult('career', won, newGuesses.length, timeTaken, MAX_GUESSES);
    }
  };

  const generateShareText = () => {
    const today = new Date();
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    const resultLine = Array.from({ length: MAX_GUESSES }, (_, index) => {
      if (gameState.won && index === gameState.guesses.length - 1) {
        return '🟩';
      }

      return index < gameState.guesses.length ? '⬜' : '⬛';
    }).join('');

    return [
      `Footle Career #${daysSinceEpoch} - ${gameState.won ? gameState.guesses.length : 'X'}/${MAX_GUESSES}`,
      '',
      resultLine,
      '',
      'https://footle.club/career',
    ].join('\n');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setShowShareConfirmation(true);
      setTimeout(() => setShowShareConfirmation(false), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook') => {
    const shareText = generateShareText();
    const encodedText = encodeURIComponent(shareText);
    const url = encodeURIComponent('https://footle.club/career');

    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?text=${encodedText}`
      : `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`;

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const visibleClues = gameState.dailyPlayer
    ? getVisibleCareerClues(gameState.dailyPlayer, gameState.guesses.length)
    : [];

  const formatStats = (apps: number | null, goals: number | null) => {
    const appsText = apps ?? '?';
    const goalsText = goals ?? '?';
    return `${appsText} apps • ${goalsText} goals`;
  };

  return (
    <>
      <div className="relative">
        <div className="absolute top-0 right-0 flex gap-2 -mt-2 z-10">
          <button
            onClick={() => setShowStats(true)}
            className="w-10 h-10 flex items-center justify-center text-2xl bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="View statistics"
          >
            📊
          </button>
        </div>

        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Footle Career</h1>
          {gameStarted ? (
            <p className="text-gray-400 text-lg">
              {!gameState.gameOver
                ? `Guess ${Math.min(gameState.guesses.length + 1, MAX_GUESSES)} of ${MAX_GUESSES}`
                : `${gameState.won ? 'Solved' : 'Game Over'} in ${gameState.guesses.length} ${gameState.guesses.length === 1 ? 'guess' : 'guesses'}`}
            </p>
          ) : (
            <p className="text-gray-400 text-lg">Guess the player from their career path</p>
          )}
        </header>

        <div className="space-y-6">
          {!gameStarted ? (
            <div className="text-center space-y-6 py-8">
              <div className="space-y-4 max-w-xl mx-auto">
                <p className="text-lg">
                  One mystery player per day. You get just {MAX_GUESSES} guesses.
                </p>
                <p className="text-gray-400">
                  Start with two clubs, then another club unlocks after each wrong answer.
                </p>
              </div>
              <button
                onClick={() => {
                  setGameStarted(true);
                  setGameState((prev) => ({ ...prev, startTime: Date.now() }));
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Start Playing
              </button>
            </div>
          ) : (
            <>
              <section className="bg-gray-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Career Path</h2>
                  <span className="text-sm text-gray-400">
                    {visibleClues.length} clue{visibleClues.length === 1 ? '' : 's'} shown
                  </span>
                </div>
                <div className="space-y-3">
                  {visibleClues.map((spell, index) => (
                    <div
                      key={`${spell.years}-${spell.club}-${index}`}
                      className="rounded-xl border border-gray-700 bg-gray-900/70 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-sm text-gray-400 whitespace-nowrap">{spell.years}</span>
                        <span className="text-right font-semibold text-white">{spell.club}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-400 text-right">
                        {formatStats(spell.apps, spell.goals)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {!gameState.gameOver && (
                <div className="relative">
                  <div className="text-center mb-4 text-gray-400">
                    {gameState.guesses.length === 0 ? 'Who is it?' : 'Study the path and guess again.'}
                  </div>
                  <SearchBar
                    value={gameState.currentGuess}
                    onChange={(value) => setGameState((prev) => ({ ...prev, currentGuess: value }))}
                    onSubmit={handleGuess}
                    disabled={gameState.gameOver}
                    playerNames={playerNames}
                    placeholder="Type a player name..."
                  />
                  {showError && (
                    <div className="absolute top-full mt-2 w-full text-center text-red-500">
                      Pick a player from the list.
                    </div>
                  )}
                </div>
              )}

              {gameState.gameOver && (
                <div className="text-center p-6 bg-gray-800 rounded-lg">
                  <h2 className="text-3xl font-bold mb-3">
                    {gameState.won ? '🎉 Correct!' : '😔 Out of guesses'}
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
                    <button
                      onClick={() => window.open('https://www.mystershirt.com/footle', '_blank', 'noopener,noreferrer')}
                      className="bg-[#F28500] hover:bg-[##FFA500] text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      👕 Get a Mystery Football Shirt
                    </button>
                  </div>
                  {showShareConfirmation && (
                    <p className="mt-2 text-green-400">Results copied to clipboard!</p>
                  )}
                </div>
              )}

              {gameState.gameOver && gameState.won && gameState.startTime && gameState.endTime && (
                <div>
                  <Leaderboard
                    gameType="career"
                    guesses={gameState.guesses.length}
                    time={Math.floor((gameState.endTime - gameState.startTime) / 1000)}
                    showSubmitForm={true}
                  />
                </div>
              )}

              {gameState.gameOver && gameState.dailyPlayer && (
                <section className="bg-gray-800 rounded-2xl p-5">
                  <h3 className="text-lg font-bold mb-4 text-center text-gray-300">Full Career</h3>
                  <div className="space-y-3">
                    {gameState.dailyPlayer.clueCareer.map((spell, index) => (
                      <div
                        key={`${spell.years}-${spell.club}-${index}`}
                        className="rounded-xl border border-gray-700 bg-gray-900/70 px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-sm text-gray-400 whitespace-nowrap">{spell.years}</span>
                          <span className="text-right font-semibold text-white">{spell.club}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-400 text-right">
                          {formatStats(spell.apps, spell.goals)}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}


              {gameState.guesses.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold mb-4 text-center text-gray-300">Your Guesses</h3>
                  <div className="space-y-3">
                    {[...gameState.guesses].reverse().map((guess, index) => {
                      const isCorrect = gameState.dailyPlayer
                        ? checkCareerGuess(gameState.dailyPlayer, guess)
                        : false;

                      return (
                        <div
                          key={`${guess}-${index}`}
                          className={`rounded-xl border px-4 py-3 text-center font-semibold ${
                            isCorrect
                              ? 'border-green-500 bg-green-500/15 text-green-300'
                              : 'border-red-500 bg-red-500/15 text-red-300'
                          }`}
                        >
                          <div>{guess}</div>
                          <div
                            className={`mt-1 text-xs uppercase tracking-wide ${
                              isCorrect ? 'text-green-400' : 'text-red-400'
                            }`}
                          >
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        gameType="career"
        maxGuesses={MAX_GUESSES}
        gameTitle="Footle Career"
      />
    </>
  );
}
