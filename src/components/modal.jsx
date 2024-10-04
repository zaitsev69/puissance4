"use client";

import React, { useState } from "react";

const GameSetupModal = ({ isModalOpen, setIsModalOpen, onGameStart }) => {
  const colors = [
    { value: "#ff0000", label: "Rouge" },
    { value: "#ffff00", label: "Jaune" },
    { value: "#00ff00", label: "Vert" },
    { value: "#0000ff", label: "Bleu" },
    { value: "#ff00ff", label: "Magenta" },
  ];

  const [playerColor, setPlayerColor] = useState(colors[0].value);
  const [playerTwoColor, setPlayerTwoColor] = useState(colors[1].value);
  const [gameMode, setGameMode] = useState("1player");

  const getRandomBotColor = () => {
    const availableColors = colors.filter(
      (color) => color.value !== playerColor
    );
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex].value;
  };

  const startGame = () => {
    if (gameMode === "1player") {
      const botColor = getRandomBotColor();
      onGameStart(playerColor, botColor, "1player");
    } else if (gameMode === "2player") {
      onGameStart(playerColor, playerTwoColor, "2player");
    } else if (gameMode === "multiplayer") {
      onGameStart(playerColor, null, "multiplayer"); // Passe au mode multijoueur
    }
    setIsModalOpen(false); // Ferme la modale
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-105">
          <h2 className="text-center text-2xl font-semibold mb-4">
            Configurer le jeu
          </h2>
          {/* Choix du mode de jeu */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Mode de jeu :</h3>
            <div className="flex space-x-4 justify-center">
              <label>
                <input
                  type="radio"
                  name="game-mode"
                  value="1player"
                  checked={gameMode === "1player"}
                  onChange={() => setGameMode("1player")}
                  className="sr-only"
                />
                <div
                  className={`px-4 py-2 rounded-md cursor-pointer ${
                    gameMode === "1player"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  1 Joueur
                </div>
              </label>
              <label>
                <input
                  type="radio"
                  name="game-mode"
                  value="2player"
                  checked={gameMode === "2player"}
                  onChange={() => setGameMode("2player")}
                  className="sr-only"
                />
                <div
                  className={`px-4 py-2 rounded-md cursor-pointer ${
                    gameMode === "2player"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  2 Joueurs
                </div>
              </label>
              <label>
                <input
                  type="radio"
                  name="game-mode"
                  value="multiplayer"
                  checked={gameMode === "multiplayer"}
                  onChange={() => setGameMode("multiplayer")}
                  className="sr-only"
                />
                <div
                  className={`px-4 py-2 rounded-md cursor-pointer ${
                    gameMode === "multiplayer"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Multijoueur
                </div>
              </label>
            </div>
          </div>

          {/* Choix de la couleur du joueur 1 */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Couleur du joueur 1 :</h3>
            <div className="flex space-x-4 my-4 justify-center">
              {colors.map((color) => (
                <label key={color.value}>
                  <input
                    type="radio"
                    name="player-color"
                    value={color.value}
                    checked={playerColor === color.value}
                    onChange={() => setPlayerColor(color.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-10 rounded-full border-2 cursor-pointer ${
                      playerColor === color.value
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Choix de la couleur du joueur 2 (visible seulement en mode 2 joueurs) */}
          {gameMode === "2player" && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">
                Couleur du joueur 2 :
              </h3>
              <div className="flex space-x-4 my-4 justify-center">
                {colors
                  .filter((color) => color.value !== playerColor) // Ne pas permettre au joueur 2 de choisir la même couleur que le joueur 1
                  .map((color) => (
                    <label key={color.value}>
                      <input
                        type="radio"
                        name="player-two-color"
                        value={color.value}
                        checked={playerTwoColor === color.value}
                        onChange={() => setPlayerTwoColor(color.value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-10 rounded-full border-2 cursor-pointer ${
                          playerTwoColor === color.value
                            ? "border-black"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color.value }}
                      />
                    </label>
                  ))}
              </div>
            </div>
          )}

          {/* Bouton jouer */}
          <div className="text-center">
            <button
              onClick={startGame}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Jouer
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default GameSetupModal;
