import React, { useEffect, useRef, useState } from "react";
import { initializeSocket } from "./socket";
import Landing from "./pages/Landing";
import Game from "./pages/Game";
import { IoMdArrowRoundBack } from "react-icons/io";

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
  const resetGame = () => {
    setChar(null);
    setPlay(false);
    setGame(false);
    setTurn(false);
    setGameID("");
    setWinner(null);
    setBoard(Array(9).fill(null));
  };

  useEffect(() => {
    return () => {
      disconnectFromServer();
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-700 flex flex-col relative justify-center items-center">
      <div className="top-0 absolute w-screen bg-slate-400 py-2 flex justify-center items-center">
        <h1 className="text-center text-gray-50 font-bold text-2xl">
          TIC TAC TOE
        </h1>
      </div>
      {winner && (
        <div className="absolute top-14 flex flex-col gap-6 items-center">
          <div className="bg-gray-900 mt-2 p-2 px-8 rounded-md shadow-white shadow-md  flex flex-col gap-3 ">
            <h1 className="text-white font-medium ">Game Over</h1>
            <h1 className="text-white font-bold text-xl text-center">
              {winner} won !!
            </h1>
          </div>
          <div>
            <button
              className="bg-slate-800 text-white font-semibold px-4 py-2 rounded-md flex items-center justify-center gap-2"
              onClick={resetGame}
            >
              <IoMdArrowRoundBack />
              <h1>Back</h1>
            </button>
          </div>
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
