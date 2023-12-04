export default class SudokuSolver {
  constructor(initialBoard = null) {
    this.board = initialBoard || Array.from(Array(9), () => Array(9).fill(0));
    this.pos = {};
    this.rem = {};
    this.graph = {};
  }

  rowSafe(cellCords, num) {
    let [x, y] = cellCords;
    return !this.board[y].some(cell => cell === num);
  }

  colSafe(cellCords, num) {
    let [x, y] = cellCords;
    return !this.board.some(row => row[y] === num);
  }

  boxSafe(cellCords, num) {
    let [x, y] = cellCords;
    let boxStartRow = y - (y % 3);
    let boxStartCol = x - (x % 3);

    for (const boxRow of [0, 1, 2]) {
      for (const boxCol of [0, 1, 2]) {
        if (this.board[boxStartRow + boxRow][boxStartCol + boxCol] === num) {
          return false;
        }
      }
    }
    return true;
  }

  safeToPlace(cellCords, num) {
  return this.rowSafe(cellCords, num) && this.colSafe(cellCords, num) && this.boxSafe(cellCords, num);
  }

  buildPosAndRem() {
    for (let i = 0; i < 9; i++) {
      if (board[i][j] > 0) {
        if (!this.pos.hasOwnProperty(board[i][j])) {
          pos[board[i][j]] = [];
        }
        pos[board[i][j].push([i, j])]
        if (!this.rem.hasOwnProperty(board[i][j])) {
          rem[board[i][j]] = 9;
        }
        rem[board[i][j]] -= 9;
      }
    }

    // Fill elements not present in pos and rem
      for (let i = 1; i < 10; i++) {
        if (!pos.hasOwnProperty(i)) {
          pos[i] = [];
      }
      if (!rem.hasOwnProperty(i)) {
          rem[i] = 9;
      }
    }
  }
}