"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const slides = [
  {
    image: "https://www.fdli.org/wp-content/uploads/2023/09/Mancheno-and-Hawana-Image-scaled.jpeg",
    title: "Fresh Groceries Delivered in 1 Hour",
    subtitle: "Everyday essentials, fresh veggies, dairy, and pantry staples delivered straight to your door.",
    buttonText: "Shop Groceries",
  },
  {
    image: "https://img-cdn.misfitsmarket.com/melodious-taiyaki-9pkr2z/aOZkY55xUNkB1vhz_Assortment_Pile_Mobile-1-.jpg",
    title: "bKash Exclusive Grocery Deals",
    subtitle: "Convenient bKash payments to +8801975300759 with rapid verification & instant dispatch.",
    buttonText: "Order with bKash",
  },
  {
    image: "https://food-ubc.b-cdn.net/wp-content/uploads/2020/02/Save-Money-On-Groceries_UBC-Food-Services.jpg",
    title: "100% Fresh & Farm Handpicked",
    subtitle: "Serving over 100,000 satisfied families across Bangladesh with unmatched quality standards.",
    buttonText: "Explore Essentials",
  },
];

export default function HeroBanner({ onExplore }: { onExplore?: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="hero-slider-section">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slider-slide ${index === currentSlide ? "active" : ""}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.title}
            className="slider-bg-img"
          />
          <div className="slider-overlay-content">
            <h2>{slide.title}</h2>
            <p>{slide.subtitle}</p>
            <button
              onClick={() => {
                if (onExplore) {
                  onExplore();
                } else {
                  const el = document.getElementById("products-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="btn-primary"
              style={{
                fontSize: "1.05rem",
                padding: "0.75rem 1.75rem",
                borderRadius: "999px",
                background: "var(--primary)",
                border: "2px solid #ffffff",
              }}
            >
              <span>{slide.buttonText}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ))}

      {/* Nav buttons */}
      <button
        onClick={prevSlide}
        className="slider-nav-btn slider-prev"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="slider-nav-btn slider-next"
        aria-label="Next Slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`slider-dot ${index === currentSlide ? "active" : ""}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
