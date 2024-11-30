import React from "react";
import ProductCarousel from "./ProductCardCarousel";

const Products: React.FC = () => {
  const productList = [
    { name: "Product 1", price: "₹59.99/sq.ft" },
    { name: "Product 2", price: "₹69.99/sq.ft" },
    { name: "Product 3", price: "₹79.99/sq.ft" },
    { name: "Product 4", price: "₹89.99/sq.ft" },
  ];

  return (
    <section id="products" className="py-20 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800">Our Products</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productList.map((product, index) => (
            <ProductCarousel />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
