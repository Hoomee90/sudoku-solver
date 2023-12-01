// Code used to scrape board seeds from websudoku.com
/* function sudokuScraper() {
  let rows = Array.from(document.querySelectorAll("table#puzzle_grid > tbody > *"));
  let board = rows.map(rowEl => Array.from(rowEl.children).map((cellEl => cellEl.firstElementChild.value)))
  board = board.map(rowArr => rowArr.map(cell => cell ? parseInt(cell) : 0));
  return board
} */

import seeds from './sudokuSeeds.json'

export default class sudokuGenerator {
  constructor(initialSeed, difficulty) {
    this.seed = initialSeed || seeds[difficulty ? difficulty : ["easy", "medium", "hard", "vHard"].sort(() => Math.random() - 0.5).slice(0, 1)][Math.floor(Math.random() * 2)];
  }

  rotateMatrix() {
    let tempMatrix = Array.from(Array(9), () => Array(9));

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let el = this.seed[i][j];
        let index = 9 - (i + 1)

        tempMatrix[j][index] = el;
      }
    }
    return tempMatrix;
  }
}
