"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero: React.FC = () => {
  const images = [
    "/carousel-1 (1).webp",
    "/carousel-1 (2).webp",
    "/carousel-1 (3).webp",
    "/carousel-1 (4).webp",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  // Handlers for manual navigation
  const handlePrev = () => {
    setCurrentIndex(
      currentIndex === 0 ? images.length - 1 : currentIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  // Handle Dot Navigation
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Outer container with responsive height */}
      <div className="relative overflow-hidden h-[150px] sm:h-[200px] md:h-[250px] lg:h-[400px] shadow-md">
        {/* Carousel Images */}
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Carousel ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Navigation Arrows */}
        <div className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={handlePrev}
            className="bg-white w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-md hover:shadow-lg focus:outline-none"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800" />
          </button>
        </div>
        <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={handleNext}
            className="bg-white w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-md hover:shadow-lg focus:outline-none"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                index === currentIndex
                  ? "bg-newgreensecond scale-110"
                  : "bg-beige hover:bg-newbeige"
              } transition-all duration-300`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
