import SudokuGenerator from "../src/js/sudokuGenerator";

describe (`sudokuGenerator`, () => {
  let sudoku;
  
  beforeEach(() => {
    sudoku = new SudokuGenerator();
  });

  test(`should have an 9x9 2D array board seed property`, () => {
    expect(sudoku.seed.every((row, index) => row.every((el, index) => index <= 9) && index <= 9)).toBeTruthy();
  });
});