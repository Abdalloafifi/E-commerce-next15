"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { loadCartFromStorage } from "@/redux/cartSlice";
import { loadTokenFromStorage } from "@/redux/authSlice";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadCartFromStorage());
    dispatch(loadTokenFromStorage());
  }, [dispatch]);

  useEffect(() => {
    // If cart is empty, redirect to cart page
    if (!loading && cartItems.length === 0) {
      router.push("/cart");
    }

    // If not authenticated, redirect to login
    if (!loading && !isAuthenticated) {
      router.push("/auth?redirect=/checkout");
    }
  }, [cartItems, isAuthenticated, loading, router]);

  if (loading || cartItems.length === 0 || !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
