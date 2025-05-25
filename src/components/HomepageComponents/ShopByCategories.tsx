"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ Import router
import { GET_SERIES_PRODUCTS } from "../../constants/queries/productQueries";

const categories = [
  { name: "SILK", image: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1745157056/ecoplaster-revised-images/EP_416/mxdsxluzecjq1fidk3r0.webp" },
  { name: "GOLD", image: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1745198412/ecoplaster-revised-images/EP_818/x95xo8we18reudast1yu.webp" },
  { name: "CHIPS", image: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1745198466/ecoplaster-revised-images/EP_381/lltwftxklauy89bdk1xs.webp" },
  { name: "DUAL", image: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1745198495/ecoplaster-revised-images/EP_231/qxtq4lpeeidteijquvuf.webp" },
  { name: "COTTON", image: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1737901757/Product_01_kre6je.webp" },
  { name: "COTTON & SILK", image: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1745154978/ecoplaster-revised-images/CS7/jvoxxlih7acktejlbjwq.webp" },
  { name: "GLITTER", image: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1745157106/ecoplaster-revised-images/G_1/uxdscr56cuivcu4sjvba.webp" },
  { name: "MULTI COLOR", image: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1745157022/ecoplaster-revised-images/MC_9/eosllbtbahgvqu3ztd8f.webp" }
];

const fallbackImages = [
  "/product1 (1).webp",
  "/product1 (2).webp",
  "/product1 (3).webp",
  "/product1 (4).webp",
  "/product1 (5).webp",
];

const CategoriesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter(); // ✅ Initialize Next.js router

  const { data, loading, error } = useQuery(GET_SERIES_PRODUCTS, {
    variables: { series: selectedCategory },
    skip: !selectedCategory, // Avoid fetching if no category is selected
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const closeSubcategories = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="relative py-8 px-4 sm:px-8 lg:px-64"
      style={{
        background: `linear-gradient(to bottom, transparent 0%, #F5F0E5 30%, #F5F0E5 70%, transparent 100%)`,
      }}
    >
      {/* Heading */}
      <h2 className="text-center text-2xl sm:text-3xl font-bold py-6 text-gray-800">
        Shop By Categories
        <div className="flex justify-center mt-1">
          <span className="w-16 h-1 mt-2 bg-newgreen rounded"></span>
        </div>
      </h2>

      {/* Main Categories Section */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 ${
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
                className="w-full h-40 sm:h-48 object-cover object-center scale-125 transition-transform duration-300 group-hover:scale-150"
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
                <X size={24} />
              </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-8">
              {loading ? (
                <p className="text-center text-gray-600">Loading...</p>
              ) : error ? (
                <p className="text-center text-red-500">Error loading products</p>
              ) : data?.getSeriesProducts.length === 0 ? (
                <p className="text-center text-gray-500">No products found</p>
              ) : (
                data?.getSeriesProducts.map((product: any, index: number) => {
                  const imageUrl = product.images?.imageMain || fallbackImages[index % fallbackImages.length];
                  
                  return (
                    <div 
                      key={product.id} 
                      className="relative group cursor-pointer"
                      onClick={() => router.push(`/productDescription/${product.id}`)} // ✅ Redirect to product page
                    >
                      <div className="overflow-hidden rounded-lg shadow-md border-2 border-white bg-white">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-24 sm:h-28 object-cover object-center transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <p className="mt-2 text-center text-sm font-medium text-gray-800">
                        {product.name}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default CategoriesSection;
