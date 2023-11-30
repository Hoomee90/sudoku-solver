export default class SudokuGame {
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
}