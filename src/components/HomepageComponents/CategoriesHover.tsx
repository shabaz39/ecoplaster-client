"use client";

import React, { useState } from "react";

const categories = [
  {
    name: "Features",
    links: ["Feature 1", "Feature 2", "Feature 3"],
  },
  {
    name: "Products",
    links: ["Foam Mattress", "Spring Mattress", "Memory Foam Mattress"],
  },
  {
    name: "About Us",
    links: ["Foam Mattress", "Spring Mattress", "Memory Foam Mattress"],
  },
  {
    name: "Projects&FAQ's",
    links: ["Beds", "Wardrobes", "Dressing Tables"],
  },
  {
    name: "Dealers",
    links: ["Sofas", "Recliners", "Coffee Tables"],
  },
 
];

const Categories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="bg-newgreensecond text-sm px-6 py-2">
      <div className="max-w-[1200px] mx-auto">
        <ul className="flex justify-around text-white font-medium relative">
          {categories.map((category) => (
            <li
              key={category.name}
              className="relative group"
              onMouseEnter={() => setActiveCategory(category.name)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              {/* Category Name */}
              <button className="hover:text-newbeige relative text-base transition-all duration-300">
                {category.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-newbeige transition-all duration-300 group-hover:w-full"></span>
              </button>

              {/* Dropdown */}
              {activeCategory === category.name && (
                <div className="absolute top-full left-0 bg-white text-black shadow-md py-2 rounded-md w-48 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {category.links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-green transition-all"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Categories;
