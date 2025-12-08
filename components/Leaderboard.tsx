'use client';

import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types/game';
import { 
  getLeaderboard, 
  saveToLeaderboard, 
  hasSubmittedToday,
  formatTime 
} from '../services/leaderboardService';

interface Props {
  gameType: string;
  guesses: number;
  time: number;
  showSubmitForm: boolean;
  onSubmit?: () => void;
}

export default function Leaderboard({ gameType, guesses, time, showSubmitForm, onSubmit }: Props) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [nickname, setNickname] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboard();
    setHasSubmitted(hasSubmittedToday(gameType));
  }, [gameType]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard(gameType);
      setLeaderboard(data);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim() || nickname.trim().length < 2) {
      alert('Please enter a nickname (at least 2 characters)');
      return;
    }

    if (nickname.trim().length > 20) {
      alert('Nickname must be 20 characters or less');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await saveToLeaderboard(gameType, nickname.trim(), guesses, time);
      setHasSubmitted(true);
      setShowForm(false);
      await loadLeaderboard();
      
      if (onSubmit) {
        onSubmit();
      }
    } catch (err) {
      console.error('Error submitting score:', err);
      setError('Failed to submit score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserRank = (): number | null => {
    if (!hasSubmitted) return null;
    
    // Find the user's position in sorted list
    const sorted = [...leaderboard].sort((a, b) => {
      if (a.guesses !== b.guesses) {
        return a.guesses - b.guesses;
      }
      return a.time - b.time;
    });
    
    // Find most recent submission with matching stats
    const userEntry = sorted.find(e => e.guesses === guesses && e.time === time);
    if (!userEntry) return null;
    
    return sorted.indexOf(userEntry) + 1;
  };

  const rank = getUserRank();

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">🏆 Today's Leaderboard</h2>
      
      {showSubmitForm && !hasSubmitted && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          {!showForm ? (
            <div className="text-center">
              <p className="text-gray-300 mb-3">
                Great job! You completed the game in <span className="font-bold text-white">{guesses}</span> {guesses === 1 ? 'guess' : 'guesses'} and <span className="font-bold text-white">{formatTime(time)}</span>
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
              >
                Submit to Leaderboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="nickname" className="block text-sm text-gray-300 mb-2">
                  Enter your nickname:
                </label>
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Your nickname"
                  maxLength={20}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Score'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {hasSubmitted && rank && (
        <div className="mb-4 p-3 bg-green-900 bg-opacity-30 border border-green-500 rounded-lg text-center">
          <p className="text-green-400 font-semibold">
            Your rank: #{rank} 🎉
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="text-gray-400 mt-2">Loading leaderboard...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-400 mb-3">{error}</p>
          <button
            onClick={loadLeaderboard}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      ) : leaderboard.length === 0 ? (
        <p className="text-center text-gray-400 py-8">
          No entries yet. Be the first to submit your score!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-2 text-gray-400 text-sm">Rank</th>
                <th className="text-left py-2 px-2 text-gray-400 text-sm">Nickname</th>
                <th className="text-center py-2 px-2 text-gray-400 text-sm">Guesses</th>
                <th className="text-center py-2 px-2 text-gray-400 text-sm">Time</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => {
                const isCurrentUser = hasSubmitted && 
                  entry.guesses === guesses && 
                  entry.time === time &&
                  index === rank! - 1;
                
                return (
                  <tr 
                    key={`${entry.nickname}-${entry.timestamp}`}
                    className={`border-b border-gray-700 ${
                      isCurrentUser ? 'bg-blue-900 bg-opacity-30' : ''
                    }`}
                  >
                    <td className="py-2 px-2 text-gray-300">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && `#${index + 1}`}
                    </td>
                    <td className="py-2 px-2 font-semibold">
                      {entry.nickname}
                      {isCurrentUser && ' (You)'}
                    </td>
                    <td className="py-2 px-2 text-center text-gray-300">
                      {entry.guesses}
                    </td>
                    <td className="py-2 px-2 text-center text-gray-300">
                      {formatTime(entry.time)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      <p className="text-xs text-gray-500 text-center mt-4">
        Leaderboard resets daily at midnight
      </p>
    </div>
  );
}
