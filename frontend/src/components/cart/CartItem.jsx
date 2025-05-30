"use client";

import Image from "next/image";
import { useAppDispatch } from "@/redux/hooks";
import { updateQuantity, removeFromCart } from "@/redux/cartSlice";

const CartItem = ({ item }) => {
  const dispatch = useAppDispatch();

  const handleQuantityChange = (newQty) => {
    if (newQty > 0 && newQty <= item.stock) {
      dispatch(updateQuantity({ productId: item.productId, qty: newQty }));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.productId));
  };

  return (
    <div className="flex items-center py-4 border-b">
      <div className="relative h-20 w-20 flex-shrink-0">
        <Image
          src={item.imageUrl || "/api/placeholder/80/80"}
          alt={item.name}
          fill
          className="object-cover rounded"
        />
      </div>

      <div className="ml-4 flex-grow">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-gray-600">${item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center">
        <div className="border rounded flex items-center mr-4">
          <button
            className="px-3 py-1 text-gray-600"
            onClick={() => handleQuantityChange(item.qty - 1)}
            disabled={item.qty <= 1}
          >
            -
          </button>
          <span className="px-3">{item.qty}</span>
          <button
            className="px-3 py-1 text-gray-600"
            onClick={() => handleQuantityChange(item.qty + 1)}
            disabled={item.qty >= item.stock}
          >
            +
          </button>
        </div>

        <div className="text-right">
          <div className="font-semibold mb-1">
            ${(item.price * item.qty).toFixed(2)}
          </div>
          <button
            className="text-sm text-red-600 hover:text-red-800"
            onClick={handleRemove}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
