"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login } from "@/redux/authSlice";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">{error}</div>
      )}

      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="block mb-1 font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 rounded font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 w-full"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
