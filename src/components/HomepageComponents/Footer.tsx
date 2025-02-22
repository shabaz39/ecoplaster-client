"use client";

import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer>
      {/* First Section */}
      <div className="bg-newgreensecond text-white py-8 px-4 sm:px-8 lg:px-64">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Logo and Links */}
          <div className="flex-1">
            <div className="text-xl font-bold mb-4">EcoPlaster</div>
            <ul className="text-sm space-y-2 text-gray-300">
              <li>Careers</li>
              <li>Become Dealer</li>
              <li>Investor Relation</li>
              <li>Business Orders</li>
              <li>Media Queries</li>
              <li>Media Coverage</li>
            </ul>
            {/* Social Media Icons */}
            <div className="flex space-x-4  mt-6">
              <Facebook className="text-white hover:text-lightgreen" />
              <Twitter className="text-white hover:text-lightgreen" />
              <Instagram className="text-white hover:text-lightgreen" />
              <Linkedin className="text-white hover:text-lightgreen" />
            </div>
          </div>
          {/* Policies */}
          <div className="flex-1">
            <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/faqs">FAQs</Link></li>
               <li><Link href="/shippingpolicy">Shipping & Location</Link></li>
               <li><Link href="/refundpolicy">Payment, Returns & Refunds</Link></li>
               <li><Link href="/termsofservice">Terms Of Service</Link></li>
              <li><Link href="/privacypolicy">Privacy Policy</Link></li>
            </ul>
          </div>
          {/* Help */}
          <div className="flex-1 text-sm text-gray-300">
            <p>Contact us at +91 94296 92999</p>
            <p className="mt-2">
              We are here to help you every day between 9:30 AM to 7:30 PM.
            </p>
            <p className="mt-4">
              Registered Office, Manufacturer & Packer:
              <br />
              RXW Imports & Exports
              <br />
              2nd Floor, police station, 14-40/A, Dhanalaxmi Nagar, beside MR Palli, Vk Puram, Tirupati, Andhra Pradesh 517501            </p>
          </div>
        </div>
      </div>

      {/* Second Section */}
      <div className="bg-cream py-8 px-4 sm:px-8 lg:px-64">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 text-newgreen">
          <div>
            <h3 className="font-bold  mb-4">DIY Guides & Home Decor Ideas</h3>
            <ul className="space-y-2 text-sm">
              <li>Mattress Size Guide</li>
              <li>Bed Size Guide</li>
              <li>Bedroom Decor Ideas</li>
              <li>Living Room Decor Ideas</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold  mb-4">Shop Bestsellers By Cities</h3>
            <ul className="space-y-2 text-sm">
              <li>Bangalore Mattress</li>
              <li>Hyderabad Mattress</li>
              <li>Chennai Mattress</li>
              <li>Mumbai Mattress</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Shop By Popular Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>Double Bed Mattresses</li>
              <li>Queen Size Beds</li>
              <li>Bedding Accessories</li>
              <li>Decorative Items</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Payment Methods</h3>
            <ul className="flex space-x-4">
              <li>
                <img src="/card.png" alt="Visa" className="h-10" />
              </li>
              <li>
                <img src="/logo.png" alt="Mastercard" className="h-10" />
              </li>
              <li>
                <img src="/paypal.png" alt="UPI" className="h-10" />
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Third Section */}
      <div className="bg-white text-black text-center py-4">
        <p className="text-sm">
          © 2025 EcoPlaster. All Rights Reserved. | EcoPlaster name and logo are
          registered trademarks owned by RXW Imports & Exports
        </p>
      </div>
    </footer>
  );
};

export default Footer;
