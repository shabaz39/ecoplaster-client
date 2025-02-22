// components/AdminDashboard/Dashboard/ControlPanel.tsx
import React from 'react';

const controls = [
  {
    title: "Homepage Banner",
    description: "Manage homepage banner settings and content.",
    icon: "🖼️"
  },
  {
    title: "Product Listings",
    description: "Configure product display and categories.",
    icon: "📦"
  },
  {
    title: "Promotions",
    description: "Manage ongoing and upcoming promotions.",
    icon: "🏷️"
  }
];

const ControlPanel = () => {
  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold text-productNameColor mb-4">Control Panel</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {controls.map((control, index) => (
          <div key={index} className="bg-cream p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{control.icon}</span>
              <h4 className="text-productNameColor font-semibold">{control.title}</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">{control.description}</p>
            <button className="text-newgreensecond hover:text-greenComponent transition-colors">
              Edit Settings
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ControlPanel;