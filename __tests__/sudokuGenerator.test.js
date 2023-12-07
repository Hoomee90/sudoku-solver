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

describe (`generateBoard`, () => { 
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

  test('shuffleRows should shuffle the rows in each square', () => {
    const shuffledMatrix = sudoku.shuffleRows();

    shuffledMatrix.forEach((row, index) => {
      const squareStart = index - (index % 3);
      expect(row === (shuffledMatrix[squareStart] || shuffledMatrix[squareStart + 1] || shuffledMatrix[squareStart + 2])).toBeTruthy;
    });
  });

  test('shuffleCols should shuffle the cols in each square', () => {
    const shuffledMatrixEl = sudoku.shuffleCols()[0];

    shuffledMatrixEl.forEach((el, index) => {
      const squareStart = index - (index % 3);
      expect(el === (shuffledMatrixEl[squareStart] || shuffledMatrixEl[squareStart + 1] || shuffledMatrixEl[squareStart + 2])).toBeTruthy;
    });
  });

  test(`generateBoard should do all of the above`, () => {
    const shuffledMatrix = sudoku.generateBoard()

    expect(shuffledMatrix).not.toEqual(sudoku.board);
  });
});