"use client";
 
import React, { useState, useEffect, useRef } from "react";
import { Fireworks } from "fireworks-js";
 
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
  const [currentPlayer, setCurrentPlayer] = useState("P1");
  const [winner, setWinner] = useState(null);
  const [winningPositions, setWinningPositions] = useState([]);
  const [fallingToken, setFallingToken] = useState({ row: null, col: null, player: null });
 
  const fireworksContainerRef = useRef(null);
  const fireworksInstanceRef = useRef(null);
 
  const handleColumnClick = (colIndex) => {
    if (winner || fallingToken.player) return; // Pas de clic si un jeton tombe ou si quelqu'un a gagné
 
    // Chercher la première ligne disponible dans la colonne
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!grid[row][colIndex]) {
        // Déclencher l'animation de chute avec les informations du joueur actuel
        setFallingToken({ row, col: colIndex, player: currentPlayer });
 
        // Attendre 500ms pour simuler la chute avant de placer le jeton dans la grille
        setTimeout(() => {
          const newGrid = [...grid];
          newGrid[row][colIndex] = currentPlayer;
          setGrid(newGrid);
 
          const winResult = checkWin(newGrid, row, colIndex, currentPlayer);
          if (winResult) {
            setWinner(currentPlayer);
            setWinningPositions(winResult);
            triggerFireworks();  // Démarrer les feux d'artifice si quelqu'un gagne
          } else {
            setCurrentPlayer(currentPlayer === "P1" ? "P2" : "P1"); // Changer de joueur
          }
 
          // Réinitialiser l'état de la chute du jeton après l'animation
          setFallingToken({ row: null, col: null, player: null });
        }, 500); // Temps de l'animation de la chute
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
    setCurrentPlayer("P1");
    setWinner(null);
    setWinningPositions([]);
    stopFireworks(); // Arrêter les feux d'artifice si le jeu est réinitialisé
  };
 
  const isWinningPosition = (row, col) => {
    return winningPositions.some(
      ([winRow, winCol]) => winRow === row && winCol === col
    );
  };
 
  const getPlayerColor = (player) => {
    return player === "P1" ? playerColor : playerTwoColor;
  };
 
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
 
  useEffect(() => {
    return () => {
      stopFireworks(); // Nettoyer à la destruction du composant
    };
  }, []);
 
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
              className="w-24 h-24 bg-blue-500 flex items-center justify-center cursor-pointer relative"
            >
              {/* Afficher le jeton uniquement si l'animation est terminée */}
              {fallingToken.col === colIndex && fallingToken.row === rowIndex ? (
                <div
                  className={`w-20 h-20 rounded-full animate-[fall_0.5s_ease-in-out]`}
                  style={{
                    backgroundColor: getPlayerColor(fallingToken.player),
                  }}
                />
              ) : (
                <div
                  className={`w-20 h-20 rounded-full transition-transform duration-500 ${
                    isWinningPosition(rowIndex, colIndex) ? "shake" : ""
                  }`}
                  style={{
                    backgroundColor:
                      // Rendre la cellule blanche pendant que le jeton tombe et si elle n'a pas encore de jeton
                      rowIndex === fallingToken.row && colIndex === fallingToken.col
                        ? "white"
                        : cell === "P1"
                        ? playerColor
                        : cell === "P2"
                        ? playerTwoColor
                        : "white",
                  }}
                />
              )}
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
 
      {/* Conteneur des feux d'artifice */}
      <div
        ref={fireworksContainerRef}
        className="absolute top-0 left-0 w-full h-full z-50 pointer-events-none"
      ></div>
    </div>
  );
};
 
export default Board_local;