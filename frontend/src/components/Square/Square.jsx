import React from "react";

const Square = ({ value, onClick, winner }) => {
  return (
    <button
      className={`${
        winner ? "disabled" : ""
      } h-16 w-16 border-2 shadow-[0_4px_20px_rgba(255,255,255,0.5)] text-white`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Square;
