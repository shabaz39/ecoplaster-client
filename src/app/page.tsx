import React from "react";
import Header from "../components/HomepageComponents/Header";
import Hero from "../components/HomepageComponents/Hero";
import ProductCarousel from "@/components/HomepageComponents/ProductCardCarousel";
import ProjectCostCalculator from "@/components/HomepageComponents/ProjectCostCalculator";
import AnnouncementBanner from "@/components/HomepageComponents/AnnouncementBanner";
import Navbar from "@/components/HomepageComponents/Navbar";
import WhyEcoPlaster from "@/components/HomepageComponents/WhyEcoplaster";
import CategoriesSection from "@/components/HomepageComponents/ShopByCategories";
import StoresSection from "@/components/HomepageComponents/Stores";
import ShopByRooms from "@/components/HomepageComponents/ShopByRooms";
import BannerWithModal from "@/components/HomepageComponents/Confused";
import BulkOrdersSection from "@/components/HomepageComponents/BulkOrderSection";
import AwardsSection from "@/components/HomepageComponents/Awards";
import TestimonialsSection from "@/components/HomepageComponents/VideoTestimonials";
import SEOSection from "@/components/HomepageComponents/SeoSection";
import Footer from "@/components/HomepageComponents/Footer";

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
      <AwardsSection/>
      <TestimonialsSection/>
      <SEOSection/>
      <Footer/>


      {/* Add more sections here */}
    </div>
  );
};

export default Home;
