import React, { useEffect } from "react";
import { initializeSocket } from "./socket";

const App = () => {
  const URL = import.meta.env.VITE_APP_URL;
  useEffect(() => {
    // Initialize the socket connection using the URL from .env
    const socket = initializeSocket(URL);

    socket.on("connect", () => {
      console.log(`Server Connected`);
    });

    return () => {
      socket.disconnect();
    };
  }, [URL]);

  console.log("URL is: " + URL);
  return (
    <div>
      <h1>Helloooo</h1>
    </div>
  );
};

export default App;
