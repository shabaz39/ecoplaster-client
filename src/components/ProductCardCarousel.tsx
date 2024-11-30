"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductCarousel: React.FC = () => {
  const products = [
    { id: 1, name: "Product 1", price: "₹59.99/sq.ft", image: "/product1 (1).webp" },
    { id: 2, name: "Product 2", price: "₹69.99/sq.ft", image: "/product1 (2).webp" },
    { id: 3, name: "Product 3", price: "₹79.99/sq.ft", image: "/product1 (3).webp" },
    { id: 4, name: "Product 4", price: "₹89.99/sq.ft", image: "/product1 (4).webp" },
    { id: 5, name: "Product 5", price: "₹59.99/sq.ft", image: "/product1 (5).webp" },
    { id: 6, name: "Product 6", price: "₹69.99/sq.ft", image: "/product1 (1).webp" },
    { id: 7, name: "Product 7", price: "₹79.99/sq.ft", image: "/product1 (2).webp" },
    { id: 8, name: "Product 8", price: "₹89.99/sq.ft", image: "/product1 (3).webp" },
  ];

  const visibleCards = 4; // Number of visible cards
  const cardWidth = 100 / visibleCards; // Calculate the width of each card as a percentage
  const totalProducts = [...products, ...products, ...products]; // Duplicate products for seamless looping
  const [currentIndex, setCurrentIndex] = useState(products.length); // Start at the first duplicate set

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Reset to the beginning or end for seamless looping
  useEffect(() => {
    if (currentIndex >= totalProducts.length - visibleCards) {
      setTimeout(() => setCurrentIndex(products.length), 0); // Reset to the first duplicate
    } else if (currentIndex < visibleCards) {
      setTimeout(() => setCurrentIndex(totalProducts.length - 2 * products.length), 0); // Reset to the last duplicate
    }
  }, [currentIndex, totalProducts.length, visibleCards]);

  // Handlers for manual navigation
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <section className="relative bg-beige py-8 px-8 overflow-hidden">
      <div className="relative max-w-[1200px] mx-auto ">
        {/* Product Cards Wrapper */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * cardWidth}%)`,
            width: `${(totalProducts.length / visibleCards) * 30}%`,
          }}
        >
          {totalProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="w-[calc(100%/4)] flex-shrink-0 p-4"
            >
              <div className="bg-white p-4 py-10 hover:bg-hoverColor shadow-md rounded-lg overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 rounded-lg object-cover" // Increased height
                />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-productNameColor">{product.name}</h3>
                  <p className="text-gray-700">{product.price}</p>
                </div>
                <div className="absolute bottom-4 left-4">
                  <button className="bg-green text-white py-2 px-4 rounded-full hover:bg-green-700">
                    Add to Cart
                  </button>
                </div>
                <div className="absolute bottom-4 right-4">
                  <button className="border border-gray-800 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-[-300px] top-1/2 transform -translate-y-1/2 bg-white opacity-50 hover:opacity-100 w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:bg-white"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-[-300px] top-1/2 transform -translate-y-1/2 bg-white opacity-50 hover:opacity-100 w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:bg-white"
        >
          <ChevronRight className="w-6 h-6 text-black" />
        </button>
      </div>
    </section>
  );
};

export default ProductCarousel;
