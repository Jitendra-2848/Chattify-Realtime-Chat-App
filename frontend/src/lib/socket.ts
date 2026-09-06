import { io, Socket } from "socket.io-client";
import { BASE_URL } from "./axios";

// Single shared socket instance across all components
export const socket: Socket = io(BASE_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 30000,
  autoConnect: true,
});
