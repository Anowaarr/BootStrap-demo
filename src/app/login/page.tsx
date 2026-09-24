"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, User, Phone, MapPin, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, user } = useAuth();
  const { showToast } = useToast();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (user) {
    if (user.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/profile");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        const res = await register({
          name,
          email,
          password,
          phone,
          address,
          city,
        });

        if (res.success) {
          showToast("Account created successfully! Welcome to Chaldal.", "success");
          router.push("/profile");
        } else {
          showToast(res.error || "Registration failed", "error");
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          showToast("Signed in successfully!", "success");
          if (email.toLowerCase().includes("admin")) {
            router.push("/admin");
          } else {
            router.push("/");
          }
        } else {
          showToast(res.error || "Invalid credentials", "error");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role: "admin" | "customer") => {
    setIsRegister(false);
    if (role === "admin") {
      setEmail("admin@chaldal.com");
      setPassword("admin123");
      showToast("Filled demo admin credentials", "info");
    } else {
      setEmail("customer@chaldal.com");
      setPassword("customer123");
      showToast("Filled demo customer credentials", "info");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <Link href="/" style={{ display: "inline-block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="Chaldal" style={{ height: "64px" }} />
        </Link>
      </div>

      <div
        style={{
          background: "#ffffff",
          padding: "2.25rem",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
          width: "100%",
          maxWidth: "460px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-dark)", margin: 0 }}>
            {isRegister ? "Create Account" : "Sign In to Chaldal"}
          </h2>
          <Link href="/" style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.85rem" }}>
            <ArrowLeft size={16} />
            <span>Store</span>
          </Link>
        </div>

        {/* Demo Fast Login Pills */}
        <div
          style={{
            background: "#f1f5f9",
            padding: "0.75rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            fontSize: "0.82rem",
          }}
        >
          <span style={{ color: "#475569", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
            Quick Demo Credentials:
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => handleQuickFill("admin")}
              className="btn-outline"
              style={{
                fontSize: "0.75rem",
                padding: "0.25rem 0.6rem",
                background: "#ffffff",
                borderColor: "#cbd5e1",
              }}
            >
              <ShieldCheck size={14} color="#4338ca" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("customer")}
              className="btn-outline"
              style={{
                fontSize: "0.75rem",
                padding: "0.25rem 0.6rem",
                background: "#ffffff",
                borderColor: "#cbd5e1",
              }}
            >
              <User size={14} color="var(--primary)" />
              <span>Customer Demo</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahim Chowdhury"
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

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.5rem" }}>
                <div className="form-group">
                  <label className="form-label">Delivery Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House, Road, Area"
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
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "0.5rem",
              fontSize: "1rem",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem", borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
          {isRegister ? (
            <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0 }}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                style={{ color: "var(--primary)", fontWeight: 700 }}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0 }}>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                style={{ color: "var(--primary)", fontWeight: 700 }}
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
