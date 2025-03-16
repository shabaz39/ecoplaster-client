"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext"; // Import the wishlist hook
import {
  Menu, X, Search, ShoppingCart, Heart, User, Phone, BadgeIndianRupee
} from "lucide-react";
import Categories from "./CategoriesHover";
import SignupModal from "./Signup";
import SearchBar from "./SearchBar";
import Link from "next/link";
import DealerModal from "./BecomeDealer";
import CartSidebar from "../CheckOutComponents/CartSidebar";
import { signOut, useSession } from "next-auth/react";
import SideMenu from "./SideMenuComponent";

const isAdmin = (email: string | null | undefined) => {
  return email === "ecoplaster1@gmail.com";
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDealerModalOpen, setIsDealerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  
  const router = useRouter();
  const { cartCount, toggleCart } = useCart();
  const { wishlistCount } = useWishlist(); // Use the wishlist context

  const handleDashboardRedirect = () => {
    if (session?.user?.role === "admin") {
      router.push("/adminDashboard");
    } else {
      router.push("/userdashboard");
    }
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleSearch = () => setIsSearchOpen((prev) => !prev);
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const navigateTo = (path: string) => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(path);
      setIsMenuOpen(false);
    }, 500);
  };

  return (
    <div className="relative"> 
      <CartSidebar />
      <SignupModal isOpen={isModalOpen} onClose={toggleModal} />
      <DealerModal isOpen={isDealerModalOpen} onClose={() => setIsDealerModalOpen(false)} />

      <header className="bg-newgreensecond text-white shadow-md relative z-40 w-full">
        {/* Main Navbar */}
        <div className="max-w-[2000px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleMenu} 
                className="text-white hover:text-newbeige"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>

              <Link href="/">
                <h1 className="text-xl font-bold cursor-pointer hover:text-newbeige">
                  EcoPlaster
                </h1>
              </Link>
            </div>

            {/* Center Section (Search Bar for Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-5xl mx-8">
              <SearchBar />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-6">
                <button 
                  onClick={() => setIsDealerModalOpen(true)}
                  className="text-white hover:text-newbeige transition-colors whitespace-nowrap"
                >
                  Become a Dealer
                </button>
                <button 
                  onClick={() => navigateTo("/stores")}
                  className="text-white hover:text-newbeige transition-colors"
                >
                  Stores
                </button>
                <button 
                  onClick={() => navigateTo("/bulkorders")}
                  className="text-white hover:text-newbeige transition-colors"
                >
                  Bulk Orders
                </button>
              </div>

              {/* Mobile Icons */}
              <div className="flex items-center gap-2 sm:gap-4">
                <button 
                  className="text-white sm:hidden hover:text-newbeige" 
                  onClick={toggleSearch}
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                <button 
                  className="text-white hover:text-newbeige hidden sm:block"
                  onClick={() => navigateTo("/contactus")}
                  aria-label="Contact"
                >
                  <Phone size={20} />
                </button>

                {/* Wishlist Icon */}
                <Link 
                  href="/wishlist" 
                  className="relative text-white hover:text-newbeige transition-colors"
                  aria-label="View your wishlist"
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* User Section */}
                <div className="relative flex items-center">
                  <button 
                    className="flex items-center text-white hover:text-newbeige" 
                    onClick={session?.user ? handleDashboardRedirect : toggleModal}
                  >
                    <User size={20} />
                    {!session?.user && <span className="ml-2 hidden sm:inline">Login</span>}
                  </button>

                  {session?.user && (
                    <div className="hidden sm:flex items-center space-x-2 ml-2">
                      {/* Truncate long names */}
                      <span className="text-white max-w-[100px] truncate">
                        {session.user.name}
                      </span>
                      {isAdmin(session.user.email) ? (
                        <Link 
                          href="/adminDashboard" 
                          className="text-xs bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-400 whitespace-nowrap"
                        >
                          Admin
                        </Link>
                      ) : (
                        <Link 
                          href="/userdashboard" 
                          className="text-xs bg-newgreen text-white px-2 py-1 rounded hover:bg-newgreensecond whitespace-nowrap"
                        >
                          Dashboard
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Cart Icon */}
                <button 
                  className="relative text-white hover:text-newbeige" 
                  onClick={toggleCart}
                  aria-label="Cart"
                >
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button 
                  className="text-white hover:text-newbeige hidden sm:block"
                  aria-label="Currency"
                >
                  <BadgeIndianRupee size={21} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="lg:hidden px-4 pb-4">
              <SearchBar />
            </div>
          )}

          {/* Categories Bar */}
          <div className="hidden sm:block border-t border-white/10 w-full">
            <Categories />
          </div>

          {/* Mobile Categories */}
          <div className="flex sm:hidden items-center overflow-x-auto no-scrollbar gap-4 px-4 py-2 border-t border-white/10">
            {["Gold series", "Silk series", "Sofa", "Chips series", "Dual series", "Cotton series"].map((item, index) => (
              <span key={index} className="text-xs whitespace-nowrap">
                {item}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Side Menu */}
      <SideMenu 
        isMenuOpen={isMenuOpen} 
        toggleMenu={toggleMenu} 
        session={session} 
      />
    </div>
  );
};

export default Navbar;