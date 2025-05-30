"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { loadCartFromStorage } from "@/redux/cartSlice";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(loadCartFromStorage());
  }, [dispatch]);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="lg:flex lg:gap-6">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 lg:mb-0">
            <div className="border-b pb-2 mb-4 flex justify-between font-semibold">
              <span>Product</span>
              <span>Total</span>
            </div>

            {cartItems.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}

            <div className="mt-4 flex justify-between">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
