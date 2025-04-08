import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [size, setSize] = useState(3);
  const [gameMode, setGameMode] = useState('pvp'); // 'pvp' or 'pvc'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleStartGame = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:5000/api/games', {
        boardSize: size,
        gameMode: gameMode
      });
      navigate(`/game/${response.data._id}`);
    } catch (error) {
      console.error('Error starting game:', error);
      setError('Failed to start game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#DB7093]">XO GAME</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Game Mode
        </label>
        <select
          className="w-full px-3 py-2 border rounded-lg mb-4"
          value={gameMode}
          onChange={(e) => setGameMode(e.target.value)}
        >
          <option value="pvp">Player vs Player</option>
          <option value="pvc">Player vs Computer</option>
        </select>

        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Board Size
        </label>
        <select
          className="w-full px-3 py-2 border rounded-lg"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        >
          {[3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <option key={value} value={value}>
              {value}x{value}
            </option>
          ))}
        </select>
      </div>

      <button
        className="w-full bg-[#FFB6C1] hover:bg-[#DB7093] text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
        onClick={handleStartGame}
        disabled={isLoading}
      >
        {isLoading ? 'Starting Game...' : 'Start New Game'}
      </button>

      <button
        className="w-full mt-4 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg"
        onClick={() => navigate('/history')}
      >
        View Game History
      </button>
    </div>
  );
}

export default Home; 