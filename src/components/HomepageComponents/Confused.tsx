"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@apollo/client";
import { CREATE_BANNER_PREFERENCE } from "../../constants/mutations/bannerPreferenceMutations";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const BannerWithModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    budget: "",
    concern: "",
    look: "",
    space: "",
    surface: "",
    phone: "",
    email: ""
  });

  const [createBannerPreference, { loading, error }] = useMutation(CREATE_BANNER_PREFERENCE);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      await createBannerPreference({ variables: { input: formData } });
      toast.success("Your preferences have been submitted successfully!");
      setFormData({ budget: "", concern: "", look: "", space: "", surface: "", phone: "", email: "" });
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Error submitting preferences. Please try again.");
      console.error("Submission error", err);
    }
  };

  return (
    <section className="bg-newgreensecond px-4 mx-4 lg:mx-64 sm:px-8 lg:px-64 lg:py-8 py-2 rounded-md">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
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

        <div className="hidden md:block">
          <img src="/confused.webp" alt="Confused" className="w-64 sm:w-60 rounded-md" />
        </div>
      </div>

      {isModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black backdrop-blur-md bg-opacity-50 z-50"
            onClick={toggleModal}
          ></motion.div>

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.5 }}
            className="fixed top-0 right-0 bg-white w-full sm:w-4/5 md:w-3/5 lg:w-2/5 h-full shadow-lg p-8 z-50"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Find the Perfect EcoPlaster for Your Needs</h3>
            <form onSubmit={handleSubmit}>
              {[
                {
                  name: "budget",
                  label: "What is your budget range for plastering per sq. ft.?",
                  options: ["Economy", "Mid-range", "Premium"],
                },
                {
                  name: "concern",
                  label: "What is your primary concern about plaster?",
                  options: ["Cracking over time", "Moisture or dampness issues", "Eco-friendliness", "Cost-effectiveness", "Maintenance"],
                },
                {
                  name: "look",
                  label: "What kind of look do you prefer?",
                  options: ["Smooth and polished", "Textured and rustic", "Matte finish", "Glossy finish"],
                },
                {
                  name: "space",
                  label: "What type of space are you planning to plaster?",
                  options: ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Commercial Space"],
                },
                {
                  name: "surface",
                  label: "What is the surface you’ll be applying plaster to?",
                  options: ["Concrete", "Brick", "Wood", "Drywall", "Other"],
                },
              ].map((field) => (
                <div key={field.name} className="mb-4">
                  <fieldset>
                    <legend className="block text-gray-800 font-medium mb-2">{field.label}</legend>
                    <div className="flex flex-wrap gap-4 text-gray-800">
                      {field.options.map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                         <input
  type="radio"
  name={field.name}
  value={option}
  checked={formData[field.name as keyof typeof formData] === option}
  onChange={handleChange}
  className="radio-option"
/>

                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
              ))}
              <div className="mb-4">
                <label className="block text-gray-800">Phone Number:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-800">Email Address:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md"
                  placeholder="Enter email address"
                />
              </div>
              <p className="text-sm text-gray-800 mt-4">Note: On any surface, one coat of primer is mandatory.</p>
              <div className="mt-6">
                <button type="submit" className="w-full py-2 px-4 bg-newgreensecond text-white rounded-lg hover:bg-newgreen transition">
                  {loading ? "Submitting..." : "Submit"}
                </button>
                {error && <p className="text-red-500 mt-2">Error submitting the form. Please try again.</p>}
              </div>
            </form>
            <p className="mt-4 text-center"><Link href="/contactus" className="text-blue-500 hover:underline">Visit our Contact Page</Link></p>
            <button onClick={toggleModal} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">✕</button>
          </motion.div>
        </>
      )}
    </section>
  );
};

export default BannerWithModal;
