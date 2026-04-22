'use client';

import * as FlagIcons from 'country-flag-icons/react/3x2';
import { useEffect, useState } from 'react';
import Leaderboard from '../../components/Leaderboard';
import SearchBar from '../../components/SearchBar';
import {
  compareClubGuess,
  getDailySquadBlueprintChallenge,
  getNationalityFlagIconCode,
  SQUAD_BLUEPRINT_STARTING_CLUE_COUNT,
  SQUAD_BLUEPRINT_TOTAL_CLUE_COUNT,
  SquadFormationCellId,
  getSubPositionShortName,
  isKnownClubGuess,
} from '../../lib/newModes';
import { saveGameResult } from '../../services/statsService';
import { GuessResult } from '../../types/player';

const STORAGE_KEY = 'footle_squad_blueprint_state';
const MAX_GUESSES = 5;

interface FormationCell {
  id: SquadFormationCellId;
  label: string;
}

const FORMATION_ROWS: FormationCell[][] = [
  [
    { id: 'lw', label: 'LW' },
    { id: 'st', label: 'ST' },
    { id: 'rw', label: 'RW' },
  ],
  [
    { id: 'lcm', label: 'CM' },
    { id: 'cm', label: 'CM' },
    { id: 'rcm', label: 'CM' },
  ],
  [
    { id: 'lb', label: 'LB' },
    { id: 'lcb', label: 'CB' },
    { id: 'rcb', label: 'CB' },
    { id: 'rb', label: 'RB' },
  ],
  [{ id: 'gk', label: 'GK' }],
];

interface GuessEntry {
  club: string;
  result: GuessResult;
}

interface SavedState {
  date: string;
  state: {
    guesses: GuessEntry[];
    currentGuess: string;
    started: boolean;
    gameOver: boolean;
    won: boolean;
    startTime?: number;
    endTime?: number;
  };
}

function NationalityFlag({ nationality }: { nationality: string }) {
  const flagIconCode = getNationalityFlagIconCode(nationality);
  const FlagIcon = flagIconCode ? FlagIcons[flagIconCode as keyof typeof FlagIcons] : undefined;

  if (!FlagIcon) {
    return (
      <div
        className="flex h-5 w-7 items-center justify-center rounded-[0.35rem] border border-white/10 bg-white/5 text-[8px] font-semibold uppercase tracking-[0.14em] text-cyan-100/80 sm:h-7 sm:w-10 sm:text-[10px] sm:tracking-[0.18em]"
        title={nationality}
      >
        {nationality.slice(0, 2)}
      </div>
    );
  }

  return (
    <FlagIcon
      title={nationality}
      className="h-5 w-7 rounded-[0.35rem] shadow-md shadow-black/30 sm:h-7 sm:w-10"
    />
  );
}

export default function SquadBlueprintClient() {
  const challenge = useState(() => getDailySquadBlueprintChallenge())[0];
  const [guesses, setGuesses] = useState<GuessEntry[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [startTime, setStartTime] = useState<number | undefined>();
  const [endTime, setEndTime] = useState<number | undefined>();
  const [showError, setShowError] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedState = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();

    if (!savedState) return;

    try {
      const parsed = JSON.parse(savedState) as SavedState;
      if (parsed.date !== today) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      setGuesses(parsed.state.guesses);
      setCurrentGuess(parsed.state.currentGuess);
      setStarted(parsed.state.started);
      setGameOver(parsed.state.gameOver);
      setWon(parsed.state.won);
      setStartTime(parsed.state.startTime);
      setEndTime(parsed.state.endTime);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!started || typeof window === 'undefined') return;

    const stateToSave: SavedState = {
      date: new Date().toDateString(),
      state: {
        guesses,
        currentGuess,
        started,
        gameOver,
        won,
        startTime,
        endTime,
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [currentGuess, endTime, gameOver, guesses, started, startTime, won]);

  const handleStart = () => {
    if (started) return;
    setStarted(true);
    setStartTime(Date.now());
  };

  const handleGuess = () => {
    if (!started || gameOver || !currentGuess.trim()) return;

    if (!isKnownClubGuess(currentGuess)) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2500);
      return;
    }

    const result = compareClubGuess(currentGuess, challenge.club, challenge.clubLeague);
    const nextGuesses = [...guesses, { club: currentGuess.trim(), result }];
    const nextWon = result === 'correct';
    const nextGameOver = nextWon || nextGuesses.length >= MAX_GUESSES;

    setGuesses(nextGuesses);
    setCurrentGuess('');
    setWon(nextWon);
    setGameOver(nextGameOver);
    setEndTime(nextGameOver ? Date.now() : undefined);

    if (nextGameOver && startTime) {
      const timeTaken = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      saveGameResult('squadle', nextWon, nextGuesses.length, timeTaken, MAX_GUESSES);
    }
  };

  const generateShareText = () => {
    const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return [
      `Squadle #${daysSinceEpoch} - ${won ? guesses.length : 'X'}/${MAX_GUESSES}`,
      '',
      ...guesses.map(({ result }) => (result === 'correct' ? '🟩' : result === 'close' ? '🟧' : '⬜')),
      '',
      'https://footle.club/squadle',
    ].join('\n');
  };

  const copyResults = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2500);
    } catch (error) {
      console.error('Failed to copy squad blueprint results:', error);
    }
  };

  const formatResultText = (result: GuessResult) => {
    if (result === 'correct') return 'Correct club';
    if (result === 'close') return 'Same league';
    return 'Wrong club';
  };

  const revealedClueCount = Math.min(
    challenge.slots.length,
    SQUAD_BLUEPRINT_STARTING_CLUE_COUNT + guesses.filter((guess) => guess.result !== 'correct').length
  );
  const hiddenClueCount = Math.max(
    0,
    Math.min(
      challenge.slots.length,
      SQUAD_BLUEPRINT_TOTAL_CLUE_COUNT
    ) - revealedClueCount
  );
  const revealedSlotIds = new Set(
    challenge.slots
      .slice(0, revealedClueCount)
      .map((slot) => slot.formationCellId)
  );

  const formationRows = FORMATION_ROWS.map((row) =>
    row.map((cell) => ({
      ...cell,
      slot: challenge.slots.find((slot) => slot.formationCellId === cell.id) ?? null,
    }))
  );

  const renderPitchSlot = (cell: FormationCell & { slot: (typeof challenge.slots)[number] | null }) => {
    if (cell.slot && revealedSlotIds.has(cell.id)) {
      return (
        <div className="mx-auto flex h-20 w-16 flex-col items-center justify-center rounded-[1rem] border border-white/15 bg-black/30 p-2 text-center shadow-lg shadow-black/20 backdrop-blur-sm sm:h-32 sm:w-28 sm:rounded-[1.4rem] sm:p-3">
          <div className="text-[8px] uppercase tracking-[0.16em] text-cyan-100/80 sm:text-[10px] sm:tracking-[0.24em]">
            {cell.label}
          </div>
          <div className="mt-1.5 sm:mt-2">
            <NationalityFlag nationality={cell.slot.nationality} />
          </div>
          <div className="mt-1.5 text-lg font-bold leading-none text-white sm:mt-2 sm:text-2xl">
            {cell.slot.age}
          </div>
          <div className="mt-1 text-[9px] uppercase tracking-[0.14em] text-cyan-200 sm:text-[11px] sm:tracking-[0.22em]">
            {getSubPositionShortName(cell.slot.subPosition)}
          </div>
        </div>
      );
    }

    if (cell.slot) {
      return (
        <div className="mx-auto flex h-20 w-16 flex-col items-center justify-center rounded-[1rem] border border-dashed border-cyan-200/25 bg-black/20 p-2 text-center shadow-lg shadow-black/10 backdrop-blur-sm sm:h-32 sm:w-28 sm:rounded-[1.4rem] sm:p-3">
          <div className="text-[8px] uppercase tracking-[0.16em] text-cyan-100/60 sm:text-[10px] sm:tracking-[0.24em]">
            {cell.label}
          </div>
          <div className="mt-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-base font-semibold text-cyan-100/80 sm:mt-3 sm:h-10 sm:w-10 sm:text-lg">
            ?
          </div>
          <div className="mt-1.5 text-[8px] uppercase tracking-[0.12em] text-cyan-200/70 sm:mt-2 sm:text-[10px] sm:tracking-[0.22em]">
            Hidden clue
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto flex h-16 w-14 flex-col items-center justify-center rounded-[1rem] border border-dashed border-white/10 bg-white/5 p-2 text-center sm:h-28 sm:w-24 sm:rounded-[1.4rem] sm:p-3">
        <div className="text-[8px] uppercase tracking-[0.16em] text-gray-500 sm:text-[10px] sm:tracking-[0.24em]">
          {cell.label}
        </div>
        <div className="mt-1.5 h-6 w-6 rounded-full border border-white/10 bg-white/5 sm:mt-2 sm:h-8 sm:w-8" />
      </div>
    );
  };

  const renderFormationBoard = () => (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-emerald-500/20 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.22),_transparent_36%),linear-gradient(180deg,rgba(7,89,55,0.95),rgba(3,7,18,0.96))] p-2 shadow-2xl shadow-emerald-950/30 sm:rounded-[2rem] sm:p-6">
      <div className="absolute inset-2 rounded-[1.2rem] border border-white/10 sm:inset-6 sm:rounded-[1.7rem]" />
      <div className="absolute left-1/2 top-3 bottom-3 w-px -translate-x-1/2 bg-white/10 sm:top-6 sm:bottom-6" />
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 sm:h-28 sm:w-28" />
      <div className="absolute inset-x-[16%] top-3 h-9 rounded-b-[1rem] border-x border-b border-white/10 sm:inset-x-[24%] sm:top-6 sm:h-12 sm:rounded-b-[1.5rem]" />
      <div className="absolute inset-x-[16%] bottom-3 h-9 rounded-t-[1rem] border-x border-t border-white/10 sm:inset-x-[24%] sm:bottom-6 sm:h-12 sm:rounded-t-[1.5rem]" />
      <div className="relative flex min-h-[24rem] flex-col justify-between gap-3 py-3 sm:min-h-[38rem] sm:gap-5 sm:py-6">
        {formationRows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`flex items-center justify-center ${
              row.length === 4 ? 'gap-1.5 sm:gap-5' : row.length === 3 ? 'gap-2 sm:gap-8' : 'gap-0'
            }`}
          >
            {row.map((cell) => (
              <div key={cell.id} className="flex justify-center">
                {renderPitchSlot(cell)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header className="text-center space-y-3">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">New mode</p>
        <h1 className="text-4xl md:text-5xl font-bold">Squadle: The Daily Starting XI Guessing Game</h1>
        <p className="mx-auto max-w-2xl text-gray-300">
          Work out the club from a stripped-back starting XI. Only a few clue cards are revealed.
        </p>
      </header>

      {!started ? (
        <section className="rounded-lg bg-gray-800 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">How it works</h2>
              <p className="text-gray-300">
                You get a daily squad blueprint made from a real club in your player database. Six players are visible at the
                start, then each non-correct guess reveals one more card in its real position until the full XI is shown.
              </p>
              <p className="text-sm text-gray-400">
                Every reveal gives you the player&apos;s flag, age, and role. Exact club matches are green and same-league guesses are orange, so near misses still help you narrow it down.
              </p>
              <button
                onClick={handleStart}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Start Squadle
              </button>
            </div>

            {renderFormationBoard()}
          </div>
        </section>
      ) : (
        <div className="space-y-6">
          <section className="rounded-lg bg-gray-800 p-5 md:p-6">
            {renderFormationBoard()}
          </section>

          {!gameOver && (
            <section className="space-y-4 rounded-lg bg-gray-800 p-5 md:p-6">
              <div className="text-center mb-1 text-gray-400">
                {guesses.length === 0 ? 'Make your first guess!' : 'Keep guessing...'}
              </div>
              <SearchBar
                value={currentGuess}
                onChange={setCurrentGuess}
                onSubmit={handleGuess}
                disabled={gameOver}
                playerNames={challenge.clubOptions}
                submitLabel="Guess"
                placeholder="Type a club..."
                inputClassName="bg-gray-950/70"
              />
              {showError && (
                <p className="text-center text-sm text-red-400">That club is not in the dataset. Try another one.</p>
              )}
              <p className="text-center text-sm text-gray-400">
                {guesses.length === 0
                  ? `6 of ${Math.min(challenge.slots.length, SQUAD_BLUEPRINT_TOTAL_CLUE_COUNT)} players are visible. Every miss reveals one more.`
                  : `${revealedClueCount} of ${Math.min(challenge.slots.length, SQUAD_BLUEPRINT_TOTAL_CLUE_COUNT)} players revealed, ${hiddenClueCount} still hidden. You have used ${guesses.length} of ${MAX_GUESSES} guesses.`}
              </p>
            </section>
          )}

          {gameOver && (
            <section className="text-center p-6 bg-gray-800 rounded-lg">
              <h2 className="text-3xl font-bold text-white">{won ? 'Squadle solved' : 'Out of guesses'}</h2>
              <p className="mt-3 text-lg text-gray-300">
                The club was <span className="font-semibold text-cyan-200">{challenge.club}</span>
              </p>
              {endTime && startTime && (
                <p className="mt-2 text-sm text-gray-500">
                  Solved in {Math.max(1, Math.floor((endTime - startTime) / 1000))} seconds.
                </p>
              )}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={copyResults}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Copy Results
                </button>
                <a
                  href="/"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Play other games
                </a>
              </div>
              {showCopied && <p className="mt-3 text-sm text-emerald-400">Results copied to clipboard.</p>}
            </section>
          )}

          {gameOver && endTime && startTime && (
            <section className="rounded-lg">
              <Leaderboard
                gameType="squadle"
                guesses={guesses.length}
                time={Math.max(1, Math.floor((endTime - startTime) / 1000))}
                showSubmitForm={won}
                scoreLabel="Guesses"
                scoreLabelSingular="guess"
                scoreLabelPlural="guesses"
              />
            </section>
          )}

          <section className="rounded-lg bg-gray-800 p-5 md:p-6">
            <h3 className="text-lg font-bold mb-4 text-center text-gray-300">Your Guesses</h3>
            <div className="mt-4 space-y-3">
              {guesses.length === 0 ? (
                <p className="text-sm text-gray-500">No guesses yet.</p>
              ) : (
                guesses.map((guess, index) => (
                  <div
                    key={`${guess.club}-${index}`}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                  >
                    <div>
                      <div className="font-semibold text-white">{guess.club}</div>
                      <div className="text-xs text-gray-400">{formatResultText(guess.result)}</div>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        guess.result === 'correct'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : guess.result === 'close'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {guess.result}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
