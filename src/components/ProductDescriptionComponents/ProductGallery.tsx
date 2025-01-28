// components/ProductDescriptionComponents/ProductGallery.tsx
import React, { useState } from 'react';
import Image from 'next/image';

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
  // Filter valid image URLs and provide fallback
  const defaultImage = './product1 (2).webp'; // Make sure this exists in your public folder
  const [selectedImage, setSelectedImage] = useState(images?.imageMain || defaultImage);

  // Create array of valid images
  const validImages = Object.entries(images || {})
    .filter(([_, url]) => url && url.startsWith('/')) // Only include valid URLs
    .map(([_, url]) => url);

  if (validImages.length === 0) {
    return (
      <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400">No images available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
        {selectedImage && (
          <Image
            src={selectedImage}
            alt={`${name} - Main View`}
            fill
            priority
            className="object-cover"
          />
        )}
      </div>

      {/* Thumbnail Gallery */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {validImages.map((imageUrl, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(imageUrl)}
              className={`aspect-square relative rounded-lg overflow-hidden bg-gray-100
                ${selectedImage === imageUrl ? 'ring-2 ring-green-500' : ''}
              `}
            >
              <Image
                src={imageUrl}
                alt={`${name} view ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;