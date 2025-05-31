"use client";

import React from "react";
import ProjectCalculator from "../../components/ProjectCalculator";
import Navbar from "../../components/HomepageComponents/Navbar";
import Footer from "../../components/HomepageComponents/Footer";

export default function CalculatorSimplifiedPage() {
  return (
    <div className="bg-beige min-h-screen text-black">
      <Navbar />
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">EcoPlaster Coverage Calculator</h1>
          <p className="text-center max-w-2xl mx-auto mb-10 text-gray-600">
            Use this simple calculator to determine how much EcoPlaster you need
            for your project. Enter your room dimensions in your preferred units 
            and get an instant estimate.
          </p>
          
          <ProjectCalculator />
          
          <div className="mt-16 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">How To Use This Calculator</h2>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700">
              <li>Select your preferred unit of measurement (feet, inches, or centimeters)</li>
              <li>Enter the length, width, and height of your room</li>
              <li>Add details for any openings (doors, windows) that should not be plastered</li>
              <li>Click "Calculate" to see your results</li>
              <li>The calculator will show how many EcoPlaster packets you need (1 packet covers 40 sq ft)</li>
            </ol>
            
            <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">Still Need Help?</h3>
              <p className="mb-4">
                Our team is available to assist with your project planning and material estimation. 
                For personalized assistance, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="tel:8790505042" 
                  className="px-6 py-3 bg-newgreen text-white font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-newgreensecond transition-colors"
                >
                  Call: 8790 5050 42
                </a>
              
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}