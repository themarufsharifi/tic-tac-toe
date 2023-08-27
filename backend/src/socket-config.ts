import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { Application } from "express";
import { move } from "./controllers/move";

export let socket: Socket;

export const initializeSocket = (server: Application) => {
  const httpServer = createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (_socket) => {
    console.log("A user connected");
    socket = _socket;
    move(_socket);
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return httpServer;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket.io not initialized");
  }
  return socket;
};
