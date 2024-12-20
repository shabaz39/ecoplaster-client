"use client";

import React from "react";

const UserDashboard: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen lg:px-64">
      {/* Header Section */}
      <header className="bg-cream px-6 py-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-700">Good Afternoon,</h1>
          <h2 className="text-xl font-semibold text-green">Mohammed Rafi</h2>
        </div>
        <div className="text-green">
          <button className="text-lg">
            <span role="img" aria-label="user-icon">👤</span>
          </button>
        </div>
      </header>

      {/* Orders Section */}
      <section className="px-6 py-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <span role="img" aria-label="box-icon" className="mr-2">📦</span>
            Orders
          </h3>
          <a href="#" className="text-newgreensecond font-medium hover:underline">
            See All
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["Order1", "Order2"].map((order, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <img
                src={`/${order}.png`}
                alt={order}
                className="w-full h-32 object-cover rounded-md"
              />
              <p className="mt-2 text-gray-700 font-semibold">
                {order} - Delivered
              </p>
              <div className="mt-2 flex justify-between text-sm">
                <a href="#" className="text-newgreensecond hover:underline">
                  Order Details
                </a>
                <a href="#" className="text-newgreensecond hover:underline">
                  Get Help
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chat and FAQs Section */}
      <section className="px-6 py-8">
        <h3 className="text-lg font-semibold text-gray-700">Chat and FAQs</h3>
        <div className="flex gap-4 mt-4">
          {["Chat With Us", "FAQs", "Contact Us"].map((item, index) => (
            <div
              key={index}
              className="flex-1 bg-cream p-4 rounded-lg shadow-sm"
            >
              <p className="text-gray-700 font-semibold">{item}</p>
              <p className="text-sm text-gray-600">
                Quick access to support and information.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-8">
        <h3 className="text-lg font-semibold text-gray-700">Your Benefits</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["Wallet", "Rewards", "Refer & Earn"].map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                index % 2 === 0 ? "bg-beige" : "bg-mint"
              } shadow-sm`}
            >
              <h4 className="text-gray-700 font-semibold">{item}</h4>
              <p className="text-sm text-gray-600">
                Access your {item.toLowerCase()} details.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* My Account Section */}
      <section className="px-6 py-8">
        <h3 className="text-lg font-semibold text-gray-700">My Account</h3>
        <ul className="mt-4 space-y-2">
          {["Manage Saved Addresses", "Sign Out"].map((item, index) => (
            <li key={index} className="text-newgreensecond hover:underline">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default UserDashboard;
