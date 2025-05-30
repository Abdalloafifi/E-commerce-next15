"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex mb-6 border-b">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "login"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "register"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("register")}
        >
          Register
        </button>
      </div>

      {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}
