'use client';

import { useEffect, useMemo, useState } from 'react';
import Leaderboard from '../../components/Leaderboard';
import SearchBar from '../../components/SearchBar';
import StatsModal from '../../components/StatsModal';
import {
  FootballGridClue,
  findFootballGridPlayer,
  FootballGridCell,
  getDailyFootballGridChallenge,
  isPlayerValidForFootballGridCell,
} from '../../lib/footballGrid';
import { saveGameResult } from '../../services/statsService';

const STORAGE_KEY = 'footle_football_grid_state';
const GAME_TYPE = 'football-grid';
const CELL_COUNT = 9;
const STATS_MAX_GUESSES = 30;

interface SolvedCell {
  playerId: number;
  playerName: string;
}

interface GuessEntry {
  cellIndex: number;
  playerId?: number;
  playerName: string;
  correct: boolean;
}

interface SavedState {
  date: string;
  challengeId: string;
  state: {
    solvedCells: Record<number, SolvedCell>;
    guesses: GuessEntry[];
    currentGuess: string;
    activeCellIndex: number;
    started: boolean;
    gameOver: boolean;
    won: boolean;
    startTime?: number;
    endTime?: number;
  };
}

function getTodayKey(): string {
  return new Date().toDateString();
}

function getNextOpenCellIndex(solvedCells: Record<number, SolvedCell>, currentIndex: number): number {
  for (let offset = 1; offset <= CELL_COUNT; offset++) {
    const candidate = (currentIndex + offset) % CELL_COUNT;
    if (!solvedCells[candidate]) {
      return candidate;
    }
  }

  return currentIndex;
}

function getCellStatusClass(isSolved: boolean, isActive: boolean): string {
  if (isSolved) {
    return 'border-emerald-400/60 bg-emerald-500/15 text-emerald-100';
  }

  if (isActive) {
    return 'border-blue-400 bg-blue-500/15 text-white ring-2 ring-blue-400/40';
  }

  return 'border-gray-700 bg-gray-900/80 text-gray-300 hover:border-gray-500 hover:bg-gray-800';
}

function getCellLabel(cell: FootballGridCell): string {
  return `${formatCluePhrase(cell.rowClue)} and ${formatCluePhrase(cell.columnClue)}`;
}

function formatClueKind(kind: FootballGridClue['kind']): string {
  if (kind === 'club') return 'Club';
  if (kind === 'league') return 'League';
  return 'Nation';
}

function formatCluePhrase(clue: FootballGridClue): string {
  if (clue.kind === 'club') {
    return `plays for ${clue.value}`;
  }

  if (clue.kind === 'league') {
    return `plays in ${clue.value}`;
  }

  return `is from ${clue.value}`;
}

function renderClueHeader(clue: FootballGridClue, axis: 'row' | 'column') {
  return (
    <>
      <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400 sm:text-[10px]">
        {formatClueKind(clue.kind)}
      </span>
      <span
        className={`block max-w-full whitespace-normal break-words font-bold leading-tight [overflow-wrap:anywhere] ${
          axis === 'row' ? 'text-[11px] sm:text-sm' : 'text-xs sm:text-sm'
        }`}
      >
        {clue.value}
      </span>
    </>
  );
}

export default function FootballGridClient() {
  const challenge = useMemo(() => getDailyFootballGridChallenge(), []);
  const [solvedCells, setSolvedCells] = useState<Record<number, SolvedCell>>({});
  const [guesses, setGuesses] = useState<GuessEntry[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [activeCellIndex, setActiveCellIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [startTime, setStartTime] = useState<number | undefined>();
  const [endTime, setEndTime] = useState<number | undefined>();
  const [message, setMessage] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedState = localStorage.getItem(STORAGE_KEY);
    if (!savedState) return;

    try {
      const parsed = JSON.parse(savedState) as SavedState;
      if (parsed.date !== getTodayKey() || parsed.challengeId !== challenge.id) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      setSolvedCells(parsed.state.solvedCells);
      setGuesses(parsed.state.guesses);
      setCurrentGuess(parsed.state.currentGuess);
      setActiveCellIndex(parsed.state.activeCellIndex);
      setStarted(parsed.state.started);
      setGameOver(parsed.state.gameOver);
      setWon(parsed.state.won);
      setStartTime(parsed.state.startTime);
      setEndTime(parsed.state.endTime);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [challenge.id]);

  useEffect(() => {
    if (!started || typeof window === 'undefined') return;

    const stateToSave: SavedState = {
      date: getTodayKey(),
      challengeId: challenge.id,
      state: {
        solvedCells,
        guesses,
        currentGuess,
        activeCellIndex,
        started,
        gameOver,
        won,
        startTime,
        endTime,
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [activeCellIndex, challenge.id, currentGuess, endTime, gameOver, guesses, solvedCells, started, startTime, won]);

  const solvedCount = Object.keys(solvedCells).length;
  const wrongGuessCount = guesses.filter((guess) => !guess.correct).length;
  const activeCell = challenge.cells[activeCellIndex];

  const handleStart = () => {
    if (started) return;

    setStarted(true);
    setStartTime(Date.now());
  };

  const showTransientMessage = (nextMessage: string) => {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(null), 2500);
  };

  const handleGuess = () => {
    if (!started || gameOver || !currentGuess.trim() || !activeCell) return;

    if (solvedCells[activeCell.index]) {
      showTransientMessage('That square is already solved. Pick an empty one.');
      return;
    }

    const guessedPlayer = findFootballGridPlayer(currentGuess);

    if (!guessedPlayer) {
      showTransientMessage('Player not found. Try a name from the player list.');
      return;
    }

    if (
      Object.values(solvedCells).some((cell) => cell.playerId === guessedPlayer.id) ||
      guesses.some((guess) => guess.playerId === guessedPlayer.id || guess.playerName.toLowerCase() === guessedPlayer.name.toLowerCase())
    ) {
      showTransientMessage('You have already used that player.');
      return;
    }

    const correct = isPlayerValidForFootballGridCell(guessedPlayer, activeCell);
    const nextGuesses = [
      ...guesses,
      {
        cellIndex: activeCell.index,
        playerId: guessedPlayer.id,
        playerName: guessedPlayer.name,
        correct,
      },
    ];

    if (!correct) {
      setGuesses(nextGuesses);
      setCurrentGuess('');
      showTransientMessage(`${guessedPlayer.name} does not match this square.`);
      return;
    }

    const nextSolvedCells = {
      ...solvedCells,
      [activeCell.index]: {
        playerId: guessedPlayer.id,
        playerName: guessedPlayer.name,
      },
    };
    const nextWon = Object.keys(nextSolvedCells).length === CELL_COUNT;
    const nextEndTime = nextWon ? Date.now() : undefined;

    setSolvedCells(nextSolvedCells);
    setGuesses(nextGuesses);
    setCurrentGuess('');
    setWon(nextWon);
    setGameOver(nextWon);
    setEndTime(nextEndTime);
    setActiveCellIndex(getNextOpenCellIndex(nextSolvedCells, activeCell.index));

    if (nextWon && nextEndTime) {
      const startedAt = startTime ?? nextEndTime;
      const timeTaken = Math.max(1, Math.floor((nextEndTime - startedAt) / 1000));
      saveGameResult(GAME_TYPE, true, nextGuesses.length, timeTaken, STATS_MAX_GUESSES);
    }
  };

  const copyResults = async () => {
    try {
      const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      const shareText = [
        `Football Grid #${daysSinceEpoch} - ${solvedCount}/${CELL_COUNT}`,
        '',
        `Guesses: ${guesses.length}`,
        `Wrong guesses: ${wrongGuessCount}`,
        '',
        'https://footle.club/grid',
      ].join('\n');

      await navigator.clipboard.writeText(shareText);
      setShowCopied(true);
      window.setTimeout(() => setShowCopied(false), 2500);
    } catch (error) {
      console.error('Failed to copy Football Grid results:', error);
    }
  };

  const renderGrid = () => (
    <div className="overflow-x-auto">
      <div className="grid min-w-[380px] grid-cols-[96px_repeat(3,minmax(86px,1fr))] gap-2 sm:grid-cols-[128px_repeat(3,minmax(120px,1fr))]">
        <div className="min-h-16" />
        {challenge.columns.map((column) => (
          <div
            key={`${column.kind}-${column.value}`}
            className="flex min-h-16 flex-col items-center justify-center rounded-lg border border-blue-500/25 bg-blue-500/10 px-2 text-center text-blue-100"
          >
            {renderClueHeader(column, 'column')}
          </div>
        ))}

        {challenge.rows.map((row, rowIndex) => (
          <div key={`${row.kind}-${row.value}`} className="contents">
            <div className="flex min-h-24 flex-col items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2 text-center text-emerald-100">
              {renderClueHeader(row, 'row')}
            </div>
            {challenge.columns.map((column, columnIndex) => {
              const cell = challenge.cells[rowIndex * 3 + columnIndex];
              const solvedCell = solvedCells[cell.index];
              const isActive = activeCellIndex === cell.index && !gameOver;

              return (
                <button
                  key={`${row.value}-${column.value}`}
                  type="button"
                  onClick={() => !gameOver && !solvedCell && setActiveCellIndex(cell.index)}
                  disabled={gameOver || Boolean(solvedCell)}
                  aria-label={getCellLabel(cell)}
                  className={`flex min-h-24 flex-col items-center justify-center rounded-lg border p-2 text-center transition ${getCellStatusClass(Boolean(solvedCell), isActive)}`}
                >
                  {solvedCell ? (
                    <>
                      <span className="text-sm font-bold leading-tight text-white">{solvedCell.playerName}</span>
                      <span className="mt-2 text-[10px] uppercase tracking-[0.14em] text-emerald-200">Solved</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-bold">?</span>
                      <span className="mt-2 text-[10px] uppercase tracking-[0.14em] text-gray-500">
                        {isActive ? 'Active' : 'Pick'}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header className="relative text-center">
        <div className="absolute right-0 top-0">
          <button
            type="button"
            onClick={() => setShowStats(true)}
            className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700"
          >
            Stats
          </button>
        </div>
        <p className="mb-3 text-sm uppercase tracking-[0.28em] text-blue-300">New daily mode</p>
        <h1 className="text-4xl font-bold md:text-5xl">Football Grid</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-300">
          Fill the 3x3 grid with players who match each club, league, or nationality pairing.
        </p>
      </header>

      {!started ? (
        <section className="rounded-lg bg-gray-800 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">How it works</h2>
              <p className="text-gray-300">
                Each row and column can be a club, league, or nationality clue. Pick a square, type a current player from
                the Footle player list, and complete all nine cells as quickly as you can.
              </p>
              <p className="text-sm text-gray-400">
                Wrong player guesses count on the leaderboard, but unknown names do not. Every daily grid is built from
                Europe&apos;s top five league player data.
              </p>
              <button
                type="button"
                onClick={handleStart}
                className="rounded-lg bg-blue-500 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-600"
              >
                Start Football Grid
              </button>
            </div>
            <div className="rounded-lg bg-gray-900/70 p-4">{renderGrid()}</div>
          </div>
        </section>
      ) : (
        <div className="space-y-6">
          <section className="rounded-lg bg-gray-800 p-4 md:p-6">{renderGrid()}</section>

          {!gameOver && activeCell && (
                  <section className="space-y-4 rounded-lg bg-gray-800 p-5 md:p-6">
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Selected square</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  Player who {getCellLabel(activeCell)}
                </p>
              </div>
              <SearchBar
                value={currentGuess}
                onChange={setCurrentGuess}
                onSubmit={handleGuess}
                disabled={gameOver}
                playerNames={challenge.playerNames}
                submitLabel="Enter"
                placeholder="Type a player name..."
                inputClassName="bg-gray-950/70"
              />
              {message && <p className="text-center text-sm text-amber-300">{message}</p>}
              <div className="grid grid-cols-3 gap-3 text-center text-sm text-gray-300">
                <div className="rounded-lg bg-gray-900/70 p-3">
                  <span className="block text-xs uppercase tracking-[0.18em] text-gray-500">Solved</span>
                  <span className="mt-1 block text-2xl font-bold text-white">{solvedCount}/9</span>
                </div>
                <div className="rounded-lg bg-gray-900/70 p-3">
                  <span className="block text-xs uppercase tracking-[0.18em] text-gray-500">Guesses</span>
                  <span className="mt-1 block text-2xl font-bold text-white">{guesses.length}</span>
                </div>
                <div className="rounded-lg bg-gray-900/70 p-3">
                  <span className="block text-xs uppercase tracking-[0.18em] text-gray-500">Wrong</span>
                  <span className="mt-1 block text-2xl font-bold text-white">{wrongGuessCount}</span>
                </div>
              </div>
            </section>
          )}

          {gameOver && (
            <section className="rounded-lg bg-gray-800 p-6 text-center">
              <h2 className="text-3xl font-bold text-white">Grid complete</h2>
              <p className="mt-3 text-lg text-gray-300">
                You finished today&apos;s grid in {guesses.length} guesses with {wrongGuessCount} wrong.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={copyResults}
                  className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
                >
                  Copy Results
                </button>
                <a
                  href="/"
                  className="rounded-lg bg-gray-700 px-6 py-2 text-white transition-colors hover:bg-gray-600"
                >
                  Play other games
                </a>
              </div>
              {showCopied && <p className="mt-3 text-sm text-emerald-400">Results copied to clipboard.</p>}
            </section>
          )}

          {gameOver && won && endTime && startTime && (
            <Leaderboard
              gameType={GAME_TYPE}
              guesses={guesses.length}
              time={Math.max(1, Math.floor((endTime - startTime) / 1000))}
              showSubmitForm={true}
              scoreLabel="Guesses"
              scoreLabelSingular="guess"
              scoreLabelPlural="guesses"
            />
          )}

          <section className="rounded-lg bg-gray-800 p-5 md:p-6">
            <h3 className="text-lg font-bold text-gray-300">Guess Log</h3>
            <div className="mt-4 space-y-3">
              {guesses.length === 0 ? (
                <p className="text-sm text-gray-500">No guesses yet.</p>
              ) : (
                [...guesses].reverse().map((guess, index) => {
                  const cell = challenge.cells[guess.cellIndex];
                  return (
                    <div
                      key={`${guess.playerName}-${guess.cellIndex}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3"
                    >
                      <div>
                        <div className="font-semibold text-white">{guess.playerName}</div>
                        <div className="text-xs text-gray-400">{getCellLabel(cell)}</div>
                      </div>
                      <div
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                          guess.correct ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {guess.correct ? 'Correct' : 'Wrong'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      )}

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        gameType={GAME_TYPE}
        maxGuesses={STATS_MAX_GUESSES}
        gameTitle="Football Grid"
      />
    </div>
  );
}
