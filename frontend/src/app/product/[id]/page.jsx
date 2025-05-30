"use client";

import { use, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProduct } from "@/redux/productSlice";
import { loadCartFromStorage } from "@/redux/cartSlice";
import ProductDetail from "@/components/product/ProductDetail";

export default function ProductDetailPage({ params }) {
  const { id } = use(params);

  const dispatch = useAppDispatch();
  const { product, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
      dispatch(loadCartFromStorage());
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-xl">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 p-4 rounded-lg text-red-700">
          <p>Error loading product: {error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-xl">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} />
    </div>
  );
}
