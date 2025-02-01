// ProductGallery.tsx
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

interface ProductImages {
  imageMain: string;
  imageArtTable: string;
  imageWall: string;
  imageBedroom: string;
  imageRoom: string;
  imageLivingRoom: string;
}

interface ProductGalleryProps {
  images: ProductImages;
  name: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, name }) => {
  const defaultImage = "/product1.webp";

  useEffect(() => {
    console.log("Received images:", images);
  }, [images]);

  const validImages = Object.values(images || {}).filter(
    (url) => url && url.startsWith("https://")
  );

  const [selectedImage, setSelectedImage] = useState<string>(
    validImages.length > 0 ? validImages[0] : defaultImage
  );

  if (validImages.length === 0) {
    return (
      <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 border border-gray-300 shadow-md">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400">No images available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Vertical Thumbnails on the left */}
      <div className="flex lg:flex-col gap-3 w-24">
        {validImages.map((imageUrl, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(imageUrl)}
            className={`relative w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0
              hover:ring-2 hover:ring-green-400 transition-all
              ${selectedImage === imageUrl ? "ring-2 ring-green-500" : ""}
            `}
          >
            <Image
              src={imageUrl}
              alt={`${name} view ${index + 1}`}
              width={96}
              height={96}
              className="object-cover"
              unoptimized
            />
          </button>
        ))}
      </div>

      {/* Main Image with Zoom on the right (Bigger Image with Outline) */}
      <div className="flex-1 flex justify-center items-center">
        <div className="relative w-full lg:w-[700px] h-[500px] lg:h-[700px] rounded-lg overflow-hidden 
          bg-gray-100 border border-gray-300 shadow-md hover:border-green-500 transition-all"
        >
          <Zoom>
            <Image
              src={selectedImage}
              alt={`${name} - Main View`}
              width={700}
              height={700}
              priority
              className="object-contain"
              unoptimized
            />
          </Zoom>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
