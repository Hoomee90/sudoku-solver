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

describe (`safelyPlaced`, () => {
  let sudoku;
  
  beforeEach(() => {
    sudoku = new SudokuSolver(seeds["test"][0]);
  });

  test(`rowSafe`, () => {
    sudoku.board[8][8] = 2;
    expect(sudoku.rowSafe(0, 0, 1)).toBeTruthy();
    expect(sudoku.rowSafe(8, 0, 6)).toBeFalsy();
  });

  test(`colSafe`, () => {
    expect(sudoku.colSafe(3, 3, 8)).toBeFalsy();
    expect(sudoku.colSafe(3, 1, 6)).toBeTruthy();
  });

  test(`boxSafe`, () => {
    expect(sudoku.boxSafe(0, 0, 1)).toBeFalsy();
    expect(sudoku.boxSafe(8, 8, 2)).toBeTruthy();
  });

  test(`safelyPlaced`, () => {
    expect(sudoku.safelyPlaced(3, 0, 8)).toBeFalsy();
    expect(sudoku.safelyPlaced(4, 4, 2)).toBeTruthy();
  });
});

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