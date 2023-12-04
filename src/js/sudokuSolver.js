export default class SudokuSolver {
  constructor(initialBoard) {
    //Array.from(Array(9), () => Array(9).fill(0))
    this.board = initialBoard;
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

  fillBoard(k, keys, r, rows) {
    for (let c of this.graph[keys[k]][rows[r]]) {
      if (this.board[rows[r]] > 0) {
        continue;
      }
      this.board[rows[r]] = keys[k]
      if (this.safeToPlace(rows[r], c)) {
        if (r < rows.length - 1) {
          if (this.fillBoard(k, keys, r + 1, rows)) {
            return
          } else {
            this.board[rows[r]] = 0;
            continue;
          }
        } else {
          if (k < keys.length - 1) {
            if (this.fillBoard(k + 1, keys, 0, Array.from(this.graph[keys[k + 1]].keys()))) {
              return true;
            } else {
              this.board[rows[r]] = 0;
              continue;
            }
          }
          return true;
        }
      }
      this.board[rows[r]] = 0;
    }
    return false;
  }

  buildPosAndRem(board = this.board) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] > 0) {
          if (!this.pos.hasOwnProperty(board[i][j])) {
            this.pos[board[i][j]] = [];
          }
          this.pos[board[i][j]].push([i, j]);
          if (!this.rem.hasOwnProperty(board[i][j])) {
            this.rem[board[i][j]] = 9;
          }
          this.rem[board[i][j]] -= 9;
        }
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
        this.graph[k] = {};
      }

      let row = [...Array(9).keys()]
      let col = [...Array(9).keys()]

      for (let cord of v) {
        row.splice(row.indexOf(cord[0]), 1);
        col.splice(col.indexOf(cord[1]), 1);
      }

      if (row.length === 0 || col.length === 0) {
        continue;
      }

      for (let r of row) {
        for (let c of col) {
          if (this.board[r][c] === 0) {
            if (!this.graph[k].hasOwnProperty(r)) {
              this.graph[k][r] = [];
            }
            this.graph[k][r].push(c);
          }
        }
      }
    }
  }

  solveBoard() {
    this.buildPosAndRem();
    this.rem = Object.fromEntries(Object.entries(this.rem).sort((a, b) => a[1] - b [1]));
    this.buildGraph()

    const remKeys = Object.keys(this.rem)
    this.fillBoard(0, remKeys, 0, Object.keys(this.graph[remKeys[0]]));
  }
}