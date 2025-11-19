import React from 'react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">How to Play</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <p>
              Guess the Footle in 10 tries. Each guess must be a valid football player.
            </p>

            <p>
              Footle features players from Europe's Top 5 Leagues: Premier League, LaLiga, Serie A, Ligue 1, and Bundesliga.
            </p>

            <p>
              If you want to make it easier, you can choose a specific league from the menu. This will limit the daily Footle and your guesses to players from that league only.
            </p>

            <div>
              <h3 className="font-bold mb-2">Attributes Compared:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Position (e.g., Forward, Midfielder)</li>
                <li>Sub-Position (e.g., Striker, Centre-Back)</li>
                <li>Age</li>
                <li>Nationality (orange for same continent)</li>
                <li>Club</li>
                <li>League</li>
                <li>Height</li>
                <li>Foot (Left/Right/Both)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">Color Indicators:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded"></div>
                  <span>Exact match</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-500 rounded"></div>
                  <span>Close match (e.g., same league, similar age, same continent)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-600 rounded"></div>
                  <span>No match</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">Examples:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Age: Orange if within 3 years</li>
                <li>Height: Orange if within 5cm</li>
                <li>Club: Orange if in same league</li>
                <li>Nationality: Orange if from same continent</li>
              </ul>
            </div>

            <p className="text-sm text-gray-400 mt-4">
              Player Data is taken from Transfermarkt.co.uk and was last updated in November 2025. Some players may be missing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 