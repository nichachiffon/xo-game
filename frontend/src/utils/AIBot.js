export class AIBot {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.maxDepth = Math.min(3, boardSize); // จำกัดความลึกสูงสุด
  }

  // ตรวจสอบว่ามีผู้ชนะหรือไม่
  checkWinner(board) {
    // ตรวจสอบแนวตั้ง
    for (let col = 0; col < this.boardSize; col++) {
      let row = 0;
      while (row < this.boardSize && board[row][col] === board[0][col] && board[row][col] !== null) {
        row++;
      }
      if (row === this.boardSize) return board[0][col];
    }

    // ตรวจสอบแนวนอน
    for (let row = 0; row < this.boardSize; row++) {
      let col = 0;
      while (col < this.boardSize && board[row][col] === board[row][0] && board[row][col] !== null) {
        col++;
      }
      if (col === this.boardSize) return board[row][0];
    }

    // ตรวจสอบแนวทแยง
    let diagonal1 = true;
    let diagonal2 = true;
    for (let i = 0; i < this.boardSize; i++) {
      if (board[i][i] !== board[0][0] || board[i][i] === null) diagonal1 = false;
      if (board[i][this.boardSize - 1 - i] !== board[0][this.boardSize - 1] || board[i][this.boardSize - 1 - i] === null) diagonal2 = false;
    }
    if (diagonal1) return board[0][0];
    if (diagonal2) return board[0][this.boardSize - 1];

    // ตรวจสอบว่าเกมเสมอหรือไม่
    let isDraw = true;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (board[i][j] === null) {
          isDraw = false;
          break;
        }
      }
    }
    if (isDraw) return 'draw';

    return null;
  }

  // คำนวณคะแนนของตำแหน่ง
  evaluatePosition(board) {
    let score = 0;
    const center = Math.floor(this.boardSize / 2);

    // ให้คะแนนตำแหน่งตรงกลางสูงสุด
    if (board[center][center] === 'O') score += 3;
    else if (board[center][center] === 'X') score -= 3;

    // ตรวจสอบแนวตั้งและแนวนอน
    for (let i = 0; i < this.boardSize; i++) {
      let rowCount = 0;
      let colCount = 0;
      for (let j = 0; j < this.boardSize; j++) {
        if (board[i][j] === 'O') rowCount++;
        if (board[i][j] === 'X') rowCount--;
        if (board[j][i] === 'O') colCount++;
        if (board[j][i] === 'X') colCount--;
      }
      score += rowCount + colCount;
    }

    return score;
  }

  // Minimax algorithm
  minimax(board, depth, isMaximizing) {
    const winner = this.checkWinner(board);
    if (winner === 'O') return 100 - depth;
    if (winner === 'X') return depth - 100;
    if (winner === 'draw') return 0;
    if (depth >= this.maxDepth) return this.evaluatePosition(board);

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          if (board[i][j] === null) {
            board[i][j] = 'O';
            const score = this.minimax(board, depth + 1, false);
            board[i][j] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          if (board[i][j] === null) {
            board[i][j] = 'X';
            const score = this.minimax(board, depth + 1, true);
            board[i][j] = null;
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }

  // หาตำแหน่งที่ดีที่สุดสำหรับการเดิน
  findBestMove(board) {
    let bestScore = -Infinity;
    let bestMove = { row: -1, col: -1 };

    // ตรวจสอบว่าตารางถูกต้อง
    if (!board || board.length !== this.boardSize) {
      console.error('Invalid board size');
      return { row: 0, col: 0 };
    }

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (board[i][j] === null) {
          board[i][j] = 'O';
          const score = this.minimax(board, 0, false);
          board[i][j] = null;
          if (score > bestScore) {
            bestScore = score;
            bestMove = { row: i, col: j };
          }
        }
      }
    }

    return bestMove;
  }
} 