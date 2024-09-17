import React, { useEffect, useRef, useState } from "react";
import { initializeSocket } from "./socket";
import Landing from "./pages/Landing";
import Game from "./pages/Game";

const App = () => {
  const [char, setChar] = useState(null);
  const [play, setPlay] = useState(false);
  const [game, setGame] = useState(false);
  const [Turn, setTurn] = useState(false);
  const [GameID, setGameID] = useState("");
  const [board, setBoard] = useState(Array(9).fill(null));

  const URL = import.meta.env.VITE_APP_URL;

  const socketRef = useRef(null);

  const onConnect = () => {
    socketRef.current = initializeSocket(URL);

    socketRef.current.on("connect", () => {
      console.log(`Server Connected`);
      console.log(`User id : ${socketRef.current.id}`);
    });

    socketRef.current.on("message", ({ char, gameID, turn }) => {
      console.log("You are " + char);
      setChar(char);
      setGameID(gameID);
      console.log(`Game id from APP.jsx is : ${GameID} , ${gameID}`);

      setGame(true);
      if (turn === socketRef.current.id) {
        setTurn(true);
      }
    });
  };

  const onDisconnect = () => {
    socketRef.current.disconnect();
  };

  const onSquareClick = (index) => {
    console.log("game if from onsqaureclick fn " + GameID);
    console.log("Index of the square clicked : " + index);

    if (!Turn) return;

    if (GameID) socketRef.current.emit("move", { GameID, index });

    socketRef.current?.on("moveMade", ({ board, turn }) => {
      setTurn(turn === socketRef.current.id);
      setBoard(board);
    });
  };

  console.log("URL is: " + URL);
  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-700 flex justify-center items-center">
      {game === false ? (
        <Landing play={play} setPlay={setPlay} onConnect={onConnect} />
      ) : (
        <Game board={board} onSquareClick={onSquareClick} value={char} />
      )}
    </div>
  );
};

export default App;
