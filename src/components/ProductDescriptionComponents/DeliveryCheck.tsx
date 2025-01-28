"use client";

import React, { useState } from "react";

const DeliveryCheck: React.FC = () => {
  const [pincode, setPincode] = useState("");

  return (
    <div className="mt-4">
      <label className="block text-gray-700">Check Delivery Date</label>
      <div className="flex space-x-2 mt-1">
        <input
          type="text"
          placeholder="Enter a Pincode"
          className="border p-2 flex-1"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
        <button className="bg-newgreen text-white px-4 py-2">Check</button>
      </div>
    </div>
  );
};

export default DeliveryCheck;
