// two players each take turns placing a marker (X, or O) onto a 3x3 board, with the goal of aligning 3 of their own marker in a row, in any direction

// 0. players are shown an empty 3x3 board

// 1. player chooses a cell to place their marker

// 2. marker gets placed in that cell, markers cannot be replaced or shifted

// 3. the board with the added marker is shown to the players

// 4. board gets checked to assess whether there are any lines of 3 of the same marker in a row to determine whether the game is over

// 5. repeate 1-4 until gameover

// so in console:

// 1. (p1.marker = x) p1 chooses cell at (1,1)

// 2. board.cell at (1,1).value = p1.marker

// 3. console.log(board)

// 4. gameController.checkGameOver

// 5. gameController.switchPlayer 

function createPlayer(name, marker) {
  return {
    name,
    marker
  };
}

function Gameboard() {
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
    placeMarker,
    printBoard
   };  
}

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
  const p1 = createPlayer('p1', 'X');
  const p2 = createPlayer('p2', 'O');
  const players = [p1, p2]

  // create empty board of cells
  const board = Gameboard();

  // prints current board so board isn't revealed(?)
  const printCurrentBoard = () => board.printBoard();

  let currentPlayer = players[0]

  const switchPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  // calls the board method to place a marker on a player's turn
  const playTurn = (row, col) => {

    // switch players only when placeMarker returns true
    board.placeMarker(row, col, currentPlayer) === true ? switchPlayer() : console.log("Please pick an empty square")  
    printCurrentBoard();

    console.log(`it's ${currentPlayer.name}'s turn`)
  }

  return {
    playTurn,
    printCurrentBoard
  };
}

game = gameController();


