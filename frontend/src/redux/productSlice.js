"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3003/api";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch single product
export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
  },
  reducers: {
    updateProductStock: (state, action) => {
      const { id, stock } = action.payload;
      const productIndex = state.products.findIndex((p) => p._id === id);
      if (productIndex !== -1) {
        state.products[productIndex].stock = stock;
      }
      if (state.product && state.product._id === id) {
        state.product.stock = stock;
      }
    },
    updateProduct: (state, action) => {
      const updatedProduct = action.payload;
      const productIndex = state.products.findIndex(
        (p) => p._id === updatedProduct._id
      );
      if (productIndex !== -1) {
        state.products[productIndex] = updatedProduct;
      }
      if (state.product && state.product._id === updatedProduct._id) {
        state.product = updatedProduct;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch products";
      })
      // Fetch single product
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch product";
      });
  },
});

export const { updateProductStock, updateProduct } = productSlice.actions;

export default productSlice.reducer;
