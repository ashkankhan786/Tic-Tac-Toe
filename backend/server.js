require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
console.log("POrt : " + process.env.PORT);
console.log("Origin Url :" + process.env.ORIGIN_URL);

const port = process.env.PORT || 3000;

let games = {};
let players = {};
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  if (Object.keys(players).length === 0) {
    players[socket.id] = "X";
    console.log(`Waiting for 2nd player`);
  } else {
    let firstPlayer = Object.keys(players)[0];
    let secondPlayer = socket.id;
    let gameID = `Game-${Date.now()}`;
    console.log(`Game has started ... game id : ${gameID}`);
    console.log(`Player id : ${firstPlayer}`);

    games[gameID] = {
      X: firstPlayer,
      O: secondPlayer,
      board: Array(9).fill(null),
      turn: firstPlayer,
    };
    io.to(firstPlayer).emit("message", {
      char: "X",
      gameID: gameID,
      turn: games[gameID].turn,
    });
    io.to(socket.id).emit("message", {
      char: "O",
      gameID: gameID,
      turn: games[gameID].turn,
    });
    console.log(games);

    delete players[firstPlayer];
  }

  socket.on("move", ({ GameID, index }) => {
    console.log(`Game id from frontend is : ${GameID} and index is : ${index}`);

    try {
      if (games[GameID].turn != socket.id) {
        console.log(`Socket id : ${socket.id}`);

        console.log("Not your turn");
        console.log(games);

        return;
      } else {
        if (games[GameID]?.board[index] != null) {
          console.log("Box not empty");

          socket.emit("errorMessage", "Invalid Move");
        } else {
          console.log("Making the move");
          console.log(games);

          games[GameID].board[index] =
            games[GameID].X === socket.id ? "X" : "O";
          console.log(games);

          games[GameID].turn =
            games[GameID].turn === games[GameID].X
              ? games[GameID].O
              : games[GameID].X;
          io.to(games[GameID].X).emit("moveMade", {
            board: games[GameID].board,
            turn: games[GameID].turn,
          });
          io.to(games[GameID].O).emit("moveMade", {
            board: games[GameID].board,
            turn: games[GameID].turn,
          });
          let winner = null;
          winningCombinations.forEach((combination) => {
            const [a, b, c] = combination;
            if (
              games[GameID].board[a] &&
              games[GameID].board[a] === games[GameID].board[b] &&
              games[GameID].board[a] === games[GameID].board[c]
            ) {
              winner = games[GameID].board[a];
            }
          });

          if (winner) {
            io.to(games[GameID].X).emit("gameOver", {
              winner: winner === "X" ? "X" : "O",
            });
            io.to(games[GameID].O).emit("gameOver", {
              winner: winner === "X" ? "X" : "O",
            });
            return;
          }
        }
      }
    } catch (error) {
      console.log(`Error while making the move ${error}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
