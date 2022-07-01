import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button
      className="square"
      style={
        props.winner
          ? { backgroundColor: "#95f542" }
          : { backgroundColor: "white" }
      }
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winLine = this.props.winLine;
    console.log(winLine, this.props.squares[i]);
    return (
      <Square
        key={i}
        winner={winLine ? winLine.includes(i) : null}
        value={this.props.squares[i]}
        onClick={() => {
          this.props.onClick(i);
        }}
      />
    );
  }

  render() {
    const array = Array(3).fill(Array(3).fill(null));
    return (
      <div>
        {array.map((el, index) => (
          <div className="board-row" key={index}>
            {el.map((el2, index2) => this.renderSquare(index2 + index * 3))}
          </div>
        ))}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          location: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      sort: true,
    };
  }
  getIndexOfMove(current, previous) {
    let indexOfMove;
    for (let i = 0; i < 9; i++) {
      if (current[i] !== previous[i]) {
        indexOfMove = i;
        break;
      }
    }
    return indexOfMove;
  }
  async handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];

    const squares = current.squares.slice();
    const { winner } = calculateWinner(squares);
    if (winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";

    const previousSquares = history[this.state.stepNumber].squares;
    const indexOfMove = this.getIndexOfMove(squares, previousSquares);
    const location = this.getLocation(indexOfMove);
    await this.setState({
      history: history.concat([
        {
          squares: squares,
          location: location,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumoTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }
  getLocation(indexOfMove) {
    const col = (indexOfMove % 3) + 1;
    const row = Math.floor(indexOfMove / 3) + 1;

    return ` (${col}-${row})`;
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const { winner, line } = calculateWinner(current.squares);
    const sort = this.state.sort;
    const moves = history.map((step, index) => {
      let move = sort ? history.length - 1 - index : index;
      const desc = move
        ? "go to move #" + move + history[move].location
        : "go to game start";
      return (
        <li key={index}>
          <button
            style={
              move === this.state.stepNumber
                ? { fontWeight: "bold" }
                : { fontWeight: "normal" }
            }
            onClick={() => {
              this.jumoTo(move);
            }}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "The winner is: " + winner;
    } else if (this.state.stepNumber > 8) {
      status = "There's a draw";
    } else {
      status = "Next player is: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            winLine={line}
            squares={current.squares}
            onClick={(i) => {
              this.handleClick(i);
            }}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            onClick={() => {
              this.setState({
                sort: !this.state.sort,
              });
            }}
            style={{
              marginLeft: "30px",
              marginTop: "10px",
              display: "flex",
              gap: "10px",
              placeItems: "center",
              transition: "all",
            }}
          >
            Sorting
            <i
              // key={100}
              className={sort ? `fas fa-angle-down` : `fas fa-angle-up`}
            ></i>
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
}

/*
Done - Display the location for each move in the format (col, row) in the move history list.
Done - Bold the currently selected item in the move list.
Done - Rewrite Board to use two loops to make the squares instead of hardcoding them.
Done - Add a toggle button that lets you sort the moves in either ascending or descending order.
Done - When someone wins, highlight the three squares that caused the win.
Done - When no one wins, display a message about the result being a draw.
*/
