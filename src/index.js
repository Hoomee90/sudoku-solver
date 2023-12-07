import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import SudokuGenerator from "../src/js/sudokuGenerator";
import SudokuSolver from "../src/js/sudokuSolver";
import seeds from "../src/js/sudokuSeeds.json";

const sudokuGenerator = new SudokuGenerator(seeds["easy"][0]);
console.log(structuredClone(seeds["easy"][0]));
let sudokuSolver = new SudokuSolver(seeds["easy"][0]);

sudokuSolver.solveBoard();

console.log(sudokuSolver.board);