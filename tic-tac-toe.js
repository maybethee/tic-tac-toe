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
    board[rowCoord][colCoord].setMarker(player.marker); 
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

  const playTurn = (row, col, player) => {
    board.placeMarker(row, col, player)
  }

  return {
    players,
    playTurn,
    printCurrentBoard
  };
}

game = gameController();

game.playTurn(0, 0, game.players[0]);
game.printCurrentBoard();

