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
      console.log(`Marker placed at row ${rowCoord}, column ${colCoord} by ${player.name}`);
      return true;
    } else {
      console.log(`Cell at row ${rowCoord}, column ${colCoord} is not empty`);
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

  const currentBoard = board.board

  // prints current board so board isn't revealed(?)
  const printCurrentBoard = () => board.printBoard();

  let currentPlayer = players[0]

  const switchPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  function isMatching(cell) {
    console.log(`Comparing cell marker ${cell.getMarker()} to ${currentPlayer.marker}:`);

    // need to match the _marker_ of the cell using getMarker()
    return cell.getMarker() === currentPlayer.marker; 
  }

  function winCheckHorizontal() {
    for (let i = 0; i < currentBoard.length; i++) {
      console.log(`Checking row ${i} for win condition`);
      console.log(`Row ${i}:`, currentBoard[i]);

      if (currentBoard[i].every(isMatching)) {
        console.log('winner winner!');
        return;
      } 
    }
    console.log('no horizontal winner')
  }

  // calls the board method to place a marker on a player's turn
  const playTurn = (row, col) => {

    const validMove = board.placeMarker(row, col, currentPlayer)
    
    printCurrentBoard();
    
    winCheckHorizontal();
    
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
game.playTurn(0, 0)
game.playTurn(1, 0)
game.playTurn(0, 1)
game.playTurn(1, 1)
game.playTurn(0, 2)
