import React from 'react';

const DELAY_BEFORE_COMPUTER_MOVE = 1000; //ms

export default class TicTacToe extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      'currentTurn': 'x',
      'player': 'x',
      'board': [
        [null, null, null], 
        [null, null, null], 
        [null, null, null]
      ]
    };

    this.changePlayer = this.changePlayer.bind(this);
    this.playerMakeMove = this.playerMakeMove.bind(this);
    this.checkWin = this.checkWin.bind(this);
  }

  playerMakeMove(row, col){
    let {currentTurn, player, board} = this.state;
    if(currentTurn === player && !board[row][col]){
      board[row][col] = player;
      this.setState({board: board, 'currentTurn': this.nextTurn()}, () => setTimeout(this.checkWin, 500));
      this.computerMakeMove();
    }
  }

  optimalComputerMove(strategy="offensive"){
    //if the strategy is defensive, the computer tries to prevent the player from winning
    //if the stategy is offensive, the computer tries to win
    // we always start with an offensive strategy i.e we try to win, if we can't win
    // we become defensive and try to prevent the player from winning
    console.log(`strategy is ${strategy}`)
    let {player, board} = this.state;
    if(strategy === "offensive") player = this.computerPlayer()
    let firstEmptySquare = null;

    for(let row = 0; row < board.length; row++){
      let rowSquareWithNoPlayer = null;
      let colSquareWithNoPlayer = null;
      let rowPlayerCount = 0;
      let colPlayerCount = 0;

      for(let col = 0; col < board[row].length; col++){
        if(!board[row][col] && !firstEmptySquare) firstEmptySquare = {row, col};

        if(board[row][col] === player) rowPlayerCount++;
        if(!board[row][col]) rowSquareWithNoPlayer = {row, col};
        if(rowPlayerCount === 2 && rowSquareWithNoPlayer) return rowSquareWithNoPlayer;
        

        if(board[col][row] === player) colPlayerCount++;
        if(!board[col][row]) colSquareWithNoPlayer = {'row': col, 'col': row};
        if(colPlayerCount === 2 && colSquareWithNoPlayer) return colSquareWithNoPlayer;
        
      } 
    }

    //diagonals: 0,0 1,1 2,2
    //0,2 1,1 2,0

    let diagonals = [
      [{row: 0, col: 0}, {row: 1, col: 1}, {row: 2, col: 2}],
      [{row: 0, col: 2}, {row: 1, col: 1}, {row: 2, col: 0}]
    ]

    for(let diag of diagonals){
      let playerCount = 0;
      let diagSquareWithNoPlayer = null;

      for(let pos of diag){
        let {row, col} = pos;
        if(board[row][col] === player) playerCount++;
        if(!board[row][col]) diagSquareWithNoPlayer = {row, col};
        if(playerCount === 2 && diagSquareWithNoPlayer) return diagSquareWithNoPlayer;
      }
    }

    if(strategy === "defensive") {
      // random empty square or first empty square or it's a tie
      return this.randomEmptySquare() || firstEmptySquare || {row: -1, col: -1}; 
    } else if(strategy === "offensive") {
      //we started with an offensive strategy now try a defensive one
      return this.optimalComputerMove("defensive");
    }
  }

  randomEmptySquare(tries=0){
    let {board} = this.state;
    const MAX_TRIES = 5;
    if(tries >= MAX_TRIES) return null;
    let row = Math.floor(Math.random() * 3);
    let col = Math.floor(Math.random() * 3);
    if(!board[row][col]) return {row, col};
    if(board[row][col]) return this.randomEmptySquare(tries + 1);
  }

  computerPlayer(){
    let {player} = this.state;
    return player === 'x' ? 'o' : 'x';
  }

  computerMakeMove(){
    setTimeout(() => {
      let {board, currentTurn, player} = this.state;
      if(currentTurn === player) return;
      let {row, col} = this.optimalComputerMove();
      if(row === -1) {
        this.gameIsOver("xo")
        return;
      }

      board[row][col] = this.computerPlayer();
      this.setState({currentTurn: this.nextTurn(), board}, () => setTimeout(this.checkWin, 500));
    }, DELAY_BEFORE_COMPUTER_MOVE);
  }

  checkWin(){
    let {board} = this.state;

    for(let row = 0; row < board.length; row++){
      for(let col = 0; col < board[row].length; col++){

        let rowValuesEqual = board[0][col] !== null && board[0][col] === board[1][col] && board[1][col] === board[2][col];
        let colValuesEqual = board[row][0] !== null && board[row][0] === board[row][1] && board[row][1] === board[row][2];
        let diag1ValuesEqual = board[0][0] !== null && board[0][0] === board[1][1] && board[1][1] === board[2][2];
        let diag2ValuesEqual = board[0][2] !== null && board[0][2] === board[1][1] && board[1][1] === board[2][0];

        if(rowValuesEqual){
          this.gameIsOver(board[0][col]);
        } else if(colValuesEqual){
          this.gameIsOver(board[row][0]);
        } else if(diag1ValuesEqual){
          this.gameIsOver(board[0][0]);
        } else if(diag2ValuesEqual){
          this.gameIsOver(board[0][2]);
        }

        if(rowValuesEqual || colValuesEqual || diag1ValuesEqual || diag2ValuesEqual) return;
      }
    }
  }

  gameIsOver(winner="x"){
    if(winner === "xo"){
      window.alert("Game over! X and O tied.")
    } else {
      window.alert(`Game over! ${winner.toUpperCase()} wins!`);
    }
    let {player} = this.state;
    this.restartGame(player);
  }

  nextTurn(){
    let {currentTurn} = this.state;
    return currentTurn === 'x' ? 'o' : 'x';
  }

  changePlayer(newPlayer){
    let {player} = this.state;
    if(this.gameInProgress()){
      let confirm = window.confirm("Change player and restart game?");
      if(confirm) this.restartGame(newPlayer);
      return;
    }
  
    if(player !== newPlayer){
      this.setState({player: newPlayer, currentTurn: newPlayer})
    }
  }

  gameInProgress(){
    let {board} = this.state;
    for(let row of board){
      for(let content of row){
        if(content) return true
      }
    }
    return false;
  }

  restartGame(player='x'){
    this.setState({
      'board': [
        [null, null, null], 
        [null, null, null], 
        [null, null, null]
      ],
      'player': player,
      'currentTurn': player
    })
  }

  render() {
    let {board, currentTurn, player} = this.state;
    return (
      <React.Fragment>
        <Board 
          board={board} 
          playerMakeMove={this.playerMakeMove} 
          player={player} 
          currentTurn={currentTurn}/>
        <WhosTurn 
          currentTurn={currentTurn} 
          changePlayer={this.changePlayer}/>
      </React.Fragment>
    );
  }
}

const Board = (props) => {
  let {board, playerMakeMove, player, currentTurn} = props;
  let tableBody = []
  for(let row = 0; row < board.length; row++){
    let tableRow = []
    for(let col = 0; col < board[row].length; col++){
      tableRow.push(
        <Square 
          content={board[row][col]}
          row={row}
          col={col}
          key={row + "_" + col} 
          player={player}
          currentTurn={currentTurn}
          playerMakeMove={playerMakeMove}/>
      );
    }
    tableBody.push(<tr key={row} style={styles.row}>{tableRow}</tr>);
  }

  return (
    <table style={styles.board}>
      <tbody>
        {tableBody}
      </tbody>
    </table>
  )
}

const Square = (props) => {
  let {content, playerMakeMove, row, col, player} = props;
  let style = styles.square
  if(player === content) {
    style = Object.assign({}, styles.square, {'color': 'white'})
  }
  return (
    <td 
      onClick={() => playerMakeMove(row, col)}
      style={style}>{content}</td>
  )
} 

const WhosTurn = (props) => {
  let {currentTurn, changePlayer} = props;
  let defaultStyle = {paddingLeft: 5, cursor: 'pointer'}
  let xStyle = currentTurn === 'x' ? Object.assign({}, defaultStyle, styles.currentTurn) : defaultStyle;
  let oStyle = currentTurn === 'o' ? Object.assign({}, defaultStyle, styles.currentTurn) : defaultStyle;
  return (
    <div style={styles.whosTurn}>
      <span style={xStyle} onClick={() => changePlayer('x')}>X</span>
      <span style={oStyle} onClick={() => changePlayer('o')}>O</span>
    </div>
  )
}

const styles = {
  board: {
    backgroundColor: "gray",
    width: 280,
    fontFamily: "Arial,sans-serif",
    tableLayout: "fixed"
  },
  row: {
    height: 80
  },
  square: {
    backgroundColor: "rgba(187, 222, 251, 0.8)",
    textAlign: "center",
    fontSize: 60,
    cursor: "pointer"
  },
  whosTurn: {
    width: 270,
    padding: 5,
    display: 'grid',
    background: "gray",
    gridTemplateColumns: "auto auto",
    fontSize: 30,
    fontFamily: "Arial, sans-serif"
  },
  currentTurn: {
    background: "#3cb371",
    color: "white"
  }
}

