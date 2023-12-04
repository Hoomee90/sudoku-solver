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

  buildPosAndRem(board = this.board) {
    for (let i = 0; i < 9; i++) {
      if (board[i][j] > 0) {
        if (!this.pos.hasOwnProperty(board[i][j])) {
          this.pos[board[i][j]] = [];
        }
        this.pos[board[i][j].push([i, j])]
        if (!this.rem.hasOwnProperty(board[i][j])) {
          this.rem[board[i][j]] = 9;
        }
        this.rem[board[i][j]] -= 9;
      }
    }

    // Fill elements not present in pos and rem
      for (let i = 1; i < 10; i++) {
        if (!this.pos.hasOwnProperty(i)) {
          this.pos[i] = [];
      }
      if (!this.rem.hasOwnProperty(i)) {
          this.rem[i] = 9;
      }
    }
  }

  buildGraph() {
    for (let [k, v] of Object.entries(this.pos)) {
      if(!this.graph.hasOwnProperty(k)) {
        graph[k] = {};
      }

      let row = [...Array(9).keys()]
      let col = [...Array(9).keys()]

      for (let cord of v) {
        row.splice(row.indexOf(cord[0]), 1);
        col.splice(row.indexOf(cord[1]), 1);
      }

      if (row.length === 0 || col.length === 0) {
        continue;
      }

      for (let r of row) {
        for (let c of col) {
          if (this.board[r] === 0) {
            if (!this.graph[k].hasOwnProperty(r)) {
              this.board[k][r] = [];
            }
            graph[k][r].push(c);
          }
        }
      }
    }
  }
}