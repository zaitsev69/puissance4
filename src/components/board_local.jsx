"use client";

import React, { useState } from "react";

const ROWS = 6;
const COLS = 7;

const Board_local = ({
  playerColor = "#ff0000",
  playerTwoColor = "#ffff00",
}) => {
  const initialGrid = Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(null));
  const [grid, setGrid] = useState(initialGrid);
  const [currentPlayer, setCurrentPlayer] = useState("P1"); // P1 pour le joueur 1, P2 pour le joueur 2
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
          setCurrentPlayer(currentPlayer === "P1" ? "P2" : "P1");
        }
        break;
      }
    }
  };

  const checkWin = (grid, row, col, player) => {
    return (
      checkDirection(grid, row, col, player, 1, 0) || // Horizontal
      checkDirection(grid, row, col, player, 0, 1) || // Vertical
      checkDirection(grid, row, col, player, 1, 1) || // Diagonal droite-bas
      checkDirection(grid, row, col, player, 1, -1) // Diagonal gauche-bas
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
    setCurrentPlayer("P1");
    setWinner(null);
    setWinningPositions([]);
  };

  const isWinningPosition = (row, col) => {
    return winningPositions.some(
      ([winRow, winCol]) => winRow === row && winCol === col
    );
  };

  const getPlayerColor = (player) => {
    return player === "P1" ? playerColor : playerTwoColor;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Puissance 4</h1>
      <div className="text-lg">
        Au tour de :{" "}
        <span
          style={{
            color: currentPlayer === "P1" ? playerColor : playerTwoColor,
          }}
        >
          {currentPlayer === "P1" ? "Joueur 1" : "Joueur 2"}
        </span>
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
                }`}
                style={{
                  backgroundColor:
                    cell === "P1"
                      ? playerColor
                      : cell === "P2"
                      ? playerTwoColor
                      : "white",
                }}
              />
            </div>
          ))
        )}
      </div>

      {winner && (
        <div className="mt-4 text-xl">
          Joueur{" "}
          <span style={{ color: getPlayerColor(winner) }}>
            {winner === "P1" ? "1" : "2"}
          </span>{" "}
          a gagné !
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

export default Board_local;
