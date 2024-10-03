"use client";

import Header from "@/components/header";
import GameSetupModal from "@/components/modal";
import Board_bot from "@/components/board_bot";
import Board from "@/components/board";
import { useState } from "react";

// /pages/index.js

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [playerColor, setPlayerColor] = useState("#ff0000"); // Couleur par défaut du joueur
  const [playerTwoColor, setPlayerTwoColor] = useState("#00ff00"); // Couleur par défaut du joueur 2
  const [botColor, setBotColor] = useState("#ffff00"); // Couleur par défaut du bot
  const [key, setKey] = useState(0); // Clé pour forcer la réinitialisation du board
  const [gameMode, setGameMode] = useState("1player"); // Mode de jeu par défaut

  // Fonction appelée lors du démarrage du jeu
  const handleGameStart = (
    chosenPlayerColor,
    chosenOpponentColor,
    chosenGameMode
  ) => {
    setPlayerColor(chosenPlayerColor);
    if (chosenGameMode === "1player") {
      setBotColor(chosenOpponentColor); // Si c'est un bot, on met la couleur du bot
    } else {
      setPlayerTwoColor(chosenOpponentColor); // Si c'est deux joueurs, on met la couleur du joueur 2
    }
    setGameMode(chosenGameMode); // Enregistre le mode de jeu choisi
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
      {gameMode === "1player" ? (
        <Board_bot key={key} playerColor={playerColor} botColor={botColor} />
      ) : (
        <Board
          key={key}
          playerColor={playerColor}
          playerTwoColor={playerTwoColor}
        />
      )}
    </div>
  );
}
