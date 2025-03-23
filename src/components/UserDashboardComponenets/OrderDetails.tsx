// src/components/UserDashboard/OrderDetails.tsx
import React, { useState } from 'react';
import { ChevronRight, Package as PackageIcon } from 'lucide-react';
import { Order, formatDate, getStatusColor, getPaymentStatusColor } from './types';
import OrderTracker from './OrderTracker';
import { safeId } from '../../utils/safeId';

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-4">
      <div className="p-4">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <div className="flex items-center">
              <h3 className="font-medium">{order.orderNumber}</h3>
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">₹{order.totalAmount.toLocaleString()}</p>
            <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>
        
        {/* Order items preview */}
        <div className="mt-3 flex overflow-x-auto gap-2">
          {order.products.map((product) => (
    <div key={safeId(product.productId)} className="flex gap-4 items-center">
              <div className="h-16 w-16 rounded-md bg-gray-100 overflow-hidden">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <PackageIcon className="text-gray-400" size={24} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
          </span>
          <button 
            onClick={() => setShowDetails(!showDetails)} 
            className="text-newgreensecond hover:text-newgreen text-sm flex items-center"
          >
            {showDetails ? 'Hide details' : 'View details'}
            <ChevronRight className={`w-4 h-4 ml-1 ${showDetails ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Expanded details */}
      {showDetails && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h4 className="font-medium mb-2">Items in your order</h4>
          <div className="space-y-4">
            {order.products.map((product) => (
              <div key={product.productId} className="flex gap-4 items-center">
                <div className="h-16 w-16 rounded-md bg-gray-100 overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <PackageIcon className="text-gray-400" size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium">{product.name}</h5>
                  <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order tracking */}
          <OrderTracker 
            status={order.status}
            trackingNumber={order.trackingNumber}
            shippingMethod={order.shippingMethod}
            estimatedDelivery={order.estimatedDelivery}
          />
          
          {/* Actions */}
          <div className="mt-4 flex justify-end gap-2">
            <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
              Need Help?
            </button>
            {order.status === "Delivered" && (
              <button className="px-3 py-1 bg-newgreensecond text-white text-sm rounded hover:bg-newgreen">
                Write a Review
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;