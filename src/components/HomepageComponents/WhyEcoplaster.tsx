"use client";

import React from "react";
import { ShieldCheck, Truck, Smile, Wrench, PackageCheck } from "lucide-react";

const WhyEcoPlaster: React.FC = () => {
  const featuresOne = [
    {
      icon: <Smile size={24} className="text-greenComponent" />, // Reduced icon size
      title: "25 Lakhs+ Customers",
    },
    {
      icon: <Truck size={24} className="text-greenComponent" />,
      title: "Free Shipping",
    },
    {
      icon: <Wrench size={24} className="text-greenComponent" />,
      title: "Free Installation",
    },
    {
      icon: <ShieldCheck size={24} className="text-greenComponent" />,
      title: "Best Warranty",
    },
  ];

  const featuresTwo = [
    {
      icon: <PackageCheck size={24} className="text-greenComponent" />,
      title: "Eco-Friendly Materials",
    },
    {
      icon: <Smile size={24} className="text-greenComponent" />,
      title: "Customer Satisfaction",
    },
    {
      icon: <Wrench size={24} className="text-greenComponent" />,
      title: "Affordable Pricing",
    },
    {
      icon: <ShieldCheck size={24} className="text-greenComponent" />,
      title: "Durability Guaranteed",
    },
  ];

  return (
    <section className="bg-beige py-4">
      <div className="max-w-6xl mx-auto flex flex-wrap md:flex-nowrap gap-4">
        {/* First Box */}
        <div className="flex-1 border bg-white border-lightgreen rounded-md py-2 px-3 text-center">
          {/* Title */}
          <h2 className="text-sm font-bold text-newgreen mb-3">
            Why EcoPlaster?
          </h2>

          {/* Features Row */}
          <div className="flex flex-wrap justify-center gap-4">
            {featuresOne.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-1 w-20"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-[12px] font-medium text-newgreensecond">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Second Box */}
        <div className="flex-1 border bg-white border-lightgreen rounded-md py-2 px-3 text-center">
          {/* Title */}
          <h2 className="text-sm font-bold text-newgreen mb-3">
            What Makes Us Special?
          </h2>

          {/* Features Row */}
          <div className="flex flex-wrap justify-center gap-4">
            {featuresTwo.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-1 w-20"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-[12px] font-medium text-newgreensecond">
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
