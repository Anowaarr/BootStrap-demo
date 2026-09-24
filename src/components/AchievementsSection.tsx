import React from "react";
import { PackageCheck, Users, Warehouse } from "lucide-react";

export default function AchievementsSection() {
  const achievements = [
    {
      icon: <PackageCheck size={36} style={{ marginBottom: "0.5rem" }} />,
      count: "5 Million+",
      title: "Orders Delivered",
      desc: "Safely delivered right to our valued customers' doorsteps across the nation.",
      cardClass: "achieve-primary",
    },
    {
      icon: <Users size={36} style={{ marginBottom: "0.5rem" }} />,
      count: "100,000+",
      title: "Families Served",
      desc: "Trusting us daily for their fresh groceries, pantry items, and kitchen needs.",
      cardClass: "achieve-secondary",
    },
    {
      icon: <Warehouse size={36} style={{ marginBottom: "0.5rem" }} />,
      count: "26 Hubs",
      title: "Warehouses in Bangladesh",
      desc: "Strategically located fulfillment centers ensuring lightning fast 1-hour deliveries.",
      cardClass: "achieve-success",
    },
  ];

  return (
    <section className="container achievements-section">
      <h2 className="brand-title" style={{ padding: "0 0 2.5rem", fontSize: "2.25rem" }}>
        Achievements
      </h2>

      <div className="achievements-grid">
        {achievements.map((item, idx) => (
          <div key={idx} className={`achievement-card ${item.cardClass}`}>
            <div style={{ display: "flex", justifyContent: "center" }}>{item.icon}</div>
            <h4>{item.count}</h4>
            <div style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.4rem" }}>
              {item.title}
            </div>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
