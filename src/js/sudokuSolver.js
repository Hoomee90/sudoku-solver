export default class SudokuSolver {
  constructor(initialBoard) {
    //Array.from(Array(9), () => Array(9).fill(0))
    this.board = initialBoard;
    this.pos = {};
    this.rem = new Map();
    this.graph = {};
  }

  graphKeys(index) {
    return Object.keys(this.graph[[...this.rem.keys()][index]]).map(el => parseInt(el));
  }

  rowSafe(cellCords, num) {
    let [x, y] = cellCords;
    return !this.board[y].some(cell => cell === num);
  }

  colSafe(cellCords, num) {
    let [x, y] = cellCords;
    return !this.board.some(row => row[x] === num);
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

  safeToPlace(x, y) {
  const key = this.board[y][x];
    if (!this.rowSafe([x, y], key) || !this.colSafe([x, y], key)) {
      return false;
    }

    if (this.boxSafe([x, y], key)) {
      return false;
    }
    return true;
  }

  fillBoard(k, keys, r, rows) {
    for (let c of this.graph[keys[k]][rows[r]]) {
      if (this.board[rows[r]][c] > 0) {
        continue;
      }
      this.board[rows[r]][c] = keys[k];
      if (this.safeToPlace(c, rows[r])) {
        if (r < rows.length - 1) {
          if (this.fillBoard(k, keys, r + 1, rows)) {
            return true;
          } else {
            this.board[rows[r]][c] = 0;
            continue;
          }
        } else {
          if (k < keys.length - 1) {
            if (this.fillBoard(k + 1, keys, 0, this.graphKeys(k + 1))) {
              return true;
            } else {
              this.board[rows[r]][c] = 0;
              continue;
            }
          }
          return true;
        }
      }
      this.board[rows[r]][c] = 0;
    }
    return false;
  }

  buildPosAndRem() {
    let remObj = {}
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] > 0) {
          if (!this.pos.hasOwnProperty(this.board[i][j])) {
            this.pos[this.board[i][j]] = [];
          }
          this.pos[this.board[i][j]].push([i, j]);
          if (!remObj.hasOwnProperty(this.board[i][j])) {
            remObj[this.board[i][j]] = 9;
          }
          remObj[this.board[i][j]] -= 9;
        }
      }
    }

    // Fill elements not present in pos and rem
      for (let i = 1; i < 10; i++) {
        if (!this.pos.hasOwnProperty(i)) {
          this.pos[i] = [];
      }
      if (!remObj.hasOwnProperty(i)) {
        remObj[i] = 9;
      }
    }

    let remEntries = Object.entries(remObj);
    remEntries = remEntries.sort((a, b) => a[1] - b[1]);
    for (const [k, v] of remEntries) {
      this.rem.set(parseInt(k), v);
    }
  }

  buildGraph() {
    for (let [k, v] of Object.entries(this.pos)) {
      if(!this.graph.hasOwnProperty(k)) {
        this.graph[k] = {};
      }

      let row = [...Array(9).keys()]
      let col = [...Array(9).keys()]

      for (const cord of v) {
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
    this.buildGraph();

    console.log(this);

    const remKeys = [...this.rem.keys()];

    this.fillBoard(0, remKeys, 0, this.graphKeys(0));
  }
}