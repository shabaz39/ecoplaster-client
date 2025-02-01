"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Filters } from './Filters';
import { SortOptions } from './SortOptions';
import { ProductCard } from './ProductCard';
import LoadingOverlay from '../LoadingOverlay';
import { FILTER_PRODUCTS } from '../../constants/queries/productQueries';
import type { Product, FiltersType } from '../../types/product.types';
import { useCart } from '@/context/CartContext';
import CartSidebar from '../CheckOutComponents/CartSidebar';

const fallbackImages = [
  "/product1 (1).webp",
  "/product1 (2).webp",
  "/product1 (3).webp",
  "/product1 (4).webp",
  "/product1 (5).webp",
];

const AllProductsPage: React.FC = () => {
  const [sortOption, setSortOption] = useState("Popularity");
  const [filters, setFilters] = useState<FiltersType>({});
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { isCartOpen } = useCart(); // Ensure cart visibility


  const { data, loading, error, refetch } = useQuery(FILTER_PRODUCTS, {
    variables: {
      color: filters.color?.length ? filters.color : null,
      fabric: filters.fabric?.length ? filters.fabric : null,
      priceRange: filters.priceRange ? [
        Math.floor(filters.priceRange[0]),
        Math.ceil(filters.priceRange[1])
      ] : null,
      series: filters.series?.length ? filters.series : null,
      finish: filters.finish?.length ? filters.finish : null,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      console.log('Filtered products:', data.filterProducts.length);
    }
  });

  useEffect(() => {
    if (data?.filterProducts) {
      const products = [...data.filterProducts];
      
      switch (sortOption) {
        case "Price (Low to High)":
          products.sort((a, b) => a.price.offerPrice - b.price.offerPrice);
          break;
        case "Price (High to Low)":
          products.sort((a, b) => b.price.offerPrice - a.price.offerPrice);
          break;
        case "Color":
          products.sort((a, b) => (a.color[0] || '').localeCompare(b.color[0] || ''));
          break;
        default:
          break;
      }
      
      setSortedProducts(products);
    }
  }, [data, sortOption]);

  const handleFilterChange = (newFilters: FiltersType) => {
    setFilters(newFilters);
    refetch({
      color: newFilters.color?.length ? newFilters.color : null,
      fabric: newFilters.fabric?.length ? newFilters.fabric : null,
      priceRange: newFilters.priceRange || null,
      series: newFilters.series?.length ? newFilters.series : null,
      finish: newFilters.finish?.length ? newFilters.finish : null,
    });
  };

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Error fetching products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {loading && <LoadingOverlay />}
      
       {/* Sidebar should always be present */}
       {isCartOpen && <CartSidebar />}
      <button 
        className="md:hidden bg-newgreen text-white py-2 px-4 rounded-md mb-4" 
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className={`${showFilters ? "block" : "hidden"} md:block md:col-span-1`}>
          <Filters selectedFilters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Products Section */}
        <div className="col-span-1 md:col-span-3">
          <SortOptions selected={sortOption} onSelect={setSortOption} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                fallbackImage={fallbackImages[index % fallbackImages.length]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
