"use client";

import React from "react";

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
      "Office Address: 123 Greenway Street, EcoCity, Country - 56789",
      "Mission: Revolutionizing wall finishes with sustainable & innovative solutions.",
    ],
  },
  {
    name: "FAQ",
    links: [
      "How long does EcoPlaster last?",
      "Is EcoPlaster safe for indoor use?",
      "What surfaces can EcoPlaster be applied to?",
      "Does it require special maintenance?",
    ],
  },
  {
    name: "Dealers",
    links: [
"1. Tirupati, Andhra Pradesh ",
"2.  Kakinada, Andhra Pradesh ",
"2. Bangalore, karnataka ",
"3. Koduvally, calicut ",
"4. Deoli, Rajasthan ",
"5. Bhubaneshwar, odisha ",
"6. Ambala, haryana ",
"7. Hisar, Haryana ",
"8. Anantnag, Jammu and Kashmir ",
"9. Srinagar, Jammu and Kashmir ",


    ],
  },
];

const Categories: React.FC = () => {
  return (
    <div className="bg-newgreensecond text-sm px-6 py-2">
      <div className="max-w-[1200px] mx-auto">
        <ul className="flex justify-around text-white font-medium relative">
          {categories.map((category) => (
            <li key={category.name} className="relative group">
              {/* Category Name */}
              <button className="hover:text-newbeige relative text-base transition-all duration-300">
                {category.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-newbeige transition-all duration-300 group-hover:w-full"></span>
              </button>

              {/* Dropdown (CSS only, No State) */}
              <div className="absolute top-full left-0 bg-white text-black shadow-lg py-2 rounded-md w-48 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-1 transition-all duration-300">
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Categories;