"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const BannerWithModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <section className="bg-newgreensecond px-4 mx-4 lg:mx-64 sm:px-8 lg:px-64 lg:py-8 py-2 rounded-md">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        {/* Text Content */}
        <div className="text-left md:text-left">
          <h2 className="lg:text-2xl font-bold text-white">Confused?</h2>
          <p className="mt-2 lg:text-lg text-white">Find your perfect EcoPlaster!</p>
          <button
            onClick={toggleModal}
            className="mt-4 lg:px-4 lg:py-2 py-2 px-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-green transition"
          >
            Contact Us
          </button>
        </div>

        {/* Image */}
        <div className="hidden md:block">
          <img
            src="/confused.webp"
            alt="Confused"
            className="w-64 sm:w-60 rounded-md"
          />
        </div>
      </div>

    {/* Modal */}
    {isModalOpen && (
        <>
          {/* Background Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black backdrop-blur-md bg-opacity-50 z-50"
            onClick={toggleModal} // Close modal on clicking background
          ></motion.div>

          {/* Form Slide-In */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.5 }}
            className="fixed top-0 right-0 bg-white w-full sm:w-4/5 md:w-3/5 lg:w-2/5 h-full shadow-lg p-8 z-50"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Find the Perfect EcoPlaster for Your Needs
            </h3>

           {/* Form */}
<form>
  <div className="mb-4">
    <fieldset>
      <legend className="block text-gray-800 font-medium mb-2">
        What is your budget range for plastering per sq. ft.?
      </legend>
      <div className="flex flex-wrap gap-4 text-gray-800 ">
        <label className="flex items-center gap-2 cursor-pointer ">
          <input type="radio" name="budget" value="Economy" className="radio-option" />
          <span>Economy</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="budget" value="Mid-range" className="radio-option" />
          <span>Mid-range</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="budget" value="Premium" className="radio-option" />
          <span>Premium</span>
        </label>
      </div>
    </fieldset>
  </div>

  <div className="mb-4">
    <fieldset>
      <legend className="block text-gray-800 font-medium mb-2">
        What is your primary concern about plaster?
      </legend>
      <div className="flex flex-wrap gap-4 text-gray-800 ">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="concern" value="Cracking over time" className="radio-option" />
          <span>Cracking over time</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="concern" value="Moisture or dampness issues" className="radio-option" />
          <span>Moisture or dampness issues</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="concern" value="Eco-friendliness" className="radio-option" />
          <span>Eco-friendliness</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="concern" value="Cost-effectiveness" className="radio-option" />
          <span>Cost-effectiveness</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="concern" value="Maintenance" className="radio-option" />
          <span>Maintenance</span>
        </label>
      </div>
    </fieldset>
  </div>

  <div className="mb-4">
    <fieldset>
      <legend className="block text-gray-800 font-medium mb-2">
        What kind of look do you prefer?
      </legend>
      <div className="flex flex-wrap gap-4 text-gray-800 ">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="look" value="Smooth and polished" className="radio-option" />
          <span>Smooth and polished</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="look" value="Textured and rustic" className="radio-option" />
          <span>Textured and rustic</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="look" value="Matte finish" className="radio-option" />
          <span>Matte finish</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="look" value="Glossy finish" className="radio-option" />
          <span>Glossy finish</span>
        </label>
      </div>
    </fieldset>
  </div>

  <div className="mb-4">
    <fieldset>
      <legend className="block text-gray-800 font-medium mb-2">
        What type of space are you planning to plaster?
      </legend>
      <div className="flex flex-wrap gap-4 text-gray-800 ">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="space" value="Living Room" className="radio-option" />
          <span>Living Room</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="space" value="Bedroom" className="radio-option" />
          <span>Bedroom</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="space" value="Kitchen" className="radio-option" />
          <span>Kitchen</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="space" value="Bathroom" className="radio-option" />
          <span>Bathroom</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="space" value="Commercial Space" className="radio-option" />
          <span>Commercial Space</span>
        </label>
      </div>
    </fieldset>
  </div>

  <div className="mb-4">
    <fieldset>
      <legend className="block text-gray-800 font-medium mb-2">
        What is the surface you’ll be applying plaster to?
      </legend>
      <div className="flex flex-wrap gap-4 text-gray-800 ">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="surface" value="Concrete" className="radio-option" />
          <span>Concrete</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="surface" value="Brick" className="radio-option" />
          <span>Brick</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="surface" value="Wood" className="radio-option" />
          <span>Wood</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="surface" value="Drywall" className="radio-option" />
          <span>Drywall</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="surface" value="Other" className="radio-option" />
          <span>Other</span>
        </label>
      </div>
    </fieldset>
  </div>

  <p className="text-sm text-gray-800 mt-4">
    Note: On any surface, one coat of primer is mandatory.
  </p>

  <div className="mt-6">
    <button
      type="submit"
      className="w-full py-2 px-4 bg-newgreensecond text-white rounded-lg hover:bg-newgreen transition"
    >
      Submit
    </button>
  </div>
</form>

            {/* Close Button */}
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </motion.div>
        </>
      )}
    </section>
  );
};

export default BannerWithModal;


 
