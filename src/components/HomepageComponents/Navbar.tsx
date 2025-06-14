"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Heart,
  User,
  Phone,
  BadgeIndianRupee,
  Store,
  Users,
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
  const { wishlistCount } = useWishlist();

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
      <DealerModal
        isOpen={isDealerModalOpen}
        onClose={() => setIsDealerModalOpen(false)}
      />

      <header className="bg-newgreensecond text-white shadow-md relative z-40 w-full">
        {/* Main Navbar */}
        <div className="max-w-[2000px] w-full mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleMenu}
                className="text-white hover:text-newbeige p-1"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link href="/">
                <h1 className="text-lg sm:text-xl font-bold cursor-pointer hover:text-newbeige">
                  EcoPlaster
                </h1>
              </Link>
            </div>

            {/* Center Section (Search Bar for Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-5xl mx-8">
              <SearchBar />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-8">
              {/* Mobile Navigation Icons (Visible on small screens) */}
              <div className="flex items-center gap-1 sm:gap-2 lg:hidden">
                <button
                  className="text-white hover:text-newbeige p-2"
                  onClick={toggleSearch}
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>

                <button
                  onClick={() => setIsDealerModalOpen(true)}
                  className="text-white hover:text-newbeige p-2"
                  aria-label="Become a Dealer"
                >
                  <Users size={18} />
                </button>

                <button
                  onClick={() => navigateTo("/stores")}
                  className="text-white hover:text-newbeige p-2"
                  aria-label="Stores"
                >
                  <Store size={18} />
                </button>

                <button
                  onClick={() => navigateTo("/contactus")}
                  className="text-white hover:text-newbeige p-2"
                  aria-label="Contact"
                >
                  <Phone size={18} />
                </button>
              </div>

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
                <button
                  className="text-white hover:text-newbeige"
                  onClick={() => navigateTo("/contactus")}
                  aria-label="Contact"
                >
                  Call us
                </button>
              </div>

              {/* Always Visible Icons Section */}
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
                {/* Wishlist Icon */}
                <Link
                  href="/wishlist"
                  className="relative text-white hover:text-newbeige transition-colors p-2"
                  aria-label="View your wishlist"
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </Link>

                {/* User Section */}
                <div className="relative flex items-center">
                  <button
                    className="flex items-center text-white hover:text-newbeige p-2"
                    onClick={
                      session?.user ? handleDashboardRedirect : toggleModal
                    }
                  >
                    <User size={20} />
                    {!session?.user && (
                      <span className="ml-1 hidden sm:inline text-sm">Login</span>
                    )}
                  </button>

                  {session?.user && (
                    <div className="hidden sm:flex items-center space-x-2 ml-1">
                      {/* Truncate long names */}
                      <span className="text-white max-w-[80px] lg:max-w-[100px] truncate text-sm">
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
                  className="relative text-white hover:text-newbeige p-2"
                  onClick={toggleCart}
                  aria-label="Cart"
                >
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>

                <button
                  className="text-white hover:text-newbeige hidden sm:block p-2"
                  aria-label="Currency"
                >
                  <BadgeIndianRupee size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden px-3 pb-3 overflow-hidden"
              >
                <SearchBar />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Categories Bar */}
          <div className="hidden sm:block border-t border-white/10 w-full">
            <Categories />
          </div>

          {/* Mobile Categories - REMOVED */}

          {/* Mobile Quick Actions Bar */}
          <div className="flex sm:hidden items-center justify-between px-3 py-2 bg-white/5 text-xs">
            <button
              onClick={() => navigateTo("/bulkorders")}
              className="text-white hover:text-newbeige"
            >
              Bulk Orders
            </button>
            <span className="text-white/60">•</span>
            <button
              onClick={() => navigateTo("/installationGuide")}
              className="text-white hover:text-newbeige"
            >
              Installation Guide
            </button>
            <span className="text-white/60">•</span>
            <button
              onClick={() => navigateTo("/projectCalculator")}
              className="text-white hover:text-newbeige"
            >
              Calculator
            </button>
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