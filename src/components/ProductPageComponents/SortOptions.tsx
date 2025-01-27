import React from "react";

interface SortOptionsProps {
  selected: string;
  onSelect: (option: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ selected, onSelect }) => {
  const options = [
    "Popularity",
    "Price (Low to High)",
    "Price (High to Low)",
    "Newest Arrivals",
    "Ratings",
    "Color",
  ];

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Products</h2>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortOptions;
