'use client';

import { useEffect, useState } from 'react';
import { GameStats } from '../types/game';
import { getStats, getWinPercentage, getGuessDistributionWithMax } from '../services/statsService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gameType: string;
  maxGuesses: number;
  gameTitle?: string;
}

export default function StatsModal({ isOpen, onClose, gameType, maxGuesses, gameTitle }: Props) {
  const [stats, setStats] = useState<GameStats | null>(null);

  useEffect(() => {
    if (isOpen) {
      const currentStats = getStats(gameType);
      setStats(currentStats);
    }
  }, [isOpen, gameType]);

  if (!isOpen || !stats) return null;

  const winPercentage = getWinPercentage(stats);
  const distribution = getGuessDistributionWithMax(stats, maxGuesses);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {gameTitle ? `${gameTitle} Stats` : 'Statistics'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.gamesPlayed}</div>
              <div className="text-xs text-gray-400 mt-1">Played</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{winPercentage}</div>
              <div className="text-xs text-gray-400 mt-1">Win %</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.currentStreak}</div>
              <div className="text-xs text-gray-400 mt-1">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.maxStreak}</div>
              <div className="text-xs text-gray-400 mt-1">Max Streak</div>
            </div>
          </div>

          {/* Average Guesses */}
          {stats.gamesWon > 0 && (
            <div className="text-center mb-6 pb-6 border-b border-gray-700">
              <div className="text-2xl font-bold">{stats.averageGuesses}</div>
              <div className="text-xs text-gray-400 mt-1">Average Guesses (Wins Only)</div>
            </div>
          )}

          {/* Guess Distribution */}
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-4">Guess Distribution</h3>
            {stats.gamesWon === 0 ? (
              <p className="text-center text-gray-400 py-8">
                No wins yet. Keep playing to see your distribution!
              </p>
            ) : (
              <div className="space-y-2">
                {distribution.map(({ guesses, count, percentage }) => (
                  <div key={guesses} className="flex items-center gap-2">
                    <div className="w-4 text-right text-sm">{guesses}</div>
                    <div className="flex-1 h-8 bg-gray-700 rounded relative overflow-hidden">
                      <div
                        className="h-full bg-green-600 transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(percentage, count > 0 ? 8 : 0)}%` }}
                      >
                        {count > 0 && (
                          <span className="text-white text-sm font-bold">{count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Info */}
          {stats.gamesPlayed > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                <div>
                  <span className="font-semibold text-white">{stats.gamesWon}</span> wins
                </div>
                <div>
                  <span className="font-semibold text-white">{stats.gamesPlayed - stats.gamesWon}</span> losses
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {stats.gamesPlayed === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-400 mb-2">No games played yet</p>
              <p className="text-sm text-gray-500">
                Complete a game to start tracking your stats!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
