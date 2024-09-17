import React from "react";

const Play = ({ setPlay, onConnect }) => {
  const handleOnClick = () => {
    onConnect();
    setPlay(true);
  };
  return (
    <div className="h-8 w-fit">
      <button
        className={`bg-green-600 text-white font-bold text-2xl outline-offset-8 px-3 py-6 rounded-md hover:border-gray-800 hover:bg-green-900 transition-all ease-in-out`}
        onClick={handleOnClick}
      >
        Play Game
      </button>
    </div>
  );
};

export default Play;
