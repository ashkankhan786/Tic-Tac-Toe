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
  const [winner, setWinner] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));

  const URL = import.meta.env.VITE_APP_URL;

  const socketRef = useRef(null);

  const connectToServer = () => {
    if (!socketRef.current) {
      const socket = initializeSocket(URL);
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log(`Server Connected`);
        console.log(`User id: ${socketRef.current.id}`);
      });

      socket.on("message", ({ char, gameID, turn }) => {
        console.log("You are " + char);
        setChar(char);
        setGameID(gameID);
        console.log(`Game id from APP.jsx is: ${gameID}`);

        setGame(true);
        if (turn === socketRef.current.id) {
          setTurn(true);
        }
      });

      socket.on("moveMade", ({ board, turn }) => {
        setTurn(turn === socketRef.current.id);
        setBoard(board);
      });

      socket.on("gameOver", ({ winner }) => {
        setWinner(winner);
      });
    }
  };

  const disconnectFromServer = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const handlePlayClick = () => {
    if (!socketRef.current) {
      connectToServer();
    }
    setPlay(true);
  };

  const onSquareClick = (index) => {
    console.log("GameID from onSquareClick fn: " + GameID);
    console.log("Index of the square clicked: " + index);

    if (!Turn) return;

    if (GameID) {
      socketRef.current.emit("move", { GameID, index });
    }
  };

  useEffect(() => {
    return () => {
      disconnectFromServer();
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-700 flex flex-col relative justify-center items-center">
      {winner && (
        <div className="bg-gray-900 p-4 px-8 rounded-md shadow-white shadow-lg absolute top-12 flex flex-col gap-3 ">
          <h1 className="text-white font-medium ">Game Over</h1>
          <h1 className="text-white font-bold text-xl text-center">
            {winner} won !!
          </h1>
        </div>
      )}

      <div>
        {!game ? (
          <Landing play={play} setPlay={setPlay} onConnect={handlePlayClick} />
        ) : (
          <Game
            board={board}
            onSquareClick={onSquareClick}
            value={char}
            winner={winner}
          />
        )}
      </div>
    </div>
  );
};

export default App;
