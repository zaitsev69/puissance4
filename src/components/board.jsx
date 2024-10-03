"use client";

import React, { useState } from "react";

const ROWS = 6;
const COLS = 7;

const Board = () => {
  const initialGrid = Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(null));
  const [grid, setGrid] = useState(initialGrid);
  const [currentPlayer, setCurrentPlayer] = useState("R");
  const [winner, setWinner] = useState(null);
  const [winningPositions, setWinningPositions] = useState([]);

  const handleColumnClick = (colIndex) => {
    if (winner) return;

    for (let row = ROWS - 1; row >= 0; row--) {
      if (!grid[row][colIndex]) {
        const newGrid = [...grid];
        newGrid[row][colIndex] = currentPlayer;
        setGrid(newGrid);

        const winResult = checkWin(newGrid, row, colIndex, currentPlayer);
        if (winResult) {
          setWinner(currentPlayer);
          setWinningPositions(winResult);
        } else {
          setCurrentPlayer(currentPlayer === "R" ? "Y" : "R");
        }
        break;
      }
    }
  };

  const checkWin = (grid, row, col, player) => {
    return (
      checkDirection(grid, row, col, player, 1, 0) ||
      checkDirection(grid, row, col, player, 0, 1) ||
      checkDirection(grid, row, col, player, 1, 1) ||
      checkDirection(grid, row, col, player, 1, -1)
    );
  };

  const checkDirection = (grid, row, col, player, rowStep, colStep) => {
    let count = 0;
    let positions = [];

    for (let i = -3; i <= 3; i++) {
      const newRow = row + i * rowStep;
      const newCol = col + i * colStep;
      if (
        newRow >= 0 &&
        newRow < ROWS &&
        newCol >= 0 &&
        newCol < COLS &&
        grid[newRow][newCol] === player
      ) {
        count++;
        positions.push([newRow, newCol]);
        if (count === 4) return positions;
      } else {
        count = 0;
        positions = [];
      }
    }
    return null;
  };

  const resetGame = () => {
    setGrid(initialGrid);
    setCurrentPlayer("R");
    setWinner(null);
    setWinningPositions([]);
  };

  const isWinningPosition = (row, col) => {
    return winningPositions.some(
      ([winRow, winCol]) => winRow === row && winCol === col
    );
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Puissance 4</h1>
      <div className="text-lg">
        Au tour de : {currentPlayer === "R" ? "Rouge" : "Jaune"}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleColumnClick(colIndex)}
              className="w-24 h-24 bg-blue-500 flex items-center justify-center cursor-pointer"
            >
              <div
                className={`w-20 h-20 rounded-full ${
                  isWinningPosition(rowIndex, colIndex) ? "shake" : ""
                } ${
                  cell === "R"
                    ? "bg-red-500"
                    : cell === "Y"
                    ? "bg-yellow-500"
                    : "bg-white"
                }`}
              />
            </div>
          ))
        )}
      </div>

      {winner && (
        <div className="mt-4 text-xl">
          Joueur {winner === "R" ? "Rouge" : "Jaune"} a gagné !
        </div>
      )}

      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
      >
        Réinitialiser le jeu
      </button>
    </div>
  );
};

export default Board;
