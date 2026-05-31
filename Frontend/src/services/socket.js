import { io } from "socket.io-client";

const socket = io("https://chatbot-websocket-geminiapi.onrender.com", {
  withCredentials: true,
});

export default socket;