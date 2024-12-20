"use client";

import React from "react";
import Navbar from "../../components/HomepageComponents/Navbar";
import Banner from "../../components/BulkOrdersPageComponents/Banner";
import BulkOrderForm from "../../components/BulkOrdersPageComponents/BulkOrderForm";
import Categories from "@/components/HomepageComponents/CategoriesHover";
import CategoriesSection from "@/components/HomepageComponents/ShopByCategories";

const BulkOrdersPage: React.FC = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Banner */}
      <Banner />

      {/* Bulk Order Form Section */}
      <BulkOrderForm />

       {/* Shop By Categories */}
       <CategoriesSection/>

    </div>
  );
};

export default BulkOrdersPage;
