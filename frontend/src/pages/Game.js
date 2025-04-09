import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AIBot } from '../utils/AIBot';

function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiBot, setAiBot] = useState(null);
  const [isAIMoving, setIsAIMoving] = useState(false);

  const handleMove = useCallback(async (row, col) => {
    if (board[row][col] || winner || isAIMoving) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/games/${id}/move`, {
        row,
        col,
        player: currentPlayer
      });
      setBoard(response.data.board);
      setCurrentPlayer(response.data.currentPlayer);
      setWinner(response.data.winner);
    } catch (error) {
      setError('Failed to make move');
    }
  }, [board, winner, id, currentPlayer, isAIMoving]);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/games/${id}`);
        setGame(response.data);
        setBoard(response.data.board);
        setCurrentPlayer(response.data.currentPlayer);
        setWinner(response.data.winner);
        
        // Initialize AI bot if game mode is Player vs Computer
        if (response.data.gameMode === 'pvc') {
          setAiBot(new AIBot(response.data.boardSize));
        }
        
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch game');
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  useEffect(() => {
    if (game?.gameMode === 'pvc' && currentPlayer === 'O' && !winner && !isAIMoving) {
      setIsAIMoving(true);
      const makeAIMove = async () => {
        try {
          const bestMove = aiBot.findBestMove([...board]);
          await handleMove(bestMove.row, bestMove.col);
        } finally {
          setIsAIMoving(false);
        }
      };
      makeAIMove();
    }
  }, [currentPlayer, game?.gameMode, aiBot, handleMove]);

  if (isLoading) return <div className="text-center">Loading game...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#DB7093]">XO GAME</h1>
      
      <div className="mb-4">
        <p className="text-center text-lg">
          {winner ? (
            winner === 'draw' ? 'Game Draw!' : `Winner: ${winner}`
          ) : (
            `Current Player: ${currentPlayer}`
          )}
        </p>
      </div>

      <div className="grid gap-1 mb-6" style={{ 
        gridTemplateColumns: `repeat(${game.boardSize}, 1fr)`,
        aspectRatio: '1/1'
      }}>
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className="aspect-square border-2 border-gray-300 flex items-center justify-center text-3xl font-bold hover:bg-gray-100"
              onClick={() => handleMove(rowIndex, colIndex)}
              disabled={cell || winner || (game.gameMode === 'pvc' && currentPlayer === 'O')}
            >
              {cell}
            </button>
          ))
        ))}
      </div>

      <button
        className="w-full bg-[#FFB6C1] hover:bg-[#DB7093] text-white font-bold py-2 px-4 rounded-lg"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
  );
}

export default Game; 