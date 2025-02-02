"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID } from "../../constants/queries/productQueries";
import ProductGallery from "./ProductGallery";
import ProductDetails from "./ProductDetails";
import PricingSection from "./PricingSection";
import DeliveryCheck from "./DeliveryCheck";
import QuantitySelector from "./QuantitiySelector";
import AddToCartButton from "./AddToCartButton";
import { Star } from "lucide-react";

interface ProductProps {
  productId: string;
}

const ProductDescription: React.FC<ProductProps> = ({ productId }) => {
  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: productId },
    skip: !productId,
  });

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  if (loading) return <div className="text-center text-black py-10">Loading...</div>;
  if (error || !data?.getProductById) return <div className="text-center text-red-500 py-10">Product not found.</div>;

  const product = data.getProductById;

  const processedImages = {
    imageMain: product.images?.imageMain || "",
    imageArtTable: product.images?.imageArtTable || "",
    imageWall: product.images?.imageWall || "",
    imageBedroom: product.images?.imageBedroom || "",
    imageRoom: product.images?.imageRoom || "",
    imageLivingRoom: product.images?.imageLivingRoom || "",
  };

  return (
    <div className="px-0 py-6">
      <div className="flex flex-col lg:flex-row">
        {/* Left Section - Gallery */}
        <div className="w-full lg:w-3/4 px-0">
          <ProductGallery images={processedImages} name={product.name} />
        </div>

        {/* Right Section - Product Details */}
        <div className="w-full lg:w-1/4 px-8">
          {/* Product Title & Rating */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium text-black">4.5</span>
              </div>
              <span className="text-xs font-medium text-black">|</span>
              <span className="text-sm font-medium text-black">6,000+ sold</span>
            </div>
            <ProductDetails product={product} />
          </div>

          {/* Price Section */}
          <div className="mb-6">
            <PricingSection product={product} />
          </div>

          {/* Delivery Check */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <DeliveryCheck />
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-black mb-2">Select Quantity</h3>
              <QuantitySelector 
  quantity={quantity}
  onQuantityChange={handleQuantityChange}
  productId={product.id}
  productName={product.name}
  productPrice={product.price.offerPrice}
  productOriginalPrice={product.price.mrp}
/>
            </div>
            <AddToCartButton 
              productId={product.id}
              productName={product.name}
              productPrice={product.price.offerPrice}
              productOriginalPrice={product.price.mrp}
              quantity={quantity}
              />
          </div>

          {/* Payment Options */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-black mb-4">Available Payment Options</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-semibold text-black">Card Payment</h4>
                <p className="text-xs text-black mt-1">All major cards accepted</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-semibold text-black">UPI Payment</h4>
                <p className="text-xs text-black mt-1">Instant payment via UPI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;