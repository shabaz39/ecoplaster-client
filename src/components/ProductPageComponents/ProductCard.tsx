import React from "react";
import Image from "next/image";

const ProductCard = ({ product, fallbackImage }: { product: any; fallbackImage: string }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all">
      <div className="relative w-full h-48">
        <Image
          src={product?.images?.imageMain || fallbackImage}
          alt={product?.name || "Product Image"}
          layout="fill"
          objectFit="cover"
          unoptimized
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-black">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.code}</p>
        <p className="text-green-600 font-bold">₹{product.price?.offerPrice}</p>
      </div>
    </div>
  );
};

export default ProductCard;
