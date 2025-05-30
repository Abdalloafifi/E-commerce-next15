"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

const CartSummary = () => {
  const router = useRouter();
  const { cartItems } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/auth?redirect=/checkout");
      return;
    }

    router.push("/checkout");
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>
            Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
            items)
          </span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <div className="border-t pt-2 mt-2 font-bold flex justify-between">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        disabled={cartItems.length === 0}
        onClick={handleCheckout}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
