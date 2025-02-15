"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Home, Package, Phone, User, ShoppingBag, 
  Heart, LogOut, ChevronRight, Store, Settings 
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const SideMenu = ({ 
  isMenuOpen, 
  toggleMenu, 
  session 
}: { 
  isMenuOpen: boolean; 
  toggleMenu: () => void; 
  session: any;
}) => {
  const router = useRouter();

  const handleDashboardRedirect = () => {
    if (session?.user?.role === "admin") {
      router.push("/adminDashboard");
    } else {
      router.push("/userdashboard");
    }
    toggleMenu(); // Close menu after navigation
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Menu */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed top-0 left-0 h-full w-80 bg-white z-50 overflow-y-auto shadow-lg"
          >
            {/* Header */}
            <div className="bg-newgreen p-4">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-white text-lg font-bold">Menu</h1>
                <button 
                  onClick={toggleMenu}
                  className="text-white hover:text-newbeige p-1 rounded-full hover:bg-white/10"
                >
                  <X size={24} />
                </button>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  {session?.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || ""}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  {session?.user ? (
                    <>
                      <p className="font-medium">{session.user.name}</p>
                      <p className="text-sm opacity-75">{session.user.email}</p>
                    </>
                  ) : (
                    <button 
                      onClick={() => router.push('/auth/signin')}
                      className="text-sm underline"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-4">
              {/* Menu Items */}
              <div className="space-y-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={toggleMenu}
                >
                  <Home size={20} />
                  <span>Home</span>
                </Link>
                <Link
                  href="/stores"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={toggleMenu}
                >
                  <Store size={20} />
                  <span>Stores</span>
                </Link>
                <Link
                  href="/bulkorders"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={toggleMenu}
                >
                  <Package size={20} />
                  <span>Bulk Orders</span>
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={toggleMenu}
                >
                  <ShoppingBag size={20} />
                  <span>My Orders</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={toggleMenu}
                >
                  <Heart size={20} />
                  <span>Wishlist</span>
                </Link>
                <Link
                  href="/contactus"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={toggleMenu}
                >
                  <Phone size={20} />
                  <span>Contact Us</span>
                </Link>
              </div>

              {/* Dashboard Button */}
              {session?.user && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleDashboardRedirect}
                    className="w-full flex items-center gap-3 px-3 py-3 text-white bg-newgreen hover:bg-newgreensecond rounded-lg transition-colors"
                  >
                    <ChevronRight size={20} />
                    <span>
                      {session.user.role === "admin" ? "Admin Dashboard" : "User Dashboard"}
                    </span>
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-3 py-3 text-red-500 hover:bg-gray-100 rounded-lg transition-colors mt-2"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideMenu;
