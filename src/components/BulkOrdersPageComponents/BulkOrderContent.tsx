"use client";

import React from "react";

const bulkOrdersContent = [
  {
    title: "Explore EcoPlaster Products for Bulk Orders",
    description:
      "EcoPlaster offers premium wall solutions for bulk purchases, catering to various industries and large-scale projects. Whether you need sustainable finishes for hospitality, commercial, or residential spaces, we provide high-quality options to meet your requirements.",
  },
  {
    title: "EcoPlaster for Hotels, Resorts, and Guest Houses",
    description:
      "Redefine luxury with EcoPlaster finishes for your hospitality projects. Our premium wall solutions cater to diverse styles, from smooth to textured finishes, ensuring an elegant and inviting ambiance. Impress your guests with a sustainable and visually stunning interior that complements your establishment’s charm.",
  },
  {
    title: "EcoPlaster for Offices and Commercial Spaces",
    description:
      "Add a touch of sophistication and professionalism to your workspace with EcoPlaster. Durable and easy to maintain, it’s the perfect choice for high-traffic areas. Choose from a variety of finishes that enhance productivity while creating a visually appealing environment.",
  },
  {
    title: "EcoPlaster for Residential Projects",
    description:
      "Upgrade your home interiors with our eco-friendly wall finishes. Whether you’re looking for vibrant textures or muted tones, EcoPlaster offers a customizable solution that combines beauty with sustainability. Perfect for living rooms, bedrooms, and accent walls.",
  },
  {
    title: "EcoPlaster for Hostels and PGs",
    description:
      "Prioritize durability and cost-effectiveness with EcoPlaster for hostels and PG accommodations. Its robust design ensures longevity while offering aesthetic value, making it ideal for communal living spaces.",
  },
  {
    title: "EcoPlaster for Service Apartments",
    description:
      "Enhance the appeal of service apartments with premium wall coatings that exude comfort and style. EcoPlaster's eco-friendly approach ensures a home-like ambiance that guests will appreciate.",
  },
  {
    title: "EcoPlaster for Builders, Architects, and Interior Designers",
    description:
      "Streamline your projects with bulk order solutions tailored for industry professionals. Choose from a comprehensive range of textures, colors, and finishes to match your design vision while adhering to sustainability goals.",
  },
  {
    title: "Bulk Order Process",
    description:
      "For placing a bulk order, connect with our team for personalized assistance. We’ll guide you through selecting the perfect finish and quantity for your project needs.",
  },
];

const BulkOrdersSEOSection: React.FC = () => {
  return (
    <section className="py-8 px-4 sm:px-8 lg:px-64 bg-white">
      {bulkOrdersContent.map((item, index) => (
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

export default BulkOrdersSEOSection;
