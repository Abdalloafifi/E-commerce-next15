"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL =  "http://localhost:3003/api";

// Checkout cart
export const checkoutCart = createAsyncThunk(
  "cart/checkout",
  async (cartItems, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const response = await axios.post(
        `${API_URL}/cart/checkout`,
        { cartItems },
        config
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find(
        (x) => x.productId === item.productId
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.productId === existItem.productId ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      // Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      toast.success(`${item.name} added to cart`);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((x) => x.productId !== id);

      // Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));

      toast.info("Item removed from cart");
    },
    updateQuantity: (state, action) => {
      const { productId, qty } = action.payload;
      const item = state.cartItems.find((x) => x.productId === productId);

      if (item) {
        item.qty = qty;
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
    loadCartFromStorage: (state) => {
      const cartItems = localStorage.getItem("cartItems");
      if (cartItems) {
        state.cartItems = JSON.parse(cartItems);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkoutCart.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(checkoutCart.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.cartItems = [];
        localStorage.removeItem("cartItems");
        toast.success("Order placed successfully");
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Checkout failed";
        toast.error(state.error);
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  loadCartFromStorage,
} = cartSlice.actions;

export default cartSlice.reducer;
