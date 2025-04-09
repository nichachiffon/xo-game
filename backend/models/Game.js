const mongoose = require('mongoose');

const moveSchema = new mongoose.Schema({
  player: {
    type: String,
    required: true,
    enum: ['X', 'O']
  },
  position: {
    row: Number,
    col: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const gameSchema = new mongoose.Schema({
  boardSize: {
    type: Number,
    required: true,
    min: 3,
    max: 10
  },
  board: {
    type: [[String]],
    required: true
  },
  moves: [moveSchema],
  winner: {
    type: String,
    enum: ['X', 'O', 'draw', null],
    default: null
  },
  currentPlayer: {
    type: String,
    required: true,
    enum: ['X', 'O']
  },
  gameMode: {
    type: String,
    required: true,
    enum: ['pvp', 'pvc'],
    default: 'pvp'
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', gameSchema); 