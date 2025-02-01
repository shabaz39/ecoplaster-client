"use client";

import React from "react";
import Navbar from "../../components/HomepageComponents/Navbar";
import Banner from "../../components/BulkOrdersPageComponents/Banner";
import BulkOrderForm from "../../components/BulkOrdersPageComponents/BulkOrderForm";
import Categories from "@/components/HomepageComponents/CategoriesHover";
import CategoriesSection from "@/components/HomepageComponents/ShopByCategories";
import BulkOrdersSEOSection from "@/components/BulkOrdersPageComponents/BulkOrderContent";
import Footer from "@/components/HomepageComponents/Footer";
import Hero from "@/components/HomepageComponents/Hero";

const BulkOrdersPage: React.FC = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Banner */}
      <Hero />

      {/* Bulk Order Form Section */}
      <BulkOrderForm />

       {/* Shop By Categories */}
       <CategoriesSection/>

      {/* Bulk Orders content */}
      <BulkOrdersSEOSection/>

      {/*Footer Section */}
      <Footer/>

    </div>
  );
};

export default BulkOrdersPage;
