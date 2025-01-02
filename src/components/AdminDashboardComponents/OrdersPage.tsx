"use client";

import React from "react";

const orders = [
  {
    id: "ORD12345",
    user: "John Doe",
    status: "Pending",
    payment: "Paid",
    address: "123 Main St, Springfield",
    contact: "+1 555-1234",
    dealership: "Springfield Auto Hub",
    date: "2024-01-01",
    total: "$2500",
  },
  {
    id: "ORD67890",
    user: "Jane Smith",
    status: "Shipped",
    payment: "Pending",
    address: "456 Elm St, Shelbyville",
    contact: "+1 555-5678",
    dealership: "Shelbyville Cars",
    date: "2024-01-02",
    total: "$1800",
  },
];

const OrdersPageComponent: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen lg:px-64">
      <header className="bg-cream px-6 py-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-700">Orders Overview</h1>
          <h2 className="text-xl font-semibold text-green">Admin Dashboard</h2>
        </div>
      </header>

      <section className="px-6 py-8">
        <h3 className="text-lg font-semibold text-gray-700">All Orders</h3>
        <div className="mt-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-black">
                <th className="border border-black px-4 py-2">Order ID</th>
                <th className="border border-black px-4 py-2">Payment</th>
                <th className="border border-black px-4 py-2">Total</th>
                <th className="border border-black px-4 py-2">Status</th>
                <th className="border border-black px-4 py-2">Date</th>
                <th className="border border-black px-4 py-2">Actions</th>
                <th className="border border-black px-4 py-2">User</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="bg-white text-black hover:bg-gray-100">
                  <td className="border border-black px-4 py-2">{order.id}</td>
                  <td className="border border-black px-4 py-2">{order.user}</td>
                  <td className="border border-black px-4 py-2">{order.status}</td>
                  <td className="border border-black px-4 py-2">{order.payment}</td>
                  <td className="border border-black px-4 py-2">{order.total}</td>
                  <td className="border border-black px-4 py-2">{order.date}</td>
                  <td className="border border-black px-4 py-2 text-center">
                    <button className="text-blue-500 hover:underline mr-4">
                      View Details
                    </button>
                    <button className="text-red-500 hover:underline">
                      Cancel Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="px-6 py-8">
        <h3 className="text-lg font-semibold text-gray-700">Order Details</h3>
        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg mt-6 border border-gray-200"
          >
            <h4 className="text-lg font-semibold">Order ID: {order.id}</h4>
            <p className="text-gray-600 mt-2">User: {order.user}</p>
            <p className="text-gray-600">Status: {order.status}</p>
            <p className="text-gray-600">Payment: {order.payment}</p>
            <p className="text-gray-600">Total: {order.total}</p>
            <p className="text-gray-600">Order Date: {order.date}</p>
            <div className="mt-4">
              <h5 className="text-gray-700 font-semibold">Shipping Info</h5>
              <p className="text-gray-600">Address: {order.address}</p>
              <p className="text-gray-600">Contact: {order.contact}</p>
              <p className="text-gray-600">Dealership: {order.dealership}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="bg-green-500 text-white px-4 py-2 rounded mr-4">
                Update Status
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded">
                Cancel Order
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default OrdersPageComponent;
