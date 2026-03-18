'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GuessResponseWithValues } from '../../types/player';
import { GameState } from '../../types/game';
import { checkGuess, getDailyPlayerByDate } from '../../services/gameService';
import SearchBar from '../../components/SearchBar';
import GuessResult from '../../components/GuessResult';
import InstructionsModal from '../../components/InstructionsModal';
import {
  ARCHIVE_DAY_COUNT,
  clampArchiveDateKey,
  formatArchiveDate,
  getArchiveDates,
  getArchivePuzzleNumber,
  getPreviousArchiveDateKey,
  parseDateKey,
  toDateKey,
} from '../../lib/archive';

const MAX_GUESSES = 10;

const createEmptyGameState = (): GameState => ({
  guesses: [],
  currentGuess: '',
  dailyPlayer: null,
  gameOver: false,
  won: false,
  startTime: undefined,
  endTime: undefined,
});

function buildStorageKey(dateKey: string): string {
  return `footle_archive_state_${dateKey}`;
}

export default function ArchiveClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gameState, setGameState] = useState<GameState>(createEmptyGameState);
  const [gameStarted, setGameStarted] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const selectedDateKey = useMemo(
    () => clampArchiveDateKey(searchParams.get('date')),
    [searchParams]
  );
  const selectedDate = useMemo(() => parseDateKey(selectedDateKey), [selectedDateKey]);
  const archiveDates = useMemo(() => getArchiveDates(), []);
  const previousDateKey = useMemo(() => getPreviousArchiveDateKey(selectedDateKey), [selectedDateKey]);
  const storageKey = useMemo(() => buildStorageKey(selectedDateKey), [selectedDateKey]);

  useEffect(() => {
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setGameState(parsedState.state);
      setGameStarted(parsedState.gameStarted);
      return;
    }

    const player = getDailyPlayerByDate(selectedDate);
    setGameState({
      ...createEmptyGameState(),
      dailyPlayer: player,
    });
    setGameStarted(false);
  }, [selectedDate, storageKey]);

  useEffect(() => {
    if (!gameState.dailyPlayer) {
      return;
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        date: selectedDateKey,
        gameStarted,
        state: gameState,
      })
    );
  }, [gameStarted, gameState, selectedDateKey, storageKey]);

  const updateSelectedDate = (dateKey: string) => {
    setShowDatePicker(false);
    router.push(`/archive?date=${dateKey}`);
  };

  const handleGuess = () => {
    if (!gameState.dailyPlayer || gameState.gameOver || !gameState.currentGuess.trim()) {
      return;
    }

    const result = checkGuess(gameState.dailyPlayer, gameState.currentGuess, undefined, selectedDate);

    if (!result) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const newGuesses = [
      ...gameState.guesses,
      { playerName: gameState.currentGuess, result },
    ];

    const won = result.isCorrect;
    const gameOver = won || newGuesses.length >= MAX_GUESSES;

    setGameState((prev) => ({
      ...prev,
      guesses: newGuesses,
      currentGuess: '',
      gameOver,
      won,
      endTime: gameOver ? Date.now() : prev.endTime,
    }));
  };

  const getMysteryPlayerResult = (): GuessResponseWithValues | null => {
    if (!gameState.dailyPlayer) {
      return null;
    }

    return checkGuess(gameState.dailyPlayer, gameState.dailyPlayer.name, undefined, selectedDate);
  };

  const generateShareText = () => {
    const puzzleNumber = getArchivePuzzleNumber(selectedDate);

    return [
      `Footle Archive ${toDateKey(selectedDate)} #${puzzleNumber} - ${gameState.won ? gameState.guesses.length : 'X'}/${MAX_GUESSES}`,
      '',
      ...gameState.guesses.map((guess) => {
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
      'https://footle.club/archive',
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

  return (
    <>
      <div className="relative">
        <div className="absolute top-0 right-0 flex gap-2 -mt-2 z-10">
          <button
            onClick={() => setShowInstructions(true)}
            className="w-10 h-10 flex items-center justify-center text-2xl bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="How to play"
          >
            ℹ️
          </button>
        </div>

        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Footle Archive</h1>
          <p className="text-gray-400 text-lg">
            Play any Footle from the last {ARCHIVE_DAY_COUNT} days.
          </p>
        </header>

        <div className="space-y-8">
          <section className="bg-gray-800/80 border border-gray-700 rounded-2xl p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Choose a date</h2>
                <p className="text-sm text-gray-400">
                  Select a puzzle from yesterday back to 30 days ago.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDatePicker((prev) => !prev)}
                className="inline-flex items-center justify-between gap-3 rounded-xl border border-gray-600 bg-gray-900/80 px-4 py-3 text-left text-sm text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-800 sm:min-w-[240px]"
                aria-expanded={showDatePicker}
                aria-controls="archive-date-picker"
              >
                <span>
                  <span className="block text-xs uppercase tracking-wide text-gray-400">Selected</span>
                  <span className="block font-semibold text-white">{formatArchiveDate(selectedDate)}</span>
                </span>
                <span className="text-xs text-gray-400">
                  {showDatePicker ? 'Hide' : 'Change'}
                </span>
              </button>
            </div>

            {showDatePicker && (
              <div
                id="archive-date-picker"
                className="mt-4 max-h-72 overflow-y-auto rounded-xl border border-gray-700 bg-gray-900/60 p-2"
              >
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                  {archiveDates.map((date) => {
                    const dateKey = toDateKey(date);
                    const isSelected = dateKey === selectedDateKey;

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        onClick={() => updateSelectedDate(dateKey)}
                        className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                          isSelected
                            ? 'border-blue-400 bg-blue-500/20 text-white'
                            : 'border-gray-700 bg-gray-900/80 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
                        }`}
                      >
                        <div className="text-xs uppercase tracking-wide text-gray-400">
                          {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                        </div>
                        <div className="text-lg font-semibold leading-tight">
                          {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </div>
                        <div className="text-xs text-gray-500">
                          Puzzle #{getArchivePuzzleNumber(date)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          <div className="space-y-6">
            {!gameStarted ? (
              <div className="text-center space-y-6 py-8">
                <div className="space-y-4 max-w-xl mx-auto">
                  <p className="text-lg">
                    Try to guess the mystery player from <span className="font-semibold text-white">{formatArchiveDate(selectedDate)}</span> in {MAX_GUESSES} attempts or less.
                  </p>
                  <p className="text-gray-400">
                    Archive games do not affect your daily streak, so this is pure extra play.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setGameStarted(true);
                    setGameState((prev) => ({ ...prev, startTime: Date.now() }));
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
                >
                  Play Now
                </button>
              </div>
            ) : (
              <>
                {!gameState.gameOver && (
                  <div className="relative">
                    <div className="text-center mb-4 text-gray-400">
                      {gameState.guesses.length === 0
                        ? `Puzzle date: ${formatArchiveDate(selectedDate)}`
                        : `Guess ${Math.min(gameState.guesses.length + 1, MAX_GUESSES)} of ${MAX_GUESSES}`}
                    </div>
                    <SearchBar
                      value={gameState.currentGuess}
                      onChange={(value) => setGameState((prev) => ({ ...prev, currentGuess: value }))}
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
                      {gameState.won ? '🎉 Nice one!' : '😔 Game Over'}
                    </h2>
                    <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                      {formatArchiveDate(selectedDate)}
                    </p>
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
                      {previousDateKey && (
                        <button
                          onClick={() => updateSelectedDate(previousDateKey)}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                          Play Previous Day
                        </button>
                      )}
                    </div>
                    {showShareConfirmation && (
                      <p className="mt-2 text-green-400">Results copied to clipboard!</p>
                    )}
                    {!previousDateKey && (
                      <p className="mt-4 text-sm text-gray-500">
                        You&apos;ve reached the end of the current 30-day archive.
                      </p>
                    )}
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
      </div>

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
    </>
  );
}
