"use client";

import React, { useState } from "react";

const GameSetupModal = () => {
  const colors = [
    { value: "#ff0000", label: "Rouge" },
    { value: "#ffff00", label: "Jaune" },
    { value: "#00ff00", label: "Vert" },
    { value: "#0000ff", label: "Bleu" },
    { value: "#ff00ff", label: "Magenta" },
  ]; // Couleurs

  const [numPlayers, setNumPlayers] = useState(1); // Par défaut 1 joueur
  const [playerColors, setPlayerColors] = useState(["#ff0000"]); // Rouge par défaut pour 1 joueur
  const [isModalOpen, setIsModalOpen] = useState(true); // état de la modale

  // Met à jour la couleur des joueurs
  const handleColorChange = (index, color) => {
    const newColors = [...playerColors];
    newColors[index] = color;
    setPlayerColors(newColors);
  };

  // Met à jour le nombre de joueurs
  const handleNumPlayersChange = (e) => {
    const newNumPlayers = parseInt(e.target.value);
    setNumPlayers(newNumPlayers);
    setPlayerColors((prevColors) => {
      const newColors = [...prevColors];
      while (newColors.length < newNumPlayers) {
        newColors.push(colors.find((c) => !newColors.includes(c.value)).value); // Ajouter une couleur qui n'est pas encore sélectionnée
      }
      return newColors.slice(0, newNumPlayers); // Limiter à 1 ou 2 joueurs
    });
  };

  // Filtre les couleurs déjà sélectionnées par d'autres joueurs
  const getAvailableColors = (currentIndex) => {
    return colors.filter(
      (color) =>
        !playerColors.includes(color.value) ||
        playerColors[currentIndex] === color.value
    );
  };

  // Fonction pour démarrer le jeu
  const startGame = () => {
    alert(
      `Le jeu commence avec ${numPlayers} joueur(s) et les couleurs ${playerColors
        .map((color) => colors.find((c) => c.value === color).label)
        .join(", ")}`
    );
    setIsModalOpen(false); // Ferme la modale après avoir démarré le jeu
  };

  return (
    <>
      {/* Afficher la modale si l'état isModalOpen est true */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Configurer le jeu</h2>

            {/* Choix du nombre de joueurs */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de joueurs :
              </label>
              <select
                value={numPlayers}
                onChange={handleNumPlayersChange}
                className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value={1}>1 joueur</option>
                <option value={2}>2 joueurs</option>
              </select>
            </div>

            {/* Choix des couleurs des joueurs */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">
                Couleurs des joueurs :
              </h3>
              {Array.from({ length: numPlayers }).map((_, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joueur {index + 1} :
                  </label>
                  <div className="flex space-x-4">
                    {getAvailableColors(index).map((color) => (
                      <label key={color.value}>
                        <input
                          type="radio"
                          name={`player-${index}-color`}
                          value={color.value}
                          checked={playerColors[index] === color.value}
                          onChange={() => handleColorChange(index, color.value)}
                          className="sr-only" // Masque l'input radio natif
                        />
                        <div
                          className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                            playerColors[index] === color.value
                              ? "border-black"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color.value }}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Boutons */}
            <div className="flex justify-between">
              <button
                onClick={startGame}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
              >
                Jouer
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameSetupModal;
