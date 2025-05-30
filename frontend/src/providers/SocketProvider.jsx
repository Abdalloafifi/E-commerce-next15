"use client";

import { createContext, useContext, useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { updateProduct } from "@/redux/productSlice";
import { initializeSocket } from "@/lib/socket";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize socket connection
    const socket = initializeSocket();

    // Listen for product updates
    socket.on("products", (data) => {
      if (data.action === "update" && data.product) {
        dispatch(updateProduct(data.product));
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off("products");
    };
  }, [dispatch]);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);
