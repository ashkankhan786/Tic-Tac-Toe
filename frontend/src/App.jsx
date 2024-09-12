import React from "react";
import { socket } from "./socket";

const App = () => {
  socket.on("connect", () => {
    console.log(`Server Connected`);
  });
  return <div></div>;
};

export default App;
