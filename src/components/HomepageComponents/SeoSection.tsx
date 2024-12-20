"use client";

import React from "react";

const seoContent = [
  {
    title: "Buy EcoPlaster Online",
    description:
      "If you are looking for eco-friendly plaster online, you have come to the right place. EcoPlaster provides innovative solutions to elevate your spaces while being sustainable and cost-effective. From smooth finishes to rustic textures, EcoPlaster caters to all your needs with premium quality. Browse through our options and take your pick with confidence.If you are looking for eco-friendly plaster online, you have come to the right place. EcoPlaster provides innovative solutions to elevate your spaces while being sustainable and cost-effective. From smooth finishes to rustic textures, EcoPlaster caters to all your needs with premium quality. Browse through our options and take your pick with confidence.",
  },
  {
    title: "Shop EcoPlaster & Supplies",
    description:
      "EcoPlaster has been a trusted name in sustainable home improvement solutions. With a focus on quality and eco-friendliness, our range of plasters and supplies is designed to meet the demands of modern homes. Choose EcoPlaster to transform your living spaces while keeping the environment in mind. If you are looking for eco-friendly plaster online, you have come to the right place. EcoPlaster provides innovative solutions to elevate your spaces while being sustainable and cost-effective. From smooth finishes to rustic textures, EcoPlaster caters to all your needs with premium quality. Browse through our options and take your pick with confidence.",
  },
  {
    title: "Best Sustainable Plaster Store Online",
    description:
      "When it comes to finding sustainable plaster solutions, EcoPlaster stands out as the best choice. Our ergonomic designs, natural materials, and practical solutions ensure maximum comfort and sustainability. Make the eco-conscious choice with EcoPlaster for your next home project.If you are looking for eco-friendly plaster online, you have come to the right place. EcoPlaster provides innovative solutions to elevate your spaces while being sustainable and cost-effective. From smooth finishes to rustic textures, EcoPlaster caters to all your needs with premium quality. Browse through our options and take your pick with confidence.",
  },
  {
    title: "EcoPlaster Home Solutions",
    description:
      "EcoPlaster offers a wide range of home solutions to help you create the living spaces of your dreams. From decorative plasters to high-performance finishes, our products are designed to be both functional and beautiful. Explore our collection today and find the perfect match for your home. If you are looking for eco-friendly plaster online, you have come to the right place. EcoPlaster provides innovative solutions to elevate your spaces while being sustainable and cost-effective. From smooth finishes to rustic textures, EcoPlaster caters to all your needs with premium quality. Browse through our options and take your pick with confidence.",
  },
];

const SEOSection: React.FC = () => {
  return (
<section className="py-8 px-4 sm:px-8 lg:px-64 bg-white">      {seoContent.map((item, index) => (
        <div key={index} className="mb-8">
          <h3 className="text-l font-bold text-gray-800 mb-2">
            {item.title}
          </h3>
          <p className="text-gray-600">{item.description}</p>
        </div>
      ))}
    </section>
  );
};

export default SEOSection;
