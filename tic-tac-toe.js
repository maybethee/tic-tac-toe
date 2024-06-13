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

  const printBoard = () => {
    const boardWithCellMarkers = board.map((row) => row.map((cell) => cell.getMarker()))
    console.log(boardWithCellMarkers);
  };

  return { printBoard };  
}

function Cell() {
  // default value is no marker
  let marker = '-';

  function getMarker() {
    return marker;
  };

  return { getMarker };
};


function gameController() {
  const p1 = createPlayer('p1', 'X');
  const p2 = createPlayer('p2', 'O');
  const players = [p1, p2]

  // create empty board of cells
  const board = Gameboard();

  return {
    players,
    board
  };
}

console.log(gameController().players[0].name);
console.log(gameController().players[0].marker);
console.log(gameController().players[1].name);
console.log(gameController().players[1].marker);
console.log(gameController().board.printBoard());
