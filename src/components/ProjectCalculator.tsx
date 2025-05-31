"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, RefreshCw, Printer, Info, Minus } from 'lucide-react';

const ProjectCalculator: React.FC = () => {
  // Unit types
  const [unit, setUnit] = useState('feet');
  
  // Wall dimensions
  const [length, setLength] = useState('');
  const [height, setHeight] = useState('');
  
  // Minus areas (doors, windows, etc.)
  const [minusAreas, setMinusAreas] = useState([
    { type: 'Door', width: '', height: '', quantity: '1' }
  ]);
  
  // Calculate results
  const [wallArea, setWallArea] = useState(0);
  const [minusArea, setMinusArea] = useState(0);
  const [netWallArea, setNetWallArea] = useState(0);
  const [requiredPackets, setRequiredPackets] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Conversion factors
  const conversionFactors = {
    cm: 0.0010764, // cm² to ft²
    inches: 0.00694444, // in² to ft²
    feet: 1 // no conversion needed
  };
  
  // Calculate areas when dimensions change
  useEffect(() => {
    if (showResults) calculateArea();
  }, [length, height, minusAreas, unit, showResults]);
  
  // Add new minus area
  const addMinusArea = () => {
    setMinusAreas([...minusAreas, { type: 'Window', width: '', height: '', quantity: '1' }]);
  };
  
  // Remove a minus area
  const removeMinusArea = (index: number) => {
    const newMinusAreas = [...minusAreas];
    newMinusAreas.splice(index, 1);
    setMinusAreas(newMinusAreas);
  };
  
  // Update minus area details
  const updateMinusArea = (index: number, field: string, value: string) => {
    const newMinusAreas = [...minusAreas];
    newMinusAreas[index] = { ...newMinusAreas[index], [field]: value };
    setMinusAreas(newMinusAreas);
  };
  
  // Calculate area
  const calculateArea = () => {
    // Check if wall dimensions are filled
    if (!length || !height) {
      alert("Please fill in both wall dimensions (length and height) before calculating.");
      setShowResults(false);
      return;
    }
    
    // Convert inputs to numbers
    const lengthNum = parseFloat(length);
    const heightNum = parseFloat(height);
    
    // Validate inputs are actual numbers
    if (isNaN(lengthNum) || isNaN(heightNum)) {
      alert("Please enter valid numbers for wall dimensions.");
      setShowResults(false);
      return;
    }
    
    // Calculate single wall area
    const singleWallArea = lengthNum * heightNum;
    
    // Convert to square feet if using different units
    const wallAreaSqFt = singleWallArea * conversionFactors[unit as keyof typeof conversionFactors];
    setWallArea(wallAreaSqFt);
    
    // Calculate minus areas (doors, windows, etc.)
    let totalMinusArea = 0;
    
    minusAreas.forEach(minusItem => {
      if (minusItem.width && minusItem.height && minusItem.quantity) {
        const minusWidth = parseFloat(minusItem.width);
        const minusHeight = parseFloat(minusItem.height);
        const minusQuantity = parseInt(minusItem.quantity);
        
        if (!isNaN(minusWidth) && !isNaN(minusHeight) && !isNaN(minusQuantity)) {
          const singleMinusArea = minusWidth * minusHeight * conversionFactors[unit as keyof typeof conversionFactors];
          totalMinusArea += singleMinusArea * minusQuantity;
        }
      }
    });
    
    setMinusArea(totalMinusArea);
    
    // Calculate net wall area
    const netArea = Math.max(0, wallAreaSqFt - totalMinusArea);
    setNetWallArea(netArea);
    
    // Calculate required packets (1 packet per 45 sq ft)
    const packets = Math.ceil(netArea / 45);
    setRequiredPackets(packets);
    
    setShowResults(true);
  };
  
  // Reset calculator
  const resetCalculator = () => {
    setLength('');
    setHeight('');
    setMinusAreas([{ type: 'Door', width: '', height: '', quantity: '1' }]);
    setShowResults(false);
  };
  
  // Print results
  const printResults = () => {
    window.print();
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg font-sans print:shadow-none">
      <div className="print:hidden">
        <div className="flex items-center mb-6">
          <Calculator className="w-8 h-8 text-newgreen mr-3" />
          <h1 className="text-2xl font-bold text-black">EcoPlaster Wall Calculator</h1>
        </div>
        
        <div className="bg-green-50 border-l-4 border-newgreen p-4 mb-6 rounded">
          <p className="text-black">
            This calculator helps you estimate how much EcoPlaster you'll need for a single wall. 
            Enter your wall dimensions and subtract any doors or windows to get an accurate estimate.
          </p>
          <div className="mt-3 p-3 bg-white rounded-md">
            <h3 className="font-semibold text-black mb-2">How The Calculator Works:</h3>
            <p className="text-black mb-2">This calculator measures the area of <strong>one wall</strong>, then subtracts any doors, windows, or other areas you don't want to cover.</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <div className="bg-gray-100 p-2 rounded text-sm">
                <strong>Example:</strong> For a 12ft × 9ft wall:
              </div>
              <ul className="list-disc pl-6 text-sm text-black">
                <li>Wall area: 12ft × 9ft = 108 sq ft</li>
                <li>Minus door: 3ft × 7ft = 21 sq ft</li>
                <li><strong>Net area to cover:</strong> 108 - 21 = 87 sq ft</li>
                <li><strong>Packets needed:</strong> 87 ÷ 45 = 2 packets</li>
              </ul>
            </div>
            
            <p className="text-black text-sm mt-1">Each EcoPlaster packet covers 45 sq ft, so we calculate how many packets you need based on your net wall area.</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-black mb-2">Unit of Measurement</h2>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="unit"
                value="feet"
                checked={unit === 'feet'}
                onChange={(e) => setUnit(e.target.value)}
                className="mr-2 text-newgreen focus:ring-newgreen"
              />
              <span className="text-black">Feet</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="unit"
                value="inches"
                checked={unit === 'inches'}
                onChange={(e) => setUnit(e.target.value)}
                className="mr-2 text-newgreen focus:ring-newgreen"
              />
              <span className="text-black">Inches</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="unit"
                value="cm"
                checked={unit === 'cm'}
                onChange={(e) => setUnit(e.target.value)}
                className="mr-2 text-newgreen focus:ring-newgreen"
              />
              <span className="text-black">Centimeters</span>
            </label>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-black mb-2">Wall Dimensions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-black mb-1">Length ({unit})</label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-newgreen focus:border-newgreen text-black"
                min="0"
                placeholder="Enter wall length"
              />
            </div>
            <div>
              <label className="block text-black mb-1">Height ({unit})</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-newgreen focus:border-newgreen text-black"
                min="0"
                placeholder="Enter wall height"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-black flex items-center gap-2">
              <Minus className="w-5 h-5 text-red-500" />
              Minus (Doors, Windows, etc.)
            </h2>
            <div className="relative">
              <button 
                onClick={() => setShowHelp(!showHelp)}
                className="text-gray-500 hover:text-newgreen"
              >
                <Info size={18} />
              </button>
              {showHelp && (
                <div className="absolute right-0 w-64 p-3 bg-white border rounded-xl shadow-lg z-10 text-sm text-black">
                  Subtract areas like doors and windows that won't need EcoPlaster coverage to get a more accurate estimate.
                </div>
              )}
            </div>
          </div>
          
          {minusAreas.map((minusItem, index) => (
            <div key={index} className="mb-4 p-4 border-2 border-red-200 rounded-xl bg-red-50">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <select
                    value={minusItem.type}
                    onChange={(e) => updateMinusArea(index, 'type', e.target.value)}
                    className="p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-newgreen focus:border-newgreen text-black"
                  >
                    <option value="Door">Door</option>
                    <option value="Window">Window</option>
                    <option value="Other">Other</option>
                  </select>
                  <span className="text-black font-medium">#{index + 1}</span>
                </div>
                {minusAreas.length > 1 && (
                  <button
                    onClick={() => removeMinusArea(index)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-black font-medium mb-1">Width ({unit})</label>
                  <input
                    type="number"
                    value={minusItem.width}
                    onChange={(e) => updateMinusArea(index, 'width', e.target.value)}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newgreen focus:border-newgreen text-black"
                    min="0"
                    placeholder="Width"
                  />
                </div>
                <div>
                  <label className="block text-black font-medium mb-1">Height ({unit})</label>
                  <input
                    type="number"
                    value={minusItem.height}
                    onChange={(e) => updateMinusArea(index, 'height', e.target.value)}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newgreen focus:border-newgreen text-black"
                    min="0"
                    placeholder="Height"
                  />
                </div>
                <div>
                  <label className="block text-black font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    value={minusItem.quantity}
                    onChange={(e) => updateMinusArea(index, 'quantity', e.target.value)}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newgreen focus:border-newgreen text-black"
                    min="1"
                    placeholder="Qty"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={addMinusArea}
            className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
          >
            <Minus size={16} />
            Add another area to subtract
          </button>
        </div>
        
        <div className="flex gap-4 mb-8">
          <button
            onClick={calculateArea}
            className="px-6 py-3 bg-newgreen text-white font-bold rounded-xl hover:bg-newgreensecond transition-colors"
          >
            Calculate
          </button>
          <button
            onClick={resetCalculator}
            className="px-6 py-3 border-2 border-gray-300 text-black font-medium rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>
      
      {showResults && (
        <div className="bg-slate-50 p-6 rounded-xl border-2 border-gray-200 mb-6">
          <div className="flex justify-between items-start print:hidden mb-4">
            <h2 className="text-xl font-bold text-black">Results</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => document.getElementById('calculation-details')?.classList.toggle('hidden')}
                className="text-newgreen hover:text-newgreensecond font-medium underline"
              >
                View Calculation Details
              </button>
              <button
                onClick={printResults}
                className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
              >
                <Printer size={16} />
                <span className="text-sm">Print</span>
              </button>
            </div>
          </div>
          
          <div id="calculation-details" className="hidden mb-4 p-4 bg-white rounded-xl border border-gray-200 text-sm">
            <h3 className="font-semibold mb-3 text-black">Detailed Wall Area Calculation:</h3>
            <ul className="space-y-2 text-black">
              <li>• Wall area: {length} × {height} = {(parseFloat(length) * parseFloat(height)).toFixed(2)} sq {unit}</li>
              <li className="font-medium">• Total wall area: {wallArea.toFixed(2)} sq ft</li>
              
              {minusAreas.length > 0 && (
                <>
                  <li className="mt-3 font-semibold text-red-600">Areas to subtract:</li>
                  {minusAreas.map((minusItem, index) => (
                    minusItem.width && minusItem.height ? (
                      <li key={index} className="text-red-700">
                        • {minusItem.type} #{index + 1}: {minusItem.width} × {minusItem.height} × {minusItem.quantity} = 
                        {(parseFloat(minusItem.width) * parseFloat(minusItem.height) * parseInt(minusItem.quantity) * 
                          conversionFactors[unit as keyof typeof conversionFactors]).toFixed(2)} sq ft
                      </li>
                    ) : null
                  ))}
                </>
              )}
              
              <li className="text-red-700">• Total minus area: {minusArea.toFixed(2)} sq ft</li>
              <li className="font-medium text-newgreen">• Net wall area: {wallArea.toFixed(2)} - {minusArea.toFixed(2)} = {netWallArea.toFixed(2)} sq ft</li>
              <li className="mt-2 font-bold text-newgreensecond">• Required packets: {netWallArea.toFixed(2)} ÷ 45 = {(netWallArea / 45).toFixed(2)}, rounded up to {requiredPackets}</li>
            </ul>
          </div>
          
          <div className="hidden print:block mb-6">
            <h1 className="text-2xl font-bold text-center mb-2">EcoPlaster Wall Estimate</h1>
            <p className="text-center text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between py-3 border-b-2 border-gray-200">
                <span className="text-black font-medium">Wall Dimensions:</span>
                <span className="font-bold text-black">{length} × {height} {unit}</span>
              </div>
              <div className="flex justify-between py-3 border-b-2 border-gray-200">
                <span className="text-black font-medium">Total Wall Area:</span>
                <span className="font-bold text-black">{wallArea.toFixed(2)} sq ft</span>
              </div>
              <div className="flex justify-between py-3 border-b-2 border-gray-200">
                <span className="text-red-600 font-medium">Total Minus Area:</span>
                <span className="font-bold text-red-600">-{minusArea.toFixed(2)} sq ft</span>
              </div>
              <div className="flex justify-between py-3 border-b-2 border-gray-200">
                <span className="text-black font-medium">Net Wall Area to Cover:</span>
                <span className="font-bold text-newgreen">{netWallArea.toFixed(2)} sq ft</span>
              </div>
              <div className="flex justify-between py-4 font-bold text-xl bg-newgreen text-white px-4 rounded-xl">
                <span>EcoPlaster Packets Required:</span>
                <span>{requiredPackets}</span>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl">
              <h3 className="font-bold text-black mb-2">💡 Recommendation</h3>
              <p className="text-black">
                We recommend purchasing <strong>{requiredPackets + 1} packets</strong> to account for waste and potential touch-ups.
              </p>
            </div>
            
            <div className="text-sm text-gray-600 print:mt-12 bg-gray-100 p-4 rounded-xl">
              <p className="mb-2 font-medium text-black">📋 Important Notes:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>This estimate is based on 1 packet covering 45 sq ft</li>
                <li>Actual coverage may vary based on surface conditions and application technique</li>
                <li>For exact requirements, consult with your EcoPlaster dealer</li>
                <li>Always order extra material for waste and future touch-ups</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCalculator;