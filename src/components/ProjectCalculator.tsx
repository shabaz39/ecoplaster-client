"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, Maximize2, Minimize2, RefreshCw, Printer, Info } from 'lucide-react';

const ProjectCalculator: React.FC = () => {
  // Unit types
  const [unit, setUnit] = useState('feet');
  
  // Room dimensions
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  
  // Openings (doors, windows, etc.)
  const [openings, setOpenings] = useState([
    { type: 'Door', width: '', height: '', quantity: '1' }
  ]);
  
  // Calculate results
  const [wallArea, setWallArea] = useState(0);
  const [openingArea, setOpeningArea] = useState(0);
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
  }, [length, width, height, openings, unit, showResults]);
  
  // Add new opening
  const addOpening = () => {
    setOpenings([...openings, { type: 'Window', width: '', height: '', quantity: '1' }]);
  };
  
  // Remove an opening
  const removeOpening = (index: number) => {
    const newOpenings = [...openings];
    newOpenings.splice(index, 1);
    setOpenings(newOpenings);
  };
  
  // Update opening details
  const updateOpening = (index: number, field: string, value: string) => {
    const newOpenings = [...openings];
    newOpenings[index] = { ...newOpenings[index], [field]: value };
    setOpenings(newOpenings);
  };
  
  // Calculate area
  const calculateArea = () => {
    if (!length || !width || !height) {
      setShowResults(false);
      return;
    }
    
    // Convert inputs to numbers
    const lengthNum = parseFloat(length);
    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);
    
    if (isNaN(lengthNum) || isNaN(widthNum) || isNaN(heightNum)) {
      setShowResults(false);
      return;
    }
    
    // Calculate perimeter
    const perimeter = 2 * (lengthNum + widthNum);
    
    // Calculate total wall area
    const totalWallArea = perimeter * heightNum;
    
    // Calculate area in square feet
    const wallAreaSqFt = totalWallArea * conversionFactors[unit as keyof typeof conversionFactors];
    setWallArea(wallAreaSqFt);
    
    // Calculate opening areas
    let totalOpeningArea = 0;
    
    openings.forEach(opening => {
      if (opening.width && opening.height && opening.quantity) {
        const openingWidth = parseFloat(opening.width);
        const openingHeight = parseFloat(opening.height);
        const openingQuantity = parseInt(opening.quantity);
        
        if (!isNaN(openingWidth) && !isNaN(openingHeight) && !isNaN(openingQuantity)) {
          const singleOpeningArea = openingWidth * openingHeight * conversionFactors[unit as keyof typeof conversionFactors];
          totalOpeningArea += singleOpeningArea * openingQuantity;
        }
      }
    });
    
    setOpeningArea(totalOpeningArea);
    
    // Calculate net wall area
    const netArea = Math.max(0, wallAreaSqFt - totalOpeningArea);
    setNetWallArea(netArea);
    
    // Calculate required packets (1 packet per 40 sq ft)
    const packets = Math.ceil(netArea / 40);
    setRequiredPackets(packets);
    
    setShowResults(true);
  };
  
  // Reset calculator
  const resetCalculator = () => {
    setLength('');
    setWidth('');
    setHeight('');
    setOpenings([{ type: 'Door', width: '', height: '', quantity: '1' }]);
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
          <h1 className="text-2xl font-bold text-gray-800">EcoPlaster Project Calculator</h1>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
          <p className="text-blue-800">
            This calculator helps you estimate how much EcoPlaster you'll need for your project. 
            Enter your room dimensions and any openings (doors, windows) to get an accurate estimate.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Unit of Measurement</h2>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="unit"
                value="feet"
                checked={unit === 'feet'}
                onChange={(e) => setUnit(e.target.value)}
                className="mr-2"
              />
              Feet
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="unit"
                value="inches"
                checked={unit === 'inches'}
                onChange={(e) => setUnit(e.target.value)}
                className="mr-2"
              />
              Inches
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="unit"
                value="cm"
                checked={unit === 'cm'}
                onChange={(e) => setUnit(e.target.value)}
                className="mr-2"
              />
              Centimeters
            </label>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Room Dimensions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Length ({unit})</label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-newgreen"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Width ({unit})</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-newgreen"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Height ({unit})</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-newgreen"
                min="0"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Openings (Doors, Windows, etc.)</h2>
            <div className="relative">
              <button 
                onClick={() => setShowHelp(!showHelp)}
                className="text-gray-500 hover:text-newgreen"
              >
                <Info size={18} />
              </button>
              {showHelp && (
                <div className="absolute right-0 w-64 p-3 bg-white border rounded-md shadow-md z-10 text-sm text-gray-600">
                  Subtract openings like doors and windows to get a more accurate estimate of the wall area that needs to be covered with EcoPlaster.
                </div>
              )}
            </div>
          </div>
          
          {openings.map((opening, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <select
                    value={opening.type}
                    onChange={(e) => updateOpening(index, 'type', e.target.value)}
                    className="p-1 border border-gray-300 rounded"
                  >
                    <option value="Door">Door</option>
                    <option value="Window">Window</option>
                    <option value="Other">Other</option>
                  </select>
                  <span className="text-gray-500 text-sm">#{index + 1}</span>
                </div>
                {openings.length > 1 && (
                  <button
                    onClick={() => removeOpening(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Width ({unit})</label>
                  <input
                    type="number"
                    value={opening.width}
                    onChange={(e) => updateOpening(index, 'width', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-newgreen"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Height ({unit})</label>
                  <input
                    type="number"
                    value={opening.height}
                    onChange={(e) => updateOpening(index, 'height', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-newgreen"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Quantity</label>
                  <input
                    type="number"
                    value={opening.quantity}
                    onChange={(e) => updateOpening(index, 'quantity', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-newgreen"
                    min="1"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={addOpening}
            className="text-newgreen hover:text-green-700 font-medium"
          >
            + Add another opening
          </button>
        </div>
        
        <div className="flex gap-4 mb-8">
          <button
            onClick={calculateArea}
            className="px-4 py-2 bg-newgreen text-white font-medium rounded hover:bg-green-700 transition-colors"
          >
            Calculate
          </button>
          <button
            onClick={resetCalculator}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>
      
      {showResults && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <div className="flex justify-between items-start print:hidden mb-4">
            <h2 className="text-xl font-bold text-gray-800">Results</h2>
            <button
              onClick={printResults}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <Printer size={16} />
              <span className="text-sm">Print</span>
            </button>
          </div>
          
          <div className="hidden print:block mb-6">
            <h1 className="text-2xl font-bold text-center mb-2">EcoPlaster Project Estimate</h1>
            <p className="text-center text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Total Wall Area:</span>
                <span className="font-medium">{wallArea.toFixed(2)} sq ft</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Total Opening Area:</span>
                <span className="font-medium">{openingArea.toFixed(2)} sq ft</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Net Wall Area to Cover:</span>
                <span className="font-medium">{netWallArea.toFixed(2)} sq ft</span>
              </div>
              <div className="flex justify-between py-3 font-bold text-lg">
                <span className="text-gray-800">EcoPlaster Packets Required:</span>
                <span className="text-newgreen">{requiredPackets}</span>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <h3 className="font-bold text-gray-800 mb-1">Recommendation</h3>
              <p className="text-gray-700">
                We recommend purchasing {requiredPackets + 1} packets to account for waste and potential touch-ups.
              </p>
            </div>
            
            <div className="text-sm text-gray-500 print:mt-12">
              <p className="mb-1">Note: This is an estimate based on standard calculations (1 packet covers 40 sq ft). Actual coverage may vary based on surface conditions, application technique, and desired finish thickness.</p>
              <p>For exact requirements, consult with your EcoPlaster dealer.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCalculator;