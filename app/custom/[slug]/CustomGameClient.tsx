'use client';

import { useEffect, useMemo, useState } from 'react';
import GuessResult from '../../../components/GuessResult';
import InstructionsModal from '../../../components/InstructionsModal';
import Leaderboard from '../../../components/Leaderboard';
import SearchBar from '../../../components/SearchBar';
import { getCustomGameBySlug } from '../../../services/customGameService';
import { checkGuessFromPool, getPlayerNamesFromPool, getPlayersByLeagues } from '../../../services/gameService';
import { GameState } from '../../../types/game';
import { GuessResponseWithValues, Player } from '../../../types/player';

interface Props {
  slug: string;
}

interface CustomGameState {
  title: string | null;
  targetPlayer: Player;
  selectedLeagues: string[] | null;
}

const MAX_GUESSES = 10;

export default function CustomGameClient({ slug }: Props) {
  const [customGame, setCustomGame] = useState<CustomGameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showError, setShowError] = useState(false);
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    currentGuess: '',
    dailyPlayer: null,
    gameOver: false,
    won: false,
    startTime: undefined,
    endTime: undefined,
  });

  const storageKey = `footle_custom_state_${slug}`;

  const guessPool = useMemo(() => {
    if (!customGame) return [];
    return getPlayersByLeagues(customGame.selectedLeagues ?? undefined);
  }, [customGame]);

  const playerNames = useMemo(() => getPlayerNamesFromPool(guessPool), [guessPool]);

  useEffect(() => {
    const loadCustomGame = async () => {
      setLoading(true);
      setLoadError('');

      try {
        const loadedGame = await getCustomGameBySlug(slug);
        if (!loadedGame) {
          setLoadError('This custom game does not exist.');
          setLoading(false);
          return;
        }

        const gameData: CustomGameState = {
          title: loadedGame.title,
          targetPlayer: loadedGame.targetPlayer,
          selectedLeagues: loadedGame.selectedLeagues,
        };

        setCustomGame(gameData);

        const savedState = localStorage.getItem(storageKey);
        if (savedState) {
          const parsedState = JSON.parse(savedState) as GameState;
          setGameState(parsedState);
          setGameStarted(true);
        } else {
          setGameState((prev) => ({ ...prev, dailyPlayer: gameData.targetPlayer }));
        }
      } catch (err) {
        console.error(err);
        setLoadError('Unable to load this custom game right now.');
      } finally {
        setLoading(false);
      }
    };

    loadCustomGame();
  }, [slug, storageKey]);

  useEffect(() => {
    if (!gameStarted) return;
    localStorage.setItem(storageKey, JSON.stringify(gameState));
  }, [gameState, gameStarted, storageKey]);

  const handleGuess = () => {
    if (!gameState.dailyPlayer || gameState.gameOver || !gameState.currentGuess.trim()) {
      return;
    }

    const result = checkGuessFromPool(gameState.dailyPlayer, gameState.currentGuess, guessPool);

    if (!result) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const newGuesses = [
      ...gameState.guesses,
      { playerName: gameState.currentGuess, result },
    ];

    const won = result.isCorrect;
    const gameOver = won || newGuesses.length >= MAX_GUESSES;

    setGameState((prev) => ({
      ...prev,
      guesses: newGuesses,
      currentGuess: '',
      gameOver,
      won,
      endTime: gameOver ? Date.now() : prev.endTime,
    }));
  };

  const copyShareUrl = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShowShareConfirmation(true);
      setTimeout(() => setShowShareConfirmation(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const getMysteryPlayerResult = (): GuessResponseWithValues | null => {
    if (!gameState.dailyPlayer) return null;

    const calculateAge = (dateOfBirth: string): number => {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age;
    };

    const playerAge = calculateAge(gameState.dailyPlayer.dateOfBirth);

    return {
      isCorrect: true,
      position: 'correct',
      subPosition: 'correct',
      age: 'correct',
      nationality: 'correct',
      club: 'correct',
      league: 'correct',
      height: 'correct',
      foot: 'correct',
      values: {
        position: gameState.dailyPlayer.position,
        subPosition: gameState.dailyPlayer.subPosition,
        age: playerAge,
        nationality: gameState.dailyPlayer.nationality,
        club: gameState.dailyPlayer.club,
        league: gameState.dailyPlayer.league,
        height: gameState.dailyPlayer.height,
        foot: gameState.dailyPlayer.foot,
      },
      targetValues: {
        age: playerAge,
        height: gameState.dailyPlayer.height,
      },
    };
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-10">Loading custom game...</div>;
  }

  if (loadError || !customGame) {
    return <div className="text-center text-red-400 py-10">{loadError || 'Could not load custom game.'}</div>;
  }

  const heading = customGame.title?.trim() || 'Custom Footle Challenge';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="absolute top-0 right-0 -mt-2 z-10">
        <button
          onClick={() => setShowInstructions(true)}
          className="w-10 h-10 flex items-center justify-center text-2xl bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
          aria-label="How to play"
        >
          ℹ️
        </button>
      </div>

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">{heading}</h1>
        {gameStarted ? (
          <p className="text-gray-400 text-lg">
            {!gameState.gameOver ? (
              `Guess ${Math.min(gameState.guesses.length + 1, MAX_GUESSES)} of ${MAX_GUESSES}`
            ) : (
              `${gameState.won ? 'Won' : 'Game Over'} in ${gameState.guesses.length} ${gameState.guesses.length === 1 ? 'guess' : 'guesses'}`
            )}
          </p>
        ) : (
          <p className="text-gray-400 text-lg">A shared custom game from your friend.</p>
        )}
      </header>

      <div className="space-y-6">
        {!gameStarted ? (
          <div className="text-center space-y-5 py-8">
            <p className="text-lg">Guess the chosen mystery player in {MAX_GUESSES} attempts.</p>
            <button
              onClick={() => {
                setGameStarted(true);
                setGameState((prev) => ({ ...prev, startTime: Date.now() }));
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Start Playing
            </button>
          </div>
        ) : (
          <>
            {!gameState.gameOver && (
              <div className="relative">
                <div className="text-center mb-4 text-gray-400">
                  {gameState.guesses.length === 0 ? 'Make your first guess!' : 'Keep guessing...'}
                </div>
                <SearchBar
                  value={gameState.currentGuess}
                  onChange={(value) => setGameState((prev) => ({ ...prev, currentGuess: value }))}
                  onSubmit={handleGuess}
                  disabled={gameState.gameOver}
                  playerNames={playerNames}
                />
                {showError && (
                  <div className="absolute top-full mt-2 w-full text-center text-red-500">
                    Player not found in this custom game pool.
                  </div>
                )}
              </div>
            )}

            {gameState.gameOver && (
              <div className="text-center p-6 bg-gray-800 rounded-lg mb-8">
                <h2 className="text-3xl font-bold mb-3">
                  {gameState.won ? 'Congratulations!' : 'Game Over'}
                </h2>
                <p className="text-xl text-gray-400 mb-6">
                  The player was <span className="font-bold text-white">{gameState.dailyPlayer?.name}</span>
                </p>
                <button
                  onClick={copyShareUrl}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Copy Challenge Link
                </button>
                {showShareConfirmation && (
                  <p className="mt-2 text-green-400">Link copied to clipboard!</p>
                )}
              </div>
            )}

            {gameState.gameOver && gameState.startTime && gameState.endTime && (
              <div className="mb-8">
                <Leaderboard
                  gameType={`custom:${slug}`}
                  guesses={gameState.guesses.length}
                  time={Math.floor((gameState.endTime - gameState.startTime) / 1000)}
                  showSubmitForm={gameState.won}
                />
              </div>
            )}

            {gameState.gameOver && !gameState.won && gameState.dailyPlayer && getMysteryPlayerResult() && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-center text-gray-300">Player Details</h3>
                <GuessResult
                  guess={getMysteryPlayerResult()!}
                  playerName={gameState.dailyPlayer.name}
                  forceIncorrect={true}
                />
              </div>
            )}

            {gameState.guesses.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-4 text-center text-gray-300">Your Guesses</h3>
                <div className="space-y-4">
                  {[...gameState.guesses].reverse().map((guess, index) => (
                    <GuessResult
                      key={gameState.guesses.length - 1 - index}
                      guess={guess.result}
                      playerName={guess.playerName}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
    </div>
  );
}
