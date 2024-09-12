require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);

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
    games[gameID] = {
      X: firstPlayer,
      O: secondPlayer,
      board: Array(9).fill(null),
      turn: firstPlayer,
    };
    io.to(firstPlayer).emit("message", "X");
    io.to(socket.id).emit("message", "O");
    delete players[firstPlayer];
  }

  socket.on("move", ({ gameID, index }) => {
    if (games[gameID].turn != socket.id) return;
    else {
      if (games[gameID].board[index] != null) {
        socket.emit("errorMessage", "Invalid Move");
      } else {
        games[gameID].board[index] =
          games[gameID]["X"] === socket.id ? "X" : "O";
        games[gameID].turn =
          games[gameID].turn === games[gameID]["X"]
            ? games[gameID]["O"]
            : games[gameID]["X"];
        io.to(games[gameID]["X"]).emit("moveMade", {
          board: games[gameID].board,
          turn: games[gameID].turn,
        });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
