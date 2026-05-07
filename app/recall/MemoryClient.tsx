'use client';

import { useEffect, useMemo, useState } from 'react';
import Leaderboard from '../../components/Leaderboard';
import {
  MemoryGuess,
  MemoryRound,
  createMemoryGame,
  getPlayerAge,
  scoreMemoryGuess,
} from '../../services/memoryGameService';
import { Player } from '../../types/player';

type Phase = 'intro' | 'memorize' | 'choose' | 'feedback' | 'complete';

const ROUND_COUNT = 5;
const REMEMBER_SECONDS = 5;
const BEST_SCORE_KEY = 'footle_recall_best_score';

function PlayerStatCard({ player }: { player: Player }) {
  const rows = [
    { label: 'Position', value: player.position },
    { label: 'Role', value: player.subPosition },
    { label: 'Age', value: getPlayerAge(player) },
    { label: 'Nationality', value: player.nationality },
    { label: 'League', value: player.league },
    { label: 'Height', value: `${player.height}cm` },
    { label: 'Foot', value: player.foot },
  ];

  return (
    <section className="rounded-lg bg-gray-800 p-3 shadow-lg sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-blue-300 sm:text-xs">Remember this profile</div>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">Mystery Player</h2>
        </div>
        <div className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-semibold text-gray-300 sm:py-2">
          Live
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {rows.map((row) => (
          <div key={row.label} className="rounded-lg bg-gray-700 p-2 sm:p-3">
            <div className="text-[11px] font-medium text-gray-300 sm:text-sm">{row.label}</div>
            <div className="mt-0.5 break-words text-sm font-bold leading-tight text-white sm:mt-1 sm:text-base">{row.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PlayerOptionStats({ player }: { player: Player }) {
  const stats = [
    { label: 'Pos', value: player.position },
    { label: 'Role', value: player.subPosition },
    { label: 'Age', value: getPlayerAge(player) },
    { label: 'Nat', value: player.nationality },
    { label: 'Lge', value: player.league },
    { label: 'Hgt', value: `${player.height}cm` },
    { label: 'Foot', value: player.foot },
  ];

  return (
    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] leading-tight">
      {stats.map((stat) => (
        <span key={stat.label} className="max-w-full rounded bg-gray-900/60 px-1.5 py-1 text-gray-200">
          <span className="text-gray-500">{stat.label}: </span>
          <span className="font-semibold">{stat.value}</span>
        </span>
      ))}
    </div>
  );
}

function ResultStrip({ guesses }: { guesses: MemoryGuess[] }) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: ROUND_COUNT }, (_, index) => {
        const guess = guesses[index];

        return (
          <div
            key={index}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold sm:h-10 sm:w-10 sm:text-sm ${
              guess
                ? guess.score === 10
                  ? 'border-green-400 bg-green-500/20 text-green-200'
                  : guess.score >= 7
                    ? 'border-orange-400 bg-orange-500/20 text-orange-100'
                    : 'border-gray-500 bg-gray-700 text-gray-200'
                : 'border-gray-700 bg-gray-800 text-gray-500'
            }`}
          >
            {guess ? guess.score : index + 1}
          </div>
        );
      })}
    </div>
  );
}

export default function MemoryClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [rounds, setRounds] = useState<MemoryRound[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [countdown, setCountdown] = useState(REMEMBER_SECONDS);
  const [guesses, setGuesses] = useState<MemoryGuess[]>([]);
  const [startTime, setStartTime] = useState<number | undefined>();
  const [endTime, setEndTime] = useState<number | undefined>();
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [showCopied, setShowCopied] = useState(false);

  const currentRound = rounds[roundIndex];
  const latestGuess = guesses[guesses.length - 1];
  const totalScore = useMemo(
    () => guesses.reduce((sum, guess) => sum + guess.score, 0),
    [guesses]
  );

  useEffect(() => {
    const savedBest = localStorage.getItem(BEST_SCORE_KEY);
    setBestScore(savedBest ? Number(savedBest) : null);
  }, []);

  useEffect(() => {
    if (phase === 'intro') {
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [phase, roundIndex]);

  useEffect(() => {
    if (phase !== 'memorize') {
      return;
    }

    if (countdown <= 0) {
      setPhase('choose');
      return;
    }

    const timeout = window.setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [countdown, phase]);

  const updateBestScore = (score: number) => {
    const currentBest = Number(localStorage.getItem(BEST_SCORE_KEY) ?? 0);

    if (score > currentBest) {
      localStorage.setItem(BEST_SCORE_KEY, String(score));
      setBestScore(score);
    }
  };

  const handleStart = () => {
    const newRounds = createMemoryGame(ROUND_COUNT);

    setRounds(newRounds);
    setRoundIndex(0);
    setGuesses([]);
    setStartTime(Date.now());
    setEndTime(undefined);
    setCountdown(REMEMBER_SECONDS);
    setShowCopied(false);
    setPhase('memorize');
  };

  const handleSelectPlayer = (selected: Player) => {
    if (!currentRound || phase !== 'choose') {
      return;
    }

    const score = scoreMemoryGuess(currentRound.target, selected);
    setGuesses((value) => [
      ...value,
      {
        roundId: currentRound.id,
        target: currentRound.target,
        selected,
        score,
      },
    ]);
    setPhase('feedback');
  };

  const handleNextRound = () => {
    if (roundIndex >= rounds.length - 1) {
      const finishedAt = Date.now();
      const finalScore = totalScore;
      setEndTime(finishedAt);
      updateBestScore(finalScore);
      setPhase('complete');
      return;
    }

    setRoundIndex((value) => value + 1);
    setCountdown(REMEMBER_SECONDS);
    setPhase('memorize');
  };

  const generateShareText = () => {
    const scores = guesses.map((guess) => guess.score).join(' ');

    return [
      `Footle Recall - ${totalScore}/50`,
      '',
      `Rounds: ${scores}`,
      '',
      'https://footle.club/recall',
    ].join('\n');
  };

  const copyResults = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setShowCopied(true);
      window.setTimeout(() => setShowCopied(false), 2500);
    } catch (error) {
      console.error('Failed to copy recall results:', error);
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook') => {
    const shareText = generateShareText();
    const encodedText = encodeURIComponent(shareText);
    const url = encodeURIComponent('https://footle.club/recall');
    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?text=${encodedText}`
      : `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`;

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (phase === 'intro') {
    return (
      <main className="space-y-8">
        <header className="text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-blue-300">Unlimited mode</p>
          <h1 className="text-4xl font-bold text-white md:text-5xl">Footle Recall</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            Memorise a player profile for five seconds, then pick the right footballer from ten similar options.
          </p>
        </header>

        <section className="rounded-lg bg-gray-800 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">How it works</h2>
              <p className="text-gray-300">
                Each run has five rounds. You see position, age, nationality, league, height, and foot,
                but never the player name during the memory phase.
              </p>
              <p className="text-gray-400">
                The answer list is built from the closest statistical matches in the player data, so a wrong pick
                can still score well if it is genuinely close. The club stays hidden so it does not give the answer away.
              </p>
              <button
                onClick={handleStart}
                className="rounded-lg bg-blue-500 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-600"
              >
                Start Recall
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-gray-900/70 p-4">
                <div className="text-3xl font-bold text-white">5</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">rounds</div>
              </div>
              <div className="rounded-lg bg-gray-900/70 p-4">
                <div className="text-3xl font-bold text-white">5s</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">memory</div>
              </div>
              <div className="rounded-lg bg-gray-900/70 p-4">
                <div className="text-3xl font-bold text-white">50</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">max</div>
              </div>
              <div className="col-span-3 rounded-lg bg-gray-900/70 p-4">
                <div className="text-sm uppercase tracking-[0.2em] text-gray-500">Your best</div>
                <div className="mt-2 text-2xl font-bold text-white">{bestScore ?? '-'}/50</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="space-y-3 sm:space-y-6">
      <header className="space-y-2 text-center sm:space-y-4">
        <p className="text-xs uppercase tracking-[0.24em] text-blue-300 sm:text-sm">Footle Recall</p>
        <h1 className="text-2xl font-bold text-white sm:text-4xl">Round {Math.min(roundIndex + 1, ROUND_COUNT)} of {ROUND_COUNT}</h1>
        <ResultStrip guesses={guesses} />
      </header>

      {currentRound && phase !== 'complete' && (
        <>
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-800/70 p-2 text-center sm:gap-4 sm:p-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-gray-500 sm:text-xs">Score</div>
              <div className="mt-1 text-lg font-bold text-white sm:text-2xl">{totalScore}/50</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-gray-500 sm:text-xs">Phase</div>
              <div className="mt-1 text-lg font-bold text-white sm:text-2xl">
                {phase === 'memorize' ? 'Memorise' : phase === 'choose' ? 'Choose' : 'Result'}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-gray-500 sm:text-xs">Timer</div>
              <div className="mt-1 text-lg font-bold text-white sm:text-2xl">
                {phase === 'memorize' ? `${countdown}s` : '-'}
              </div>
            </div>
          </div>

          {phase === 'memorize' && (
            <>
              <PlayerStatCard player={currentRound.target} />
              <p className="text-center text-sm text-gray-400 sm:text-base">
                Study the profile. The screen will switch to the answers when the timer hits zero.
              </p>
            </>
          )}

          {phase === 'feedback' && latestGuess && (
            <section className="rounded-lg bg-gray-800 p-4 text-center sm:p-6">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {latestGuess.score === 10 ? 'Correct' : `${latestGuess.score}/10`}
              </h2>
              <p className="mt-2 text-sm text-gray-300 sm:mt-3 sm:text-base">
                The player was <span className="font-semibold text-white">{latestGuess.target.name}</span>.
                {' '}You picked <span className="font-semibold text-white">{latestGuess.selected.name}</span>.
              </p>
              <button
                onClick={handleNextRound}
                className="mt-4 rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-600 sm:mt-5"
              >
                {roundIndex >= rounds.length - 1 ? 'See final score' : 'Next round'}
              </button>
            </section>
          )}

          {(phase === 'choose' || phase === 'feedback') && (
            <section className="space-y-3 sm:space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-white sm:text-xl">Who matched that profile?</h2>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">Match the remembered stats to the closest card.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {currentRound.options.map((player) => {
                  const isCorrect = player.id === currentRound.target.id;
                  const isSelected = latestGuess?.selected.id === player.id;

                  return (
                    <button
                      key={player.id}
                      onClick={() => handleSelectPlayer(player)}
                      disabled={phase !== 'choose'}
                      className={`rounded-lg border p-2 text-left transition sm:p-4 ${
                        phase === 'feedback' && isCorrect
                          ? 'border-green-400 bg-green-500/20 text-green-100'
                          : phase === 'feedback' && isSelected
                            ? 'border-orange-400 bg-orange-500/20 text-orange-100'
                            : 'border-gray-700 bg-gray-800 text-white hover:border-blue-400 hover:bg-gray-700 disabled:hover:border-gray-700 disabled:hover:bg-gray-800'
                      }`}
                    >
                      <div className="text-sm font-semibold leading-tight sm:text-base">{player.name}</div>
                      <PlayerOptionStats player={player} />
                    </button>
                  );
                })}
              </div>
            </section>
          )}

        </>
      )}

      {phase === 'complete' && startTime && endTime && (
        <section className="space-y-6">
          <div className="rounded-lg bg-gray-800 p-6 text-center">
            <h2 className="text-4xl font-bold text-white">{totalScore}/50</h2>
            <p className="mt-3 text-gray-300">
              Finished in {Math.max(1, Math.floor((endTime - startTime) / 1000))} seconds.
              {bestScore === totalScore ? ' New personal best.' : ''}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={copyResults}
                className="rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
              >
                Copy Results
              </button>
              <button
                onClick={() => handleSocialShare('twitter')}
                className="rounded-lg bg-[#1DA1F2] px-6 py-2 font-semibold text-white transition-colors hover:bg-[#1a8cd8]"
              >
                Share to X
              </button>
              <button
                onClick={() => handleSocialShare('facebook')}
                className="rounded-lg bg-[#4267B2] px-6 py-2 font-semibold text-white transition-colors hover:bg-[#365899]"
              >
                Share to Facebook
              </button>
              <button
                onClick={handleStart}
                className="rounded-lg bg-gray-700 px-6 py-2 font-semibold text-white transition-colors hover:bg-gray-600"
              >
                Play again
              </button>
            </div>
            {showCopied && <p className="mt-3 text-sm text-green-400">Results copied to clipboard.</p>}
          </div>

          <Leaderboard
            key={`${startTime}-${endTime}`}
            gameType="recall"
            guesses={totalScore}
            time={Math.max(1, Math.floor((endTime - startTime) / 1000))}
            showSubmitForm={true}
            scoreLabel="Score"
            scoreLabelSingular="point"
            scoreLabelPlural="points"
            scoreSort="desc"
            leaderboardScope="allTime"
            leaderboardTitle="Recall Leaderboard"
            leaderboardFooter="All-time Recall scores. Higher scores rank first; time breaks ties."
            allowMultipleSubmissions={true}
          />

          <section>
            <h2 className="mb-4 text-center text-lg font-bold text-gray-300">Round Breakdown</h2>
            <div className="space-y-3">
              {guesses.map((guess, index) => (
                <div key={guess.roundId} className="rounded-lg bg-gray-800 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Round {index + 1}</div>
                      <div className="font-semibold text-white">{guess.target.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{guess.score}/10</div>
                      <div className="text-sm text-gray-400">picked {guess.selected.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      )}
    </main>
  );
}
