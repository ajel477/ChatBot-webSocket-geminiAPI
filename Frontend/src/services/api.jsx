import axios from "axios";

const api = axios.create({
  baseURL: "https://chatbot-websocket-geminiapi.onrender.com",
  withCredentials: true,
});

export default api;