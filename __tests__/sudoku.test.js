import Sudoku from "../src/js/sudoku";

describe (`sudoku`, () => {
  test(`should correctly create a sudoku object`, () => {
    const sudoku = new Sudoku();
    expect(typeof sudoku).toBe(`object`);
  })
});