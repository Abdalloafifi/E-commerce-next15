"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/authSlice";
import { useEffect } from "react";
import { loadTokenFromStorage, getUserProfile } from "@/redux/authSlice";
import { loadCartFromStorage } from "@/redux/cartSlice";

export default function Header() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { cartItems } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(loadTokenFromStorage());
    dispatch(loadCartFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserProfile());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Shop
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className={`hover:text-blue-600 ${
                pathname === "/" ? "text-blue-600 font-medium" : ""
              }`}
            >
              Products
            </Link>

            <Link
              href="/cart"
              className={`relative hover:text-blue-600 ${
                pathname === "/cart" ? "text-blue-600 font-medium" : ""
              }`}
            >
              Cart
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">{user?.name || "User"}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className={`hover:text-blue-600 ${
                  pathname === "/auth" ? "text-blue-600 font-medium" : ""
                }`}
              >
                Login / Register
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
