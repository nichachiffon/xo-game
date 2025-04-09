const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new game
router.post('/', async (req, res) => {
  try {
    const { boardSize, gameMode } = req.body;
    const board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
    
    const game = new Game({
      boardSize,
      board,
      currentPlayer: 'X',
      gameMode: gameMode || 'pvp'
    });

    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Make a move
router.post('/:id/move', async (req, res) => {
  try {
    const { row, col, player } = req.body;
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.winner) {
      return res.status(400).json({ message: 'Game is already over' });
    }

    if (player !== game.currentPlayer) {
      return res.status(400).json({ message: 'Not your turn' });
    }

    if (game.board[row][col]) {
      return res.status(400).json({ message: 'Cell is already occupied' });
    }

    // Make the move
    game.board[row][col] = player;

    // Check for winner
    const winner = checkWinner(game.board);
    if (winner) {
      game.winner = winner;
    } else if (isBoardFull(game.board)) {
      game.winner = 'draw';
    } else {
      // Switch player
      game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
    }

    await game.save();
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Helper function to check for winner
function checkWinner(board) {
  const size = board.length;
  
  // Check rows
  for (let row = 0; row < size; row++) {
    if (board[row][0] && board[row].every(cell => cell === board[row][0])) {
      return board[row][0];
    }
  }

  // Check columns
  for (let col = 0; col < size; col++) {
    const column = board.map(row => row[col]);
    if (column[0] && column.every(cell => cell === column[0])) {
      return column[0];
    }
  }

  // Check diagonals
  const diagonal1 = board.map((row, i) => row[i]);
  const diagonal2 = board.map((row, i) => row[size - 1 - i]);

  if (diagonal1[0] && diagonal1.every(cell => cell === diagonal1[0])) {
    return diagonal1[0];
  }

  if (diagonal2[0] && diagonal2.every(cell => cell === diagonal2[0])) {
    return diagonal2[0];
  }

  return null;
}

// Helper function to check if board is full
function isBoardFull(board) {
  return board.every(row => row.every(cell => cell !== null));
}

module.exports = router; 