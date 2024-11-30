"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Heart,
  User,
  Phone,
  DollarSign,
} from "lucide-react";
import Categories from "./CategoriesHover";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return (
    <header className="bg-newgreensecond text-white shadow-md relative z-50">
      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu */}
          <button
            onClick={toggleMenu}
            className="text-white hover:text-newbeige"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Logo */}
          <div className="text-xl font-bold">EcoPlaster</div>
        </div>

        {/* Center Section (Search Bar for Desktop) */}
        <div className="hidden sm:flex flex-1 ml-6 mx-4">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full max-w-screen-xl px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring focus:ring-green-200"
          />
        </div>

        {/* Right Section (Icons and Links) */}
        <div className="flex items-center gap-4">
          <div className="flex p items-center gap-4">
            <button className="hidden md:block relative text-white hover:text-newbeige transition-all duration-200 group">
              Become a Dealer
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-newbeige transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button className="hidden md:block relative text-white hover:text-newbeige transition-all duration-200 group">
              Stores
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-newbeige transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button className="hidden md:block relative text-white hover:text-newbeige transition-all duration-200 group">
              Bulk Orders
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-newbeige transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          {/* Search Icon for Mobile */}
          <button
            className="text-white sm:hidden hover:text-newbeige"
            onClick={toggleSearch}
          >
            <Search size={20} />
          </button>

          <button className="text-white hover:text-newbeige">
            <Phone size={20} />
          </button>
          <button className="text-white hover:text-newbeige">
            <Heart size={20} />
          </button>
          <button className="text-white hover:text-newbeige">
            <User size={20} />
          </button>
          <button className="text-white hover:text-newbeige">
            <ShoppingCart size={20} />
          </button>
          <button className="text-white hover:text-newbeige">
            <DollarSign size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Categories */}
      <div className="flex items-center overflow-x-scroll no-scrollbar gap-4 px-4 py-2 bg-newgreensecond sm:hidden">
        {[
          "Mattress",
          "Beds",
          "Sofa",
          "Bedding",
          "Zense",
          "Wardrobe",
           
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-1 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
              {/* Replace with actual images */}
              <img
                src={`/path-to-icons/icon-${index + 1}.png`}
                alt={item}
                className="w-8 h-8"
              />
            </div>
            <span className="text-xs text-white">{item}</span>
          </div>
        ))}
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white w-4/5 p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <input
                type="text"
                placeholder="Search"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
              <button
                className="text-gray-600 ml-4"
                onClick={toggleSearch}
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </motion.div>
      )}


      {/* Only render <Categories /> on larger screens */}
      <div className="hidden sm:block">
        <Categories />
      </div>

      {/* Side Drawer (Hamburger Menu) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay with Fade-In Effect */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-300 ${
              isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={toggleMenu}
          ></div>
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-80%" }}
            transition={{ type: "tween", stiffness: 80 }}
            className="bg-newgreen w-80 h-full fixed top-0 left-0 shadow-lg p-4 z-50"
          >
            <div className="p-4 bg-newgreen text-white">
              <h2 className="text-lg font-bold">My Account</h2>
              <ul className="space-y-4">
                <li className="text-white text-sm hover:text-newbeige">
                  Log in or create an account
                </li>
              </ul>
            </div>

            <div className="p-4">
              <ul className="space-y-4">
                <li className="text-white hover:text-newbeige">
                  <ShoppingCart className="inline-block mr-2" size={18} />
                  My Cart
                </li>
                <li className="text-white hover:text-newbeige">
                  <Heart className="inline-block mr-2" size={18} />
                  Wishlist
                </li>
                <li className="text-white hover:text-newbeige">
                  <User className="inline-block mr-2" size={18} />
                  My Account
                </li>
                <li className="text-white hover:text-newbeige">
                  <Search className="inline-block mr-2" size={18} />
                  Browse Categories
                </li>
                <li className="text-white hover:text-newbeige">
                  <Phone className="inline-block mr-2" size={18} />
                  Contact Us
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
