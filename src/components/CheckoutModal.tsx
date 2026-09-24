"use client";

import React, { useState } from "react";
import { X, Copy, Check, CheckCircle2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Order } from "@/types";

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "Dhaka");
  const [bkashNumber, setBkashNumber] = useState(user?.phone || "");
  const [bkashTrxId, setBkashTrxId] = useState("");
  const [notes, setNotes] = useState("");

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const deliveryFee = totalAmount >= 500 || totalAmount === 0 ? 0 : 49;
  const finalTotal = totalAmount + deliveryFee;
  const bkashMerchantNumber = "+8801975300759";

  const handleCopy = () => {
    navigator.clipboard.writeText("+8801975300759");
    setCopied(true);
    showToast("Copied bKash Number: +8801975300759", "info");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !deliveryAddress) {
      showToast("Please fill in your name, phone, and delivery address", "error");
      return;
    }

    if (!bkashNumber || !bkashTrxId.trim()) {
      showToast("Please enter your bKash phone number and Transaction ID (TrxID)", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          deliveryAddress,
          city,
          items: orderItems,
          totalAmount: finalTotal,
          deliveryFee,
          bkashNumber,
          bkashTrxId: bkashTrxId.trim().toUpperCase(),
          notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        setConfirmedOrder(data.order);
        clearCart();
        showToast("Order placed successfully! bKash payment recorded.", "success");
      } else {
        showToast(data.error || "Failed to submit order", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(null);
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-dark)" }}>
            {confirmedOrder ? "Order Confirmed!" : "Checkout & bKash Payment"}
          </h3>
          <button onClick={handleClose} aria-label="Close modal" style={{ padding: "0.4rem" }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {confirmedOrder ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <CheckCircle2 size={64} color="#16a34a" style={{ margin: "0 auto 1rem" }} />
              <h4 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                Thank You for Your Order!
              </h4>
              <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                Your order <strong style={{ color: "var(--primary)" }}>#{confirmedOrder.id}</strong> has been received and is being verified with your bKash payment.
              </p>

              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "12px",
                  padding: "1.25rem",
                  textAlign: "left",
                  marginBottom: "1.5rem",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#64748b" }}>Order Total:</span>
                  <span style={{ fontWeight: 700, color: "var(--primary)" }}>৳{confirmedOrder.totalAmount}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#64748b" }}>Payment Method:</span>
                  <span style={{ fontWeight: 600, color: "var(--bkash-pink)" }}>bKash Only (+8801975300759)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#64748b" }}>Transaction ID:</span>
                  <span style={{ fontWeight: 700, fontFamily: "monospace" }}>{confirmedOrder.bkashTrxId}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#64748b" }}>Delivery Address:</span>
                  <span style={{ fontWeight: 500 }}>{confirmedOrder.deliveryAddress}, {confirmedOrder.city}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Status:</span>
                  <span className="badge badge-pending">{confirmedOrder.status}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button onClick={handleClose} className="btn-primary" style={{ padding: "0.65rem 1.5rem" }}>
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder}>
              {/* bKash Instructions Box */}
              <div className="bkash-payment-card">
                <div className="bkash-header-badge">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/bkash.png" alt="bKash" style={{ height: "28px" }} />
                    <strong style={{ color: "var(--bkash-pink)", fontSize: "1.05rem" }}>
                      bKash Payment Only
                    </strong>
                  </div>
                  <span style={{ background: "var(--bkash-pink)", color: "#fff", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                    OFFICIAL
                  </span>
                </div>

                <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.4, marginBottom: "0.5rem" }}>
                  Please send <strong>৳{finalTotal}</strong> via <strong>Send Money</strong> or <strong>Payment</strong> to the following number:
                </p>

                <div className="bkash-num-highlight">
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>bKash Account Number:</span>
                    <span className="bkash-number">{bkashMerchantNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="btn-outline"
                    style={{ padding: "0.35rem 0.75rem", fontSize: "0.82rem" }}
                  >
                    {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Delivery Details */}
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.85rem", color: "var(--text-dark)" }}>
                Delivery Details
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahim Chowdhury"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.75rem" }}>
                <div className="form-group">
                  <label className="form-label">Delivery Address *</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House, Road, Area"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-select"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Noakhali">Noakhali</option>
                    <option value="Sundarban">Sundarban</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              {/* bKash Payment Form fields */}
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "1rem 0 0.85rem", color: "var(--bkash-pink)" }}>
                bKash Transaction Verification
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className="form-group">
                  <label className="form-label">Sender bKash Number *</label>
                  <input
                    type="tel"
                    required
                    value={bkashNumber}
                    onChange={(e) => setBkashNumber(e.target.value)}
                    placeholder="Your bKash number"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">bKash Transaction ID (TrxID) *</label>
                  <input
                    type="text"
                    required
                    value={bkashTrxId}
                    onChange={(e) => setBkashTrxId(e.target.value)}
                    placeholder="e.g. 9K8B7X2Y1Z"
                    className="form-input"
                    style={{ textTransform: "uppercase", fontFamily: "monospace", letterSpacing: "0.05em" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Special Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, ring second bell"
                  className="form-input"
                />
              </div>

              {/* Summary row */}
              <div
                style={{
                  background: "#f1f5f9",
                  padding: "0.85rem 1rem",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "1rem 0 1.25rem",
                }}
              >
                <div>
                  <span style={{ fontSize: "0.85rem", color: "#64748b", display: "block" }}>Items: {items.length}</span>
                  <span style={{ fontWeight: 700, color: "var(--text-dark)" }}>Payable via bKash:</span>
                </div>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary)" }}>
                  ৳{finalTotal}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-bkash"
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? "Placing Order..." : `Confirm Order with bKash (৳${finalTotal})`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
