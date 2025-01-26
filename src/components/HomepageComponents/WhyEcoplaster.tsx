"use client";

import React from "react";
import { ShieldCheck, Truck, Smile, Wrench, PackageCheck } from "lucide-react";

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

const WhyEcoPlaster: React.FC = () => {
  return (
    <section className="bg-beige py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Box */}
        <div className="bg-white border border-lightgreen rounded-2xl py-6 px-5 shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-lg font-bold text-newgreen mb-4 text-center md:text-left">
            <span className="text-newgreen">Why</span> EcoPlaster?
          </h2>

          <div className="grid grid-cols-2 gap-4 md:flex md:justify-between">
            {featuresOne.map((feature, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="flex justify-center bg-green-100 p-3 rounded-full">
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
        <div className="bg-white border border-lightgreen rounded-2xl py-6 px-5 shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-lg font-bold text-newgreen mb-4 text-center md:text-left">
            <span className="text-newgreen">What Makes Us</span> Special?
          </h2>

          <div className="grid grid-cols-2 gap-4 md:flex md:justify-between">
            {featuresTwo.map((feature, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="flex justify-center bg-green-100 p-3 rounded-full">
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
