// app/products/[id]/page.tsx
"use client";

import Footer from "@/components/HomepageComponents/Footer";
import Navbar from "@/components/HomepageComponents/Navbar";
import SEOSection from "@/components/HomepageComponents/SeoSection";
import CategoriesSection from "@/components/HomepageComponents/ShopByCategories";
import ProductDetails from "@/components/ProductDescriptionComponents/ProductDetails";
import { GET_PRODUCT_BY_ID } from "@/constants/queries/productQueries";
import { useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useLoading } from "@/components/LoadingProvider";
import LoadingOverlay from "@/components/LoadingOverlay";
import ProductDescription from "@/components/ProductDescriptionComponents/ProductDescription";

const ProductDescriptionPage = () => {
  const params = useParams();
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
      <ProductDescription productId={productId} /> {/* Changed this line */}
      </div>
      <CategoriesSection />
      <SEOSection />
      <Footer />
    </div>
  );
};

export default ProductDescriptionPage;