import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * --- COLOR PALETTE ---
 * Primary: #3498db (Blue)
 * Secondary: #2ecc71 (Green)
 * Accent: #e74c3c (Red)
 */

/**
 * Square component represents an individual tic tac toe cell.
 * @param {object} props - Props passed from Board
 */
// PUBLIC_INTERFACE
function Square({ value, onClick, isWinning }) {
  return (
    <button
      className={`ttt-square${isWinning ? " ttt-square-win" : ""}`}
      onClick={onClick}
      aria-label={value ? value : "empty"}
    >
      {value}
    </button>
  );
}

/**
 * Board component for 3x3 tic tac toe board.
 * @param {object} props - { squares, onSquareClick, winningLine }
 */
// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine }) {
  function renderSquare(i) {
    const isWinning =
      winningLine && Array.isArray(winningLine) && winningLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        isWinning={isWinning}
      />
    );
  }

  return (
    <div className="ttt-board">
      {[0, 1, 2].map((row) => (
        <div key={row} className="ttt-row">
          {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function GameControls({
  currentPlayer,
  isGameOver,
  winner,
  onRestart,
  onNewGame,
  score,
}) {
  return (
    <div className="ttt-controls">
      {winner ? (
        <div className="ttt-status win">
          {winner === "Draw" ? (
            <>
              <span>🤝</span> It's a draw!
            </>
          ) : (
            <>
              <span
                className={`ttt-winner-badge ${
                  winner === "X" ? "primary" : "secondary"
                }`}
                aria-label={`Winner: Player ${winner}`}
              >
                Player {winner}
              </span>{" "}
              wins!
            </>
          )}
        </div>
      ) : (
        <div className="ttt-status">
          <span className="ttt-player-label">Current: </span>
          <span
            className={`ttt-current-player ${
              currentPlayer === "X" ? "primary" : "secondary"
            }`}
          >
            Player {currentPlayer}
          </span>
        </div>
      )}
      <div className="ttt-buttons">
        <button className="ttt-btn" onClick={onRestart}>
          Restart Game
        </button>
        <button className="ttt-btn outline" onClick={onNewGame}>
          New Game
        </button>
      </div>
      <div className="ttt-scoreboard" aria-label="Scoreboard">
        <span className="primary">X: {score.X}</span>
        <span className="secondary">O: {score.O}</span>
        <span className="accent">Draw: {score.Draw}</span>
      </div>
    </div>
  );
}

// UTILITY: check for winner and return { winner: "X"/"O"/null, line: [indexes] }
// PUBLIC_INTERFACE
function calculateWinner(sq) {
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
  for (let line of lines) {
    const [a, b, c] = line;
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
      return { winner: sq[a], line };
    }
  }
  // Draw: all squares filled & no winner
  if (sq.every(Boolean)) {
    return { winner: "Draw", line: [] };
  }
  return { winner: null, line: [] };
}

/**
 * Main App component, handles game state and layout.
 */
// PUBLIC_INTERFACE
function App() {
  // Board is array of 9 squares: "X" | "O" | null.
  const [squares, setSquares] = useState(Array(9).fill(null));
  // X always starts. Toggle between "X" and "O".
  const [isXNext, setIsXNext] = useState(true);
  // In-memory score (Obj): { X, O, Draw }
  const [score, setScore] = useState({ X: 0, O: 0, Draw: 0 });
  // Keeps track if game is over.
  const [gameStatus, setGameStatus] = useState({
    winner: null,
    winningLine: [],
  });
  // Resets everything for Start New Game (including score)
  const handleNewGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setScore({ X: 0, O: 0, Draw: 0 });
    setGameStatus({ winner: null, winningLine: [] });
  };
  // Restarts round: preserves score, resets board
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus({ winner: null, winningLine: [] });
  };

  // Make a play
  const handleSquareClick = (idx) => {
    if (squares[idx] || gameStatus.winner) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = isXNext ? "X" : "O";
    setSquares(nextSquares);
    setIsXNext((prev) => !prev);

    // Winning logic & update handled in useEffect below
  };

  // Check for winner after every move
  useEffect(() => {
    const res = calculateWinner(squares);
    if (res.winner && !gameStatus.winner) {
      setGameStatus({ winner: res.winner, winningLine: res.line });
      setScore((s) => ({
        ...s,
        [res.winner]: s[res.winner] + 1,
      }));
    }
    // eslint-disable-next-line
  }, [squares]);

  // --- MODERN MINIMAL HEADER ---
  return (
    <div className="ttt-app-root" data-theme="light">
      <header className="ttt-header">
        <h1 className="ttt-title">
          <span
            style={{
              color: "#3498db",
              fontWeight: 800,
              fontFamily: "inherit",
            }}
          >
            Tic
          </span>
          <span style={{ color: "#2ecc71", fontWeight: 800 }}>Tac</span>
          <span style={{ color: "#e74c3c", fontWeight: 800 }}>Toe</span>
        </h1>
        <div className="ttt-subtitle">Two Player • Modern Minimal UI</div>
      </header>
      <main>
        <section className="ttt-board-section">
          <Board
            squares={squares}
            onSquareClick={gameStatus.winner ? () => {} : handleSquareClick}
            winningLine={gameStatus.winningLine}
          />
        </section>
        <GameControls
          currentPlayer={isXNext ? "X" : "O"}
          isGameOver={!!gameStatus.winner}
          winner={gameStatus.winner}
          onRestart={handleRestart}
          onNewGame={handleNewGame}
          score={score}
        />
      </main>
      <footer className="ttt-footer">
        <span>
          <a
            href="https://react.dev/"
            rel="noopener"
            target="_blank"
            className="ttt-footer-link"
          >
            React
          </a>{" "}
          | <span style={{ color: "#888" }}>Simple PvP version</span>
        </span>
      </footer>
    </div>
  );
}

export default App;
