"use client";

import React from "react";
import { ShieldCheck, Truck, Smile, Wrench } from "lucide-react"; // Example icons

const WhyEcoPlaster: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck size={30} className="text-green" />, // Reduced icon size
      title: "Best Warranty",
      description: "Up to 10 years warranty on EcoPlaster.",
    },
    {
      icon: <Truck size={30} className="text-green" />, // Reduced icon size
      title: "Free Shipping",
      description: "Free doorstep delivery for EcoPlaster products.",
    },
    {
      icon: <Smile size={30} className="text-green" />, // Reduced icon size
      title: "25 Lakh+ Customers",
      description: "Trusted by millions of satisfied customers.",
    },
    {
      icon: <Wrench size={30} className="text-green" />, // Reduced icon size
      title: "Free Installation",
      description: "Hassle-free installation services included.",
    },
  ];

  return (
    <section className="bg-newbeige py-3">
      <div className="max-w-7xl mx-auto text-center px-4">
        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-newgreensecond">
          Why EcoPlaster?
        </h2>

        {/* Features Grid */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-md p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-2">{feature.icon}</div>
              <h3 className="text-sm font-semibold text-newgreen mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyEcoPlaster;
