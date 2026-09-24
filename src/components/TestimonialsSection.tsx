import React from "react";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Food Blogger & Home Chef",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      comment:
        "The groceries were delivered in less than 45 minutes! The Chinigura rice and fresh tomatoes were top notch. Paying through bKash was seamless and hassle-free.",
    },
    {
      name: "David Miller",
      role: "Verified Customer & Local Guide",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      comment:
        "Consistent freshness every single time. Their customer care chatbot was super helpful when I needed to update my delivery address. Highly recommend to everyone in Dhaka!",
    },
  ];

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span
            style={{
              color: "var(--secondary-hover)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "0.85rem",
            }}
          >
            Reviews & Ratings
          </span>
          <h2 className="brand-title" style={{ padding: "0.5rem 0 0", fontSize: "2.25rem", color: "#1e293b" }}>
            What Our Customers Say
          </h2>
          <div
            style={{
              width: "60px",
              height: "3px",
              background: "var(--secondary)",
              margin: "0.75rem auto 1rem",
              borderRadius: "2px",
            }}
          />
          <p style={{ color: "#64748b", maxWidth: "600px", margin: "0 auto", fontSize: "0.95rem" }}>
            Discover why thousands of families trust us daily for their fresh groceries and everyday home supplies.
          </p>
        </div>

        <div className="testimonials-grid">
          {reviews.map((rev, idx) => (
            <div key={idx} className="testimonial-card">
              <Quote
                size={36}
                color="var(--secondary)"
                opacity={0.3}
                style={{ position: "absolute", top: "1.25rem", right: "1.25rem" }}
              />

              <div className="testimonial-stars">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>

              <p className="testimonial-text">&ldquo;{rev.comment}&rdquo;</p>

              <div className="testimonial-author">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={rev.avatar} alt={rev.name} className="testimonial-avatar" />
                <div>
                  <h4 className="author-name">{rev.name}</h4>
                  <small className="author-role">{rev.role}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
