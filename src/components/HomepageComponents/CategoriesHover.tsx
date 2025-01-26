"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = [
  {
    name: "Features",
    links: [
      "Eco-Friendly & Sustainable Materials",
      "Advanced Noise & Thermal Insulation",
      "Ultra-Durable & Long-Lasting Finish",
      "Seamless, Crack-Free Surface",
      "Customizable Colors & Textures",
    ],
  },
  {
    name: "Products",
    links: [
      "EcoPlaster Premium Finish",
      "Natural Lime-Based Plaster",
      "Breathable Clay Plaster",
      "Water-Resistant Exterior Plaster",
      "Smooth Venetian Plaster",
    ],
  },
  {
    name: "About Us",
    links: [
      { name: "Office Address: 123 Greenway Street, EcoCity, Country - 56789", href: "#" },
      { name: "Mission: Revolutionizing wall finishes with sustainable & innovative solutions.", href: "#" },
    ],
    route: "/aboutus", // Navigation route
  },
  {
    name: "FAQ",
    links: [
      "How long does EcoPlaster last?",
      "Is EcoPlaster safe for indoor use?",
      "What surfaces can EcoPlaster be applied to?",
      "Does it require special maintenance?",
    ],
    route: "/faqs",
  },
  {
    name: "Dealers",
    links: [
      "Tirupati, Andhra Pradesh",
      "Kakinada, Andhra Pradesh",
      "Bangalore, Karnataka",
      "Koduvally, Calicut",
      "Deoli, Rajasthan",
      "Bhubaneshwar, Odisha",
      "Ambala, Haryana",
      "Hisar, Haryana",
      "Anantnag, Jammu and Kashmir",
      "Srinagar, Jammu and Kashmir",
    ],
  },
];

const Categories: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const navigateTo = (path: string) => {
    setIsLoading(true); // Start loading effect
    setTimeout(() => {
      router.push(path);
      setIsLoading(false);
    }, 500); // Delay for smoother transition
  };

  return (
    <div className="bg-newgreensecond text-sm px-6 py-2">
      <div className="max-w-[1200px] mx-auto">
        <ul className="flex justify-around text-white font-medium relative">
          {categories.map((category) => (
            <li key={category.name} className="relative group">
              {/* Category Name with Router Navigation */}
              {category.route ? (
                <button
                  onClick={() => navigateTo(category.route)}
                  className="hover:text-newbeige relative text-base transition-all duration-300"
                >
                  {category.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-newbeige transition-all duration-300 group-hover:w-full"></span>
                </button>
              ) : (
                <button className="hover:text-newbeige relative text-base transition-all duration-300">
                  {category.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-newbeige transition-all duration-300 group-hover:w-full"></span>
                </button>
              )}

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 bg-white text-black shadow-lg py-2 rounded-md w-48 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-1 transition-all duration-300">
                {category.links.map((link, index) =>
                  typeof link === "string" ? (
                    <a
                      key={index}
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-green transition-all"
                    >
                      {link}
                    </a>
                  ) : (
                    <a
                      key={index}
                      href={link.href}
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-green transition-all"
                    >
                      {link.name}
                    </a>
                  )
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default Categories;
