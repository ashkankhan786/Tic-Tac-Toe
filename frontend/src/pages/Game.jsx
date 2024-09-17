import React from "react";
import Square from "../components/Square/Square";

const Game = ({ board, onSquareClick, value }) => {
  return (
    <div>
      <h2 className="text-center mb-5 font-bold text-cyan-200">
        You are playing as {value}
      </h2>
      <div className="grid grid-cols-3">
        {board.map((square, index) => (
          <Square
            key={index}
            value={square}
            onClick={() => onSquareClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Game;
