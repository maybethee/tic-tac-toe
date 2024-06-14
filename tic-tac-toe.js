function createPlayer(name, marker) {
  return {
    name,
    marker
  };
}

const Gameboard = (() => {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const placeMarker = (rowCoord, colCoord, player) => {
    // checks if chosen location is "available"
    if (board[rowCoord][colCoord].getMarker() === '-') {
      board[rowCoord][colCoord].setMarker(player.marker);
      return true;
    } else {
      return false;
    }
  }

  const printBoard = () => {
    const boardWithCellMarkers = board.map((row) => row.map((cell) => cell.getMarker()))
    console.log(boardWithCellMarkers);
  };

  return { 
    board,
    placeMarker,
    printBoard
    };  
})();

function Cell() {
  // default value is no marker
  let marker = '-';

  function getMarker() {
    return marker;
  };

  function setMarker(newMarker) {
    marker = newMarker;
  }

  return { 
    getMarker,
    setMarker
   };
};

function gameController() {
  const p1 = createPlayer('p1', 'O');
  const p2 = createPlayer('p2', 'X');
  const players = [p1, p2]

  // create empty board of cells
  // const board = Gameboard();
  const board = Gameboard;

  const currentBoard = board.board

  // prints current board so board isn't revealed(?)
  const printCurrentBoard = () => board.printBoard();

  let currentPlayer = players[0]

  const switchPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  function isMatching(cell) {
    // need to match the _marker_ of the cell using getMarker()
    return cell.getMarker() === currentPlayer.marker; 
  }

  function winCheckHorizontal(boardArray) {
    for (let i = 0; i < currentBoard.length; i++) {
      if (boardArray[i].every(isMatching)) {
        console.log('winner winner!');
        return true;
      } 
    }
    // console.log('no horizontal winner')
    return false;
  }

  function winCheckVertical() {
    function transpose(boardArray) {
      return boardArray[0].map((col, i) => boardArray.map(row => row[i]));
    }

    const transposedBoard = transpose(currentBoard);

    // no need to recreate the horizontal checks after transposing array, just pass new one in
    return winCheckHorizontal(transposedBoard);
  }

  function winCheckDiagonal() {
    const diagonalArr = [currentBoard[0][0], currentBoard[1][1], currentBoard[2][2]];
    const diagonalArr2 = [currentBoard[0][2], currentBoard[1][1], currentBoard[2][0]];

    if (diagonalArr.every(isMatching) || diagonalArr2.every(isMatching)) {
      console.log('winner winner');
      return true;
    }
    return false;
    // console.log('no diagonal winner')
  }

  function tieCheck() {
    function checkAllCoords() {
      return currentBoard.every(row => row.every(cell => cell.getMarker() !== '-'))
    }

    if (checkAllCoords()) {
      console.log('game ends in a tie')
      return;
    }
    // console.log('no tie')
  }

  function winCheck() {
    if (winCheckHorizontal(currentBoard) || winCheckVertical() || winCheckDiagonal()) {
      return true;
    }

    // must also check for ties
    tieCheck();
  }

  // calls the board method to place a marker on a player's turn
  const playTurn = (row, col) => {

    const validMove = board.placeMarker(row, col, currentPlayer)
    
    printCurrentBoard();
    
    if (winCheck()) {
      // break out of function and do gameover
      console.log('game over!')
      return;
    }
    
    // switch players only when placeMarker returns true
    validMove ? switchPlayer() : console.log("Please pick an empty square")

    console.log(`it's ${currentPlayer.name}'s turn`)
  }

  return {
    playTurn,
    printCurrentBoard
  };
}

game = gameController();

// emulate horizontal win
// game.playTurn(0, 0)
// game.playTurn(1, 0)
// game.playTurn(0, 1)
// game.playTurn(1, 1)
// game.playTurn(0, 2)

// emulate vertical win
// game.playTurn(0, 0)
// game.playTurn(1, 1)
// game.playTurn(1, 0)
// game.playTurn(2, 1)
// game.playTurn(2, 0)

// emulate diagonal win
// game.playTurn(0, 0)
// game.playTurn(0, 2)
// game.playTurn(1, 1)
// game.playTurn(1, 0)
// game.playTurn(2, 2)

// emulate tie
game.playTurn(0, 2)
game.playTurn(0, 0)
game.playTurn(0, 1)
game.playTurn(1, 2)
game.playTurn(1, 0)
game.playTurn(1, 1)
game.playTurn(2, 2)
game.playTurn(2, 0)
game.playTurn(2, 1)

// emulate win on last cell (don't call tieCheck())
// game.playTurn(0, 2)
// game.playTurn(0, 0)
// game.playTurn(0, 1)
// game.playTurn(1, 2)
// game.playTurn(1, 1)
// game.playTurn(2, 2)
// game.playTurn(1, 0)
// game.playTurn(2, 0)
// game.playTurn(2, 1)