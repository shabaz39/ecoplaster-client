"use client";

import React from "react";
 import { Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle /* Added WhatsApp/Message icon */ } from "lucide-react";
import Link from "next/link";

const Footer: React.FC = () => {
  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/ecoplaster1" }, // Replace with your URL
     { name: "Instagram", icon: Instagram, href: "https://instagram.com/ecoplaster1" }, // Replace with your URL
     { name: "YouTube", icon: Youtube, href: "https://youtube.com/@ecoplaster1?si=yfuK7_zvVnDUPQ3m" }, // Replace with your URL
    { name: "WhatsApp", icon: MessageCircle, href: "https://wa.me/918790505042" }, // Replace with your WhatsApp number link
  ];
  return (
    <footer className="relative">
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
            <div className="fixed right-4 bottom-4 z-50 flex flex-col space-y-3">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${link.name}`}
            // Styling for the circular buttons
            className={`p-3 rounded-full text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2
              ${link.name === 'Facebook' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : ''}
              ${link.name === 'Twitter' ? 'bg-sky-500 hover:bg-sky-600 focus:ring-sky-400' : ''}
              ${link.name === 'Instagram' ? 'bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 hover:opacity-90 focus:ring-pink-500' : ''}
              ${link.name === 'LinkedIn' ? 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-600' : ''}
              ${link.name === 'YouTube' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : ''}
              ${link.name === 'WhatsApp' ? 'bg-newgreen hover:bg-green focus:ring-green-400' : ''}
            `}
          >
            <link.icon size={20} />
          </a>
        ))}
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
            <p>Contact us at +91  87905 05042</p>
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
            {/* Shop by Series */}
    <div>
      <h3 className="font-bold mb-4 text-gray-800">Shop By Series</h3> {/* Changed heading color */}
      <ul className="space-y-2 text-sm">
        <li><Link href="/allproducts?series=Silk" className="hover:text-newgreen">Silk Series</Link></li>
        <li><Link href="/allproducts?series=Gold" className="hover:text-newgreen">Gold Series</Link></li>
        <li><Link href="/allproducts?series=Chips" className="hover:text-newgreen">Chips Series</Link></li>
        <li><Link href="/allproducts?series=Cotton" className="hover:text-newgreen">Cotton Series</Link></li>
        <li><Link href="/allproducts?series=Glitter" className="hover:text-newgreen">Glitter Series</Link></li>
        <li><Link href="/allproducts" className="hover:text-newgreen font-medium">View All Products</Link></li>
      </ul>
    </div>

    {/* Shop by Room/Application */}
    <div>
      <h3 className="font-bold mb-4 text-gray-800">Ideal For</h3> {/* Changed heading color */}
      <ul className="space-y-2 text-sm">
        <li><Link href="/inspiration/living-room" className="hover:text-newgreen">Living Rooms</Link></li>
        <li><Link href="/inspiration/bedroom" className="hover:text-newgreen">Bedrooms</Link></li>
        <li><Link href="/inspiration/office" className="hover:text-newgreen">Offices & Commercial</Link></li>
        <li><Link href="/inspiration/kitchen-dining" className="hover:text-newgreen">Kitchens & Dining</Link></li>
        <li><Link href="/inspiration/feature-walls" className="hover:text-newgreen">Feature Walls</Link></li>
        <li><Link href="/inspiration/ceilings" className="hover:text-newgreen">Ceilings</Link></li>
      </ul>
    </div>

    {/* Resources */}
    <div>
      <h3 className="font-bold mb-4 text-gray-800">Resources</h3> {/* Changed heading color */}
      <ul className="space-y-2 text-sm">
        <li><Link href="/blogs" className="hover:text-newgreen">Blog & Inspiration</Link></li>
        <li><Link href="/installationGuide" className="hover:text-newgreen">Installation Guide</Link></li>
         {/* <li><Link href="/visualizer" className="hover:text-newgreen">Room Visualizer</Link></li>
        <li><Link href="/project-calculator" className="hover:text-newgreen">Project Calculator</Link></li> */}
        <li><Link href="/faqs" className="hover:text-newgreen">FAQs</Link></li>
      </ul>
    </div>

    {/* Connect With Us */}
    <div>
       <h3 className="font-bold mb-4 text-gray-800">Connect</h3> {/* Changed heading color */}
       <ul className="space-y-2 text-sm">
          <li><Link href="/stores" className="hover:text-newgreen">Find a Store/Dealer</Link></li>
          <li><Link href="/" className="hover:text-newgreen">Become a Dealer</Link></li>
          <li><Link href="/bulkorders" className="hover:text-newgreen">Bulk Orders</Link></li>
          <li><Link href="/contactus" className="hover:text-newgreen">Contact Support</Link></li>
           {/* Add social links again here if desired, or rely on the floating ones */}
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
