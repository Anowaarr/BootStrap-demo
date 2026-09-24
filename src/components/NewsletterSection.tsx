"use client";

import React, { useState } from "react";
import { Mail, Send, Check } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please provide a valid email address", "error");
      return;
    }

    setSubscribed(true);
    showToast("Subscribed! You will receive our weekly grocery deals and offers.", "success");
    setEmail("");
  };

  return (
    <div className="container">
      <div className="newsletter-card">
        <div>
          <div className="newsletter-tag">Join Our Club</div>
          <h3 style={{ fontSize: "1.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Subscribe to Our Newsletter
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.5 }}>
            Get exclusive weekend discounts, bKash cashback alerts, and fresh product arrivals delivered straight to your inbox.
          </p>
        </div>

        <div>
          {subscribed ? (
            <div
              style={{
                background: "rgba(22, 163, 74, 0.2)",
                border: "1px solid #16a34a",
                borderRadius: "8px",
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#4ade80",
              }}
            >
              <Check size={20} />
              <span>Thank you for subscribing to Chaldal updates!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="newsletter-input"
                aria-label="Email address for newsletter"
              />
              <button type="submit" className="btn-secondary">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
