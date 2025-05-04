"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = [
  {
    name: "Features",
    links: [
      { name: "Eco-Friendly & Sustainable Materials", href: "/features" },
      { name: "Kids & Pet Friendly", href: "/features" },
      { name: "Odorless", href: "/features" },
      { name: "Breathable Walls", href: "/features" },
      { name: "High Elasticity", href: "/features" },
      { name: "Easy to Apply", href: "/features" },
      { name: "Fire Retardant", href: "/features" },
      { name: "Sound Insulation", href: "/features" },
      { name: "Heat Insulation", href: "/features" },
      { name: "Hypoallergenic", href: "/features" },
      { name: "Moisture Resistant", href: "/features" },
      { name: "Anti-Static", href: "/features" }
    ],
    route: "/features",
  },
  {
    name: "Products",
    links: [
      { name: "Silk series", href: "/allproducts" },
      { name: "Gold series", href: "/allproducts" },
      { name: "Chips series", href: "/allproducts" },
      { name: "Dual series", href: "/allproducts" },
      { name: "Cotton series", href: "/allproducts" },
      { name: "Cotton & Silk series", href: "/allproducts" },
      { name: "Glitter series", href: "/allproducts" },
      { name: "Multi-Color series", href: "/allproducts" },
    ],
    route: "/allproducts",

  },
  {
    name: "About Us",
    links: [
    
      {
        name: "Mission: Revolutionizing wall finishes with sustainable & innovative solutions.",
        href: "/aboutus",
      },
    ],
    route: "/aboutus", // Navigation route
  },
  {
    name: "FAQ",
    links: [
      { name: "How long does EcoPlaster last?", href: "/faqs" },
      { name: "Is EcoPlaster safe for indoor use?", href: "/faqs" },
      { name: "What surfaces can EcoPlaster be applied to?", href: "/faqs" },
      { name: "Does it require special maintenance?", href: "/faqs" },
    ],
    route: "/faqs",
  },
  {
    name: "Dealers",
    links: [
      { name: "Tirupati, Andhra Pradesh", href: "/stores" },
      { name: "Kakinada, Andhra Pradesh", href: "/stores" },
      { name: "Bangalore, Karnataka", href: "/stores" },
      { name: "Koduvally, Calicut", href: "/stores" },
      { name: "Deoli, Rajasthan", href: "/stores" },
      { name: "Bhubaneshwar, Odisha", href: "/stores" },
      { name: "Ambala, Haryana", href: "/stores" },
      { name: "Hisar, Haryana", href: "/stores" },
      { name: "Anantnag, Jammu and Kashmir", href: "/stores" },
      { name: "Srinagar, Jammu and Kashmir", href: "/stores" },
    ],
    route: "/stores",
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
