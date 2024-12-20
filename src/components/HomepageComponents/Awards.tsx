"use client";

import React from "react";
import { Award, Star, Globe, Leaf } from "lucide-react";


const awards = [
    {
      icon: <Award size={40} className="text-newgreensecond" />,
      title: "Best Eco-Friendly Product",
      description: "Awarded for outstanding environmental contributions.",
    },
    {
      icon: <Globe size={40} className="text-newgreensecond" />,
      title: "Innovation in Construction",
      description: "Recognized for groundbreaking advancements in construction materials.",
    },
    {
      icon: <Star size={40} className="text-newgreensecond" />,
      title: "Customer Choice Award",
      description: "Voted by customers for exceptional quality and service.",
    },
    {
      icon: <Leaf size={40} className="text-newgreensecond" />,
      title: "Sustainability Excellence",
      description: "Honored for promoting sustainability and eco-friendly solutions.",
    },
  ];

const AwardsSection: React.FC = () => {
  return (
    <section className="bg-cream px-4 mx-4 mt-10 lg:mx-64 sm:px-8 lg:px-40 lg:py-8 py-2 rounded-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Our Awards</h2>
        <p className="mt-2 text-gray-600">
          Recognized globally for our commitment to quality and sustainability.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {awards.map((award, index) => (
           <div
           key={index}
           className="flex flex-col items-center bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow duration-300"
         >
           <div className="mb-4">{award.icon}</div>
           <h3 className="text-lg font-bold text-gray-800">{award.title}</h3>
           <p className="mt-2 text-gray-600 text-sm">{award.description}</p>
         </div>
        ))}
      </div>
    </section>
  );
};

export default AwardsSection;
