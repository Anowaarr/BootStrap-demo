import React from "react";
import { Home, Headset, Zap } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: <Home size={34} />,
      title: "Home Delivery",
      desc: "Fast and reliable doorstep delivery in temperature-controlled bags within 1 hour.",
    },
    {
      icon: <Headset size={34} />,
      title: "Customer Support",
      desc: "24/7 dedicated support team and AI assistant to help you with every order.",
    },
    {
      icon: <Zap size={34} />,
      title: "Fast Response",
      desc: "Instant query solutions, rapid bKash payment verification, and dispatch.",
    },
  ];

  return (
    <section className="services-section">
      <div className="container">
        <h2 className="brand-title" style={{ padding: "0 0 2.5rem", fontSize: "2.25rem" }}>
          Our Services
        </h2>

        <div className="services-grid">
          {services.map((s, idx) => (
            <div key={idx} className="service-card">
              <div className="service-icon-box">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
