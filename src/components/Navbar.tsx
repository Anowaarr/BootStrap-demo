"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  MapPin,
  User as UserIcon,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  PhoneCall,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  selectedCity?: string;
  onCityChange?: (city: string) => void;
}

export default function Navbar({
  searchQuery = "",
  onSearchChange,
  selectedCity = "Dhaka",
  onCityChange,
}: NavbarProps) {
  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link href="/" className="nav-logo-link">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="Chaldal" />
        </Link>

        {/* Middle: City Selector & Search */}
        <div className="nav-middle">
          <div className="city-select-wrapper">
            <select
              value={selectedCity}
              onChange={(e) => onCityChange && onCityChange(e.target.value)}
              className="city-select"
              aria-label="Select delivery city"
            >
              <option value="Dhaka">Dhaka</option>
              <option value="Chattogram">Chattogram</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Noakhali">Noakhali</option>
              <option value="Sundarban">Sundarban</option>
              <option value="Others">Others</option>
            </select>
            <MapPin size={16} className="city-select-icon" />
          </div>

          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search items (e.g. rice, eggs, potato)..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="search-input"
              aria-label="Search groceries"
            />
          </div>
        </div>

        {/* Right actions: Cart, Auth, Admin */}
        <div className="nav-actions">
          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="nav-cart-btn"
            aria-label={`Shopping cart with ${itemCount} items`}
          >
            <ShoppingBag size={20} />
            <span className="cart-badge">{itemCount}</span>
          </button>

          {/* Admin Dashboard button if role is admin */}
          {user && user.role === "admin" && (
            <Link href="/admin" className="btn-admin">
              <ShieldAlert size={16} />
              <span>Admin Panel</span>
            </Link>
          )}

          {/* User state */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link href="/profile" className="btn-outline">
                <UserIcon size={16} />
                <span>{user.name.split(" ")[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn-outline"
                title="Logout"
                style={{ padding: "0.55rem 0.75rem" }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-dark">
              Login
            </Link>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer open">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>City:</span>
            <select
              value={selectedCity}
              onChange={(e) => onCityChange && onCityChange(e.target.value)}
              className="city-select"
              style={{ flex: 1 }}
            >
              <option value="Dhaka">Dhaka</option>
              <option value="Chattogram">Chattogram</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Noakhali">Noakhali</option>
              <option value="Sundarban">Sundarban</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="btn-outline"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserIcon size={16} />
                  My Profile
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="btn-admin"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-outline"
                  style={{ padding: "0.55rem 0.75rem" }}
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="btn-dark"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
