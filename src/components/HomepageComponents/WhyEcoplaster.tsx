"use client";

import React from "react";
import { ShieldCheck, Truck, Smile, Wrench, PackageCheck } from "lucide-react";

const WhyEcoPlaster: React.FC = () => {
  const featuresOne = [
    {
      icon: <Smile size={32} className="text-greenComponent drop-shadow-md" />,
      title: "25 Lakhs+ Customers",
    },
    {
      icon: <Truck size={32} className="text-greenComponent drop-shadow-md" />,
      title: "Free Shipping",
    },
    {
      icon: <Wrench size={32} className="text-greenComponent drop-shadow-md" />,
      title: "Free Installation",
    },
    {
      icon: <ShieldCheck size={32} className="text-greenComponent drop-shadow-md" />,
      title: "Best Warranty",
    },
  ];

  const featuresTwo = [
    {
      icon: <PackageCheck size={32} className="text-greenComponent drop-shadow-md" />,
      title: "Eco-Friendly Materials",
    },
    {
      icon: <Smile size={32} className="text-greenComponent drop-shadow-md" />,
      title: "Customer Satisfaction",
    },
    {
      icon: <Wrench size={32} className="text-greenComponent drop-shadow-md" />,
      title: "Affordable Pricing",
    },
    {
      icon: <ShieldCheck size={32} className="text-greenComponent drop-shadow-md" />,
      title: "Durability Guaranteed",
    },
  ];

  return (
    <section className="bg-beige py-8">
      <div className="max-w-6xl mx-auto flex flex-wrap md:flex-nowrap gap-6 px-4">
        {/* First Box */}
        <div className="flex-1 bg-white border border-lightgreen rounded-2xl py-6 px-5 shadow-lg hover:shadow-xl transition-all">
          {/* Title */}
          <h2 className="text-lg font-bold text-newgreen mb-4 text-left">
            <span className="text-newgreen">Why</span> EcoPlaster?
          </h2>

          {/* Features Row */}
          <div className="flex justify-between items-center gap-5">
            {featuresOne.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 w-24"
              >
                <div className="flex justify-center bg-green-100 p-2 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-medium text-newgreensecond text-center">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Second Box */}
        <div className="flex-1 bg-white border border-lightgreen rounded-2xl py-6 px-5 shadow-lg hover:shadow-xl transition-all">
          {/* Title */}
          <h2 className="text-lg font-bold text-newgreen mb-4 text-left">
            <span className="text-newgreen">What Makes Us</span> Special?
          </h2>

          {/* Features Row */}
          <div className="flex justify-between items-center gap-5">
            {featuresTwo.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 w-24"
              >
                <div className="flex justify-center bg-green-100 p-2 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-medium text-newgreensecond text-center">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyEcoPlaster;