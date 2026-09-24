"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  Package,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Check,
  LogOut,
  ArrowLeft,
  Clock,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Order } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCity(user.city || "Dhaka");
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {
      showToast("Failed to load order history", "error");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address, city }),
      });
      if (res.ok) {
        await refreshUser();
        setIsEditing(false);
        showToast("Profile details updated successfully!", "success");
      } else {
        showToast("Failed to update profile", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Loading account profile...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "2.5rem 0", background: "#f8fafc" }}>
        <div className="container">
          {/* Top header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-dark)", margin: 0 }}>
                My Customer Account
              </h1>
              <p style={{ color: "#64748b", marginTop: "0.25rem" }}>
                Manage your personal info and track your grocery deliveries.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="/" className="btn-outline">
                <ShoppingBag size={16} />
                <span>Shop More</span>
              </Link>
              <button onClick={handleLogout} className="btn-outline" style={{ color: "#ef4444" }}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem",
            }}
          >
            {/* Left Card: Customer Profile Details */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "var(--shadow-md)",
                border: "1px solid var(--border-color)",
                height: "fit-content",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <User size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>
                      {user.name}
                    </h3>
                    <span className="badge badge-verified" style={{ fontSize: "0.7rem" }}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-outline"
                  style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                >
                  <Edit2 size={14} />
                  <span>{isEditing ? "Cancel" : "Edit"}</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Delivery Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House, Road, Sector"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
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

                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary"
                    style={{ width: "100%", marginTop: "0.5rem" }}
                  >
                    <Check size={16} />
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </form>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#475569" }}>
                    <Mail size={18} color="var(--primary)" />
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block" }}>Email</span>
                      <span style={{ fontWeight: 600 }}>{user.email}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#475569" }}>
                    <Phone size={18} color="var(--primary)" />
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block" }}>Contact Phone</span>
                      <span style={{ fontWeight: 600 }}>{user.phone || "Not specified"}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#475569" }}>
                    <MapPin size={18} color="var(--primary)" />
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block" }}>Saved Address</span>
                      <span style={{ fontWeight: 600 }}>
                        {user.address ? `${user.address}, ${user.city}` : "No address saved"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Card: Order History */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "var(--shadow-md)",
                border: "1px solid var(--border-color)",
                gridColumn: "span 2",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <Package size={22} color="var(--primary)" />
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                    My Orders ({orders.length})
                  </h3>
                </div>
              </div>

              {loadingOrders ? (
                <p style={{ color: "#64748b" }}>Loading orders...</p>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#64748b" }}>
                  <Package size={48} opacity={0.3} style={{ margin: "0 auto 1rem" }} />
                  <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>No orders placed yet</p>
                  <p style={{ fontSize: "0.9rem" }}>Browse fresh groceries and place your first order!</p>
                  <Link href="/" className="btn-primary" style={{ marginTop: "1rem" }}>
                    Explore Store
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "1.25rem",
                        background: "#f8fafc",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "0.75rem",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--primary)" }}>
                            Order #{order.id}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }}>
                            <Clock size={13} />
                            <span>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span className={`badge badge-${order.status.toLowerCase().replace(/\s+/g, "")}`}>
                            {order.status}
                          </span>
                          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-dark)" }}>
                            ৳{order.totalAmount}
                          </span>
                        </div>
                      </div>

                      {/* bKash Payment Details */}
                      <div
                        style={{
                          background: "#fff0f6",
                          border: "1px solid rgba(226, 19, 110, 0.2)",
                          borderRadius: "8px",
                          padding: "0.5rem 0.75rem",
                          fontSize: "0.82rem",
                          marginBottom: "0.85rem",
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        <div>
                          <span style={{ color: "var(--bkash-pink)", fontWeight: 700 }}>Payment: </span>
                          <span>bKash (+8801975300759)</span>
                        </div>
                        <div>
                          <span style={{ color: "#64748b" }}>Sender: </span>
                          <strong>{order.bkashNumber}</strong>
                        </div>
                        <div>
                          <span style={{ color: "#64748b" }}>TrxID: </span>
                          <code style={{ fontWeight: 700, color: "var(--bkash-pink)" }}>{order.bkashTrxId}</code>
                        </div>
                      </div>

                      {/* Items list */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              fontSize: "0.88rem",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "4px" }}
                              />
                              <span>
                                {item.name} × <strong>{item.quantity}</strong>
                              </span>
                            </div>
                            <span style={{ fontWeight: 600 }}>৳{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginTop: "0.75rem", fontSize: "0.82rem", color: "#64748b", borderTop: "1px dashed #cbd5e1", paddingTop: "0.5rem" }}>
                        Delivery Destination: {order.deliveryAddress}, {order.city}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
