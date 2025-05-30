"use client";

import { Provider } from "react-redux";
import { useRef } from "react";
import { store } from "@/redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ReduxProvider({ children }) {
  const storeRef = useRef(store);

  return (
    <Provider store={storeRef.current}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </Provider>
  );
}
