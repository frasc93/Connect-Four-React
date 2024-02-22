import React, { useState } from 'react';
import './App.css';

const initialBoard = Array(42).fill(""); // Array iniziale vuoto per la board (6 righe x 7 colonne)

const App = () => {
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState("Red");
  const [winner, setWinner] = useState("");
  const [draw, setDraw] = useState(false);

  const handleCellClick = (index: number) => {
    if (board[index] === "" && !winner && !draw) {
      const newBoard = [...board];
      let rowIndex = getRowIndex(index); // Ottieni l'indice della riga
      let columnIndex = index % 7; // Ottieni l'indice della colonna
      let bottomRowIndex = findBottomRowIndex(columnIndex); // Trova l'indice della cella più bassa disponibile nella colonna

      if (bottomRowIndex !== -1) {
        newBoard[bottomRowIndex * 7 + columnIndex] = currentPlayer;
        setBoard(newBoard);
        checkWinner(newBoard, bottomRowIndex, columnIndex);
        setCurrentPlayer(currentPlayer === "Red" ? "Yellow" : "Red");
      }
    }
  };

  const getRowIndex = (index: number): number => {
    return Math.floor(index / 7);
  };

  const findBottomRowIndex = (columnIndex: number): number => {
    for (let row = 5; row >= 0; row--) {
      if (board[row * 7 + columnIndex] === "") {
        return row;
      }
    }
    return -1; // Se la colonna è piena, ritorna -1
  };

  const checkWinner = (board: string[], row: number, col: number) => {
    const directions = [
      [0, 1],   // Orizzontale
      [1, 0],   // Verticale
      [1, 1],   // Diagonale in su a destra
      [1, -1],  // Diagonale in su a sinistra
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      count += countDirection(board, row, col, dx, dy);
      count += countDirection(board, row, col, -dx, -dy);

      if (count >= 4) {
        setWinner(currentPlayer);
        return;
      }
    }

    const isBoardFull = board.every(cell => cell !== "");
    if (isBoardFull) {
      setDraw(true);
    }
  };

  const countDirection = (
    board: string[],
    row: number,
    col: number,
    dx: number,
    dy: number
  ): number => {
    let count = 0;
    let r = row + dx;
    let c = col + dy;

    while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r * 7 + c] === currentPlayer) {
      count++;
      r += dx;
      c += dy;
    }

    return count;
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setCurrentPlayer("Red");
    setWinner("");
    setDraw(false);
  };

  return (
    <div>
      <h1 className="title">Connect Four</h1>
      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell}`}
            onClick={() => handleCellClick(index)}
          >
            {cell && <div className="piece" />}
          </div>
        ))}
      </div>
      <div className="status">
        {winner && <p>Il vincitore è: {winner}</p>}
        {!winner && draw && <p>Pareggio!</p>}
        {!winner && !draw && <p>Turno di: {currentPlayer}</p>}
      </div>
      <div className="button-wrapper">
        <button onClick={resetGame}>Nuova Partita</button>
      </div>
    </div>
  );
};

export default App;
