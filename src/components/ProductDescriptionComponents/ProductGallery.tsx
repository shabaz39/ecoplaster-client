"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

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
  const validImages = Object.values(images || {}).filter(
    (url) => url && url.startsWith("https://")
  );
  
  const [selectedImage, setSelectedImage] = useState<string>(
    validImages.length > 0 ? validImages[0] : defaultImage
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);
  const visibleThumbnails = 5;

  const nextThumbnails = () => {
    if (currentIndex + visibleThumbnails < validImages.length) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevThumbnails = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const nextMobileImage = () => {
    setMobileImageIndex((prev) => 
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevMobileImage = () => {
    setMobileImageIndex((prev) => 
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  };

  const handleDotClick = (index: number) => {
    setMobileImageIndex(index);
  };

  if (validImages.length === 0) {
    return (
      <div className="relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  // Mobile Gallery
  const MobileGallery = () => (
    <div className="relative w-full">
      <div className="relative aspect-square w-full">
        <Image
          src={validImages[mobileImageIndex]}
          alt={`${name} ${mobileImageIndex + 1}`}
          fill
          className="object-contain"
          unoptimized
          priority
        />
      </div>
      
      {/* Navigation Arrows */}
      <button
        onClick={prevMobileImage}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextMobileImage}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {validImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === mobileImageIndex 
                ? "bg-newgreensecond w-4" 
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );

  // Desktop Gallery
  const DesktopGallery = () => (
    <div className="flex gap-8 text-black">
      {/* Vertical Thumbnails */}
      <div className="relative">
        {validImages.length > visibleThumbnails && (
          <>
            <button
              onClick={prevThumbnails}
              disabled={currentIndex === 0}
              className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 p-1 rounded-full bg-white shadow-md disabled:opacity-50"
            >
              <ChevronUp size={20} />
            </button>
            <button
              onClick={nextThumbnails}
              disabled={currentIndex + visibleThumbnails >= validImages.length}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 p-1 rounded-full bg-white shadow-md disabled:opacity-50"
            >
              <ChevronDown size={20} />
            </button>
          </>
        )}

        <div className="flex flex-col gap-4 overflow-hidden py-4">
          {validImages
            .slice(currentIndex, currentIndex + visibleThumbnails)
            .map((image, index) => (
              <button
                key={index + currentIndex}
                onClick={() => setSelectedImage(image)}
                className={`relative w-28 h-28 rounded-lg overflow-hidden transition-all ${
                  selectedImage === image
                    ? "ring-2 ring-newgreensecond"
                    : "ring-1 ring-gray-200 hover:ring-gray-300"
                }`}
              >
                <Image
                  src={image}
                  alt={`${name} ${index + currentIndex + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
        </div>
      </div>

      {/* Main Image */}
      <div className="flex-1">
        <div className="relative aspect-[4/3] w-full max-w-4xl bg-gray-50 rounded-lg overflow-hidden">
          <Image
            src={selectedImage}
            alt={name}
            fill
            className="object-contain"
            unoptimized
            priority
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="block md:hidden">
        <MobileGallery />
      </div>
      <div className="hidden md:block">
        <DesktopGallery />
      </div>
    </>
  );
};

export default ProductGallery;