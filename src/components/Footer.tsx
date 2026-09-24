"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        {/* Top bar */}
        <div className="footer-top">
          <div className="footer-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Chaldal" />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "1rem", fontWeight: 600, color: "#ffffff" }}>
              Any Suggestion or Query?
            </span>
            <a
              href="tel:+8801975300759"
              className="btn-outline"
              style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.3)" }}
            >
              <Phone size={16} />
              <span>Call: +8801975300759</span>
            </a>
          </div>
        </div>

        {/* 3 Columns */}
        <div className="footer-columns">
          <div className="footer-col">
            <h5>Services</h5>
            <ul>
              <li>1-Hour Free Delivery</li>
              <li>24/7 Support Helpline</li>
              <li>Fast Delivery Request</li>
              <li>Customer Reward Points</li>
              <li>Corporate Grocery Supply</li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>About Us</h5>
            <ul>
              <li>Our Story & Mission</li>
              <li>Quality & Safety Guarantee</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Careers at Chaldal</li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Payment Methods</h5>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.75rem" }}>
              Accepted Payment Method:
            </p>
            <div className="payment-methods-list">
              <div className="payment-icon-box bkash-highlight-box" title="bKash (Official)">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/bkash.png" alt="bKash" />
              </div>
              <div className="payment-icon-box" title="Nagad">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/nagad.png" alt="Nagad" />
              </div>
              <div className="payment-icon-box" title="Mastercard">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/mastercard.png" alt="Mastercard" />
              </div>
              <div className="payment-icon-box" title="iPay">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/ipay.png" alt="iPay" />
              </div>
            </div>
            <div style={{ marginTop: "0.85rem", fontSize: "0.82rem", color: "#cbd5e1" }}>
              Official bKash Merchant: <strong style={{ color: "var(--bkash-pink)" }}>+8801975300759</strong>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>

          <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.88rem", color: "#94a3b8" }}>
            <span>Terms & Conditions</span>
            <span>•</span>
            <span>Refund Policy</span>
            <span>•</span>
            <span>Delivery Policy</span>
          </div>

          <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
            Copyright &copy; Anowaarr 2026. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
