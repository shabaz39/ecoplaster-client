"use client";

import React, { useState } from "react";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-sm w-full">
      <div className="max-w-[2000px] mx-auto flex items-center justify-between py-4 px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold text-gray-800 hover:underline cursor-pointer">
          EcoPlaster
        </Link>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="md:hidden text-gray-800"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex flex-1 justify-start pl-8 lg:pl-16 gap-4 lg:gap-8 font-medium">
          <a href="#" className="text-gray-700 hover:text-green-600 whitespace-nowrap">
            Features
          </a>
          <a href="#" className="text-gray-700 hover:text-green-600 whitespace-nowrap">
            Room Visualizer
          </a>
          <a href="#" className="text-gray-700 hover:text-green-600 whitespace-nowrap">
            Products
          </a>
          <a href="/aboutus" className="text-gray-700 hover:text-green-600 whitespace-nowrap">
            About Us
          </a>
          <a href="#" className="text-gray-700 hover:text-green-600 whitespace-nowrap">
            Projects &amp; FAQs
          </a>
          <a href="#" className="text-gray-700 hover:text-green-600 whitespace-nowrap">
            Dealers
          </a>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search"
              className="bg-beige rounded-full pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-600 focus:outline-none w-32 sm:w-40 lg:w-48"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-searchBeige w-5 h-5" />
          </div>

          {/* User Icon */}
          <button className="text-searchBeige">
            <User className="w-6 h-6" />
          </button>

          {/* Cart Icon */}
          <button className="text-searchBeige">
            <ShoppingCart className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col gap-4 p-4">
            <li>
              <a href="#" className="text-gray-700 hover:text-green-600 block py-2">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:text-green-600 block py-2">
                Room Visualizer
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:text-green-600 block py-2">
                Products
              </a>
            </li>
            <li>
              <a href="/aboutus" className="text-gray-700 hover:text-green-600 block py-2">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:text-green-600 block py-2">
                Projects &amp; FAQs
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:text-green-600 block py-2">
                Dealers
              </a>
            </li>
          </ul>
          
          {/* Mobile search */}
          <div className="px-4 pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="bg-beige rounded-full pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-600 focus:outline-none w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-searchBeige w-5 h-5" />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;