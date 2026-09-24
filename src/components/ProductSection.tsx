"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  products: Product[];
  searchQuery?: string;
}

export default function ProductSection({
  products,
  searchQuery = "",
}: ProductSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Groceries", "Vegetables", "Oil & Ghee"];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="container" id="products-section">
      <h1 className="brand-title">Groceries</h1>

      {/* Category Filter Chips */}
      <div className="category-filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 1rem",
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px dashed #cbd5e1",
            marginBottom: "3rem",
          }}
        >
          <p style={{ fontSize: "1.2rem", color: "#64748b", fontWeight: 600 }}>
            No grocery items found matching &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => setSelectedCategory("All")}
            className="btn-primary"
            style={{ marginTop: "1rem" }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
