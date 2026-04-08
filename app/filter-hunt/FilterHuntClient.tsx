'use client';

import { useEffect, useState } from 'react';
import Leaderboard from '../../components/Leaderboard';
import { evaluateFilterRule, getDailyFilterHuntChallenge } from '../../lib/newModes';
import { saveGameResult } from '../../services/statsService';

const STORAGE_KEY = 'footle_filter_hunt_state';

interface SavedState {
  date: string;
  state: {
    eliminatedIds: number[];
    started: boolean;
    gameOver: boolean;
    won: boolean;
    mistakes: number;
    startTime?: number;
    endTime?: number;
  };
}

export default function FilterHuntClient() {
  const challenge = useState(() => getDailyFilterHuntChallenge())[0];
  const [eliminatedIds, setEliminatedIds] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<number | undefined>();
  const [endTime, setEndTime] = useState<number | undefined>();
  const [message, setMessage] = useState<string | null>(null);
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

      setEliminatedIds(parsed.state.eliminatedIds);
      setStarted(parsed.state.started);
      setGameOver(parsed.state.gameOver);
      setWon(parsed.state.won);
      setMistakes(parsed.state.mistakes);
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
        eliminatedIds,
        started,
        gameOver,
        won,
        mistakes,
        startTime,
        endTime,
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [eliminatedIds, endTime, gameOver, mistakes, started, startTime, won]);

  const getActiveInstructionIndex = () => {
    let index = 0;

    while (index < challenge.instructions.length) {
      const rule = challenge.instructions[index];
      const hasMatchesRemaining = challenge.cards.some(
        (card) => !eliminatedIds.includes(card.id) && evaluateFilterRule(card, rule)
      );

      if (hasMatchesRemaining) {
        break;
      }

      index += 1;
    }

    return index;
  };

  const activeInstructionIndex = getActiveInstructionIndex();
  const activeInstruction = challenge.instructions[activeInstructionIndex];
  const remainingCards = challenge.cards.filter((card) => !eliminatedIds.includes(card.id));
  const activeStepLabel = Math.min(activeInstructionIndex + 1, challenge.instructions.length);

  useEffect(() => {
    if (!started || gameOver) return;

    if (remainingCards.length === 1 && remainingCards[0].id === challenge.targetPlayerId) {
      setWon(true);
      setGameOver(true);
      setEndTime(Date.now());
      if (startTime) {
        const timeTaken = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        saveGameResult('shortlist', true, mistakes, timeTaken, challenge.cards.length - 1);
      }
    }
  }, [challenge.cards.length, challenge.targetPlayerId, gameOver, mistakes, remainingCards, startTime, started]);

  const handleStart = () => {
    if (started) return;
    setStarted(true);
    setStartTime(Date.now());
  };

  const handleCardClick = (playerId: number) => {
    if (!started || gameOver || eliminatedIds.includes(playerId)) return;

    const player = challenge.cards.find((card) => card.id === playerId);
    if (!player || !activeInstruction) return;

    if (!evaluateFilterRule(player, activeInstruction)) {
      setMistakes((value) => value + 1);
      setMessage('That card stays for this step.');
      window.setTimeout(() => setMessage(null), 1800);
      return;
    }

    const nextEliminated = [...eliminatedIds, playerId];
    setEliminatedIds(nextEliminated);

    if (nextEliminated.length === challenge.cards.length - 1) {
      setWon(true);
      setGameOver(true);
      setEndTime(Date.now());
      if (startTime) {
        const timeTaken = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        saveGameResult('shortlist', true, mistakes, timeTaken, challenge.cards.length - 1);
      }
    }
  };

  const copyResults = async () => {
    try {
      const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      const shareText = [
        `Shortlist #${daysSinceEpoch} - ${won ? 'Solved' : 'X'}`,
        '',
        `${challenge.instructions.length} steps, ${mistakes} mistakes`,
        '',
        'https://footle.club/shortlist',
      ].join('\n');

      await navigator.clipboard.writeText(shareText);
      setShowCopied(true);
      window.setTimeout(() => setShowCopied(false), 2500);
    } catch (error) {
      console.error('Failed to copy filter hunt results:', error);
    }
  };

  return (
    <div className="space-y-8">
      <header className="text-center space-y-3">
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">New mode</p>
        <h1 className="text-4xl md:text-5xl font-bold">Shortlist: Football Player Elimination Challenge</h1>
        <p className="mx-auto max-w-2xl text-gray-300">
          A fast elimination puzzle. Read each instruction, click the players who match it, and narrow the board to one survivor.
        </p>
      </header>

      {!started ? (
        <section className="rounded-lg bg-gray-800 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">How it works</h2>
              <p className="text-gray-300">
                You&apos;ll get 20 player cards and a sequence of elimination rules. One instruction appears at a time,
                and each daily board uses at least 3 steps.
              </p>
              <p className="text-sm text-gray-400">
                This board is built from age, league, position, nationality, height, and foot data already in your player list.
              </p>
              <button
                onClick={handleStart}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Start Shortlist
              </button>
              <div className="rounded-lg bg-gray-900/70 p-4 text-sm text-gray-300">
                <div className="font-semibold text-white">Live rule flow</div>
                <p className="mt-2">
                  Read the current instruction, click every matching card, and keep clearing the board until one player survives.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-gray-900/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Today&apos;s format</div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {['3+', '20', '1'].map((label) => (
                  <div key={label} className="rounded-lg bg-gray-800 px-3 py-4 text-center">
                    <div className="text-2xl font-bold text-white">{label}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-gray-500">
                      {label === '3+' ? 'steps' : label === '20' ? 'cards' : 'survivor'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="space-y-6">
          <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-lg bg-gray-800 p-5 md:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Current instruction</h2>
                <div className="text-sm text-gray-400">
                  Step {activeStepLabel} of {challenge.instructions.length}
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-gray-900/70 p-4 text-lg font-medium text-blue-200">
                {activeInstruction ? activeInstruction.text : 'All filters cleared'}
              </div>

              <div className="mt-4 flex items-center gap-2">
                {challenge.instructions.map((rule, index) => {
                  const isDone = index < activeInstructionIndex;
                  const isActive = index === activeInstructionIndex;

                  return (
                    <span
                      key={rule.id}
                      className={`h-2.5 flex-1 rounded-full ${
                        isDone ? 'bg-emerald-400' : isActive ? 'bg-cyan-300' : 'bg-white/15'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-gray-300">
                <div className="rounded-lg bg-gray-900/70 p-3">
                  <span className="block text-xs uppercase tracking-[0.2em] text-gray-500">Remaining</span>
                  <span className="mt-1 block text-2xl font-bold text-white">{remainingCards.length}</span>
                </div>
                <div className="rounded-lg bg-gray-900/70 p-3">
                  <span className="block text-xs uppercase tracking-[0.2em] text-gray-500">Mistakes</span>
                  <span className="mt-1 block text-2xl font-bold text-white">{mistakes}</span>
                </div>
              </div>

              {message && (
                <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {message}
                </p>
              )}
            </div>

            <div className="rounded-lg bg-gray-800 p-5 md:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Player board</h2>
                <div className="text-sm text-gray-400">{remainingCards.length} cards left</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {challenge.cards.map((player) => {
                  const eliminated = eliminatedIds.includes(player.id);

                  if (eliminated) {
                    return (
                      <div
                        key={player.id}
                        className="rounded-lg bg-gray-900/70 p-2.5 opacity-20"
                      >
                        <div className="text-xs font-semibold leading-tight text-gray-400 line-through break-words">
                          {player.name}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={player.id}
                      onClick={() => handleCardClick(player.id)}
                      className="overflow-hidden rounded-lg bg-gray-900/70 p-2.5 text-left transition hover:-translate-y-0.5 hover:bg-gray-700"
                    >
                      <div className="text-xs font-semibold leading-tight text-white break-words">{player.name}</div>
                      <div
                        className="mt-2 truncate text-[10px] uppercase tracking-[0.16em] text-gray-500"
                        title={player.league}
                      >
                        {player.league}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {gameOver && (
            <section className="text-center p-6 bg-gray-800 rounded-lg">
              <h2 className="text-3xl font-bold text-white">{won ? 'Shortlist cleared' : 'Run ended'}</h2>
              <p className="mt-3 text-lg text-gray-300">
                The final player was <span className="font-semibold text-emerald-200">
                  {challenge.cards.find((card) => card.id === challenge.targetPlayerId)?.name}
                </span>
              </p>
              {endTime && startTime && (
                <p className="mt-2 text-sm text-gray-500">
                  Finished in {Math.max(1, Math.floor((endTime - startTime) / 1000))} seconds.
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
                gameType="shortlist"
                guesses={mistakes}
                time={Math.max(1, Math.floor((endTime - startTime) / 1000))}
                showSubmitForm={won}
                scoreLabel="Mistakes"
                scoreLabelSingular="mistake"
                scoreLabelPlural="mistakes"
              />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
