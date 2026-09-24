"use client";

import React from "react";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    totalAmount,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const deliveryFee = totalAmount >= 500 || totalAmount === 0 ? 0 : 49;
  const finalTotal = totalAmount + deliveryFee;

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h3>Your Grocery Cart</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            style={{ padding: "0.4rem" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="drawer-content">
          {items.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                color: "#64748b",
                gap: "1rem",
              }}
            >
              <ShoppingBag size={56} opacity={0.3} />
              <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>Your cart is empty</p>
              <p style={{ fontSize: "0.9rem" }}>Add everyday groceries to see them here.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-primary"
                style={{ marginTop: "0.5rem" }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="cart-item-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="cart-item-img"
                />
                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.product.name}</h4>
                  <div className="cart-item-price">
                    ৳{item.product.price} × {item.quantity} = ৳{item.product.price * item.quantity}
                  </div>
                </div>

                <div className="cart-qty-controls">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="qty-btn"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="qty-btn"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  style={{ color: "#ef4444", padding: "0.35rem" }}
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.92rem", color: "#64748b" }}>
              <span>Subtotal</span>
              <span>৳{totalAmount}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.92rem", color: "#64748b" }}>
              <span>Delivery Fee {deliveryFee === 0 && <span style={{ color: "#16a34a", fontWeight: 700 }}>(FREE)</span>}</span>
              <span>৳{deliveryFee}</span>
            </div>
            <div className="subtotal-row">
              <span>Total Payable:</span>
              <span style={{ color: "var(--primary)", fontSize: "1.35rem" }}>৳{finalTotal}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn-bkash"
              type="button"
            >
              <span>Pay with bKash</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
