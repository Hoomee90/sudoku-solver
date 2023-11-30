import SudokuSolver from "../src/js/sudokuSolver";

describe (`sudoku`, () => {
  let sudoku;
  
  beforeEach(() => {
    sudoku = new SudokuSolver();
  });
  
  test(`should correctly create a sudoku object`, () => {
    expect(typeof sudoku).toEqual(`object`);
  });

  test(`should create a 9x9 2D array`, () => {
    expect(sudoku.board.every((row, index) => row.every((el, index) => index <= 9) && index <= 9)).toBeTruthy();
  });
});

describe (`safeToPlace`, () => {
  let sudoku;
  
  beforeEach(() => {
    sudoku = new SudokuSolver();
  });

  test(`rowSafe`, () => {
    expect(sudoku.rowSafe([0, 0], 0)).toBeFalsy();
    expect(sudoku.rowSafe([8, 8], 1)).toBeTruthy();
  });

  test(`colSafe`, () => {
    expect(sudoku.colSafe([3, 3], 0)).toBeFalsy();
    expect(sudoku.colSafe([6, 6], 9)).toBeTruthy();
  });

  test(`boxSafe`, () => {
    expect(sudoku.boxSafe([4, 4], 0)).toBeFalsy();
    expect(sudoku.boxSafe([7, 7], 5)).toBeTruthy();
  });

  test(`safetoPlace`, () => {
    expect(sudoku.safeToPlace([2, 2], 0)).toBeFalsy();
    expect(sudoku.safeToPlace([1, 1], 3)).toBeTruthy();
  });
});