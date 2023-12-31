import seeds from './sudokuSeeds.json'

export default class sudokuGenerator {
  constructor(initialSeed, difficulty) {
    // get seed from preset board or randomly with or without preset difficulty
    this.seed = initialSeed || seeds[difficulty || this.fisherYatesShuffle(["easy", "medium", "hard", "vHard"])[0]][this.fisherYatesShuffle([0, 1, 2])[0]];
  }
  
  fisherYatesShuffle(deck){
    for (let i = deck.length - 1; i > 0; i--) {
      const swapIndex = Math.floor(Math.random() * (i + 1));
      const currentCard = deck[i];
      const cardToSwap = deck[swapIndex];
      deck[i] = cardToSwap;
      deck[swapIndex] = currentCard;
    }
    return deck;
  }

  //rotate board 90deg clockwise
  rotateMatrix(matrix = this.seed) {
    let tempMatrix = Array.from(Array(9), () => Array(9));

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let el = matrix[i][j];
        let index = 9 - (i + 1);

        tempMatrix[j][index] = el;
      }
    }
    return tempMatrix;
  }

  // map random numbers to other number
  mapMatrix(matrix = this.seed) {
    let conversion = {}
    const shuffled = this.fisherYatesShuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    shuffled.forEach((el, i) => conversion[i + 1] = el);
    let tempMatrix = Array.from(Array(9), () => Array(9));

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        tempMatrix[i][j]  = conversion[matrix[i][j]] || 0;
      }
    }
    return tempMatrix;
  }

  // shuffle the ordering of each row of 3 x 3 boxes
  shuffleRows(matrix = this.seed) {
    return [
      this.fisherYatesShuffle(matrix.slice(0, 3)),
      this.fisherYatesShuffle(matrix.slice(3, 6)),
      this.fisherYatesShuffle(matrix.slice(6))
    ].flat();
  }

  // shuffle the ordering of each column of 3 x 3 boxes
  shuffleCols(matrix = this.seed) {
    let tempMatrix = this.shuffleRows(this.rotateMatrix(matrix));
    return this.rotateMatrix(this.rotateMatrix(this.rotateMatrix(tempMatrix)));
  }

  generateBoard(matrix = this.seed) {
    let board = matrix;
    for (let i = 0; i <= this.fisherYatesShuffle([0, 1, 2, 3])[0]; i++) {
      board = this.rotateMatrix(board);
    }
    board = this.mapMatrix(board);
    board = this.shuffleRows(this.shuffleCols(board));
    this.newBoard = board;
    
    return board;
  }
}
