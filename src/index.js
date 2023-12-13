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

function handleBoardInput() {
  let newSudokuSolver = new SudokuSolver(null);
  newSudokuSolver.initializeSafetyCache()
  const board = document.querySelector(`#board`);
  document.querySelector("div.progress-bar").style.width = `0%`;
  
  const solveButton = document.querySelector("button#solve");
  solveButton.solver = newSudokuSolver;
  solveButton.setAttribute(`disabled`, ``);
  
  buildBoard();

  const rows = board.querySelectorAll(`#board > *`)

  for (let i = 0; i < 9; i++) {
    const cols = rows[i].children
    for (let j = 0; j < 9; j++) {
      cols[j].previousValue = [j, i, 0];
      cols[j].addEventListener(`change`, parseChange);
    }
  }
}

function parseChange(e) {
  let sudokuSolver = document.querySelector("button#solve").solver;
  const inputX = parseInt(e.target.classList.item(0).charAt(6));
  const inputY = parseInt(e.target.parentElement.classList.item(0).charAt(6));
  const newValue = (parseInt(e.target.value) && parseInt(e.target.value) <= 9) ? parseInt(e.target.value) : 0;

  if (e.target.previousValue[0] === inputX && e.target.previousValue[1] === inputY && e.target.previousValue[2]) {
    sudokuSolver.updateSafetyCache(inputX, inputY, e.target.previousValue[2], true);
  }

  if (newValue) {
    sudokuSolver.updateSafetyCache(inputX, inputY, newValue);
  }

  e.target.previousValue = [inputX, inputY, newValue];
  console.log(sudokuSolver);
}

function checkBoard(board) {
  let sudokuSolver = document.querySelector("button#solve").solver;
  sudokuSolver.newBoard(board);
  sudokuSolver.initializeSafetyCache();
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
