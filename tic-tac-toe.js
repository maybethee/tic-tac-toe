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
    if (board[rowCoord][colCoord].getMarker() === '_') {
      board[rowCoord][colCoord].setMarker(player.marker);
      return true;
    } else {
      return false;
    }
  }

  const printBoard = () => {
    board.map((row) => row.map((cell) => cell.getMarker()))
  };

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        board[i][j].setMarker('_');
      }
    }
  }

  return { 
    board,
    placeMarker,
    printBoard,
    resetBoard
    };  
})();

function Cell() {
  // default value is no marker
  let marker = '_';

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

  // set default players
  let p1 = createPlayer('Player 1', 'O');
  let p2 = createPlayer('Player 2', 'X');
  let players = [p1, p2];

  function setPlayerNames() {
    // const p1Name = document.getElementById("p1Name")
    p1Name = document.getElementById("p1Name").value;
    p2Name = document.getElementById("p2Name").value;

    if (p1Name !== "") {
      p1.name = p1Name;
    }

    if (p2Name !== "") {
      p2.name = p2Name;
    }
 
    const formContent = document.querySelectorAll(".formContent");

    formContent.forEach(element => {
      element.style.visibility = "hidden";
    });
  }

  // create empty board of cells
  const board = Gameboard;

  const currentBoard = board.board;

  // prints current board so board isn't revealed(?)
  const printCurrentBoard = () => board.printBoard();

  let currentPlayer = players[0]

  const switchPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  const getCurrentPlayer = () => currentPlayer;

  function isMatching(cell) {
    // need to match the _marker_ of the cell using getMarker()
    return cell.getMarker() === currentPlayer.marker; 
  }

  function winCheckHorizontal(boardArray) {
    for (let i = 0; i < currentBoard.length; i++) {
      if (boardArray[i].every(isMatching)) {
        return true;
      } 
    }
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
      return true;
    }
    return false;
  }

  function tieCheck() {
    function checkAllCoords() {
      return currentBoard.every(row => row.every(cell => cell.getMarker() !== '_'))
    }

    if (checkAllCoords()) {
      return true;
    }
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
    const errorMessage = document.querySelector('.alert')


    if (validMove) {
      errorMessage.textContent = ""
      
      // match clicked button's data with board array's coordinates
      const cellButton = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);

      cellButton.textContent = currentPlayer.marker;
    } else {
      errorMessage.textContent = "Please pick an empty square"
    }
    
    printCurrentBoard();
    
    if (winCheck()) {
      // break out of function and do gameover
      return;
    } else if (tieCheck()) {
      return;
    }
    
    validMove && switchPlayer();
  };

  const resetGame = () => {
    board.resetBoard();
    
    // reset player order
    currentPlayer = players[0];
  };

  return {
    setPlayerNames,
    playTurn,
    getCurrentPlayer,
    printCurrentBoard,
    currentBoard,
    winCheck,
    tieCheck,
    resetGame
  };
}




(function displayController() {
  const game = gameController();
  const boardDiv = document.querySelector('.board');
  const playerTurnDiv = document.querySelector('.turn');
  const resultsDiv = document.querySelector('.results');
  const startButton = document.querySelector('.gameStart');
  let gameStarted = false;

  const updateDisplay = () => {
    // clear the board
    boardDiv.textContent = "";

    // set the board and current player
    const board = game.currentBoard;
    const currentPlayer = game.getCurrentPlayer();

    // display player's turn
    if (!gameStarted) {
      playerTurnDiv.style.visibility = "hidden";
    }
    playerTurnDiv.textContent = `${currentPlayer.name}'s turn`;

    // display results when game ends
    if (game.winCheck()) {
      freezeBoard();
      resultsDiv.textContent = `${currentPlayer.name} wins!`;
    } else if (game.tieCheck()) {
      freezeBoard();
      resultsDiv.textContent = "TIE!";
    }

    // print board as buttons
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        if (gameStarted) {
          cellButton.classList.add("active-game");
        }
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.col = colIndex;
        cellButton.textContent = cell.getMarker();
        boardDiv.appendChild(cellButton);
      })
    })
  }

  // board event listener functions
  function playGame(event) {
    if (event.target.matches('.cell')) {
      const row = event.target.dataset.row;
      const col = event.target.dataset.col;
      game.playTurn(row, col);
      updateDisplay();
    }
  }

  function freezeBoard() {
    boardDiv.removeEventListener('click', playGame);
    gameStarted = false;

    let cells = document.querySelectorAll('.cell');

    cells.forEach(function(cell) {
      cell.classList.remove('active-game');
    });

    playerTurnDiv.style.visibility = "hidden";
  }

  startButton.addEventListener('click', (event) => {
    event.preventDefault();
    activateBoard();
    game.setPlayerNames();
  });

  function activateBoard() {
    // makes board clickable
    boardDiv.addEventListener('click', playGame);
    gameStarted = true;

    let cells = document.querySelectorAll('.cell');

    cells.forEach(function(cell) {
      cell.classList.add('active-game');
    });

    startButton.textContent = "Reset Game";
    playerTurnDiv.style.visibility = "visible";
  }

  startButton.addEventListener('click', function() {
    if (gameStarted) {
      // button resets the game if one is in progress
      game.resetGame();
      updateDisplay();
      resultsDiv.textContent = ""
    } else {
      activateBoard();
    }
  });

  // initial render
  updateDisplay();
})()
