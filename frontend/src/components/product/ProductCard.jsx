"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/cartSlice";

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);

  // Check if product is already in cart
  const existingItem = cartItems.find((item) => item.productId === product._id);
  const currentQty = existingItem ? existingItem.qty : 0;

  // Check if adding more would exceed stock
  const isMaxStock = currentQty + quantity > product.stock;
  const isOutOfStock = product.stock <= 0;

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-contain absolute"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          <span
            className={`text-sm ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        {!isOutOfStock && (
          <div className="flex items-center mt-3">
            <div className="flex items-center border rounded mr-2">
              <button
                className="px-2 py-1 text-gray-600 disabled:text-gray-300"
                disabled={quantity <= 1}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-2">{quantity}</span>
              <button
                className="px-2 py-1 text-gray-600 disabled:text-gray-300"
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

            <button
              className="flex-1 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={isOutOfStock || isMaxStock}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
