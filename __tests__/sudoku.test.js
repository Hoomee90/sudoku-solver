import SudokuGame from "../src/js/sudoku";

describe (`sudoku`, () => {
  let sudoku;
  
  beforeEach(() => {
    sudoku = new SudokuGame();
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
    sudoku = new SudokuGame();
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
});