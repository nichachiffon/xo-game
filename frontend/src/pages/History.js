import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function History() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/games');
        setGames(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Failed to fetch game history');
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleViewGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  if (isLoading) return <div className="text-center">Loading game history...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#DB7093]">Game History</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Board Size</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Game Mode</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-200">
                  {new Date(game.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {game.boardSize}x{game.boardSize}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {game.gameMode === 'pvp' ? 'Player vs Player' : 'Player vs Computer'}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {game.winner ? (
                    game.winner === 'draw' ? 'Draw' : `Winner: ${game.winner}`
                  ) : (
                    'In Progress'
                  )}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  <button
                    className="bg-[#FFB6C1] hover:bg-[#DB7093] text-white font-bold py-2 px-4 rounded-lg"
                    onClick={() => handleViewGame(game._id)}
                  >
                    View/Replay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="w-full mt-6 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
  );
}

export default History; 