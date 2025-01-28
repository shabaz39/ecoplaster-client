import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../types/product.types';
import { ShoppingCart, CreditCard, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  fallbackImage: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, fallbackImage }) => {
  const { addToCart, removeFromCart, cartItems } = useCart();
  const increasedMRP = Math.ceil(product.price.mrp * 1.5);
  const discount = Math.round(((increasedMRP - product.price.offerPrice) / increasedMRP) * 100);

  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price.offerPrice,
      quantity: 1,
    });
  };

  return (
    <Link href={`/productDescription/${product.id}`} passHref>
      <div className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 cursor-pointer">
        {/* Image Section */}
        <div className="relative h-72 w-full overflow-hidden">
          <Image
            src={product.images?.imageMain || fallbackImage}
            alt={product.name}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-md text-xs font-semibold">
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-productNameColor truncate mb-1 group-hover:text-hoverColor transition-colors">
            {product.name}
          </h3>
          <p className="text-searchBeige text-sm mb-2">Code: {product.code}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {product.color.map((color) => (
              <span key={color} className="text-xs px-2 py-1 bg-cream text-newgreen rounded-full">
                {color}
              </span>
            ))}
          </div>

          {/* Series & Finish */}
          <div className="text-sm text-black mb-3">
            <p className="truncate">Series: {product.series.join(' • ')}</p>
            <p className="truncate">Finish: {product.finish.join(' • ')}</p>
          </div>

          {/* Price Section */}
          <div className="mt-4 flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-productNameColor">
                ₹{product.price.offerPrice.toLocaleString()}
              </span>
              <span className="text-sm text-searchBeige line-through ml-2">
                ₹{increasedMRP.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Buttons & Quantity Control */}
          <div className="mt-5 flex flex-col gap-3">
            {quantity > 0 ? (
              <div className="flex items-center justify-between border border-greenComponent rounded-lg px-4 py-2">
                <button onClick={() => removeFromCart(product.id)} className="text-newgreen hover:text-hoverColor">
                  <Minus size={16} />
                </button>
                <span className="text-lg font-semibold text-productNameColor">{quantity}</span>
                <button onClick={handleAddToCart} className="text-newgreen hover:text-hoverColor">
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 w-full bg-beige text-black py-2 rounded-lg 
                hover:bg-newbeige hover:text-black transition-colors duration-200 font-medium">
                <ShoppingCart size={16} /> Add to Cart
              </button>
            )}
            <button className="flex items-center justify-center gap-2 w-full bg-newgreensecond text-white py-2 rounded-lg 
              hover:bg-newgreen transition-colors duration-200 font-medium">
              <CreditCard size={16} /> Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
