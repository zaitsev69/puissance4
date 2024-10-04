"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const ROWS = 6;
const COLS = 7;

const Board_multiplayer = ({
  playerColor = "#ff0000",
  playerTwoColor = "#ffff00",
  gameId = "game123",
}) => {
  const initialGrid = Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(null));

  const [grid, setGrid] = useState(initialGrid);
  const [currentPlayer, setCurrentPlayer] = useState("P1");
  const [winner, setWinner] = useState(null);
  const [winningPositions, setWinningPositions] = useState([]);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const socketInstance = io("https://backp4.onrender.com/", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setPlayerId(socketInstance.id);
      socketInstance.emit("join_game", gameId);
      console.log(`Player ${socketInstance.id} joined game ${gameId}`);
    });

    socketInstance.on("update_game", (game) => {
      setGrid(game.grid);
      setCurrentPlayer(game.currentPlayer);
      setWinner(game.winner);
      setWinningPositions(game.winningPositions || []);

      if (!myRole) {
        const role = game.players[0] === socketInstance.id ? "P1" : "P2";
        setMyRole(role);
      }

      setIsMyTurn(game.currentPlayer === myRole);

      if (game.winner) {
        setWinner(game.winner);
        setWinningPositions(game.winningPositions || []);
      }
    });

    socketInstance.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [gameId, myRole]);

  const handleColumnClick = (colIndex) => {
    if (!isMyTurn || winner) {
      return;
    }

    const columnFull = grid[0][colIndex] !== null;
    if (columnFull) {
      return;
    }

    socket.emit("play_move", { gameId, colIndex });
  };

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      socket.emit("send_message", {
        gameId,
        message: messageInput,
        player: myRole === "P1" ? "Joueur 1" : "Joueur 2",
      });
      setMessageInput("");
    }
  };

  const isMyMessage = (msgPlayer) => {
    return (
      (myRole === "P1" && msgPlayer === "Joueur 1") ||
      (myRole === "P2" && msgPlayer === "Joueur 2")
    );
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Puissance 4 - Multijoueur</h1>

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
                  winningPositions.some(
                    ([winRow, winCol]) =>
                      winRow === rowIndex && winCol === colIndex
                  )
                    ? "shake"
                    : ""
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
          <span
            style={{
              color: currentPlayer === "P1" ? playerColor : playerTwoColor,
            }}
          >
            {winner === "P1" ? "1" : "2"}
          </span>{" "}
          a gagné !
        </div>
      )}

      <div className="w-full max-w-md mt-4">
        <div className="h-64 bg-gray-100 border rounded p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 flex ${
                isMyMessage(msg.player) ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isMyMessage(msg.player)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <span className="font-bold">{msg.player}:</span> {msg.message}
              </div>
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l"
            placeholder="Tapez votre message"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-blue-500 text-white rounded-r"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Board_multiplayer;
