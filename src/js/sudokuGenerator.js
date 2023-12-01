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
    this.seed = initialSeed || seeds[difficulty ? difficulty : this.fisherYatesShuffle(["easy", "medium", "hard", "vHard"])[0]][this.fisherYatesShuffle([0, 1, 2])[0]];
  }
  
  fisherYatesShuffle(deck){
    for (var i = deck.length - 1; i > 0; i--) {
      const swapIndex = Math.floor(Math.random() * (i + 1))
      const currentCard = deck[i]
      const cardToSwap = deck[swapIndex]
      deck[i] = cardToSwap
      deck[swapIndex] = currentCard
    }
    return deck
  }

  rotateMatrix(matrix = this.seed) {
    let tempMatrix = Array.from(Array(9), () => Array(9));

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let el = matrix[i][j];
        let index = 9 - (i + 1)

        tempMatrix[j][index] = el;
      }
    }
    return tempMatrix;
  }

  mapNumbers(matrix = this.seed) {
    
  }
}
