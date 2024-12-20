"use client";

import React from "react";

const ProjectCostCalculator: React.FC = () => {
  return (
    <section className="bg-white py-12 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
          Estimate Your Project Cost Instantly
        </h2>
        <p className="text-gray-600 mt-4">
          Our smart calculator will help you get a sense of how much your
          project will cost. It's easy to use and will give you a personalized
          estimate in just a few minutes.
        </p>

        {/* Image */}
        <div className="mt-8">
          <img
            src="/calculator-image.webp" // Update this to your image path
            alt="Calculators"
            className="rounded-lg w-full object-cover max-h-72 md:max-h-96"
          />
        </div>

        {/* Subheading and Highlights */}
        <div className="mt-8 text-left">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
            Quick, easy, and personalized estimates
          </h3>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-lg font-semibold text-gray-900">Instant results</p>
              <p className="text-greenText text-sm md:text-base">
                Get a rough estimate in just a few minutes
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                Customized for you
              </p>
              <p className="text-greenText text-sm md:text-base">
                We'll ask you a few questions about your project to make sure
                the estimate is as accurate as possible
              </p>
            </div>
          </div>
        </div>

        {/* Call-to-Action Button */}
        <div className="mt-8">
          <button className="bg-greenComponent text-white py-3 px-6 rounded-full text-lg font-medium hover:bg-green-700 transition-all duration-300">
            Calculate Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProjectCostCalculator;
