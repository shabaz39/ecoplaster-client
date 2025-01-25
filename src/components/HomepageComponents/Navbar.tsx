"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import LoadingOverlay from "@/components/LoadingOverlay";



import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Heart,
  User,
  Phone,
  BadgeIndianRupee,
  Home,
  Layers,
  Package,
  Star,
  Info,
  MessageCircle,
  Image,
  Book,
  Wallet,
  MapPin,
} from "lucide-react";
import Categories from "./CategoriesHover";
import SignupModal from "./Signup";
import SearchBar from "./SearchBar";
import Link from "next/link";
import DealerModal from "./BecomeDealer";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the SignupModal
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDealerModalOpen, setIsDealerModalOpen] = useState(false);


  const navigateTo = (path: string) => {
    setIsLoading(true); // Start loading
    setTimeout(() => {
    router.push(path);
  }, 500);
    setIsMenuOpen(false); // Close the menu after navigating
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const toggleModal = () => setIsModalOpen((prev) => !prev); // Toggles SignupModal


  return (
    <div> 
          {/* Signup Modal */}
          <SignupModal isOpen={isModalOpen} onClose={toggleModal} />

    <header className="bg-newgreensecond px-4 text-white text-sm shadow-md relative z-50">
  
 
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

          <Link href="/">
  <h1 className="text-xl font-bold cursor-pointer hover:text-newbeige">
    EcoPlaster
  </h1>
</Link>        </div>

        {/* Center Section (Search Bar for Desktop) */}
        <div className="hidden sm:flex flex-1 ml-10 mr-10">
  <SearchBar />
</div> 

{/* Search Overlay */}
<AnimatePresence>
  {isSearchOpen && (
    <SearchBar isMobile onClose={() => setIsSearchOpen(false)} />
  )}
</AnimatePresence>

        {/* Right Section (Icons and Links) */}
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="flex p items-center gap-4 lg:gap-8">
          <>
  <button 
    onClick={() => setIsDealerModalOpen(true)}
    className="hidden md:block relative text-white hover:text-newbeige transition-all duration-200 group"
  >
    Become a Dealer
    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-newbeige transition-all duration-300 group-hover:w-full"></span>
  </button>

  {/* Dealer Modal */}
  <DealerModal 
    isOpen={isDealerModalOpen} 
    onClose={() => setIsDealerModalOpen(false)} 
  />
</>
            <button className="hidden md:block relative text-white hover:text-newbeige transition-all duration-200 group">
              Stores
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-newbeige transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button  className="hidden md:block relative text-white hover:text-newbeige transition-all duration-200 group" 
                          onClick={() => navigateTo("/bulkorders")}
>
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
          <button className="text-white hover:text-newbeige"
           onClick={toggleModal} // Open Signup Modal on User icon click
           >
            <User size={20} />
          </button>
          <button className="text-white hover:text-newbeige">
            <ShoppingCart size={20} />
          </button>
          <button className="text-white hover:text-newbeige">
            <BadgeIndianRupee size={21} />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Categories */}
      <div className="flex items-center overflow-x-scroll no-scrollbar gap-4 px-4 py-2 bg-newgreensecond sm:hidden">
        {[
          "Gold series",
          "Silk series",
          "Sofa",
          "Chips series",
          "Dual series",
          "Cotton series",
           
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
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-300"
            onClick={toggleMenu}
          ></div>

          {/* Side Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-80%" }}
            transition={{ type: "tween", stiffness: 80 }}
            className="bg-beige w-80 h-full fixed top-0 left-0 shadow-lg z-50"
          >
            {/* Header Section */}
            <div className="p-4 bg-newgreen text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User size={24} />
                  <div>
                    <p className="text-sm font-semibold">My Account</p>
                    <a href="#" className="text-xs underline">
                      Log in
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={20} />
                  <a href="#" className="text-xs underline">
                    Enter Pincode
                  </a>
                </div>
                </div>
              </div>
              {/* Quick Links */}
              <div className="mt-4 flex justify-around text-center">
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
  <a
    href="#"
    className="flex flex-col items-center gap-2 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
  >
    <ShoppingCart size={24} className="text-newgreen" />
    <span className="text-sm font-semibold text-gray-800">My Cart</span>
  </a>
  <a
    href="#"
    className="flex flex-col items-center gap-2 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
  >
    <Heart size={24} className="text-newgreen" />
    <span className="text-sm font-semibold text-gray-800">Wishlist</span>
  </a>
  <a
    href="#"
    className="flex flex-col items-center gap-2 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
  >
    <Wallet size={24} className="text-newgreen" />
    <span className="text-sm font-semibold text-gray-800">Wallet</span>
  </a>
</div>

            </div>

            {/* Menu Items */}
            <div className="p-4">
              <ul className="space-y-6">
                <li className="flex items-center gap-3 text-newgreensecond hover:text-newgreen">
                  <Home size={20} />
                  <span className="text-sm font-semibold">Home</span>
                </li>
                <li className="flex items-center gap-3 text-newgreensecond hover:text-newgreen">
                  <Layers size={20} />
                  <span className="text-sm font-semibold">Our Collection</span>
                </li>
                <li className="flex items-center gap-3 text-newgreensecond hover:text-newgreen">
                  <Package size={20} />
                  <span className="text-sm font-semibold">Explore Product</span>
                </li>
                 
                <li className="flex items-center gap-3 text-newgreensecond hover:text-newgreen">
                  <Package size={20} />
                  <span className="text-sm font-semibold">Product</span>
                </li>
                <li className="flex items-center gap-3 text-newgreensecond hover:text-newgreen">
                  <MessageCircle size={20} />
                  <span className="text-sm font-semibold">Q&A</span>
                </li>
                <li className="flex items-center gap-3 text-newgreensecond hover:text-newgreen">
                  <Info size={20} />
                  <span className="text-sm font-semibold">About Brand</span>
                </li>
                <li className="flex items-center gap-3 text-newgreensecond hover:text-newgreen">
                  <Star size={20} />
                  <span className="text-sm font-semibold">Reviews</span>
                </li>
                <li className="flex items-center gap-3 text-newgreensecond hover:text-newgreen">
                  <Image size={20} />
                  <span className="text-sm font-semibold">Gallery</span>
                </li>
                <li className="flex items-center gap-3 text-newgreensecond hover:text-newgreen">
                  <Phone size={20} />
                  <span className="text-sm font-semibold">Contact Us</span>
                </li>
                <li className="flex items-center gap-3 text-newgreensecond hover:text-newgreen">
                  <Book size={20} />
                  <span className="text-sm font-semibold">Blogs</span>
                </li>
                {/* Add this to your menu items list */}
<li 
  className="flex items-center gap-3 text-newgreensecond hover:text-newgreen cursor-pointer"
  onClick={() => {
    setIsDealerModalOpen(true);
    setIsMenuOpen(false);  // Close menu when opening modal
  }}
>
  <Package size={20} />
  <span className="text-sm font-semibold">Become a Dealer</span>
</li>
              </ul>
            </div>
          </motion.div>

          

        </div>
      )}

       
    </header>
    </div>
  );
};

export default Navbar;
