export default class SudokuSolver {
  constructor(initialBoard) {
    this.board = initialBoard; //2D array
    this.pos = {}; // board as represented cell value keys and each coordinate array as a values, for building graph
    this.rem = new Map(); // map of which keys are the order the values should be checked
    this.graph = {};
    // graph property looks like:
    // graph = {
    //  cell value: {
    //    row1: [columns],
    //    row2: [columns],
    // /   ...
    //    }
    // }
    this.steps = []; // every step take in process of solving as [x, y, num || null]
    this.currentStep = 0;
  }

  updateStepPos() {
    this.currentStep++;
  }

  addStep(x, y, value) {
    // add a step taken to the steps property
    this.steps.push([x, y, value]);
  }

  graphKeys(cellValueNum) {
    // return a list of y values the graph has for the give cell value of any entry of this.rem
    return Object.keys(this.graph[[...this.rem.keys()][cellValueNum]]).map(el => parseInt(el));
  }

  initializeSafetyCache() {
    // create three arrays, each with nine elements, each a set of all cell values safe to place in a given row/col/box
    this.rowCache = Array.from(Array(9), () => new Set(Array.from(Array(9), (_, i) => i + 1)));
    this.colCache = Array.from(Array(9), () => new Set(Array.from(Array(9), (_, i) => i + 1)));
    this.boxCache = Array.from(Array(9), () => new Set(Array.from(Array(9), (_, i) => i + 1)));

    // remove all cells from the safety cache that are unsafe due to initial board
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.board[r][c] !== 0) {
          this.updateSafetyCache(c, r, this.board[r][c]);
        }
      }
    }
  }

  updateSafetyCache(x, y, num, add) {
    // either remove cells from the caches if they've been placed, or add them back if they've been removed
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
  // the caches contain only valid nums for the given index (rows[y] is all valid cell values to place in board[y] etc...)
  const boxIndex = Math.floor(y / 3) * 3 + Math.floor(x / 3);
  
  return this.rowCache[y].has(num) && this.colCache[x].has(num) && this.boxCache[boxIndex].has(num);
  }

  fillBoard(k, keys, r, rows) {
    for (const c of this.graph[keys[k]][rows[r]]) {
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
    
    // set up pos and rem to resemble their respective data structures, then:
    // add each cell's coords to pos
    // shrink rem values for each given appearance of the analogous cell value
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

    // fill elements not present in pos and rem
      for (let i = 1; i < 10; i++) {
        if (!this.pos.hasOwnProperty(i)) {
          this.pos[i] = [];
      }
      if (!remObj.hasOwnProperty(i)) {
        remObj[i] = 9;
      }
    }

    // turn rem object into sortable array, then build map with most common cell values appearing as first keys
    let remEntries = Object.entries(remObj);
    remEntries = remEntries.sort((a, b) => a[1] - b[1]);
    for (const [k, v] of remEntries) {
      this.rem.set(parseInt(k), v);
    }
  }

  buildGraph() {
    // build graph with the same keys-as-cell-values as this.pos
    for (const [cellValue, coords] of Object.entries(this.pos)) {
      if(!this.graph.hasOwnProperty(cellValue)) {
        this.graph[cellValue] = {};
      }

      let validRows = [...Array(9).keys()];
      let validCols = [...Array(9).keys()];

      // cut out all rows and cols to be added that already have the cellValue with coords there. This is to account for the preexisting cells on the board
      for (const coord of coords) {
        validRows.splice(validRows.indexOf(coord[0]), 1);
        validCols.splice(validCols.indexOf(coord[1]), 1);
      }

      if (validRows.length === 0 || validCols.length === 0) {
        continue;
      }

      // add to graph the valid rows and cols for a value
      for (const r of validRows) {
        for (const c of validCols) {
          if (this.board[r][c] === 0) {
            if (!this.graph[cellValue].hasOwnProperty(r)) {
              this.graph[cellValue][r] = [];
            }
            this.graph[cellValue][r].push(c);
          }
        }
      }
    }
  }

  solveBoard() {
    // call all required methods to solve board
    this.initializeSafetyCache();
    this.buildPosAndRem();
    this.buildGraph();

    const remKeys = [...this.rem.keys()];

    this.fillBoard(0, remKeys, 0, this.graphKeys(0));
  }
}