import React from 'react';
import { IProduct } from '../../types/product.types';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';

interface CartItem extends IProduct {
  quantity: number;
}

interface CartSummaryProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ items, onUpdateQuantity, onRemoveItem }) => {
  const total = items.reduce((sum, item) => sum + (item.price.offerPrice * item.quantity), 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sticky top-4 h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b">
        <ShoppingBag className="w-5 h-5 text-green-600" />
        <h2 className="text-lg font-semibold">Cart Summary</h2>
        <span className="ml-auto bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {items.length} items
        </span>
      </div>

      {/* Items List */}
      <div className="flex-grow overflow-auto my-4 -mx-4 px-4">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="mb-4 p-3 bg-gray-50 rounded-lg relative group"
            >
              <div className="flex gap-3">
                {/* Product Image */}
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.images.imageMain || '/placeholder.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{item.code}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="font-semibold">₹{(item.price.offerPrice * item.quantity).toLocaleString()}</p>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Total Section */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{total.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>

        {/* Checkout Button */}
        <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-medium 
          hover:bg-green-700 transition-colors active:scale-[0.99] transform duration-100">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartSummary;