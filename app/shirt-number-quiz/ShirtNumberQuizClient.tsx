'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Leaderboard from '../../components/Leaderboard';
import type { ShirtNumberQuestion } from '../../lib/premier-league-shirt-numbers';
import { getShirtColor, getShirtDesign, getShirtNumberColor } from '../../lib/premier-league-shirt-colors';

type Phase = 'intro' | 'question' | 'feedback' | 'complete';

interface Answer {
  questionId: string;
  selected: string;
  correct: boolean;
}

interface SavedQuiz {
  challengeDate: string;
  phase: Phase;
  questionIndex: number;
  answers: Answer[];
  startTime: number;
  endTime?: number;
}

function getStorageKey(challengeDate: string): string {
  return `footle_shirt_number_quiz_${challengeDate}`;
}

function Shirt({ club, number }: { club: string; number: number }) {
  const shirtColor = getShirtColor(club);
  const numberColor = getShirtNumberColor(shirtColor, club);

  return (
    <div className="relative h-56 w-56 drop-shadow-xl sm:h-64 sm:w-64">
      <Image
        alt={`${club} football shirt`}
        className="object-contain"
        fill
        priority
        sizes="(max-width: 640px) 224px, 256px"
        src={getShirtDesign(club)}
      />
      <span
        aria-label={`Squad number ${number}`}
        className="absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2 text-[2.7rem] font-black leading-none sm:text-[3.5rem]"
        style={{
          color: numberColor,
          WebkitTextStroke: `1px ${numberColor === '#FFFFFF' ? '#111827' : '#FFFFFF'}`,
          paintOrder: 'stroke fill',
        }}
      >
        {number}
      </span>
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

export default function ShirtNumberQuizClient({
  challengeDate,
  questions,
}: {
  challengeDate: string;
  questions: ShirtNumberQuestion[];
}) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [startTime, setStartTime] = useState<number>();
  const [endTime, setEndTime] = useState<number>();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hasLoadedSavedQuiz, setHasLoadedSavedQuiz] = useState(false);

  const currentQuestion = questions[questionIndex];
  const currentAnswer = answers[questionIndex];
  const correctAnswers = answers.filter((answer) => answer.correct).length;
  const completedTime = startTime && endTime
    ? Math.max(1, Math.floor((endTime - startTime) / 1000))
    : 1;

  useEffect(() => {
    const savedQuiz = localStorage.getItem(getStorageKey(challengeDate));

    if (savedQuiz) {
      try {
        const parsed = JSON.parse(savedQuiz) as SavedQuiz;
        const answersAreValid = Array.isArray(parsed.answers)
          && parsed.answers.every((answer, index) => (
            answer.questionId === questions[index]?.id
            && questions[index]?.options.includes(answer.selected)
            && typeof answer.correct === 'boolean'
          ));

        if (
          parsed.challengeDate === challengeDate
          && ['question', 'feedback', 'complete'].includes(parsed.phase)
          && Number.isInteger(parsed.questionIndex)
          && parsed.questionIndex >= 0
          && parsed.questionIndex < questions.length
          && answersAreValid
          && Number.isFinite(parsed.startTime)
        ) {
          setPhase(parsed.phase);
          setQuestionIndex(parsed.questionIndex);
          setAnswers(parsed.answers);
          setStartTime(parsed.startTime);
          setEndTime(parsed.endTime);
          setElapsedSeconds(Math.floor((Date.now() - parsed.startTime) / 1000));
        } else {
          localStorage.removeItem(getStorageKey(challengeDate));
        }
      } catch (error) {
        console.error('Failed to restore shirt number quiz:', error);
        localStorage.removeItem(getStorageKey(challengeDate));
      }
    }

    setHasLoadedSavedQuiz(true);
  }, [challengeDate, questions]);

  useEffect(() => {
    if (!hasLoadedSavedQuiz || phase === 'intro' || startTime === undefined) return;

    const savedQuiz: SavedQuiz = {
      challengeDate,
      phase,
      questionIndex,
      answers,
      startTime,
      endTime,
    };
    localStorage.setItem(getStorageKey(challengeDate), JSON.stringify(savedQuiz));
  }, [answers, challengeDate, endTime, hasLoadedSavedQuiz, phase, questionIndex, startTime]);

  useEffect(() => {
    if (!startTime || phase === 'intro' || phase === 'complete') return;

    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, startTime]);

  const handleStart = () => {
    const now = Date.now();
    const savedQuiz: SavedQuiz = {
      challengeDate,
      phase: 'question',
      questionIndex: 0,
      answers: [],
      startTime: now,
    };
    localStorage.setItem(getStorageKey(challengeDate), JSON.stringify(savedQuiz));
    setQuestionIndex(0);
    setAnswers([]);
    setStartTime(now);
    setEndTime(undefined);
    setElapsedSeconds(0);
    setPhase('question');
  };

  const handleAnswer = (selected: string) => {
    if (!currentQuestion || phase !== 'question') return;

    const answer: Answer = {
      questionId: currentQuestion.id,
      selected,
      correct: selected === currentQuestion.answer,
    };
    setAnswers((previous) => [...previous, answer]);

    if (questionIndex === questions.length - 1) {
      setEndTime(Date.now());
    }

    setPhase('feedback');
  };

  const handleNextQuestion = () => {
    if (questionIndex === questions.length - 1) {
      setPhase('complete');
      return;
    }

    setQuestionIndex((index) => index + 1);
    setPhase('question');
  };

  if (phase === 'intro') {
    return (
      <main className="mx-auto max-w-2xl">
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-800 via-gray-800 to-slate-950 shadow-2xl shadow-black/30">
          <div className="px-6 py-10 text-center sm:px-12 sm:py-14">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
              <span className="h-2 w-2 rounded-full bg-blue-300" />
              Today&apos;s challenge
            </p>
            <h1 className="mx-auto mt-6 max-w-xl text-3xl font-extrabold leading-tight text-white sm:text-5xl">
              Premier League<br className="hidden sm:block" /> Shirt Number Quiz
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-gray-300 sm:text-lg">
              Every day, the same five shirt-number questions for everyone. Pick the player who wore the number and see how you rank.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                className="min-w-52 rounded-xl bg-blue-500 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-blue-950/40 transition hover:-translate-y-0.5 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
                disabled={!hasLoadedSavedQuiz}
                onClick={handleStart}
                type="button"
              >
                {hasLoadedSavedQuiz ? 'Start today’s quiz' : 'Loading…'}
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-500">One attempt per day · New questions at midnight UTC</p>
          </div>
          <div className="border-t border-white/10 bg-black/10 px-6 py-4 text-center">
            <p className="text-sm text-gray-400">
              Club colours · Five rounds · Score more and finish faster
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (phase === 'complete') {
    return (
      <main className="space-y-6">
        <header className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-blue-300">Premier League Shirt Number Quiz</p>
          <h1 className="text-4xl font-bold text-white">Quiz complete</h1>
        </header>

        <section className="rounded-lg bg-gray-800 p-6 text-center">
          <div className="text-5xl font-bold text-white">{correctAnswers}/5</div>
          <p className="mt-3 text-gray-300">You got {correctAnswers} {correctAnswers === 1 ? 'answer' : 'answers'} right in {formatTime(completedTime)}.</p>
          <p className="mt-5 text-sm text-gray-400">Come back tomorrow for a new set of questions.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-center text-lg font-bold text-gray-300">Your answers</h2>
          {questions.map((question, index) => {
            const answer = answers.find((item) => item.questionId === question.id);

            return (
              <div className="rounded-lg bg-gray-800 p-4" key={question.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Question {index + 1} · {question.season}</p>
                    <p className="font-semibold text-white">{question.club} · No. {question.squadNumber}</p>
                    <p className="mt-1 text-sm text-gray-400">
                      You chose <span className="text-gray-200">{answer?.selected}</span>
                    </p>
                  </div>
                  <span className={`shrink-0 font-semibold ${answer?.correct ? 'text-green-400' : 'text-red-300'}`}>
                    {answer?.correct ? 'Correct' : 'Answer: ' + question.answer}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        <Leaderboard
          key={`${startTime}-${endTime}`}
          gameType="premier-league-shirt-number"
          guesses={correctAnswers}
          time={completedTime}
          showSubmitForm
          scoreLabel="Correct"
          scoreLabelSingular="correct answer"
          scoreLabelPlural="correct answers"
          scoreSort="desc"
          leaderboardScope="daily"
          leaderboardTitle="Today’s Shirt Number Quiz Leaderboard"
          leaderboardFooter="Today’s scores. More correct answers rank first; time breaks ties."
        />
      </main>
    );
  }

  return (
    <main className="space-y-5">
      <header className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-blue-300 sm:text-sm">Premier League Shirt Number Quiz</p>
        <h1 className="text-2xl font-bold text-white sm:text-4xl">Question {questionIndex + 1} of {questions.length}</h1>
        <div className="flex justify-center gap-2" aria-label={`${answers.length} of ${questions.length} questions answered`}>
          {questions.map((question, index) => (
            <span
              aria-hidden="true"
              className={`h-2.5 w-8 rounded-full ${
                index < answers.length
                  ? answers[index]?.correct ? 'bg-green-400' : 'bg-red-400'
                  : index === questionIndex ? 'bg-blue-400' : 'bg-gray-700'
              }`}
              key={question.id}
            />
          ))}
        </div>
      </header>

      <div className="flex items-center justify-between rounded-xl border border-gray-700/80 bg-gray-800/80 px-5 py-3">
        <p className="text-sm text-gray-400">Score <span className="ml-1 font-bold text-white">{correctAnswers}/{questions.length}</span></p>
        <p className="text-sm text-gray-400">Time <span className="ml-1 font-mono font-bold text-white">{formatTime(elapsedSeconds)}</span></p>
      </div>

      {currentQuestion && (
        <section className="space-y-4 rounded-2xl border border-gray-700/80 bg-gray-800 p-5 text-center shadow-xl shadow-black/20 sm:p-7">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-gray-400">{currentQuestion.season} season</p>
            <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{currentQuestion.club}</h2>
          </div>
          <div className="flex justify-center">
            <Shirt club={currentQuestion.club} number={currentQuestion.squadNumber} />
          </div>
          {phase === 'feedback' && currentAnswer && (
            <div aria-live="polite">
              <p className={`text-xl font-bold ${currentAnswer.correct ? 'text-green-400' : 'text-red-300'}`}>
                {currentAnswer.correct ? 'Correct!' : 'Not quite'}
              </p>
              <p className="mt-1 text-gray-300">
                {currentQuestion.answer} wore number {currentQuestion.squadNumber}.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {currentQuestion.options.map((player) => {
              const isSelected = currentAnswer?.selected === player;
              const isAnswer = currentQuestion.answer === player;
              const revealedCorrect = phase === 'feedback' && isAnswer;
              const revealedWrong = phase === 'feedback' && isSelected && !isAnswer;

              return (
                <button
                  className={`rounded-lg border px-4 py-3 text-left font-semibold transition-colors disabled:cursor-default ${
                    revealedCorrect
                      ? 'border-green-400 bg-green-500/20 text-green-100'
                      : revealedWrong
                        ? 'border-red-400 bg-red-500/20 text-red-100'
                        : 'border-gray-700 bg-gray-900/70 text-white hover:border-blue-400 hover:bg-gray-700'
                  }`}
                  disabled={phase !== 'question'}
                  key={player}
                  onClick={() => handleAnswer(player)}
                  type="button"
                >
                  {player}
                </button>
              );
            })}
          </div>
          {phase === 'feedback' && (
            <button
              className="rounded-lg bg-blue-500 px-7 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
              onClick={handleNextQuestion}
              type="button"
            >
              {questionIndex === questions.length - 1 ? 'See your results' : 'Next question'}
            </button>
          )}
        </section>
      )}
    </main>
  );
}
