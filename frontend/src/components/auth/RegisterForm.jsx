"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { register } from "@/redux/authSlice";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear password match error when typing
    if (e.target.name === "password" || e.target.name === "password2") {
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      setPasswordError("Passwords do not match");
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    dispatch(register(userData));
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">{error}</div>
      )}

      <div className="mb-4">
        <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="reg-email"
          className="block mb-1 font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="reg-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="reg-password"
          className="block mb-1 font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="reg-password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          minLength="6"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password2"
          className="block mb-1 font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="password2"
          name="password2"
          value={formData.password2}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {passwordError && (
          <p className="mt-1 text-sm text-red-600">{passwordError}</p>
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 rounded font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 w-full"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
