"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import ProductSection from "@/components/ProductSection";
import ServicesSection from "@/components/ServicesSection";
import AchievementsSection from "@/components/AchievementsSection";
import FaqAccordion from "@/components/FaqAccordion";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export default function HomeClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Dhaka");

  const handleExplore = () => {
    const el = document.getElementById("products-section");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />

      <main style={{ flex: 1 }}>
        {/* Hero Banner Carousel */}
        <HeroBanner onExplore={handleExplore} />

        {/* Product Catalog Section */}
        <ProductSection
          products={initialProducts}
          searchQuery={searchQuery}
        />

        {/* Services */}
        <ServicesSection />

        {/* Achievements Counter */}
        <AchievementsSection />

        {/* FAQ Accordion */}
        <FaqAccordion />

        {/* Reviews & Testimonials */}
        <TestimonialsSection />

        {/* Newsletter Subscription */}
        <NewsletterSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
