import React, { useState } from 'react';
import { FiltersType } from '../../types/product.types';
import PriceRangeSlider from './PriceRangeSlider';

interface FiltersProps {
  selectedFilters: FiltersType;
  onFilterChange: (filters: FiltersType) => void;
}

export const Filters: React.FC<FiltersProps> = ({ selectedFilters, onFilterChange }) => {
 
 
  const materialTypes = [
    { display: "Silk Series", value: "SILK" },
    { display: "Gold Series", value: "GOLD" },
    { display: "Dual Series", value: "DUAL" },
    { display: "Chips Series", value: "CHIPS" },
    { display: "Cotton Series", value: "COTTON" },
    { display: "Cotton & Silk Series", value: "COTTON & SILK" },
    { display: "Glitter Series", value: "GLITTER" },
    { display: "Multi Color Series", value: "MULTI COLOR" }
  ];

  const fabrics = [
    { display: "Silk & Cotton", value: "SILK & COTTON" },
    { display: "Pure Silk", value: "SILK" },
    { display: "Pure Cotton", value: "COTTON" },
  ];

  const colors = [
    { display: "White", value: "WHITE" },
    { display: "Yellow", value: "YELLOW" },
    { display: "Pink", value: "PINK" },
    { display: "Red", value: "RED" },
    { display: "Green", value: "GREEN" },
    { display: "Blue", value: "BLUE" },
    { display: "Black", value: "BLACK" },
    { display: "Silver", value: "SILVER" },
    { display: "Chestnut Brown", value: "CHESTNUT/BROWN" },
    { display: "Dark Brown", value: "Dark Brown" },
    { display: "Golden Yellow", value: "GOLDEN YELLOW" },
    { display: "Grey", value: "GREY" },
    { display: "Ivory Cream", value: "IVORY CREAM" },
    { display: "Khaki", value: "KHAKI" },
    { display: "Maroon", value: "MAROON" },
    { display: "Navy Blue", value: "NAVY BLUE" },
    { display: "Neon Green", value: "Neon Green" },
    { display: "Orange", value: "Orange" },
    { display: "Purple", value: "PURPLE" },
    { display: "Sky Blue", value: "SKY BLUE" },
    { display: "Silver Grey", value: "SLIVER/GREY" },
    { display: "Turquoise", value: "TURQUOISE" },
    { display: "Violet", value: "VIOLET" },

  ];

  const finishTypes = [
    { display: "Smooth", value: "SMOOTH" },
    { display: "Textured", value: "TEXTURED" },
    { display: "Matte", value: "MATTE" },
    { display: "Glossy", value: "GLOSSY" }
  ];

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const handleFilterChange = (key: keyof FiltersType, value: string) => {
    const currentValues = selectedFilters[key] as string[] || [];
    const newValues = currentValues.includes(value )
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];

    onFilterChange({
      ...selectedFilters,
      [key]: newValues.length > 0 ? newValues : undefined
    });
  };

  const handlePriceRangeChange = (newRange: [number, number]) => {
    onFilterChange({
      ...selectedFilters,
      priceRange: newRange
    });
  };


  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl text-black font-bold mb-4">Filters</h2>

      <div className="space-y-6">
        {/* Material Type */}
        <div>
          <h3 className="font-semibold mb-2 text-black">Types of Material</h3>
          <div className="space-y-2 text-black">
            {materialTypes.map(({ display, value }) => (
              <label key={value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedFilters.series?.includes(value) || false}
                  onChange={() => handleFilterChange("series", value)}
                  className="mr-2"
                />
                <span>{display}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Fabric */}
        <div>
          <h3 className="font-semibold mb-2 text-black">Fabric</h3>
          <div className="space-y-2 text-black">
            {fabrics.map(({ display, value }) => (
              <label key={value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedFilters.fabric?.includes(value) || false}
                  onChange={() => handleFilterChange("fabric", value)}
                  className="mr-2"
                />
                <span>{display}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <h3 className="font-semibold mb-2 text-black">Color</h3>
          <div className="space-y-2 text-black">
            {colors.map(({ display, value }) => (
              <label key={value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedFilters.color?.includes(value) || false}
                  onChange={() => handleFilterChange("color", value)}
                  className="mr-2"
                />
                <span>{display}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Finish Type */}
        <div>
          <h3 className="font-semibold mb-2 text-black">Finish Type</h3>
          <div className="space-y-2 text-black">
            {finishTypes.map(({ display, value }) => (
              <label key={value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedFilters.finish?.includes(value) || false}
                  onChange={() => handleFilterChange("finish", value)}
                  className="mr-2"
                />
                <span>{display}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
    <h3 className="font-semibold mb-2 text-black">Price Range</h3>
    <PriceRangeSlider
      value={selectedFilters.priceRange || [1800, 2400]}
      onChange={handlePriceRangeChange}
    />
  </div>
      </div>
    </div>
  );
};
