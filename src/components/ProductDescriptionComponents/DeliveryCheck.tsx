"use client";

import React, { useState } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import pincodeDirectory from "india-pincode-lookup";

interface DeliveryInfo {
  days: string;
  location?: {
    district: string;
    state: string;
  };
}

interface LocationInfo {
  isValid: boolean;
  district?: string;
  state?: string;
}

const DeliveryCheck: React.FC = () => {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);

  const validateAndGetLocation = (pin: string): LocationInfo => {
    try {
      const locations = pincodeDirectory.lookup(pin);
      if (locations && locations.length > 0) {
        // Get the first location as it's usually the main post office
        const location = locations[0];
        return {
          isValid: true,
          district: location.districtName,
          state: location.stateName
        };
      }
      return { isValid: false };
    } catch (err) {
      return { isValid: false };
    }
  };

  const handleCheck = async () => {
    setError("");
    setDeliveryInfo(null);
    
    if (!pincode) {
      setError("Please enter a pincode");
      return;
    }

    if (pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);
    
    // Simulate API call while validating pincode
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const locationInfo = validateAndGetLocation(pincode);
      
      if (locationInfo.isValid && locationInfo.district && locationInfo.state) {
        setDeliveryInfo({ 
          days: "5-7",
          location: {
            district: locationInfo.district,
            state: locationInfo.state
          }
        });
      } else {
        setError("Please enter a valid Indian pincode");
      }
    } catch (err) {
      setError("Unable to process delivery estimate. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <div className="mt-4 max-w-md">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        Check Delivery Availability
      </label>
      
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter a Pincode"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm 
                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
        />
        <button
          className="bg-newgreensecond text-white px-4 py-2 rounded-md text-sm font-medium
                   hover:bg-newgreen focus:outline-none focus:ring-2 focus:ring-newgreen focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          onClick={handleCheck}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            "Check"
          )}
        </button>
      </div>

      {error && (
        <div className="mt-3 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {deliveryInfo && (
        <div className="mt-3 p-3 rounded-md bg-green-50 border border-green-200 text-green-700 flex items-start">
          <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p>Delivery available for {deliveryInfo.location?.district}, {deliveryInfo.location?.state}</p>
            <p className="mt-1">Estimated delivery time: {deliveryInfo.days} business days</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryCheck;