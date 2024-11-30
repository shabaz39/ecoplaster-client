"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const categories = [
  { name: "Mattresses & Beddings", image: "/product1 (1).webp" },
  { name: "Beds & Side Tables", image: "/product1 (2).webp" },
  { name: "Pillows & Cushions", image: "/product1 (3).webp" },
  { name: "Sofas & Seating", image: "/product1 (4).webp" },
  { name: "Wardrobes & Dressing Tables", image: "/product1 (5).webp" },
  { name: "Chairs & WFH Furniture", image: "/product1 (1).webp" },
  { name: "TV Units & Coffee Tables", image: "/product1 (2).webp" },
  { name: "Cabinets & Shelves", image: "/product1 (3).webp" },
];

const subcategories = Array.from({ length: 21 }, (_, i) => ({
  name: `Subcategory ${i + 1}`,
  image: `/subcategory-${i + 1}.webp`,
}));

const CategoriesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const closeSubcategories = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="bg-gradient-to-b from-beige to-white py-8 px-4 sm:px-8 lg:px-64">
      {/* Heading */}
      <h2 className="text-center  text-2xl sm:text-3xl font-bold py-6 text-gray-800">
        Shop By Categories
        <div className="flex justify-center mt-1 ">
          <span className="w-16 h-1 mt-2 bg-newgreen rounded"></span>
        </div>
      </h2>

      {/* Main Categories Section */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 ${
          selectedCategory ? "blur-sm pointer-events-none" : "blur-none"
        }`}
      >
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="overflow-hidden rounded-lg shadow-lg border-2 border-white bg-white">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <p className="mt-2 text-center font-semibold text-gray-800">
              {category.name}
            </p>
          </div>
        ))}
      </div>

      {/* Subcategories Section */}
      {selectedCategory && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40"
            onClick={closeSubcategories}
          ></div>

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", stiffness: 80 }}
            className="fixed top-0 right-0 w-full sm:w-[60%] h-full bg-beige shadow-lg z-50 overflow-y-auto"
          >
            <div className="flex justify-between items-center p-4 bg-newgreen shadow-md">
              <h2 className="text-lg font-bold text-white">
                {selectedCategory}
              </h2>
              <button
                className="text-white hover:text-newgreensecond"
                onClick={closeSubcategories}
              >
                <X size={24} /> {/* Close icon with size */}
              </button>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-8">
              {subcategories.map((subcategory, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <div className="overflow-hidden rounded-lg shadow-md border-2 border-white bg-white">
                    <img
                      src={subcategory.image}
                      alt={subcategory.name}
                      className="w-full h-24 sm:h-28 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <p className="mt-2 text-center text-sm font-medium text-gray-800">
                    {subcategory.name}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default CategoriesSection;
