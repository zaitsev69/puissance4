import React from "react";

function Header({ onRestart }) {
  const handleRestartClick = () => {
    const confirmRestart = window.confirm(
      "Êtes-vous sûr de vouloir continuer ? Vous allez perdre votre partie en cours."
    );
    if (confirmRestart) {
      onRestart(); // Si l'utilisateur confirme, on appelle la fonction pour réinitialiser le jeu
    }
  };

  return (
    <div className="bg-[#B0D3F3] flex justify-between items-center p-4">
      <div className="flex space-x-10 uppercase font-bold">
        <div>Level:</div>
        <div>Score:</div>
      </div>
      {/* Appel de la fonction handleRestartClick pour afficher la confirmation */}
      <button
        onClick={handleRestartClick}
        className="bg-white border border-black text-black px-4 py-2 rounded shadow-md uppercase"
      >
        Menu
      </button>
    </div>
  );
}

export default Header;
