import React, { useState } from "react";

interface FiltersProps {
  selectedFilters: any;
  onFilterChange: (filters: any) => void;
}

const Filters: React.FC<FiltersProps> = ({ selectedFilters, onFilterChange }) => {
  const [filters, setFilters] = useState(selectedFilters);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: any) => {
      const newFilters = {
        ...prev,
        [key]: prev[key]?.includes(value)
          ? prev[key].filter((item: string) => item !== value) // Remove filter if already selected
          : [...(prev[key] || []), value], // Add filter
      };
      onFilterChange(newFilters); // Update parent
      return newFilters;
    });
  };

  return (
    <div className="w-64 p-4 border-r border-gray-300">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      {/* Material Type */}
      <div className="mb-4">
        <h3 className="font-medium">Types of Material</h3>
        {["Silk Series", "Gold Series", "Dual Series", "Chips Series", "Cotton Series", "Cotton & Silk Series", "Glitter Series", "Multi Color Series"].map((type) => (
          <label key={type} className="block text-sm">
            <input
              type="checkbox"
              checked={filters.series?.includes(type)}
              onChange={() => handleFilterChange("series", type)}
              className="mr-2"
            />
            {type}
          </label>
        ))}
      </div>

      {/* Color */}
      <div className="mb-4">
        <h3 className="font-medium">Color</h3>
        {["White", "Yellow", "Pink", "Red", "Green", "Blue", "Black", "Silver"].map((color) => (
          <label key={color} className="block text-sm">
            <input
              type="checkbox"
              checked={filters.color?.includes(color)}
              onChange={() => handleFilterChange("color", color)}
              className="mr-2"
            />
            {color}
          </label>
        ))}
      </div>

      {/* Finish Type */}
      <div>
        <h3 className="font-medium">Finish Type</h3>
        {["Smooth", "Textured", "Matte", "Glossy"].map((finish) => (
          <label key={finish} className="block text-sm">
            <input
              type="checkbox"
              checked={filters.finish?.includes(finish)}
              onChange={() => handleFilterChange("finish", finish)}
              className="mr-2"
            />
            {finish}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filters;
