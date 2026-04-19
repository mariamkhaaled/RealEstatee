import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export default socket;
