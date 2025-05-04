"use client";

import React from "react";

const BulkOrderForm: React.FC = () => {
  return (
    <section className="bg-white py-8 text-black ">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section: Image */}
        <div className="flex justify-center lg:m-32">
          <img
            src="/bulkorderpage.png"
            alt="EcoPlaster Product"
            className="rounded-lg shadow-lg object-cover max-h-96"
          />
        </div>

        {/* Right Section: Form */}
        <div>
          <h2 className="text-2xl font-semibold text-newgreen mb-4">
            Enquire Now
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Minimum Order Value - INR 2,00,000
          </p>
          <form className="space-y-4">
            {/* Name */}
            <div>
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-newgreen"
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-newgreen"
              />
            </div>

            {/* Phone Number */}
            <div>
              <div className="flex">
                <span className="px-4 py-2 border rounded-l-md bg-gray-200 text-gray-600">
                  +91
                </span>
                <input
                  type="text"
                  placeholder="Mobile Number"
                  maxLength={10}
                  className="flex-1 px-4 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-newgreen"
                />
              </div>
            </div>

            {/* Requirements */}
            <div>
              <textarea
                rows={4}
                placeholder="Tell us your requirements"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-newgreen"
              />
            </div>

            {/* Pincode */}
            <div>
              <input
                type="text"
                placeholder="Pincode"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-newgreen"
              />
            </div>

            {/* Organisation */}
            <div>
              <input
                type="text"
                placeholder="Organisation"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-newgreen"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-newgreen text-white font-semibold rounded-md hover:bg-newgreensecond"
            >
              Request a Call
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BulkOrderForm;
