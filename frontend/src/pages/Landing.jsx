import React, { useState } from "react";
import Play from "../components/PlayButton/Play";

const Landing = ({ play, setPlay, onConnect }) => {
  return (
    <>
      {play == false ? (
        <Play setPlay={setPlay} onConnect={onConnect} />
      ) : (
        <div className="text-white bg-slate-600 font-semibold p-3 rounded">
          <h2>Waiting for other player to join...</h2>
        </div>
      )}
    </>
  );
};

export default Landing;
