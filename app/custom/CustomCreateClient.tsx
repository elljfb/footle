'use client';

import { useMemo, useState } from 'react';
import SearchBar from '../../components/SearchBar';
import { LEAGUE_OPTIONS } from '../../lib/leagues';
import { createCustomGame } from '../../services/customGameService';
import { getPlayerNamesFromPool, getPlayersByLeagues } from '../../services/gameService';

type LeagueMode = 'all' | 'selected';

export default function CustomCreateClient() {
  const [title, setTitle] = useState('');
  const [leagueMode, setLeagueMode] = useState<LeagueMode>('all');
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const availablePlayers = useMemo(() => {
    if (leagueMode === 'all') {
      return getPlayersByLeagues();
    }
    if (selectedLeagues.length === 0) {
      return [];
    }
    return getPlayersByLeagues(selectedLeagues);
  }, [leagueMode, selectedLeagues]);

  const playerNames = useMemo(
    () => getPlayerNamesFromPool(availablePlayers),
    [availablePlayers]
  );

  const exactPlayerMatch = useMemo(() => {
    const normalized = playerName.trim().toLowerCase();
    return availablePlayers.find((player) => player.name.toLowerCase() === normalized) ?? null;
  }, [playerName, availablePlayers]);

  const toggleLeague = (leagueName: string) => {
    setSelectedLeagues((prev) =>
      prev.includes(leagueName)
        ? prev.filter((league) => league !== leagueName)
        : [...prev, leagueName]
    );
  };

  const handleCreate = async () => {
    setError('');
    setShareUrl('');
    setCopied(false);

    if (leagueMode === 'selected' && selectedLeagues.length === 0) {
      setError('Select at least one league, or switch to All Players.');
      return;
    }

    if (!exactPlayerMatch) {
      setError('Select a valid player from the available leagues.');
      return;
    }

    setIsSaving(true);
    try {
      const customGame = await createCustomGame({
        title,
        playerName: exactPlayerMatch.name,
        selectedLeagues: leagueMode === 'all' ? undefined : selectedLeagues,
      });

      const origin = window.location.origin;
      setShareUrl(`${origin}/custom/${customGame.slug}`);
    } catch (err) {
      console.error(err);
      setError('Could not create custom game. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const copyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-2">Create Custom Footle</h1>
        <p className="text-gray-400">Pick leagues, choose a player, and share the game link with friends.</p>
        <p className="text-gray-400">The custom game will expire after 7 days.</p>
      </header>

      <div className="bg-gray-800 rounded-lg p-5 space-y-5">
        <div className="space-y-2">
          <label htmlFor="custom-title" className="block text-sm text-gray-300">
            Title (optional)
          </label>
          <input
            id="custom-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Weekend challenge"
            className="w-full px-4 py-3 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
            maxLength={80}
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-300">Player pool</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLeagueMode('all')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                leagueMode === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
            >
              All Players
            </button>
            <button
              type="button"
              onClick={() => setLeagueMode('selected')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                leagueMode === 'selected' ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
            >
              Specific Leagues
            </button>
          </div>

          {leagueMode === 'selected' && (
            <div className="grid sm:grid-cols-2 gap-2">
              {LEAGUE_OPTIONS.map((league) => (
                <label key={league.slug} className="flex items-center gap-2 text-sm bg-gray-900 rounded p-2">
                  <input
                    type="checkbox"
                    checked={selectedLeagues.includes(league.name)}
                    onChange={() => toggleLeague(league.name)}
                    className="accent-blue-500"
                  />
                  {league.name}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-300">
            Target player ({availablePlayers.length} available)
          </p>
          <SearchBar
            value={playerName}
            onChange={setPlayerName}
            onSubmit={handleCreate}
            playerNames={playerNames}
            submitLabel={isSaving ? 'Creating...' : 'Create'}
            placeholder={leagueMode === 'selected' && selectedLeagues.length === 0 ? 'Select leagues first' : 'Type a player name...'}
            inputClassName="bg-gray-900"
            disabled={isSaving || (leagueMode === 'selected' && selectedLeagues.length === 0)}
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {shareUrl && (
        <div className="bg-gray-800 rounded-lg p-5 space-y-3">
          <p className="text-green-400 font-semibold">Custom game created</p>
          <div className="bg-gray-900 rounded px-3 py-2 text-sm break-all">{shareUrl}</div>
          <button
            type="button"
            onClick={copyLink}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            {copied ? 'Copied' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
}
