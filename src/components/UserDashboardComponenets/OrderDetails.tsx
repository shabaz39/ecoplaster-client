// src/components/UserDashboardComponenets/OrderDetails.tsx
import React, { useState } from 'react';
import { ChevronRight, Package as PackageIcon, ExternalLink } from 'lucide-react'; // Import ExternalLink
import { Order, formatDate, getStatusColor, getPaymentStatusColor } from './types';
import OrderTracker from './OrderTracker';
import { safeId } from '../../utils/safeId';
import { useRouter } from 'next/navigation'; // Import useRouter
import Link from 'next/link';

interface OrderDetailsProps {
  order: Order; // Make sure the Order type includes shiprocketAWBCode etc.
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter(); // Initialize router

  // Determine the tracking number and shipping method to use
  // Prioritize Shiprocket AWB code and Courier name
  const trackingNumberToShow = order.shiprocketAWBCode || order.trackingNumber;
  const shippingMethodToShow = order.shiprocketCourier || order.shippingMethod;

  // Handler for the track button click
  const handleTrackClick = () => {
    if (trackingNumberToShow) {
      // Navigate to the public tracking page with the AWB code
      router.push(`/track-order?awb=${encodeURIComponent(trackingNumberToShow)}`);
    }
  };

  // Generate a simple display order number (e.g., last 8 chars of ID)
  const displayOrderNumber = order.id ? `...${order.id.slice(-8)}` : 'N/A';

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-4 text-black">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div>
            <div className="flex items-center flex-wrap gap-x-2">
              <h3 className="font-semibold text-sm sm:text-base text-gray-800">
                Order ID: {displayOrderNumber}
              </h3>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm sm:text-base text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN') ?? '0.00'}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Body Section (Items Preview + Toggle) */}
      <div className="p-4">
        {/* Order items preview */}
        <div className="flex overflow-x-auto gap-3 pb-2">
          {order.products?.map((product) => (
            <div key={safeId(product.productId)} className="flex-shrink-0">
              <div className="h-16 w-16 rounded-md bg-gray-100 overflow-hidden border">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name || 'Product'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')} // Basic placeholder
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <PackageIcon className="text-gray-400" size={24} />
                  </div>
                )}
              </div>
            </div>
          ))}
           {order.products?.length === 0 && (
                 <p className="text-xs text-gray-500">No product details available.</p>
           )}
        </div>

        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {order.products?.length || 0} {order.products?.length === 1 ? 'item' : 'items'}
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-newgreensecond hover:text-newgreen text-sm flex items-center font-medium"
          >
            {showDetails ? 'Hide details' : 'View details'}
            <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {showDetails && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h4 className="font-medium mb-4 text-gray-800">Items in your order</h4>
          <div className="space-y-4 mb-6">
            {order.products?.map((product) => (
              <div key={safeId(product.productId)} className="flex gap-4 items-start">
                <div className="h-16 w-16 rounded-md bg-gray-100 overflow-hidden border flex-shrink-0">
                   {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name || 'Product'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                       onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <PackageIcon className="text-gray-400" size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm truncate text-gray-900">{product.name || 'Unnamed Product'}</h5>
                   <p className="text-xs text-gray-500">Code: {product.code || 'N/A'}</p>
                  <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                </div>
                <div className="text-right text-sm font-medium text-gray-900 flex-shrink-0">
                  ₹{(product.price || 0).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
             {order.products?.length === 0 && (
                 <p className="text-xs text-center text-gray-500 py-4">No product details found for this order.</p>
           )}
          </div>

          {/* Order tracking */}
          <OrderTracker
            status={order.status}
            trackingNumber={trackingNumberToShow} // Pass the determined tracking number
            shippingMethod={shippingMethodToShow} // Pass the determined shipping method
            estimatedDelivery={order.estimatedDelivery}
            onTrack={trackingNumberToShow ? handleTrackClick : undefined} // Pass handler only if number exists
          />

          {/* Actions */}
          <div className="mt-6 flex flex-wrap justify-end gap-2">
           <Link href="/contactus" passHref>
              <button className="px-3 py-1 border border-gray-300 text-gray-700 text-xs sm:text-sm rounded hover:bg-gray-50 transition-colors">
                Need Help?
              </button>
            </Link>
            {order.status === "Delivered" && (
              <button className="px-3 py-1 bg-newgreensecond text-white text-xs sm:text-sm rounded hover:bg-newgreen">
                Write a Review
              </button>
            )}
            {(order.status === "Delivered") && /* Add return window logic here */ (
              <button className="px-3 py-1 border border-orange-500 text-orange-600 text-xs sm:text-sm rounded hover:bg-orange-50">
                Return/Exchange
              </button>
            )}
     
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;