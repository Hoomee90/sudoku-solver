export default class SudokuSolver {
  constructor(initialBoard = null) {
    this.board = initialBoard || Array.from({ length: 9 }, () => Array(9).fill(0));
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
}