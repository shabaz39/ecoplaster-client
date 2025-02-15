"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  MessageCircle,
  Gift,
  Wallet,
  MapPin,
  LogOut,
  HelpCircle,
  User
} from "lucide-react";
import { signOut } from "next-auth/react";

const UserDashboard: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="bg-gray-50 min-h-screen lg:px-64">
      {/* Header Section */}
      <header className="bg-cream px-6 py-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-700">
            Good {new Date().getHours() < 12 ? 'Morning' : 
                  new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},
          </h1>
          <h2 className="text-xl font-semibold text-green">
            {session?.user?.name}
          </h2>
          <p className="text-sm text-gray-600">{session?.user?.email}</p>
        </div>
        <div className="text-green">
          <User size={24} />
        </div>
      </header>

      {/* Orders Section */}
      <section className="px-6 py-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <ShoppingBag className="mr-2" size={20} />
            Orders
          </h3>
          <button 
            onClick={() => router.push('/orders')}
            className="text-newgreensecond font-medium hover:underline"
          >
            See All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["Order1", "Order2"].map((order, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="w-full h-32 bg-gray-200 rounded-md mb-2"></div>
              <p className="mt-2 text-gray-700 font-semibold">
                {order} - Delivered
              </p>
              <div className="mt-2 flex justify-between text-sm">
                <button className="text-newgreensecond hover:underline">
                  Order Details
                </button>
                <button className="text-newgreensecond hover:underline">
                  Get Help
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chat and FAQs Section */}
      <section className="px-6 py-8">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <MessageCircle className="mr-2" size={20} />
          Support
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            { title: "Chat With Us", icon: MessageCircle },
            { title: "FAQs", icon: HelpCircle },
            { title: "Contact Us", icon: MessageCircle }
          ].map((item, index) => (
            <button
              key={index}
              className="bg-cream p-4 rounded-lg shadow-sm hover:bg-newgreensecond hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <item.icon size={20} />
                <p className="font-semibold">{item.title}</p>
              </div>
              <p className="text-sm mt-2">
                Quick access to support and information.
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-8">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <Gift className="mr-2" size={20} />
          Your Benefits
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Wallet", icon: Wallet },
            { title: "Rewards", icon: Gift },
            { title: "Refer & Earn", icon: Gift }
          ].map((item, index) => (
            <button
              key={index}
              className={`p-4 rounded-lg ${
                index % 2 === 0 ? "bg-beige" : "bg-mint"
              } shadow-sm hover:opacity-90 transition-opacity`}
            >
              <div className="flex items-center gap-2">
                <item.icon size={20} />
                <h4 className="text-gray-700 font-semibold">{item.title}</h4>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Access your {item.title.toLowerCase()} details.
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* My Account Section */}
      <section className="px-6 py-8">
        <h3 className="text-lg font-semibold text-gray-700">My Account</h3>
        <div className="mt-4 space-y-2">
          <button 
            onClick={() => router.push('/addresses')}
            className="flex items-center gap-2 text-newgreensecond hover:underline w-full"
          >
            <MapPin size={20} />
            Manage Saved Addresses
          </button>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-red-500 hover:underline w-full"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;