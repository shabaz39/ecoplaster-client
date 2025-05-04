"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import {ProductDescription} from "../../../components/HomepageComponents/ProductDescription";
import { useLoading } from "@/components/LoadingProvider";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID } from "@/constants/queries/productQueries";
import LoadingOverlay from "@/components/LoadingOverlay";
import Navbar from "@/components/HomepageComponents/Navbar";
import Footer from "@/components/HomepageComponents/Footer";
import CategoriesSection from "@/components/HomepageComponents/ShopByCategories";
import SEOSection from "@/components/HomepageComponents/SeoSection";



const ProductPage = () => {
  const params = useParams() as { id: string }; // Ensure params is an object with `id`
  const productId = params?.id ? String(params.id) : '';

  console.log('productID', productId)
  console.log('typeofProductId', typeof(productId))
  const { setLoading } = useLoading();

  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: productId },
    skip: !productId,
    onCompleted: () => setLoading(false),
    onError: () => setLoading(false),
  });

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  if (loading) return <LoadingOverlay />;
  
  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            Error loading product details. Please try again later.
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!data?.getProductById) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Product not found</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
      <ProductDescription productData={null} />{/* Changed this line */}
      </div>
      <CategoriesSection />
      <SEOSection />
      <Footer />
    </div>
  );
};
