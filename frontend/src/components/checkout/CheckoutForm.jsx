"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { checkoutCart } from "@/redux/cartSlice";

const CheckoutForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cartItems, loading } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push("/auth?redirect=/checkout");
      return;
    }

    // Transform cartItems to the format expected by the backend
    const cartItemsForCheckout = cartItems.map((item) => ({
      productId: item.productId,
      qty: item.qty,
    }));

    const result = dispatch(checkoutCart(cartItemsForCheckout));

    if (checkoutCart.fulfilled.match(result)) {
      // Redirect to success page or order confirmation
      router.push("/");
    }
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <form onSubmit={handleSubmit} className="lg:flex lg:gap-8">
      <div className="lg:w-2/3">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Shipping Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="w-full border rounded px-3 py-2"
                required
                value={shippingDetails.fullName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                className="w-full border rounded px-3 py-2"
                required
                value={shippingDetails.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                className="w-full border rounded px-3 py-2"
                required
                value={shippingDetails.address}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                className="w-full border rounded px-3 py-2"
                required
                value={shippingDetails.city}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  className="w-full border rounded px-3 py-2"
                  required
                  value={shippingDetails.state}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  className="w-full border rounded px-3 py-2"
                  required
                  value={shippingDetails.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          <p className="text-gray-600">
            Demo mode - no actual payment processing.
          </p>
        </div>
      </div>

      <div className="lg:w-1/3">
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                </div>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}

            <div className="flex justify-between pt-2">
              <span>Subtotal</span>
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
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={loading || cartItems.length === 0}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
