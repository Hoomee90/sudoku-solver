import SudokuGenerator from "../src/js/sudokuGenerator";
import seeds from '../src/js/sudokuSeeds.json'

describe (`sudokuGenerator`, () => {
  let sudoku;
  
  beforeEach(() => {
    sudoku = new SudokuGenerator();
  });

  test(`should have an 9x9 2D array board seed property`, () => {
    expect(sudoku.seed.every((row, index) => row.every((el, index) => index <= 9) && index <= 9)).toBeTruthy();
  });
});

describe (`generateArray`, () => { 
  let sudoku;
  
  beforeEach(() => {
    sudoku = new SudokuGenerator(seeds["easy"][0]);
  });

  test(`rotateMatrix should rotate board 90°`, () => {
    // expect(sudoku.rotateMatrix().every((row, index) => row.every((el, index) => index <= 9) && index <= 9)).toBeTruthy();
    expect(sudoku.rotateMatrix()).toEqual([[0, 0, 0, 2, 0, 0, 0, 8, 1],
      [0, 0, 6, 7, 5, 0, 0, 0, 0],
      [0, 7, 0, 8, 9, 0, 0, 5, 6],
      [0, 0, 2, 5, 0, 0, 0, 6, 8],
      [9, 0, 0, 6, 2, 4, 0, 0, 7],
      [1, 6, 0, 0, 0, 8, 4, 0, 0],
      [6, 3, 0, 0, 8, 5, 0, 9, 0],
      [0, 0, 0, 0, 6, 2, 8, 0, 0],
      [2, 9, 0, 0, 0, 7, 0, 0, 0]]);
  });

  test(`mapMatrix should map each number to another random number°`, () => {
    // expect(sudoku.rotateMatrix().every((row, index) => row.every((el, index) => index <= 9) && index <= 9)).toBeTruthy();
    const mappedMatrix = sudoku.mapMatrix();
    expect(mappedMatrix[0][0]).toEqual(mappedMatrix[8][5]);
    expect(mappedMatrix[0][0]).not.toEqual(mappedMatrix[0][3]);
  });
});

describe (`shuffleRows`, () => {
  let sudoku
  let matrix
  let shuffledMatrix

  beforeEach(() => {
    sudoku = new SudokuGenerator(seeds["easy"][0]);
    matrix = sudoku.seed;
    shuffledMatrix = sudoku.shuffleRows();
  });
  
  test('should correctly shuffle every set of three arrays within the matrix', () => {
    expect(shuffledMatrix.slice(0, 3)).not.toEqual(matrix.slice(0, 3));
    expect(shuffledMatrix.slice(3, 6)).not.toEqual(matrix.slice(3, 6));
    expect(shuffledMatrix.slice(6)).not.toEqual(matrix.slice(6));

  });

  test('elements should be the same before and after shuffle', () => {
    expect(shuffledMatrix.slice(0, 3).sort()).toEqual(matrix.slice(0, 3).sort());
    expect(shuffledMatrix.slice(3, 6).sort()).toEqual(matrix.slice(3, 6).sort());
    expect(shuffledMatrix.slice(6).sort()).toEqual(matrix.slice(6).sort());
  });
});