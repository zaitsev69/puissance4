"use client";

import Header from "@/components/header";
import GameSetupModal from "@/components/modal";
import Board_boat from "@/components/board_bot";
import { useState } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [playerColor, setPlayerColor] = useState("#ff0000"); // Couleur par défaut du joueur
  const [botColor, setBotColor] = useState("#ffff00"); // Couleur par défaut du bot
  const [key, setKey] = useState(0); // Clé pour forcer la réinitialisation du board

  // Fonction appelée lors du démarrage du jeu
  const handleGameStart = (chosenPlayerColor, chosenBotColor) => {
    setPlayerColor(chosenPlayerColor);
    setBotColor(chosenBotColor);
    setIsModalOpen(false); // Fermer la modale
  };

  // Fonction pour réinitialiser la partie
  const resetGame = () => {
    setKey((prevKey) => prevKey + 1); // Change la clé pour forcer la réinitialisation du Board
    setIsModalOpen(true); // Réouvrir la modale
  };

  return (
    <div>
      <Header onRestart={resetGame} />
      <GameSetupModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onGameStart={handleGameStart}
      />
      <Board_boat key={key} playerColor={playerColor} botColor={botColor} />
    </div>
  );
}
