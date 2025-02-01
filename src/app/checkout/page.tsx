"use client";

import React from 'react';
import Navbar from '@/components/HomepageComponents/Navbar';
import CheckoutPage from '@/components/CheckOutComponents/CheckOutComponent';
import CategoriesSection from '@/components/HomepageComponents/ShopByCategories';
import FAQPage from '@/components/FAQComponents/Faqpage';
import ContactUs from '@/components/ContactUsComponents/contactUs';
import Footer from '@/components/HomepageComponents/Footer';

const CheckOut = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Main content with proper spacing */}
      <main className="flex-grow">
        <div>
          <CheckoutPage />
        </div>
      
        <div className="py-16">
          <FAQPage />
        </div>
        
       
      </main>

      <Footer />
    </div>
  );
};

export default CheckOut;