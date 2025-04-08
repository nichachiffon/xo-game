import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentGame: null,
  boardSize: 3,
  games: [],
  loading: false,
  error: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setBoardSize: (state, action) => {
      state.boardSize = action.payload;
    },
    setCurrentGame: (state, action) => {
      state.currentGame = action.payload;
    },
    setGames: (state, action) => {
      state.games = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setBoardSize, setCurrentGame, setGames, setLoading, setError } = gameSlice.actions;

export default gameSlice.reducer; 