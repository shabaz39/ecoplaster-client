// src/components/UserDashboardComponenets/OrderTracker.tsx
import React from 'react';
import {
  CheckCircle,
  Clock,
  TruckIcon,
  Package,
  ShoppingBag,
  XCircle,
  AlertCircle,
  ExternalLink // Import ExternalLink icon
} from 'lucide-react';

interface OrderTrackingProps {
  status: string;
  trackingNumber?: string | null; // Allow null
  shippingMethod?: string | null; // Allow null
  estimatedDelivery?: string | null; // Allow null
  onTrack?: () => void; // Callback for the track button
}

// Order status to step number mapping
const orderStepMap: Record<string, number> = {
  "Pending": 0,
  "Processing": 1,
  "Shipped": 2,
  "Delivered": 3,
  "Cancelled": -1,
  "Returned": -2 // Assuming -2 for Returned
};

// Define the steps with their icons
const steps = [
  { name: 'Order Placed', icon: ShoppingBag },
  { name: 'Processing', icon: Package },
  { name: 'Shipped', icon: TruckIcon },
  { name: 'Delivered', icon: CheckCircle }
];

// Format date helper (consider moving to types.ts if used elsewhere)
const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A'; // Return N/A if no date

  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
       return 'N/A';
    }
    return date.toLocaleDateString('en-IN', { // Use Indian locale
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'Invalid Date'; // Return specific error string
  }
};

const OrderTracker: React.FC<OrderTrackingProps> = ({
  status,
  trackingNumber,
  shippingMethod,
  estimatedDelivery,
  onTrack // Receive the onTrack prop
}) => {
  // Get current step from status, default to -3 for unknown status
  const currentStep = orderStepMap[status] ?? -3;

  // Handle cancelled or returned orders
  if (currentStep < 0) {
    const isCancelled = currentStep === -1;
    const message = isCancelled ? "Order Cancelled" : "Order Returned";
    const Icon = isCancelled ? XCircle : AlertCircle;
    const color = isCancelled ? "text-red-500" : "text-orange-500";
    const bgColor = isCancelled ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200";


    return (
      <div className={`mt-6 p-4 border rounded-lg ${bgColor}`}>
        <div className={`flex items-center gap-2 mb-3 font-medium ${color}`}>
          <Icon size={20} />
          <span>{message}</span>
        </div>

        {trackingNumber && onTrack && (
          <div className="mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-white rounded-lg border border-gray-200 gap-2 shadow-sm">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Tracking Number</p>
              <p className="font-medium text-sm text-gray-900">{trackingNumber}</p>
               {shippingMethod && <p className="text-xs text-gray-500 mt-0.5">via {shippingMethod}</p>}
            </div>
            <button
              onClick={onTrack} // Use the passed function
              className="px-3 py-1 bg-newgreensecond text-white text-xs sm:text-sm rounded-md hover:bg-newgreen flex items-center gap-1 self-start sm:self-center" // Adjusted button alignment
            >
              Track <ExternalLink size={12} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
      <h4 className="font-medium mb-6 text-gray-800 text-base">Order Status</h4>

      {/* Step indicators */}
      <div className="relative mb-8">
        {/* Progress Bar */}
        <div className="absolute left-0 top-5 w-full h-0.5 bg-gray-200 -z-0">
          <div
            className="h-full bg-newgreensecond transition-all duration-500"
            style={{ width: currentStep >= 0 ? `${(currentStep / (steps.length - 1)) * 100}%` : '0%' }}
          ></div>
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center w-1/4 px-1 text-center"> {/* Added text-center */}
              <div
                className={`z-10 flex items-center justify-center w-10 h-10 rounded-full mb-1 transition-colors
                  ${idx <= currentStep
                    ? 'bg-newgreensecond text-white shadow-md'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
              >
                {idx < currentStep ? (
                  <CheckCircle size={18} />
                ) : (
                  <step.icon size={18} />
                )}
              </div>
              <span className={`text-[10px] sm:text-xs font-medium leading-tight
                ${idx <= currentStep
                  ? 'text-newgreensecond'
                  : 'text-gray-500'
                }`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery & Tracking Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {estimatedDelivery && (
          <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Estimated Delivery</p>
            <p className="font-medium text-sm text-gray-900">{formatDate(estimatedDelivery)}</p>
          </div>
        )}

        {shippingMethod && (
          <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Shipping Method</p>
            <p className="font-medium text-sm text-gray-900">{shippingMethod}</p>
          </div>
        )}
      </div>

      {trackingNumber && onTrack && (
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-white rounded-lg border border-gray-200 gap-2 shadow-sm">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Tracking Number</p>
            <p className="font-medium text-sm text-gray-900">{trackingNumber}</p>
          </div>
          <button
            onClick={onTrack}
            className="px-3 py-1 bg-newgreensecond text-white text-xs sm:text-sm rounded-md hover:bg-newgreen flex items-center gap-1 self-start sm:self-center"
          >
            Track <ExternalLink size={12} />
          </button>
        </div>
      )}
       {!trackingNumber && status === 'Shipped' && (
          <p className="text-xs text-center text-gray-500 mt-4">Tracking information will be available soon.</p>
      )}
    </div>
  );
};

export default OrderTracker;