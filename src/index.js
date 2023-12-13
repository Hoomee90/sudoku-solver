import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/styles.css"
import SudokuGenerator from "../src/js/sudokuGenerator";
import SudokuSolver from "../src/js/sudokuSolver";

function buildBoard(board) {
  for (let r = 0; r < 9; r++) {
    const row = document.querySelector(`.s-row-${r}`);
    for (let c = 0; c < 9; c++) {
      row.children[c].value = null;
      row.children[c].classList.remove("bg-light");
      row.children[c].removeAttribute("disabled");
      if (board) {
        if (board[r][c]) {
          row.children[c].value = board[r][c];
          row.children[c].classList.add("bg-light");
          row.children[c].setAttribute("disabled", "");
        }
      }
    }
  }
}

function showSteps(e) {
  const solver = e.target.solver;
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
    document.querySelector("button#inputBoard").removeEventListener("click", handleBoardInput);
    e.target.removeEventListener("click", showSteps);
  }

  if(solver.currentStep < solver.steps.length) {
  setTimeout(() => {
    step(Math.ceil(solver.steps.length / 1000));
    showSteps(e);
  }, 0.02 * 1000);
  } else {
    document.querySelector("button#build").addEventListener("click", initializeBoard);
    document.querySelector("button#inputBoard").addEventListener("click", handleBoardInput);
  }
}

function handleBoardInput(e) {
  let newSudokuSolver = new SudokuSolver(null);
  const board = document.querySelector(`#board`);
  document.querySelector("div.progress-bar").style.width = `0%`;
  
  const solveButton = document.querySelector("button#solve");
  solveButton.solver = newSudokuSolver;
  solveButton.setAttribute(`disabled`, ``);
  
  buildBoard();

  for (let child of board.querySelectorAll(`#board > *`)) {
    child.addEventListener(`change`, parseBoard);
  }
}

function parseBoard() {
  let board = []
  for (let r = 0; r < 9; r++) {
    const row = document.querySelector(`.s-row-${r}`);
    board.push([])
    for (let c = 0; c < 9; c++) {
      const cellValue = parseInt(row.querySelector(`.s-col-${c}`).value)
      if (cellValue && cellValue <= 9) {
        board[r].push(cellValue);
      } else {
        board[r].push(0);
      }
    }
  }
  return board;
}

function initializeBoard() {
  let sudokuGenerator = new SudokuGenerator();
  sudokuGenerator.generateBoard();
  buildBoard(sudokuGenerator.newBoard);
  
  let sudokuSolver = new SudokuSolver(structuredClone(sudokuGenerator.newBoard));
  sudokuSolver.solveBoard();
  
  document.querySelector("div.progress-bar").style.width = `0%`;
  const solveButton = document.querySelector("button#solve");
  solveButton.removeAttribute(`disabled`);
  solveButton.solver = sudokuSolver;
  solveButton.addEventListener("click", showSteps);
}

initializeBoard();
document.querySelector("button#build").addEventListener("click", initializeBoard);
document.querySelector("button#inputBoard").addEventListener("click", handleBoardInput);
