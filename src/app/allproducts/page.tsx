import AnnouncementBanner from '@/components/HomepageComponents/AnnouncementBanner'
import Footer from '@/components/HomepageComponents/Footer'
import Navbar from '@/components/HomepageComponents/Navbar'
import AllProductsPaage from '@/components/ProductPageComponents/ProductPage'
import AllProductsPage from '@/components/ProductPageComponents/ProductPage'
import SilkProductsPage from '@/components/ProductPageComponents/ProductPage'
import React from 'react'

const AllProducts = () => {
  return (
    <div>
      <AnnouncementBanner/>
      <Navbar/>
      <AllProductsPage/>
      <Footer/>
    </div>
  )
}

export default AllProducts
