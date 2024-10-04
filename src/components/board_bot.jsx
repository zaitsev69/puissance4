"use client";
 
import { useState, useEffect, useRef } from "react";
import { Fireworks } from "fireworks-js";
 
const ROWS = 6;
const COLS = 7;
 
const createBoard = () => {
  return Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(null));
};
 
const checkWinner = (board, player) => {
  const directions = [
    { x: 1, y: 0 }, // droite
    { x: 0, y: 1 }, // bas
    { x: 1, y: 1 }, // diagonale bas-droite
    { x: 1, y: -1 }, // diagonale bas-gauche
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
 
export default function Board_bot({ playerColor = "#ff0000", botColor = "#ffff00" }) {
  const [board, setBoard] = useState(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState("Human");
  const [winner, setWinner] = useState(null);
  const [fallingToken, setFallingToken] = useState({ row: null, col: null, player: null });
  const fireworksContainerRef = useRef(null);
  const fireworksInstanceRef = useRef(null);
 
  const triggerFireworks = () => {
    if (fireworksContainerRef.current) {
      if (!fireworksInstanceRef.current) {
        fireworksInstanceRef.current = new Fireworks(fireworksContainerRef.current, {
          autoresize: true,
          opacity: 0.5,
          acceleration: 1.05,
          friction: 0.97,
          gravity: 1.5,
          particles: 100,
          traceLength: 3,
          traceSpeed: 10,
          explosion: 5,
          intensity: 30,
          flickering: 50,
          hue: { min: 0, max: 360 },
          delay: { min: 30, max: 60 },
          brightness: { min: 50, max: 80 },
          decay: { min: 0.015, max: 0.03 },
        });
      }
      fireworksInstanceRef.current.start();
    }
  };
 
  const stopFireworks = () => {
    if (fireworksInstanceRef.current) {
      fireworksInstanceRef.current.stop();
    }
  };
 
  const dropPiece = (col) => {
    if (winner || fallingToken.player) return;
    const newBoard = [...board];
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        // Simuler la chute du jeton
        setFallingToken({ row, col, player: currentPlayer });
 
        setTimeout(() => {
          newBoard[row][col] = currentPlayer;
          setBoard(newBoard);
 
          if (checkWinner(newBoard, currentPlayer)) {
            setWinner(currentPlayer);
            triggerFireworks();
          } else {
            setCurrentPlayer(currentPlayer === "Human" ? "Bot" : "Human");
          }
 
          setFallingToken({ row: null, col: null, player: null });
        }, 500);
        break;
      }
    }
  };
 
  useEffect(() => {
    if (currentPlayer === "Bot" && !winner) {
      const availableCols = board[0]
        .map((_, i) => i)
        .filter((i) => !board[0][i]);
      const randomCol =
        availableCols[Math.floor(Math.random() * availableCols.length)];
      dropPiece(randomCol);
    }
  }, [currentPlayer, board, winner]);
 
  useEffect(() => {
    return () => {
      stopFireworks(); // Nettoyage à la destruction
    };
  }, []);
 
  const renderCell = (row, col) => {
    const value = board[row][col];
    const isFalling = fallingToken.row === row && fallingToken.col === col;
 
    return (
<div
        key={col}
        className={`w-20 h-20 rounded-full flex justify-center items-center cursor-pointer relative`}
        onClick={() => currentPlayer === "Human" && dropPiece(col)}
>
        {/* Affichage du jeton avec animation */}
        {isFalling ? (
<div
            className="w-16 h-16 rounded-full animate-[fall_0.5s_ease-in-out]"
            style={{ backgroundColor: currentPlayer === "Human" ? playerColor : botColor }}
          />
        ) : (
<div
            className="w-16 h-16 rounded-full transition-all"
            style={{
              backgroundColor:
                value === "Human"
                  ? playerColor
                  : value === "Bot"
                  ? botColor
                  : "white",
            }}
          />
        )}
</div>
    );
  };
 
  return (
<div className="flex flex-col items-center mt-10">
<h1 className="text-4xl font-bold mb-6">Puissance 4</h1>
      {winner ? (
<h2 className="text-2xl font-semibold mb-4 text-green-600">
          {winner} wins!
</h2>
      ) : (
<h2 className="text-xl mb-4">
          Current Player: <span className="font-bold">{currentPlayer}</span>
</h2>
      )}
<div className="grid grid-cols-7 grid-rows-6 gap-2 bg-blue-800 p-7">
        {board.flat().map((_, index) => {
          const rowIndex = Math.floor(index / COLS);
          const colIndex = index % COLS;
          return renderCell(rowIndex, colIndex);
        })}
</div>
 
      {/* Conteneur des feux d'artifice */}
<div
        ref={fireworksContainerRef}
        className="absolute top-0 left-0 w-full h-full z-50 pointer-events-none"
></div>
</div>
  );
}