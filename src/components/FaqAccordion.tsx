"use client";

import React, { useState } from "react";
import { ChevronDown, MapPin, ClipboardList, HelpCircle } from "lucide-react";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      title: "Store Locations & Delivery Coverage",
      icon: <MapPin size={20} color="var(--primary)" />,
      content:
        "We deliver across major metropolitan areas including Dhaka (Banani, Gulshan, Dhanmondi, Uttara, Mirpur, Mohammadpur), Chattogram, Sylhet, Noakhali, and Sundarban region. Visit us or order online for direct delivery from our nearest fulfillment hub.",
    },
    {
      title: "How to Order & bKash Payment Guide",
      icon: <ClipboardList size={20} color="var(--primary)" />,
      content:
        "Simply browse items, click 'Add to Cart' or 'Buy Now'. During checkout, make a bKash Send Money or Payment of the total order value to our official number: +8801975300759. Copy your bKash Transaction ID (TrxID) and submit. Our verification team confirms your order in real-time!",
    },
    {
      title: "Helpline & 24/7 Customer Care",
      icon: <HelpCircle size={20} color="var(--primary)" />,
      content:
        "Need immediate support? Call our helpline at +8801975300759, email support@chaldal.com, or use our floating Gemini AI Customer Care Chatbot in the bottom right corner for instantaneous answers on orders and items.",
    },
  ];

  return (
    <section className="container accordion-section">
      <h2 className="brand-title" style={{ padding: "0 0 2rem", fontSize: "2.25rem" }}>
        Frequently Asked Questions
      </h2>

      <div className="accordion-wrapper">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="accordion-item">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="accordion-trigger"
                aria-expanded={isOpen}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                <ChevronDown
                  size={18}
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </button>

              {isOpen && (
                <div className="accordion-content">
                  <p>{item.content}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
