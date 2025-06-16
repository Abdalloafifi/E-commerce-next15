"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/cartSlice";

const ProductDetail = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);

  // Check if product is already in cart
  const existingItem = cartItems.find((item) => item.productId === product._id);
  const currentQty = existingItem ? existingItem.qty : 0;

  // Reset quantity if product changes
  useEffect(() => {
    setQuantity(1);
  }, [product._id]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        qty: existingItem ? existingItem.qty + quantity : quantity,
        stock: product.stock,
      })
    );
    setQuantity(1);
  };

  if (!product) {
    return <div className="text-center py-12">Loading product details...</div>;
  }

  const isOutOfStock = product.stock <= 0;
  const isMaxStock = currentQty + quantity > product.stock;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2">
          <div className="relative h-80 w-full">

            {Array.isArray(product.imageUrl) &&
              product.imageUrl
                .filter((url) => typeof url === "string" && url.trim() !== "")
                .map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    alt={product.name}
                    fill
                    className="object-contain absolute"
                    loading="lazy"
                  />
                ))}

          </div>
        </div>

        <div className="md:w-1/2 p-6">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl font-semibold mb-4">
            ${product.price.toFixed(2)}
          </p>

          <div
            className={`mb-4 inline-block px-3 py-1 rounded ${product.stock > 10
                ? "bg-green-100 text-green-800"
                : product.stock > 0
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
          >
            {product.stock > 10
              ? `In Stock (${product.stock})`
              : product.stock > 0
                ? `Low Stock (${product.stock})`
                : "Out of Stock"}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {!isOutOfStock && (
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Quantity:</label>
              <div className="flex items-center space-x-2">
                <button
                  className="px-3 cursor-pointer bg-gray-200 rounded-full hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className="w-12 text-center border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={quantity}
                  disabled
                />
                <button
                  className="px-3 cursor-pointer bg-gray-200 rounded-full hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm"
                  disabled={quantity >= product.stock - currentQty}
                  onClick={() =>
                    setQuantity(
                      Math.min(product.stock - currentQty, quantity + 1)
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={isOutOfStock || isMaxStock}
            onClick={handleAddToCart}
          >
            {isOutOfStock
              ? "Out of Stock"
              : isMaxStock
                ? "Max Stock Reached"
                : "Add to Cart"}
          </button>

          {existingItem && (
            <p className="text-sm text-gray-600 mt-2">
              You already have {existingItem.qty} of this item in your cart.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
