import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/styles.css"
import SudokuGenerator from "../src/js/sudokuGenerator";
import SudokuSolver from "../src/js/sudokuSolver";
import seeds from "../src/js/sudokuSeeds.json";

let sudokuGenerator = new SudokuGenerator();
sudokuGenerator.generateBoard()
let sudokuSolver = new SudokuSolver(sudokuGenerator.newBoard);

function buildBoard(board) {
  for (let r = 0; r < 9; r++) {
    const row = document.querySelector(`.s-row-${r}`);
    for (let c = 0; c < 9; c++) {
      if (board[r][c]) {
        row.children[c].value = board[r][c];
      }
      
    }
  }
}

function updateBoardCell(x, y, num) {
  let cell = document.querySelector(`.s-row-${y} > .s-col-${x}`);
  console.log(cell);
  if (cell) {
    cell.value = num;
  }
}

buildBoard(sudokuGenerator.newBoard);
updateBoardCell(0, 0, "test");

document.querySelector("button#solve").addEventListener("click", () => {
  sudokuSolver.solveBoard()
  buildBoard(sudokuSolver.board);
});
