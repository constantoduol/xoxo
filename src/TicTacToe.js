import React from 'react';

export default class TicTacToe extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      'turn': 'x',
      'board': [
        [null, null, null], 
        [null, null, null], 
        [null, null, null]
      ]
    }
  }

  render() {
    let {board, turn} = this.state;
    return (
      <React.Fragment>
        <Board board={board}/>
        <WhosTurn turn={turn}/>
      </React.Fragment>
    );
  }
}

const Board = (props) => {
  let {board} = props;
  let squares = [];
  let count = 0
  for(let row of board){
    for(let content of row){
      squares.push(<Square content={content} key={count}/>);
      count++;
    }
  }

  return (
    <div style={styles.board}>
      {squares}
    </div>
  )
}

const Square = (props) => {
  let {content} = props;
  content = content == null ? '' : content;
  return (
    <div style={styles.square}>{content}</div>
  )
} 

const WhosTurn = (props) => {
  let {turn} = props;
  return (
    <div>
      <span>X</span>
      <span>O</span>
    </div>
  )
}

const styles = {
  'board': {
    display: 'grid',
    gridColumnGap: 8,
    gridRowGap: 8,
    backgroundColor: "gray",
    gridTemplateColumns: "auto auto auto",
    width: 250,
    height: 220,
    fontFamily: "Arial,sans-serif"
  },
  'square': {
    backgroundColor: "#BBDEFB",
    textAlign: "center",
    padding: "5px 0",
    fontSize: 50
  }
}

