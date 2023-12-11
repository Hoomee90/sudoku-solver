import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/styles.css"
import SudokuGenerator from "../src/js/sudokuGenerator";
import SudokuSolver from "../src/js/sudokuSolver";
import seeds from "../src/js/sudokuSeeds.json";

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

function showSteps(solver, progressBar) {
  const [x, y, num] = solver.steps[solver.currentStep];
  setTimeout(() => {
    let cell = document.querySelector(`.s-row-${y} > .s-col-${x}`);

    if (cell) {
      cell.value = num;
    }

    solver.updateStepPos();
    progressBar.style.width = `${solver.currentStep / solver.steps.length * 100}%`;

    if(solver.currentStep < solver.steps.length) {
      showSteps(solver, progressBar);
    }
  }, 0.01 * 1000);
}

function initializeBoard() {
  let sudokuGenerator = new SudokuGenerator();
  sudokuGenerator.generateBoard();
  buildBoard(sudokuGenerator.newBoard);

  let sudokuSolver = new SudokuSolver(sudokuGenerator.newBoard);
  document.querySelector("button#solve").addEventListener("click", () => {
    sudokuSolver.solveBoard();

    showSteps(sudokuSolver, document.querySelector("div.progress-bar"));
  });
}

initializeBoard();
