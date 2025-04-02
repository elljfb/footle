import React from 'react';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    gamesPlayed: number;
    winPercentage: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: number[];
  };
}

export default function StatisticsModal({ isOpen, onClose, stats }: StatisticsModalProps) {
  if (!isOpen) return null;

  const maxGuesses = Math.max(...stats.guessDistribution);
  const barWidth = (count: number) => `${(count / maxGuesses) * 100}%`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Statistics</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8 text-center">
            <div>
              <div className="text-4xl font-bold">{stats.gamesPlayed}</div>
              <div className="text-sm text-gray-400">Played</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{stats.winPercentage}</div>
              <div className="text-sm text-gray-400">Win %</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{stats.currentStreak}</div>
              <div className="text-sm text-gray-400">Current Streak</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{stats.maxStreak}</div>
              <div className="text-sm text-gray-400">Max Streak</div>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4">Guess Distribution</h3>
          <div className="space-y-2">
            {stats.guessDistribution.slice(0, 5).map((count, index) => (
              <div key={index} className="flex items-center">
                <div className="w-4">{index + 1}</div>
                <div className="flex-1 ml-2">
                  <div className="relative h-8">
                    <div
                      className={`absolute inset-y-0 left-0 ${
                        count > 0 ? 'bg-green-500' : 'bg-gray-600'
                      } rounded flex items-center justify-end px-2 min-w-[40px]`}
                      style={{ width: count > 0 ? barWidth(count) : '40px' }}
                    >
                      <span className="leading-8">
                        {count}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 