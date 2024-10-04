"use client";

import Header from "@/components/header";
import GameSetupModal from "@/components/modal";
import Board_bot from "@/components/board_bot";
import Board_local from "@/components/board_local";
import Board_multiplayer from "@/components/multi"; // Composant multijoueur
import { useState } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [playerColor, setPlayerColor] = useState("#ff0000"); // Couleur par défaut du joueur
  const [playerTwoColor, setPlayerTwoColor] = useState("#00ff00"); // Couleur par défaut du joueur 2
  const [botColor, setBotColor] = useState("#ffff00"); // Couleur par défaut du bot
  const [gameState, setGameState] = useState(null); // État de la partie
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
    } else if (chosenGameMode === "2player") {
      setPlayerTwoColor(chosenOpponentColor); // Si c'est deux joueurs, on met la couleur du joueur 2
    }
    setGameMode(chosenGameMode); // Enregistre le mode de jeu choisi
    setIsModalOpen(false); // Fermer la modale
  };

  // Fonction pour réinitialiser la partie sans déconnecter
  const resetGame = () => {
    setGameState(null); // Réinitialiser uniquement l'état du jeu
    setIsModalOpen(true); // Réouvrir la modale pour une nouvelle configuration
  };

  return (
    <div>
      <Header onRestart={resetGame} />
      <GameSetupModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onGameStart={handleGameStart}
      />

      {/* Montre le composant correct selon le mode de jeu */}
      {gameMode === "1player" ? (
        <Board_bot
          key={gameState}
          playerColor={playerColor}
          botColor={botColor}
        />
      ) : gameMode === "2player" ? (
        <Board_local
          key={gameState}
          playerColor={playerColor}
          playerTwoColor={playerTwoColor}
        />
      ) : gameMode === "multiplayer" ? (
        <Board_multiplayer key={gameState} playerColor={playerColor} />
      ) : null}
    </div>
  );
}
