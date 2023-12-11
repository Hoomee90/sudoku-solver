export default class SudokuSolver {
  constructor(initialBoard) {
    this.board = initialBoard; //2D array
    this.pos = {}; //board as represented cell value keys and each coordinate array as a values
    this.rem = new Map(); // map of which keys are the order the values should be checked
    // graph = {
    //  cell value: {
    //    row1: [columns],
    //    row2: [columns],
    ///   ...
    //    }
    // }
    this.graph = {};
    this.steps = [];
  }

  addStep(x, y, value) {
    this.steps.push([x, y, value]);
  }

  graphKeys(index) {
    return Object.keys(this.graph[[...this.rem.keys()][index]]).map(el => parseInt(el));
  }

  initializeSafetyCache() {
    this.rowCache = Array.from(Array(9), () => new Set(Array.from(Array(9), (_, i) => i + 1)));
    this.colCache = Array.from(Array(9), () => new Set(Array.from(Array(9), (_, i) => i + 1)));
    this.boxCache = Array.from(Array(9), () => new Set(Array.from(Array(9), (_, i) => i + 1)));

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.board[r][c] !== 0) {
          this.updateSafetyCache(c, r, this.board[r][c]);
        }
      }
    }
  }

  updateSafetyCache(x, y, num, add) {
    const boxIndex = Math.floor(y / 3) * 3 + Math.floor(x / 3);

    if (add) {
      this.rowCache[y].add(num);
      this.colCache[x].add(num);
      this.boxCache[boxIndex].add(num);
    } else {
      this.rowCache[y].delete(num);
      this.colCache[x].delete(num);
      this.boxCache[boxIndex].delete(num);
    }
  }

  safelyPlaced(x, y, num) {
  const boxIndex = Math.floor(y / 3) * 3 + Math.floor(x / 3);
  
  return this.rowCache[y].has(num) && this.colCache[x].has(num) && this.boxCache[boxIndex].has(num);
  }

  fillBoard(k, keys, r, rows) {
    for (let c of this.graph[keys[k]][rows[r]]) {
      if (this.board[rows[r]][c] > 0) {
        continue;
      }

      if (this.safelyPlaced(c, rows[r], keys[k])) {
        this.board[rows[r]][c] = keys[k];
        this.addStep(c, rows[r], keys[k]);
        this.updateSafetyCache(c, rows[r], keys[k], false);

        if (r < rows.length - 1) {
          if (this.fillBoard(k, keys, r + 1, rows)) {
            return true;
          }
        } else {
          if (k < keys.length - 1) {
            if (this.fillBoard(k + 1, keys, 0, this.graphKeys(k + 1))) {
              return true;
            }
          } else {
            return true;
          }
        }
        this.board[rows[r]][c] = 0;
        this.addStep(c, rows[r], null);
        this.updateSafetyCache(c, rows[r], keys[k], true);
      }
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
          remObj[this.board[i][j]] -= 1;
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

      let row = [...Array(9).keys()];
      let col = [...Array(9).keys()];

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
    this.initializeSafetyCache();
    this.buildPosAndRem();
    this.buildGraph();

    const remKeys = [...this.rem.keys()];

    this.fillBoard(0, remKeys, 0, this.graphKeys(0));
  }
}