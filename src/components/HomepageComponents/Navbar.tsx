"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useCart } from "../../context/CartContext";
import {
  Menu, X, Search, ShoppingCart, Heart, User, Phone, BadgeIndianRupee, Home, Layers,
  Package, Star, Info, MessageCircle, Image, Book, Wallet, MapPin
} from "lucide-react";
import Categories from "./CategoriesHover";
import SignupModal from "./Signup";
import SearchBar from "./SearchBar";
import Link from "next/link";
import DealerModal from "./BecomeDealer";
import LoadingOverlay from "@/components/LoadingOverlay";
import CartSidebar from "../CheckOutComponents/CartSidebar";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDealerModalOpen, setIsDealerModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { cartCount, toggleCart } = useCart();

  // Track authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
    <div> 
      <CartSidebar />

      {/* Signup & Dealer Modal */}
      <SignupModal isOpen={isModalOpen} onClose={toggleModal} />
      <DealerModal isOpen={isDealerModalOpen} onClose={() => setIsDealerModalOpen(false)} />

      <header className="bg-newgreensecond px-4 text-white text-sm shadow-md relative z-40">
      {/* Main Navbar */}
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button onClick={toggleMenu} className="text-white hover:text-newbeige">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Logo */}
            <Link href="/">
              <h1 className="text-xl font-bold cursor-pointer hover:text-newbeige">EcoPlaster</h1>
            </Link>
          </div>

          {/* Center Section (Search Bar for Desktop) */}
          <div className="hidden sm:flex flex-1 ml-10 mr-10">
            <SearchBar />
          </div>

          {/* Right Section (Icons and Links) */}
          <div className="flex items-center gap-4 lg:gap-8">
            <button onClick={() => setIsDealerModalOpen(true)} className="hidden md:block text-white hover:text-newbeige transition-all duration-200">
              Become a Dealer
            </button>

            <button className="hidden md:block text-white hover:text-newbeige transition-all duration-200"
              onClick={() => navigateTo("/stores")}>
              Stores
            </button>

            <button className="hidden md:block text-white hover:text-newbeige transition-all duration-200"
              onClick={() => navigateTo("/bulkorders")}>
              Bulk Orders
            </button>

            {/* Search Icon for Mobile */}
            <button className="text-white sm:hidden hover:text-newbeige" onClick={toggleSearch}>
              <Search size={20} />
            </button>

            <button className="text-white hover:text-newbeige" onClick={() => navigateTo("/contactus")}>
              <Phone size={20} />
            </button>

            <button className="text-white hover:text-newbeige">
              <Heart size={20} />
            </button>

            {/* User Icon with Name */}
            <button className="flex items-center text-white hover:text-newbeige" onClick={toggleModal}>
              <User size={20} />
              {user && <span className="ml-2">{user.displayName || "User"}</span>}
            </button>

            {/* Shopping Cart */}
            <button className="relative text-white hover:text-newbeige" onClick={toggleCart}>
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button className="text-white hover:text-newbeige">
              <BadgeIndianRupee size={21} />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Categories (Mobile Only) */}
        <div className="flex items-center overflow-x-scroll no-scrollbar gap-4 px-4 py-2 bg-newgreensecond sm:hidden">
          {["Gold series", "Silk series", "Sofa", "Chips series", "Dual series", "Cotton series"].map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-1 text-center">
              <span className="text-xs text-white">{item}</span>
            </div>
          ))}
        </div>

        {/* Categories Component for Desktop */}
        <div className="hidden sm:block">
          <Categories />
        </div>

        {/* Side Drawer (Hamburger Menu) */}
        {isMenuOpen && (
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-80%" }}
            transition={{ type: "tween", stiffness: 80 }}
            className="bg-beige w-80 h-full fixed top-0 left-0 shadow-lg z-50"
          >
            <div className="p-4 bg-newgreen text-white">
              <div className="flex justify-between items-center">
                {/* User Info in Sidebar */}
                <div className="flex items-center gap-2">
                  <User size={24} />
                  <div>
                    {user ? (
                      <>
                        <p className="text-sm font-semibold">{user.displayName || "User"}</p>
                        <button onClick={() => auth.signOut()} className="text-xs underline">Logout</button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold">My Account</p>
                        <button onClick={toggleModal} className="text-xs underline">Log in</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </header>
    </div>
  );
};

export default Navbar;
