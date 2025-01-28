// components/ProductDescriptionComponents/ProductDescription.tsx
"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID } from "../../constants/queries/productQueries";
import ProductGallery from "./ProductGallery";
import ProductDetails from "./ProductDetails";
import PricingSection from "./PricingSection";
import DeliveryCheck from "./DeliveryCheck";
import QuantitySelector from "./QuantitiySelector";
import AddToCartButton from "./AddToCartButton";

interface ProductProps {
  productId: string;
}

const ProductDescription: React.FC<ProductProps> = ({ productId }) => {
  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: productId },
    skip: !productId
  });

  if (loading) return <div>Loading...</div>;
  if (error || !data?.getProductById) return <div>Product not found.</div>;

  const product = data.getProductById;
  
  // Ensure images object exists
  const processedImages = {
    imageMain: product.images?.imageMain ? `/${product.images.imageMain}` : '',
    imageArtTable: product.images?.imageArtTable ? `/${product.images.imageArtTable}` : '',
    imageWall: product.images?.imageWall ? `/${product.images.imageWall}` : '',
    imageBedroom: product.images?.imageBedroom ? `/${product.images.imageBedroom}` : '',
    imageRoom: product.images?.imageRoom ? `/${product.images.imageRoom}` : '',
    imageLivingRoom: product.images?.imageLivingRoom ? `/${product.images.imageLivingRoom}` : '',
  };

  return (
    <div className="flex flex-col lg:flex-row bg-white text-black min-h-screen p-6">
    {/* Left - Image Gallery */}
    <div className="w-full lg:w-2/5">
      <ProductGallery 
        images={processedImages} 
        name={product.name} 
      />
    </div>

      {/* Right - Product Info */}
      <div className="w-full lg:w-3/5 p-6">
        <ProductDetails product={product} />
        <PricingSection product={product} />
        <DeliveryCheck />
        <QuantitySelector />
        <AddToCartButton productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDescription;