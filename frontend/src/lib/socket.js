"use client";

import io from "socket.io-client";

let socket;

export const initializeSocket = () => {
  const SOCKET_URL = "http://localhost:3003";

  if (!socket) {
    socket = io(SOCKET_URL);
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};
