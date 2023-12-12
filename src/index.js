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
      row.children[c].value = null;
      if (board[r][c]) {
        row.children[c].value = board[r][c];
      }
    }
  }
}

function showSteps(e) {
  const solver = e.target.solver;
  console.log(solver.steps.length);
  const step = (steps) => {
    for(let i = 0; i <= steps; i++) {
      const [x, y, num] = solver.steps[solver.currentStep];
      let cell = document.querySelector(`.s-row-${y} > .s-col-${x}`);

      if (cell) {
        cell.value = num;
      }

      solver.updateStepPos();
      document.querySelector("div.progress-bar").style.width = `${solver.currentStep / solver.steps.length * 100}%`;

      if(solver.currentStep >= solver.steps.length) {
        break;
      }
    }
  }

  if (solver.currentStep === 0) {
    document.querySelector("button#build").removeEventListener("click", initializeBoard);
    e.target.removeEventListener("click", showSteps)
  }

  if(solver.currentStep < solver.steps.length) {
  setTimeout(() => {
    step(Math.ceil(solver.steps.length / 1000));
    showSteps(e);
  }, 0.02 * 1000);
  } else {
    document.querySelector("button#build").addEventListener("click", initializeBoard);
  }
}

function initializeBoard() {
  let sudokuGenerator = new SudokuGenerator();
  sudokuGenerator.generateBoard();
  buildBoard(sudokuGenerator.newBoard);
  
  let sudokuSolver = new SudokuSolver(structuredClone(sudokuGenerator.newBoard));
  sudokuSolver.solveBoard();
  
  const solveButton = document.querySelector("button#solve");
  document.querySelector("div.progress-bar").style.width = `0%`;
  solveButton.solver = sudokuSolver;
  solveButton.addEventListener("click", showSteps);
}

initializeBoard();
document.querySelector("button#build").addEventListener("click", initializeBoard);
