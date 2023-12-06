import SudokuSolver from "../src/js/sudokuSolver";
import seeds from '../src/js/sudokuSeeds.json'

describe (`sudokuSolver`, () => {
  let sudoku;
  
  beforeEach(() => {
    sudoku = new SudokuSolver(seeds["easy"][0]);
  });
  
  test(`should correctly create a sudoku object`, () => {
    expect(typeof sudoku).toEqual(`object`);
  });

  test(`should have a 9x9 2D array property`, () => {
    expect(sudoku.board.every((row, index) => row.every((el, index) => index <= 9) && index <= 9)).toBeTruthy();
  });
});

describe (`safelyPlaced`, () => {
  let sudoku;
  
  beforeEach(() => {
    sudoku = new SudokuSolver(seeds["bad"][0]);
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