"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import Filters from "./Filters";
import SortOptions from "./SortOptions";
import ProductCard from "./ProductCard";
import { FILTER_PRODUCTS } from "../../constants/queries/productQueries";

const fallbackImages = [
  "/product1 (1).webp",
  "/product1 (2).webp",
  "/product1 (3).webp",
  "/product1 (4).webp",
  "/product1 (5).webp",
];

const AllProductsPage: React.FC = () => {
  const [sortOption, setSortOption] = useState<string>("Popularity");
  const [filters, setFilters] = useState<any>({});

  const { data, loading, error, refetch } = useQuery(FILTER_PRODUCTS, {
    variables: { ...filters },
  });

  // Update filters when changed
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    refetch(newFilters); // Re-fetch filtered products
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-black">Error fetching products</div>;

  return (
    <div className="flex bg-white text-black min-h-screen">
      {/* Filters Sidebar */}
      <Filters selectedFilters={filters} onFilterChange={handleFilterChange} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Sorting Options */}
        <SortOptions selected={sortOption} onSelect={setSortOption} />

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {data?.filterProducts.map((product: any, index: number) => (
            <ProductCard
              key={product.id}
              product={product}
              fallbackImage={fallbackImages[index % fallbackImages.length]} // Cycle fallback images
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
