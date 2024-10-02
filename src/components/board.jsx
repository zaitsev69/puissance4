"use client"
import { useState, useEffect } from 'react';

const ROWS = 6;
const COLS = 7;

const createBoard = () => {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
};

const checkWinner = (board, player) => {
  const directions = [
    { x: 1, y: 0 }, // droite
    { x: 0, y: 1 }, // bas
    { x: 1, y: 1 }, // diagonale bas-droite
    { x: 1, y: -1 } // diagonale bas-gauche
  ];

  const inBounds = (x, y) => x >= 0 && x < ROWS && y >= 0 && y < COLS;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === player) {
        for (let { x: dx, y: dy } of directions) {
          let count = 1;
          for (let step = 1; step < 4; step++) {
            const newRow = row + step * dy;
            const newCol = col + step * dx;
            if (inBounds(newRow, newCol) && board[newRow][newCol] === player) {
              count++;
            } else {
              break;
            }
          }
          if (count === 4) return true;
        }
      }
    }
  }
  return false;
};

export default function Home() {
  const [board, setBoard] = useState(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState('Human');
  const [winner, setWinner] = useState(null);

  const dropPiece = (col) => {
    if (winner) return;
    const newBoard = [...board];
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);

        if (checkWinner(newBoard, currentPlayer)) {
          setWinner(currentPlayer);
        } else {
          setCurrentPlayer(currentPlayer === 'Human' ? 'Bot' : 'Human');
        }
        break;
      }
    }
  };

  useEffect(() => {
    if (currentPlayer === 'Bot' && !winner) {
      const availableCols = board[0].map((_, i) => i).filter(i => !board[0][i]);
      const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
      dropPiece(randomCol);
    }
  }, [currentPlayer, board, winner]);

  const renderCell = (row, col) => {
    const value = board[row][col];
    return (
      <div 
        key={col}
        className={`w-12 h-12 border-2 border-gray-300 rounded-full flex justify-center items-center cursor-pointer
          ${value === 'Human' ? 'bg-red-500' : value === 'Bot' ? 'bg-yellow-500' : 'bg-white'}`} 
        onClick={() => currentPlayer === 'Human' && dropPiece(col)}
      />
    );
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-4xl font-bold mb-6">Puissance 4</h1>
      {winner ? (
        <h2 className="text-2xl font-semibold mb-4 text-green-600">{winner} wins!</h2>
      ) : (
        <h2 className="text-xl mb-4">Current Player: <span className="font-bold">{currentPlayer}</span></h2>
      )}
      {/* Mise à jour pour que la grille soit correctement affichée */}
      <div className="grid grid-cols-7 grid-rows-6 gap-2">
        {board.flat().map((_, index) => {
          const rowIndex = Math.floor(index / COLS);
          const colIndex = index % COLS;
          return renderCell(rowIndex, colIndex);
        })}
      </div>
      <button 
        onClick={() => {
          setBoard(createBoard());
          setWinner(null);
          setCurrentPlayer('Human');
        }}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Restart Game
      </button>
    </div>
  );
}