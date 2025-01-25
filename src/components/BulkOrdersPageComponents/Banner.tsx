"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Banner: React.FC = () => {
  const images = [
    "https://res.cloudinary.com/djzmj5oqp/image/upload/c_fit,w_1920,h_1080/Bedroom__Ep_216__fayehr.jpg",
    "https://res.cloudinary.com/djzmj5oqp/image/upload/c_fit,w_1920,h_1080/Dining_Area_img_CC_6.1_yocmhk.jpg",
    "https://res.cloudinary.com/djzmj5oqp/image/upload/c_fit,w_1920,h_1080/Kids_love_CC_14_V1_ue5kjj.jpg",
    "https://res.cloudinary.com/djzmj5oqp/image/upload/c_fit,w_1920,h_1080/Office_EP__812_eve8z6.jpg",
    "https://res.cloudinary.com/djzmj5oqp/image/upload/c_fit,w_1920,h_1080/Bathroom_EP_815_y7bphf.jpg",
    "https://res.cloudinary.com/djzmj5oqp/image/upload/c_fit,w_1920,h_1080/Hallway_Entrance_1920x108_EP_416_xj30tj.jpg",
    "https://res.cloudinary.com/djzmj5oqp/image/upload/c_fit,w_1920,h_1080/Laundry_Room_EP_401_v1_uecfqp.jpg",
    "https://res.cloudinary.com/djzmj5oqp/image/upload/c_fit,w_1920,h_1080/Master_Bedroom__EP_396_V2_dhxlif.jpg",
    "https://res.cloudinary.com/djzmj5oqp/image/upload/Gamming_room_Ep_228_ykfhif.jpg",
    "https://res.cloudinary.com/djzmj5oqp/image/upload/TV_room_EP_391_dmyljj.jpg",
    "https://res.cloudinary.com/djzmj5oqp/image/upload/Walk-In_Closet_lpjrwy.jpg"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleNav = (direction: "prev" | "next") => {
    setCurrentIndex((prev) =>
      direction === "prev" ? (prev === 0 ? images.length - 1 : prev - 1) : (prev + 1) % images.length
    );
  };

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[400px] shadow-md">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={image} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}

        <button
          onClick={() => handleNav("prev")}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-md hover:shadow-lg focus:outline-none"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800" />
        </button>

        <button
          onClick={() => handleNav("next")}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-md hover:shadow-lg focus:outline-none"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800" />
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                index === currentIndex ? "bg-newgreensecond scale-110" : "bg-beige hover:bg-newbeige"
              } transition-all duration-300`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;
