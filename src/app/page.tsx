import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductCarousel from "@/components/ProductCardCarousel";
import ProjectCostCalculator from "@/components/ProjectCostCalculator";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Navbar from "@/components/Navbar";
import WhyEcoPlaster from "@/components/WhyEcoplaster";
import CategoriesSection from "@/components/ShopByCategories";
import StoresSection from "@/components/Stores";
import ShopByRooms from "@/components/ShopByRooms";
import BannerWithModal from "@/components/Confused";
import BulkOrdersSection from "@/components/BulkOrderSection";

const Home: React.FC = () => {
  return (
    <div>
      <AnnouncementBanner/>
      <Navbar/>
      <Hero />
      <WhyEcoPlaster/>
      <CategoriesSection/>
      <StoresSection/>
      <ShopByRooms/>
      <BannerWithModal/>
      <BulkOrdersSection/>


      {/* Add more sections here */}
    </div>
  );
};

export default Home;
