"use client";

import React from "react";
import { Leaf, Palette, Wrench, Shield, Gem, Home, Wind, Package } from "lucide-react";
import { useRouter } from "next/navigation";

const featuresOne = [
  {
    icon: <Leaf size={32} className="text-greenComponent drop-shadow-md" />,
    title: "Silk & Cotton-Based",
    subtitle: "Eco-friendly, non-toxic material safe for all."
  },
  {
    icon: <Palette size={32} className="text-greenComponent drop-shadow-md" />,
    title: "148+ Elegant Shades",
    subtitle: "Perfect for stylish wall makeovers."
  },
  {
    icon: <Wrench size={32} className="text-greenComponent drop-shadow-md" />,
    title: "No Paint or Putty Needed",
    subtitle: "Apply directly with just one coat of primer."
  },
  {
    icon: <Shield size={32} className="text-greenComponent drop-shadow-md" />,
    title: "Multi-protection",
    subtitle: "Covers cracks, resists heat, sound & fire."
  },
];

const featuresTwo = [
  {
    icon: <Gem size={32} className="text-greenComponent drop-shadow-md" />,
    title: "Premium Finish",
    subtitle: "Gives walls a rich, textured designer look."
  },
  {
    icon: <Home size={32} className="text-greenComponent drop-shadow-md" />,
    title: "Crack Coverage",
    subtitle: "Hides imperfections with ease."
  },
  {
    icon: <Wind size={32} className="text-greenComponent drop-shadow-md" />,
    title: "Breathable & Hypoallergenic",
    subtitle: "Safe for kids, elderly, and sensitive skin."
  },
  {
    icon: <Package size={32} className="text-greenComponent drop-shadow-md" />,
    title: "Value for Money",
    subtitle: "1 Packet covers 45 sq ft – long-lasting & economical"
  },
];

const WhyEcoPlaster: React.FC = () => {
  const router = useRouter();

  const handleFeatureClick = () => {
    router.push('/features');
  };

  return (
    <section className="bg-beige py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Box */}
        <div className="bg-white border border-lightgreen rounded-2xl py-6 px-5 shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-lg font-bold text-newgreen mb-4 text-center md:text-left">
            <span className="text-2xl">🌿</span> <span className="text-newgreen">Why</span> Ecoplaster?
          </h2>

          <div className="space-y-4">
            {featuresOne.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-3 group hover:bg-green-50 p-3 rounded-lg transition-all duration-300 hover:shadow-sm cursor-pointer"
                onClick={handleFeatureClick}
              >
                <div className="flex-shrink-0 bg-green-100 p-2 rounded-full transform transition-all duration-300 hover:scale-110 hover:rotate-12 hover:shadow-lg group-hover:animate-pulse">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-newgreensecond mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second Box */}
        <div className="bg-white border border-lightgreen rounded-2xl py-6 px-5 shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-lg font-bold text-newgreen mb-4 text-center md:text-left">
            <span className="text-2xl">✨</span> <span className="text-newgreen">What Makes</span> Ecoplaster Special?
          </h2>

          <div className="space-y-4">
            {featuresTwo.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-3 group hover:bg-green-50 p-3 rounded-lg transition-all duration-300 hover:shadow-sm cursor-pointer"
                onClick={handleFeatureClick}
              >
                <div className="flex-shrink-0 bg-green-100 p-2 rounded-full transform transition-all duration-300 hover:scale-110 hover:rotate-12 hover:shadow-lg group-hover:animate-pulse">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-newgreensecond mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyEcoPlaster;