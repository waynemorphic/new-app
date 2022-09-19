import React from 'react';
import ReactDOM from 'react-dom/client'
import './index.css'


// function components are components that only contain a render method and don't have their own state.
// instead of writing a class that extends a React.Component, a function will take props as input and return what is
// to be rendered. We are changing Square from a class to a function component

// square is a child component
function Square(props) {
  // class Square extends React.Component {

  // state is private to a component it is defined in
  // react component classes with a constructor should start with super(props) call

  // constructor(props){
  //   super(props);
  //   this.state = {
  //     value: null,
  //   };
  // }
  // render() {
  return (
    <button className="square"
      onClick={props.onClick}>

      {/* when the button is clicked, we want to display the state, not the prop */}

      {/* calling setState from the onClick event handler in the render method, React re-renders the Square
        component whenever the button is clicked
        
        calling setState in a component automatically updates the child components insie of it as well*/}

      {props.value}
      {/* {this.state.value} */}
    </button>
  );

}

// Board is a parent component
// passing props is how data flows from parents to child components
class Board extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true
  //   }
  // }

  // handleClick event handles the onClick event that is passed to the Square from the Board. Note that the square's onClick prop
  // is specified by the board. Therefore, the Square calls the Board's handleClick(i) when clicked

  // handleClick(i) {
  //   const history = this.state.history;
  //   this.current = history[history.length - 1];
  //   const squares = this.state.squares.slice();
  //   if (calculateWinner(squares) || squares[i]){
  //     return;
  //   }
  //   squares[i] = this.state.xIsNext ? 'X': 'O';
  //   this.setState({ 
  //     history: history.concat([{
  //       squares: squares,
  //   }]),
  //     xIsNext: !this.state.xIsNext,
  //    });
  // }

  // each square has to read from the individual state of the Board ...this.state.squares
  // each Square therefore receives a value prop that is either X, O or null

  // the Board's state cannot be updated directly from Square since state is private to a component that defines it
  // a function is passed down from the Board to a Square and the Square calls the function when the square is clicked
  // therefore, two props are passed down from Board to Square, value and onClick

  // Note that now, state is stored in the Board component instead of the individual squares in the Board component, hence,
  // Square components are controlled components 
  renderSquare(i) {
    return <Square value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)} />;
  }

  render() {
      // const winner = calculateWinner(this.state.squares);
      // let status;
      // if (winner){
      //   status = 'Winner: ' + winner;
      // } else {
      //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O' );
      // }
    
    return (
      <div>
        {/* <div className="status"></div> */}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
    }],
    // stepNumber indicates which step the viewer is currently viewing before jumpTo()
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X': 'O';
    this.setState({ 
      history: history.concat([{
        squares: squares,
    }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
     });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // using map to view past player moves
    // step variable is current history element value
    // move is the current history element index
    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move :
      'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button> 
        </li>
      )
    })

    let status;
    if (winner){
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
