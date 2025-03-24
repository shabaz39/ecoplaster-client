"use client";

import React from 'react';
import { Package, Truck } from 'lucide-react';

interface OrderProduct {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface OrderProps {
  order: {
    id: string;
    products: OrderProduct[];
    shippingAddress: OrderAddress;
    totalAmount: number;
    status: string;
  };
}

export const OrderSummary: React.FC<OrderProps> = ({ order }) => {
  console.log("Rendering OrderSummary with:", order);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:sticky md:top-4">
      <h2 className="text-lg font-semibold text-black mb-4">Order Summary</h2>
      
      {/* Order ID */}
      <div className="bg-gray-50 rounded-md p-3 mb-4">
        <p className="text-sm text-gray-500">Order ID</p>
        <p className="font-medium text-black">{order.id}</p>
      </div>

      {/* Products */}
      <div className="space-y-4 mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <Package size={16} className="mr-2 text-newgreensecond" />
          Items ({order.products.length})
        </h3>
        
        {order.products.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm border-b pb-2">
            <div className="flex items-center">
              {item.image ? (
                <div className="w-10 h-10 bg-gray-100 rounded-md mr-3 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded-md mr-3"></div>
              )}
              <div>
                <p className="font-medium text-black">{item.name}</p>
                <p className="text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
            <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Delivery Address */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center mb-2">
          <Truck size={16} className="mr-2 text-newgreensecond" />
          Delivery Address
        </h3>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-sm text-gray-600">
            {order.shippingAddress && [
              order.shippingAddress.street,
              order.shippingAddress.city,
              order.shippingAddress.state,
              order.shippingAddress.zip,
              order.shippingAddress.country,
            ]
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>₹{order.totalAmount.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600">FREE</span>
        </div>
        
        <div className="flex justify-between text-black font-medium pt-2 border-t mt-2">
          <span>Total</span>
          <span>₹{order.totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};