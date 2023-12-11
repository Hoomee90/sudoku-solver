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

function showSteps(e) {
  const solver = e.target.solver;
  const [x, y, num] = solver.steps[solver.currentStep];
  setTimeout(() => {
    let cell = document.querySelector(`.s-row-${y} > .s-col-${x}`);

    if (cell) {
      cell.value = num;
    }

    solver.updateStepPos();
    document.querySelector("div.progress-bar").style.width = `${solver.currentStep / solver.steps.length * 100}%`;

    if(solver.currentStep < solver.steps.length) {
      showSteps(e);
    }
  }, 10 / Math.log10(solver.steps.length));
}


function initializeBoard() {
  let sudokuGenerator = new SudokuGenerator();
  sudokuGenerator.generateBoard();
  
  let sudokuSolver = new SudokuSolver(structuredClone(sudokuGenerator.newBoard));

  buildBoard(sudokuGenerator.newBoard);
  sudokuSolver.solveBoard();
  
  const solveButton = document.querySelector("button#solve");
  solveButton.solver = sudokuSolver;
  solveButton.addEventListener("click", showSteps);
}

document.querySelector("button#build").addEventListener("click", initializeBoard);
