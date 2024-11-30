"use client";

import React, { useState, useEffect } from "react";

const AnnouncementBanner: React.FC = () => {
  const announcements = [
    "🎉 Big Announcement: EcoPlaster is now available nationwide!",
    "💡 Special Offer: Get 20% off on your first order with code ECO20!",
    "📢 Join Our Dealer Program and grow your business with EcoPlaster.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 4000); // Change announcement every 4 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [announcements.length]);

  return (
    <div className="bg-black text-white py-2 px-3 overflow-hidden w-full">
      <div className="relative h-[2.5rem] overflow-hidden flex items-center justify-center">
        <div
          className="absolute w-full text-center transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateY(-${currentIndex * 2.5}rem)`,
          }}
        >
          {announcements.map((announcement, index) => (
            <p
              key={index}
              className="text-xs sm:text-sm md:text-base"
              style={{
                height: "2.5rem", // Matches the container height
                lineHeight: "2.5rem",
              }}
            >
              {announcement}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
