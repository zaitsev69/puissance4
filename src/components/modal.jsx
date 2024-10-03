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

  const getRandomBotColor = () => {
    const availableColors = colors.filter(
      (color) => color.value !== playerColor
    );
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex].value;
  };

  const startGame = () => {
    const botColor = getRandomBotColor();
    onGameStart(playerColor, botColor); // Passe la couleur choisie et la couleur du bot au parent
    setIsModalOpen(false); // Ferme la modale
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-center text-2xl font-semibold mb-4">
            Configurer le jeu
          </h2>
          {/* Choix de la couleur */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Couleur du joueur :</h3>
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
                    className={`w-5 h-5 rounded-full border-2 cursor-pointer ${
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
