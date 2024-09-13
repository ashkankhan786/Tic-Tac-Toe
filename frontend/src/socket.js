import { io } from "socket.io-client";

export const initializeSocket = (url) => {
  return io(url);
};
