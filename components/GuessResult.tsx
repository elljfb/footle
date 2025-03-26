import React from 'react';
import { GuessResponseWithValues } from '../services/gameService';

interface GuessResultProps {
  guess: GuessResponseWithValues;
  playerName: string;
}

const ResultRow = ({ label, value, result }: { label: string; value: string | number; result: 'correct' | 'close' | 'incorrect' }) => {
  const bgColor = {
    correct: 'bg-green-500',
    close: 'bg-orange-500',
    incorrect: 'bg-gray-600',
  }[result];

  const icon = {
    correct: '✓',
    close: '≈',
    incorrect: '✗',
  }[result];

  return (
    <div className={`${bgColor} p-3 rounded-lg flex justify-between items-center transition-colors duration-200`}>
      <div className="flex flex-col">
        <span className="font-medium text-sm opacity-80">{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <span className="text-xl">{icon}</span>
    </div>
  );
};

export default function GuessResult({ guess, playerName }: GuessResultProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="text-lg font-bold mb-4 flex items-center justify-between">
        <span>{playerName}</span>
        <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">
          {guess.isCorrect ? '🎯 Correct!' : '❌ Incorrect'}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ResultRow label="Position" value={guess.values.position} result={guess.position} />
        <ResultRow label="Sub-Position" value={guess.values.subPosition} result={guess.subPosition} />
        <ResultRow label="Age" value={guess.values.age} result={guess.age} />
        <ResultRow label="Nationality" value={guess.values.nationality} result={guess.nationality} />
        <ResultRow label="Club" value={guess.values.club} result={guess.club} />
        <ResultRow label="League" value={guess.values.league} result={guess.league} />
        <ResultRow label="Height" value={`${guess.values.height}cm`} result={guess.height} />
        <ResultRow label="Foot" value={guess.values.foot} result={guess.foot} />
      </div>
    </div>
  );
} 