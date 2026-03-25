'use client';

import { useEffect, useMemo, useState } from 'react';
import SearchBar from '../../components/SearchBar';
import StatsModal from '../../components/StatsModal';
import { saveGameResult } from '../../services/statsService';
import {
  validateGridGuess,
  type GridPuzzle,
} from '../../services/gridGameService';

interface SelectedCell {
  row: number;
  column: number;
}

interface GridCellState {
  playerName: string | null;
  attempts: number;
}

interface GridGameState {
  puzzle: GridPuzzle | null;
  cells: GridCellState[][];
  currentGuess: string;
  selectedCell: SelectedCell | null;
  attemptsUsed: number;
  gameOver: boolean;
  won: boolean;
  startTime?: number;
  endTime?: number;
}

const STORAGE_KEY = 'footle_grid_state';
const MAX_GUESSES = 12;

interface GridClientProps {
  initialPuzzle: GridPuzzle;
  puzzleNumber: number;
}

function createEmptyCells(): GridCellState[][] {
  return Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => ({
      playerName: null,
      attempts: 0,
    }))
  );
}

function createEmptyState(): GridGameState {
  return {
    puzzle: null,
    cells: createEmptyCells(),
    currentGuess: '',
    selectedCell: { row: 0, column: 0 },
    attemptsUsed: 0,
    gameOver: false,
    won: false,
    startTime: undefined,
    endTime: undefined,
  };
}

function findFirstOpenCell(cells: GridCellState[][]): SelectedCell | null {
  for (let row = 0; row < cells.length; row += 1) {
    for (let column = 0; column < cells[row].length; column += 1) {
      if (!cells[row][column].playerName) {
        return { row, column };
      }
    }
  }

  return null;
}

export default function GridClient({ initialPuzzle, puzzleNumber }: GridClientProps) {
  const [gameState, setGameState] = useState<GridGameState>(() => ({
    ...createEmptyState(),
    puzzle: initialPuzzle,
  }));
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const playerNames = gameState.puzzle?.allPlayerNames ?? [];
  const usedPlayerNames = useMemo(
    () =>
      gameState.cells
        .flat()
        .map((cell) => cell.playerName)
        .filter((playerName): playerName is string => Boolean(playerName)),
    [gameState.cells]
  );

  useEffect(() => {
    const today = new Date().toDateString();
    const savedState = localStorage.getItem(STORAGE_KEY);

    try {
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState.date === today && parsedState.state?.puzzle) {
          setGameState(parsedState.state as GridGameState);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to restore grid state:', error);
    }

    setGameState({
      ...createEmptyState(),
      puzzle: initialPuzzle,
    });
  }, [initialPuzzle]);

  useEffect(() => {
    if (!gameState.puzzle) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        date: new Date().toDateString(),
        state: gameState,
      })
    );
  }, [gameState]);

  const isCellSolved = (row: number, column: number) => Boolean(gameState.cells[row][column].playerName);

  const solvedCells = usedPlayerNames.length;

  const showTransientError = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  const handleCellSelect = (row: number, column: number) => {
    if (gameState.gameOver || isCellSolved(row, column)) {
      return;
    }

    setGameState((prev) => ({
      ...prev,
      selectedCell: { row, column },
    }));
  };

  const handleGuess = () => {
    if (!gameState.puzzle || gameState.gameOver || !gameState.selectedCell || !gameState.currentGuess.trim()) {
      return;
    }

    const { row, column } = gameState.selectedCell;
    const validation = validateGridGuess(
      gameState.puzzle,
      row,
      column,
      gameState.currentGuess,
      usedPlayerNames
    );

    if (validation.code === 'unknown_player' || validation.code === 'duplicate_player') {
      showTransientError(validation.reason ?? 'That guess is not allowed.');
      return;
    }

    const nextCells = gameState.cells.map((cellRow, rowIndex) =>
      cellRow.map((cell, columnIndex) => {
        if (rowIndex !== row || columnIndex !== column) {
          return cell;
        }

        return {
          playerName: validation.code === 'valid' ? validation.playerName ?? gameState.currentGuess.trim() : null,
          attempts: cell.attempts + 1,
        };
      })
    );

    const attemptsUsed = gameState.attemptsUsed + 1;
    const solvedCount = nextCells.flat().filter((cell) => cell.playerName).length;
    const won = solvedCount === 9;
    const gameOver = won || attemptsUsed >= MAX_GUESSES;
    const nextSelectedCell = won || gameOver
      ? null
      : validation.code === 'valid'
        ? findFirstOpenCell(nextCells)
        : { row, column };

    setGameState((prev) => ({
      ...prev,
      cells: nextCells,
      currentGuess: '',
      selectedCell: nextSelectedCell,
      attemptsUsed,
      gameOver,
      won,
      startTime: prev.startTime ?? Date.now(),
      endTime: gameOver ? Date.now() : prev.endTime,
    }));

    if (validation.code === 'wrong_cell') {
      showTransientError(validation.reason ?? 'Wrong cell.');
    }

    if (gameOver) {
      const endTime = Date.now();
      const startTime = gameState.startTime ?? endTime;
      const timeTaken = Math.floor((endTime - startTime) / 1000);
      saveGameResult('grid', won, attemptsUsed, timeTaken, MAX_GUESSES);
    }
  };

  const generateShareText = () => {
    const resultRows = gameState.cells.map((row) =>
      row
        .map((cell) => {
          if (cell.playerName) {
            return cell.attempts === 1 ? '🟩' : '🟨';
          }

          return gameState.gameOver ? '⬛' : '⬜';
        })
        .join('')
    );

    return [
      `Footle Grid #${puzzleNumber} - ${gameState.won ? attemptsUsedLabel(gameState.attemptsUsed) : 'X'}/${MAX_GUESSES}`,
      '',
      ...resultRows,
      '',
      'https://footle.club/grid',
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
    const url = encodeURIComponent('https://footle.club/grid');

    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?text=${encodedText}`
      : `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`;

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const selectedCellLabel = gameState.selectedCell && gameState.puzzle
    ? `${gameState.puzzle.rowClubs[gameState.selectedCell.row]} × ${gameState.puzzle.columnClubs[gameState.selectedCell.column]}`
    : null;

  if (!gameState.puzzle) {
    return <div className="py-12 text-center text-gray-400">Loading grid...</div>;
  }

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
          <h1 className="text-4xl font-bold mb-2">Footle Grid</h1>
          <p className="text-gray-400 text-lg">
            {gameState.gameOver
              ? gameState.won
                ? `Solved in ${gameState.attemptsUsed} ${gameState.attemptsUsed === 1 ? 'guess' : 'guesses'}`
                : `Game Over after ${MAX_GUESSES} guesses`
              : `${solvedCells}/9 solved • ${MAX_GUESSES - gameState.attemptsUsed} guesses left`}
          </p>
        </header>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-4 sm:p-5">
            <div className="overflow-x-auto">
              <div className="grid min-w-[620px] grid-cols-[140px_repeat(3,minmax(0,1fr))] gap-2">
                <div className="rounded-xl bg-gray-950/80 p-3 text-sm text-gray-400">
                  Pick any player who played for both clubs.
                </div>
                {gameState.puzzle.columnClubs.map((club) => (
                  <div
                    key={club}
                    className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-center font-semibold text-blue-100"
                  >
                    {club}
                  </div>
                ))}

                {gameState.puzzle.rowClubs.map((rowClub, rowIndex) => (
                  <div key={rowClub} className="contents">
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 font-semibold text-emerald-100">
                      {rowClub}
                    </div>
                    {gameState.puzzle.columnClubs.map((columnClub, columnIndex) => {
                      const cell = gameState.cells[rowIndex][columnIndex];
                      const isSelected =
                        gameState.selectedCell?.row === rowIndex &&
                        gameState.selectedCell?.column === columnIndex;
                      const solved = Boolean(cell.playerName);

                      return (
                        <button
                          key={`${rowClub}-${columnClub}`}
                          type="button"
                          onClick={() => handleCellSelect(rowIndex, columnIndex)}
                          disabled={solved || gameState.gameOver}
                          className={`min-h-[104px] rounded-xl border p-3 text-left transition-colors ${
                            solved
                              ? 'border-green-500 bg-green-500/15 text-green-100'
                              : isSelected
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-gray-700 bg-gray-800/80 hover:bg-gray-800'
                          } ${solved || gameState.gameOver ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          {solved ? (
                            <div className="flex h-full flex-col justify-between">
                              <div className="font-semibold">{cell.playerName}</div>
                              <div className="text-xs uppercase tracking-wide text-green-300">
                                {cell.attempts === 1 ? 'Correct first try' : `Solved in ${cell.attempts} tries`}
                              </div>
                            </div>
                          ) : (
                            <div className="flex h-full flex-col justify-between">
                              <div className="text-sm text-gray-300">
                                {isSelected ? 'Selected square' : 'Tap to answer'}
                              </div>
                              <div className="text-xs uppercase tracking-wide text-gray-500">
                                {cell.attempts > 0 ? `${cell.attempts} wrong ${cell.attempts === 1 ? 'guess' : 'guesses'}` : 'Open'}
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!gameState.gameOver && (
            <div className="space-y-4">
              <div className="text-center text-gray-400">
                {selectedCellLabel
                  ? `Selected: ${selectedCellLabel}`
                  : 'Choose a square to start guessing.'}
              </div>
              <div className="relative">
                <SearchBar
                  value={gameState.currentGuess}
                  onChange={(value) => setGameState((prev) => ({ ...prev, currentGuess: value }))}
                  onSubmit={handleGuess}
                  disabled={!gameState.selectedCell || gameState.gameOver}
                  playerNames={playerNames}
                  placeholder={selectedCellLabel ? `Guess a player for ${selectedCellLabel}...` : 'Select a square first...'}
                />
                {showError && (
                  <div className="absolute top-full mt-2 w-full text-center text-red-400">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          <section className="rounded-2xl border border-gray-800 bg-gray-900/70 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Used Players</h2>
              <span className="text-sm text-gray-400">{usedPlayerNames.length} of 9 locked in</span>
            </div>
            {usedPlayerNames.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {usedPlayerNames.map((playerName) => (
                  <span
                    key={playerName}
                    className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm text-green-200"
                  >
                    {playerName}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-gray-400">Correct answers will appear here as you fill the grid.</p>
            )}
          </section>

          {gameState.gameOver && (
            <div className="text-center rounded-2xl bg-gray-800 p-6">
              <h2 className="mb-3 text-3xl font-bold">
                {gameState.won ? 'Grid Complete!' : 'Out of Guesses'}
              </h2>
              <p className="mb-6 text-gray-400">
                {gameState.won
                  ? `You filled all 9 squares with ${MAX_GUESSES - gameState.attemptsUsed} guesses to spare.`
                  : 'Some squares are still open. A new grid will be ready tomorrow.'}
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={handleShare}
                  className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
                >
                  Copy Results
                </button>
                <button
                  onClick={() => handleSocialShare('twitter')}
                  className="rounded-lg bg-[#1DA1F2] px-6 py-2 text-white transition-colors hover:bg-[#1a8cd8]"
                >
                  Share to X
                </button>
                <button
                  onClick={() => handleSocialShare('facebook')}
                  className="rounded-lg bg-[#4267B2] px-6 py-2 text-white transition-colors hover:bg-[#365899]"
                >
                  Share to Facebook
                </button>
              </div>
              {showShareConfirmation && (
                <p className="mt-3 text-green-400">Results copied to clipboard!</p>
              )}
            </div>
          )}
        </div>
      </div>

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        gameType="grid"
        maxGuesses={MAX_GUESSES}
        gameTitle="Footle Grid"
      />
    </>
  );
}

function attemptsUsedLabel(attemptsUsed: number): string {
  return `${attemptsUsed}`;
}
