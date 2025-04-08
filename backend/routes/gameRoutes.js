const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Create a new game
router.post('/', async (req, res) => {
  try {
    const { boardSize } = req.body;
    const game = new Game({ boardSize });
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific game
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
    const { player, position } = req.body;
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.isComplete) {
      return res.status(400).json({ message: 'Game is already complete' });
    }

    if (game.currentPlayer !== player) {
      return res.status(400).json({ message: 'Not your turn' });
    }

    // Add move to game
    game.moves.push({ player, position });
    game.currentPlayer = player === 'X' ? 'O' : 'X';

    // Check for win
    const winner = checkWinner(game);
    if (winner) {
      game.winner = winner;
      game.isComplete = true;
    } else if (game.moves.length === game.boardSize * game.boardSize) {
      game.winner = 'DRAW';
      game.isComplete = true;
    }

    await game.save();
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Helper function to check for winner
function checkWinner(game) {
  const boardSize = game.boardSize;
  const board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
  
  // Fill board with moves
  game.moves.forEach(move => {
    board[move.position.row][move.position.col] = move.player;
  });

  // Check rows
  for (let i = 0; i < boardSize; i++) {
    const row = board[i];
    if (row.every(cell => cell === row[0] && cell !== null)) {
      return row[0];
    }
  }

  // Check columns
  for (let i = 0; i < boardSize; i++) {
    const column = board.map(row => row[i]);
    if (column.every(cell => cell === column[0] && cell !== null)) {
      return column[0];
    }
  }

  // Check diagonals
  const diagonal1 = board.map((row, i) => row[i]);
  const diagonal2 = board.map((row, i) => row[boardSize - 1 - i]);

  if (diagonal1.every(cell => cell === diagonal1[0] && cell !== null)) {
    return diagonal1[0];
  }

  if (diagonal2.every(cell => cell === diagonal2[0] && cell !== null)) {
    return diagonal2[0];
  }

  return null;
}

module.exports = router; 