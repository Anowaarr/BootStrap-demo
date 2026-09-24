"use client";

import React from "react";
import { Plus, Zap, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, buyNow } = useCart();
  const { showToast } = useToast();

  const handleAdd = () => {
    addToCart(product, 1);
    showToast(`Added ${product.name} to cart!`, "success");
  };

  const handleBuy = () => {
    buyNow(product);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="product-image-box">
        {hasDiscount && (
          <span className="product-discount-badge">{discountPercent}% OFF</span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>

      <div className="product-card-body">
        <span className="product-unit">{product.unit}</span>
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <div className="product-price-row">
          <span className="product-price">৳{product.price}</span>
          {hasDiscount && (
            <span className="product-original-price">৳{product.originalPrice}</span>
          )}
        </div>

        <div className="product-actions">
          <button onClick={handleAdd} className="btn-card-cart" type="button">
            <ShoppingCart size={15} />
            <span>Add</span>
          </button>
          <button onClick={handleBuy} className="btn-card-buy" type="button">
            <Zap size={15} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
