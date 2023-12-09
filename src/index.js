import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/styles.css"
import SudokuGenerator from "../src/js/sudokuGenerator";
import SudokuSolver from "../src/js/sudokuSolver";
import seeds from "../src/js/sudokuSeeds.json";

let sudokuGenerator = new SudokuGenerator();
let sudokuSolver = new SudokuSolver(sudokuGenerator.newBoard);

function buildBoard(board) {
  for (let r = 0; r < 9; r++) {
    const row = document.querySelector(`.s-row-${r}`);
    for (let c = 0; c < 9; c++) {
      row.children[c].value = board[r][c];
    }
  }
}

buildBoard(seeds["easy"][0]);
