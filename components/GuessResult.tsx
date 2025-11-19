import React from 'react';
import { GuessResponseWithValues } from '../types/player';

interface GuessResultProps {
  guess: GuessResponseWithValues;
  playerName: string;
  forceIncorrect?: boolean;
}

const ResultRow = ({ label, value, result, direction, forceIncorrect }: { label: string; value: string | number; result: 'correct' | 'close' | 'incorrect'; direction?: 'higher' | 'lower'; forceIncorrect?: boolean }) => {
  const displayResult = forceIncorrect ? 'incorrect' : result;
  
  const bgColor = {
    correct: 'bg-green-500',
    close: 'bg-orange-500',
    incorrect: 'bg-gray-600',
  }[displayResult];

  const icon = {
    correct: '✓',
    close: '≈',
    incorrect: '✗',
  }[displayResult];

  const directionIndicator = direction === 'higher' ? '↓' : direction === 'lower' ? '↑' : '';
  const isDirectionalField = label === 'Age' || label === 'Height';
  const isCorrect = displayResult === 'correct';

  return (
    <div className={`${bgColor} p-3 rounded-lg flex justify-between items-center transition-colors duration-200`}>
      <div className="flex flex-col">
        <span className="font-medium text-sm opacity-80">{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <span className="text-xl">
        {isDirectionalField && !isCorrect ? directionIndicator : icon}
      </span>
    </div>
  );
};

export default function GuessResult({ guess, playerName, forceIncorrect }: GuessResultProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="text-lg font-bold mb-4 flex items-center justify-between">
        <span>{playerName}</span>
        <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">
          {forceIncorrect ? '❌ Missed' : (guess.isCorrect ? '🎯 Correct!' : '❌ Incorrect')}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ResultRow label="Position" value={guess.values.position} result={guess.position} forceIncorrect={forceIncorrect} />
        <ResultRow label="Sub-Position" value={guess.values.subPosition} result={guess.subPosition} forceIncorrect={forceIncorrect} />
        <ResultRow 
          label="Age" 
          value={guess.values.age} 
          result={guess.age}
          direction={guess.values.age > guess.targetValues.age ? 'higher' : 'lower'}
          forceIncorrect={forceIncorrect}
        />
        <ResultRow label="Nationality" value={guess.values.nationality} result={guess.nationality} forceIncorrect={forceIncorrect} />
        <ResultRow label="Club" value={guess.values.club} result={guess.club} forceIncorrect={forceIncorrect} />
        <ResultRow label="League" value={guess.values.league} result={guess.league} forceIncorrect={forceIncorrect} />
        <ResultRow 
          label="Height" 
          value={`${guess.values.height}cm`} 
          result={guess.height}
          direction={guess.values.height > guess.targetValues.height ? 'higher' : 'lower'}
          forceIncorrect={forceIncorrect}
        />
        <ResultRow label="Foot" value={guess.values.foot} result={guess.foot} forceIncorrect={forceIncorrect} />
      </div>
    </div>
  );
} 