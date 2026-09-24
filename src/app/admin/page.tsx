"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ShoppingBag,
  DollarSign,
  Package,
  Users,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  Search,
  Filter,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Order, Product, User } from "@/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // New product form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodOriginalPrice, setProdOriginalPrice] = useState("");
  const [prodUnit, setProdUnit] = useState("1 kg");
  const [prodCategory, setProdCategory] = useState("Groceries");
  const [prodImage, setProdImage] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "admin") {
        // Not authorized
        setLoadingData(false);
      } else {
        loadAdminData();
      }
    }
  }, [user, authLoading]);

  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [resOrders, resProducts] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products"),
      ]);

      if (resOrders.ok) {
        const dOrders = await resOrders.json();
        setOrders(dOrders.orders || []);
      }
      if (resProducts.ok) {
        const dProducts = await resProducts.json();
        setProducts(dProducts.products || []);
      }
    } catch {
      showToast("Error loading admin records", "error");
    } finally {
      setLoadingData(false);
    }
  };

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: Order["status"],
    paymentStatus?: Order["paymentStatus"]
  ) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
          paymentStatus: paymentStatus || (newStatus === "Delivered" ? "Verified" : undefined),
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: newStatus,
                  paymentStatus: paymentStatus || o.paymentStatus,
                }
              : o
          )
        );
        showToast(`Order #${orderId} status set to ${newStatus}`, "success");
      } else {
        showToast("Failed to update status", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodUnit || !prodImage) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setSavingProduct(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prodName,
          price: Number(prodPrice),
          originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
          unit: prodUnit,
          category: prodCategory,
          image: prodImage,
          description: prodDesc,
        }),
      });

      const data = await res.json();
      if (res.ok && data.product) {
        setProducts((prev) => [data.product, ...prev]);
        setShowAddProduct(false);
        setProdName("");
        setProdPrice("");
        setProdOriginalPrice("");
        setProdImage("");
        setProdDesc("");
        showToast("New grocery product added successfully!", "success");
      } else {
        showToast(data.error || "Failed to add product", "error");
      }
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast(`Product "${name}" deleted`, "info");
      } else {
        showToast("Failed to delete product", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  // If unauthorized
  if (!authLoading && (!user || user.role !== "admin")) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "#fee2e2",
              padding: "1.25rem",
              borderRadius: "50%",
              color: "#b91c1c",
              marginBottom: "1rem",
            }}
          >
            <ShieldAlert size={48} />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem" }}>
            Restricted Admin Area
          </h2>
          <p style={{ color: "#64748b", maxWidth: "480px", marginBottom: "1.5rem" }}>
            This dashboard is exclusively visible when signed in as an administrator. Please log in with the administrator account.
          </p>
          <Link href="/login" className="btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
            Sign In as Admin
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "2.5rem 0", background: "#f8fafc" }}>
        <div className="container">
          {/* Header */}
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldAlert size={28} color="#4338ca" />
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-dark)", margin: 0 }}>
                  Admin Operations Dashboard
                </h1>
              </div>
              <p style={{ color: "#64748b", marginTop: "0.25rem" }}>
                Manage customer grocery orders, verify bKash payments (+8801975300759), and update inventory.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setActiveTab("orders")}
                className={`filter-chip ${activeTab === "orders" ? "active" : ""}`}
                style={{ padding: "0.6rem 1.25rem" }}
              >
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`filter-chip ${activeTab === "products" ? "active" : ""}`}
                style={{ padding: "0.6rem 1.25rem" }}
              >
                Products ({products.length})
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2.5rem",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Total Revenue</span>
              <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--primary)", marginTop: "0.25rem" }}>
                ৳{totalRevenue}
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Total Orders</span>
              <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-dark)", marginTop: "0.25rem" }}>
                {orders.length}
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Pending Verification</span>
              <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#d97706", marginTop: "0.25rem" }}>
                {pendingOrders}
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Active Products</span>
              <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#2563eb", marginTop: "0.25rem" }}>
                {products.length}
              </div>
            </div>
          </div>

          {/* TAB 1: ORDERS */}
          {activeTab === "orders" && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "1.75rem",
                border: "1px solid #e2e8f0",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem" }}>
                Customer Orders & bKash Verification
              </h3>

              {orders.length === 0 ? (
                <p style={{ color: "#64748b", padding: "2rem", textAlign: "center" }}>
                  No customer orders received yet.
                </p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                        <th style={{ padding: "0.75rem" }}>Order ID</th>
                        <th style={{ padding: "0.75rem" }}>Customer</th>
                        <th style={{ padding: "0.75rem" }}>bKash Payment Details</th>
                        <th style={{ padding: "0.75rem" }}>Items</th>
                        <th style={{ padding: "0.75rem" }}>Total (৳)</th>
                        <th style={{ padding: "0.75rem" }}>Current Status</th>
                        <th style={{ padding: "0.75rem" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "0.75rem", fontWeight: 700, color: "var(--primary)" }}>
                            {o.id}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <div style={{ fontWeight: 600 }}>{o.customerName}</div>
                            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{o.customerPhone}</div>
                            <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{o.deliveryAddress}, {o.city}</div>
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <div style={{ color: "var(--bkash-pink)", fontWeight: 700, fontSize: "0.85rem" }}>
                              Sender: {o.bkashNumber}
                            </div>
                            <div style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>
                              TrxID: {o.bkashTrxId}
                            </div>
                            <span className={`badge ${o.paymentStatus === "Verified" ? "badge-verified" : "badge-pending"}`} style={{ fontSize: "0.68rem" }}>
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem", fontSize: "0.85rem" }}>
                            {o.items.map((item, idx) => (
                              <div key={idx}>
                                {item.name} × {item.quantity}
                              </div>
                            ))}
                          </td>
                          <td style={{ padding: "0.75rem", fontWeight: 800, fontSize: "1rem", color: "var(--primary)" }}>
                            ৳{o.totalAmount}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <span className={`badge badge-${o.status.toLowerCase().replace(/\s+/g, "")}`}>
                              {o.status}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <select
                              value={o.status}
                              onChange={(e) =>
                                handleUpdateStatus(o.id, e.target.value as Order["status"])
                              }
                              className="form-select"
                              style={{ padding: "0.35rem 0.5rem", fontSize: "0.82rem" }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Payment Verified">Payment Verified</option>
                              <option value="Processing">Processing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === "products" && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "1.75rem",
                border: "1px solid #e2e8f0",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                  Grocery Products Catalog ({products.length})
                </h3>
                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="btn-primary"
                >
                  <Plus size={16} />
                  <span>{showAddProduct ? "Close Form" : "Add New Grocery"}</span>
                </button>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <form
                  onSubmit={handleAddProduct}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    marginBottom: "2rem",
                  }}
                >
                  <h4 style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--primary)" }}>
                    Add New Product
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        placeholder="e.g. Fresh Red Onions"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Price (৳) *</label>
                      <input
                        type="number"
                        required
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        placeholder="e.g. 65"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Original Price (৳)</label>
                      <input
                        type="number"
                        value={prodOriginalPrice}
                        onChange={(e) => setProdOriginalPrice(e.target.value)}
                        placeholder="e.g. 80"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Unit *</label>
                      <input
                        type="text"
                        required
                        value={prodUnit}
                        onChange={(e) => setProdUnit(e.target.value)}
                        placeholder="e.g. 1 kg, 500 gm, 12 pcs"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value)}
                        className="form-select"
                      >
                        <option value="Groceries">Groceries</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Oil & Ghee">Oil & Ghee</option>
                        <option value="Meat & Fish">Meat & Fish</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Image URL *</label>
                      <input
                        type="url"
                        required
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                        placeholder="https://chaldn.com/..."
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      placeholder="Brief details about freshness and source..."
                      className="form-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="btn-primary"
                    style={{ padding: "0.65rem 1.5rem" }}
                  >
                    {savingProduct ? "Saving..." : "Create Product"}
                  </button>
                </form>
              )}

              {/* Products Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                      <th style={{ padding: "0.75rem" }}>Product</th>
                      <th style={{ padding: "0.75rem" }}>Category</th>
                      <th style={{ padding: "0.75rem" }}>Unit</th>
                      <th style={{ padding: "0.75rem" }}>Price</th>
                      <th style={{ padding: "0.75rem" }}>Stock Status</th>
                      <th style={{ padding: "0.75rem" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "0.75rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "4px" }}
                            />
                            <div>
                              <div style={{ fontWeight: 600 }}>{p.name}</div>
                              <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{p.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem" }}>{p.category}</td>
                        <td style={{ padding: "0.75rem" }}>{p.unit}</td>
                        <td style={{ padding: "0.75rem", fontWeight: 700, color: "var(--primary)" }}>
                          ৳{p.price}
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <span className="badge badge-verified">In Stock</span>
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            style={{ color: "#ef4444", padding: "0.4rem" }}
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
