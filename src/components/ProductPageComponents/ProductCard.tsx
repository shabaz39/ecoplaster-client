import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IProduct } from '../../types/product.types';
import { ShoppingCart, CreditCard, Plus, Minus, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSession } from 'next-auth/react';

interface ProductCardProps {
  product: IProduct;
  fallbackImage: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, fallbackImage }) => {
  const { addToCart, toggleCart, removeFromCart, cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, showLoginPrompt } = useWishlist();
  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);
  const { status } = useSession();
  
  const increasedMRP = Math.ceil(product.price.mrp * 1.5);
  const discount = Math.round(((increasedMRP - product.price.offerPrice) / increasedMRP) * 100);

  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const productInWishlist = isInWishlist(product.id);

  const handleBuyNow = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price.offerPrice,
      originalPrice: product.price.mrp,
      quantity: 1,
    });
    toggleCart(); // Open sidebar
  };

  const handleAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price.offerPrice,
      originalPrice: product.price.mrp,
      quantity: 1,
    });
    toggleCart(); // Open sidebar
  };

  const handleWishlistToggle = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation
    event.preventDefault();
    
    if (status !== 'authenticated') {
      showLoginPrompt();
      return;
    }
    
    setIsWishlistAnimating(true);
    
    try {
      if (productInWishlist) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
    } finally {
      setTimeout(() => setIsWishlistAnimating(false), 300);
    }
  };

  return (
    <div className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 cursor-pointer">
      
      {/* Image Section - Click to navigate */}
      <Link href={`/productDescription/${product.id}`} passHref>
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
          
          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 bg-white p-2 rounded-full shadow-md transition-transform duration-300 ${
              isWishlistAnimating ? 'scale-125' : 'scale-100'
            } hover:bg-red-50`}
            aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              size={20} 
              className={productInWishlist ? "text-red-500 fill-red-500" : "text-gray-500"} 
            />
          </button>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-5">
        {/* Name - Click to navigate */}
        <Link href={`/productDescription/${product.id}`} passHref>
          <h3 className="text-lg font-semibold text-productNameColor truncate mb-1 group-hover:text-hoverColor transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-searchBeige text-sm mb-2">Code: {product.code}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {product.color.map((color: any) => (
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
              <button onClick={(e) => {
                e.stopPropagation();
                removeFromCart(product.id);
              }} className="text-newgreen hover:text-hoverColor">
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
          <button
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-2 w-full bg-newgreensecond text-white py-2 rounded-lg 
            hover:bg-newgreen transition-colors duration-200 font-medium">
            <CreditCard size={16} /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};