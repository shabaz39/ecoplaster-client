import React from "react";
import { Range, getTrackBackground } from "react-range";

interface PriceRangeSliderProps {
  value: [number, number];
  onChange: (range: [number, number]) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ value, onChange }) => {
  const STEP = 25;
  const MIN = 1800;
  const MAX = 2400;

  return (
    <div className="py-4 px-2">
      <div className="flex justify-between mb-4 text-sm text-gray-600">
        <span>₹{value[0].toLocaleString()}</span>
        <span>₹{value[1].toLocaleString()}</span>
      </div>

      <Range
        values={value}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={(values) => onChange(values as [number, number])}
        renderTrack={({ props, children, isDragged }) => {
          const { onMouseDown, onTouchStart, ref, ...restProps } = props;
          return (
            <div
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
              ref={ref}
              className="w-full h-2 rounded bg-gray-200"
              style={{
                background: getTrackBackground({
                  values: value,
                  colors: ["#e5e7eb", "#16a34a", "#e5e7eb"],
                  min: MIN,
                  max: MAX,
                }),
                position: 'relative'
              }}
            >
              {children}
            </div>
          );
        }}
        renderThumb={({ props, isDragged }) => {
          const {key, ref, ...restProps } = props;
          return (
            <div
            key={key}
              {...restProps}
              ref={ref}
              className="h-4 w-4 rounded-full bg-white focus:outline-none"
              style={{
                ...restProps.style,
                border: "2px solid #16a34a",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                touchAction: 'none',
                position: 'absolute',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          );
        }}
      />
    </div>
  );
};

export default PriceRangeSlider;