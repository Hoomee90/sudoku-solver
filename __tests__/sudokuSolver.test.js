import SudokuSolver from "../src/js/sudokuSolver";
import seeds from '../src/js/sudokuSeeds.json'

let sudoku;
let strangeSudoku;
  
beforeEach(() => {
  sudoku = new SudokuSolver(seeds["easy"][0]);
  strangeSudoku = new SudokuSolver(seeds["test"][1]);
  strangeSudoku.buildPosAndRem();
  strangeSudoku.buildGraph();
  sudoku.buildPosAndRem();
  sudoku.buildGraph();
});

describe (`sudokuSolver`, () => {
  
  test(`should correctly create a sudoku object`, () => {
    expect(typeof sudoku).toEqual(`object`);
  });

  test(`should have a 9x9 2D array property`, () => {
    expect(sudoku.board.every((row, index) => row.every((el, index) => index = 9 && index < 9))).toBeTruthy();
  });
});

// describe (`safelyPlaced`, () => {
//   let sudoku;
  
//   beforeEach(() => {
//     sudoku = new SudokuSolver(seeds["test"][0]);
//   });
// });

describe(`buildPosAndRem`, () => {

  const checkPos = (newBoard, solver) => {
    for (const key of Object.keys(solver.pos)) {
      solver.pos[key].forEach((el) => newBoard[el[0]][el[1]] = parseInt(key));
    }
  }

  const checkRem = (solver) => {
    return [...solver.rem.keys()].sort((a, b) => solver.board.filter(row => row.includes(a)) - solver.board.filter(row => row.includes(b)));
  }

  test(`should modify pos and rem values`, () => {
    expect(sudoku.pos).not.toEqual({});
    expect(sudoku.rem).not.toEqual(new Map());
  });

  test(`should make pos represent every element on the board`, () => {
    let newBoard = Array.from(Array(9), () => Array(9).fill(0));
    
    checkPos(newBoard, sudoku);
    expect(sudoku.board).toEqual(newBoard);
  });

  test(`pos should work even on boards with no instances of a number`, () => {
    let newBoard = Array.from(Array(9), () => Array(9).fill(0));
    
    checkPos(newBoard, strangeSudoku);
    expect(strangeSudoku.board).toEqual(newBoard);
  });

  test(`should make rem a map whose keys are the order of most to least common preexisting cell values`, () => {
    expect([...sudoku.rem.keys()]).toEqual(checkRem(sudoku));
  });

  test(`rem should work even on boards with no instances of a number present`, () => {
    
    expect([...strangeSudoku.rem.keys()]).toEqual(checkRem(strangeSudoku));
  });
});

describe(`buildGraph`, () => {

  const checkGraph = (board) => {
    return Object.keys(board.graph).every(key => Object.keys(board.graph[key]).every(row => board.graph[key][row].every(col => col < 9) && parseInt(row) < 9));
  }

  test(`should make the graph contain values keyed to each possible number`, () => {
    expect(Object.keys(sudoku.graph)).toEqual([...Array(9).keys()].map(el => (el + 1).toString()));
  });

  test(`should fill graph's values to contain both keys and arrays whose values are valid columns and rows`, () => { 
    expect(checkGraph(sudoku)).toBeTruthy();
  });

  test(`should fill graph's values correctly even when there are no instances of a number present`, () => { 
    expect(checkGraph(strangeSudoku)).toBeTruthy();
  });
});

describe(`solveBoard`, () => {

  const validRow = (board) => {
    for (let i = 0; i < 9; i++) {
      let rowSet = new Set();

      for (let j = 0; j < 9; j++) {
        if (board[i][j] > 0) {
          if (rowSet.has(board[i][j])) {
            return false;
          }
          rowSet.add(board[i][j]);
        }
      }
    }
    return true;
  }

  const validCol = (board) => {
    for (let i = 0; i < 9; i++) {
      let colSet = new Set();

      for (let j = 0; j < 9; j++) {
        if (board[i][j] > 0) {
          if (colSet.has(board[j][i])) {
            return false;
          }
          colSet.add(board[j][i]);
        }
      }
    }
    return true;
  }

  const validBox = (board) => {
    for (let row = 0; row < board.length; row += 3) {
      for (let col = 0; col < board.length; col += 3) {
        let boxSet = new Set();

        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const val = board[row + r][col + c];
            if (val > 0) {
              if (boxSet.has(val)) {
                return false;
              }
              boxSet.add(val);
            }
          }
        }
      }
    }
  }

  for (const difficultyKey of Object.keys(seeds)) {
    if (difficultyKey === "test") {
      continue;
    }
    for (let boardNum in seeds[difficultyKey]) {
      let newSudoku;
      let deepSeed
      
      beforeEach(() => {
        deepSeed = structuredClone(seeds[difficultyKey][boardNum]);
        newSudoku = new SudokuSolver(seeds[difficultyKey][boardNum]);
      });

      test(`should have a property of board ${boardNum} in difficulty ${difficultyKey}`, () => { 
        expect(newSudoku.board).toEqual(deepSeed);
      });

      test(`should give a solved difficulty board ${boardNum} in difficulty ${difficultyKey}`, () => {
        newSudoku.solveBoard();
        expect(newSudoku.board).not.toEqual(deepSeed);
      });
    }
  }
});