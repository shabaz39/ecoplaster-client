"use client";

import React from "react";
import { Calculator, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const HomepageCalculatorSection: React.FC = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <section className="bg-white py-12 px-4 sm:px-8 lg:px-64">
      <div className="max-w-8xl mx-auto">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="relative pb-2 text-2xl font-bold text-gray-800 text-left">
            Project Cost Calculator
            <div className="mt-1">
              <span className="absolute left-0 bottom-0 h-[3px] w-14 bg-newgreen rounded-md"></span>
            </div>
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl">
            Planning your next wall makeover? Use our calculator to estimate how much EcoPlaster you'll need and get an accurate cost breakdown.
          </p>
        </div>

        {/* Calculator Preview */}
        <div className="flex flex-col md:flex-row items-center gap-8 mt-6 bg-beige rounded-xl p-6 shadow-md">
          {/* Left: Calculator Preview Image */}
          <div className="w-full md:w-1/2 rounded-lg overflow-hidden">
            <img 
              src="/calculator-image.webp" 
              alt="Project Calculator Preview" 
              className="w-full h-auto rounded-lg object-cover shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/calculator-image.webp";
              }}
            />
          </div>

          {/* Right: Features & CTA */}
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-xl font-bold text-gray-800">
              Calculate Your Project Requirements
            </h3>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Calculator className="w-5 h-5 text-newgreen mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Every 45 sq.ft = 1 packet of EcoPlaster</span>
              </li>
              <li className="flex items-start gap-2">
                <Calculator className="w-5 h-5 text-newgreen mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Easy room size calculation with different unit options</span>
              </li>
              <li className="flex items-start gap-2">
                <Calculator className="w-5 h-5 text-newgreen mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Accurate estimates accounting for doors, windows, and other openings</span>
              </li>
              <li className="flex items-start gap-2">
                <Calculator className="w-5 h-5 text-newgreen mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Printable results for your contractor or dealer</span>
              </li>
            </ul>
            
            <div className="pt-2">
              <Link href="/projectCalculator">
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 bg-newgreen text-white font-semibold rounded-lg hover:bg-newgreensecond transition-colors"
                >
                  Use Calculator
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Estimate Box */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-green-200 rounded-lg p-5 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-2">Small Room</h4>
            <p className="text-sm text-gray-600 mb-3">Approximately 100 sq.ft (10×10 ft)</p>
            <div className="text-lg font-bold text-newgreen">≈ 3 packets</div>
          </div>
          
          <div className="bg-white border border-green-200 rounded-lg p-5 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-2">Medium Room</h4>
            <p className="text-sm text-gray-600 mb-3">Approximately 180 sq.ft (12×15 ft)</p>
            <div className="text-lg font-bold text-newgreen">≈ 4 packets</div>
          </div>
          
          <div className="bg-white border border-green-200 rounded-lg p-5 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-2">Large Room</h4>
            <p className="text-sm text-gray-600 mb-3">Approximately 300 sq.ft (15×20 ft)</p>
            <div className="text-lg font-bold text-newgreen">≈ 7 packets</div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>These are approximate estimates. Use our calculator for precise requirements based on your specific room dimensions.</p>
        </div>
      </div>
    </section>
  );
};

export default HomepageCalculatorSection;