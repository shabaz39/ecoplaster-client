import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  TruckIcon, 
  Package, 
  ShoppingBag,
  XCircle, 
  AlertCircle 
} from 'lucide-react';

interface OrderTrackingProps {
  status: string;
  trackingNumber?: string;
  shippingMethod?: string;
  estimatedDelivery?: string;
  onTrack?: () => void;
}

// Order status to step number mapping
const orderStepMap = {
  "Pending": 0,
  "Processing": 1,
  "Shipped": 2, 
  "Delivered": 3,
  "Cancelled": -1,
  "Returned": -2
};

// Define the steps with their icons
const steps = [
  { name: 'Order Placed', icon: ShoppingBag },
  { name: 'Processing', icon: Package },
  { name: 'Shipped', icon: TruckIcon },
  { name: 'Delivered', icon: CheckCircle }
];

// Format date helper
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return '';
  }
};

const OrderTracker: React.FC<OrderTrackingProps> = ({ 
  status, 
  trackingNumber, 
  shippingMethod,
  estimatedDelivery,
  onTrack 
}) => {
  // Get current step from status
  const currentStep = orderStepMap[status as keyof typeof orderStepMap];
  
  // Handle cancelled or returned orders
  if (currentStep < 0) {
    return (
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-2 mb-4">
          {currentStep === -1 ? (
            <>
              <XCircle className="text-red-500" size={20} />
              <span className="font-medium text-red-500">Order Cancelled</span>
            </>
          ) : (
            <>
              <AlertCircle className="text-orange-500" size={20} />
              <span className="font-medium text-orange-500">Order Returned</span>
            </>
          )}
        </div>
        
        {trackingNumber && (
          <div className="mt-2 flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Tracking Number</p>
              <p className="font-medium">{trackingNumber}</p>
            </div>
            <button 
              onClick={onTrack}
              className="px-3 py-1 bg-newgreensecond text-white text-sm rounded-md hover:bg-newgreen"
            >
              Track
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h4 className="font-medium mb-6">Order Status</h4>
      
      {/* Step indicators */}
      <div className="relative">
        {/* Progress Bar - Line connecting all steps */}
        <div className="absolute left-0 top-5 w-full h-0.5 bg-gray-200">
          {/* Progress indicator */}
          <div 
            className="h-full bg-newgreensecond transition-all duration-500" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div 
                className={`z-10 flex items-center justify-center w-10 h-10 rounded-full mb-2 transition-colors
                  ${idx <= currentStep 
                    ? 'bg-newgreensecond text-white' 
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                  }`}
              >
                {idx < currentStep ? (
                  <CheckCircle size={18} />
                ) : idx === currentStep ? (
                  <step.icon size={18} />
                ) : (
                  <step.icon size={18} />
                )}
              </div>
              <span className={`text-xs text-center font-medium
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

      {/* Delivery Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {estimatedDelivery && (
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Estimated Delivery</p>
            <p className="font-medium">{formatDate(estimatedDelivery)}</p>
          </div>
        )}
        
        {shippingMethod && (
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Shipping Method</p>
            <p className="font-medium">{shippingMethod}</p>
          </div>
        )}
      </div>
      
      {/* Tracking Info */}
      {trackingNumber && (
        <div className="mt-4 flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
          <div>
            <p className="text-sm text-gray-500">Tracking Number</p>
            <p className="font-medium">{trackingNumber}</p>
          </div>
          <button 
            onClick={onTrack}
            className="px-3 py-1 bg-newgreensecond text-white text-sm rounded-md hover:bg-newgreen"
          >
            Track
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;