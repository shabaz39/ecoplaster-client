import Banner from '@/components/BulkOrdersPageComponents/Banner'
import AnnouncementBanner from '@/components/HomepageComponents/AnnouncementBanner'
import Footer from '@/components/HomepageComponents/Footer'
import Hero from '@/components/HomepageComponents/Hero'
import Navbar from '@/components/HomepageComponents/Navbar'
import StoreCards from '@/components/StorePageComponents/StoreComponent'
import React from 'react'

const StoresPage = () => {
  return (
    <div>
        <AnnouncementBanner/>
     <Navbar/>
        <Hero/>
      <StoreCards/>
      <Footer/>
    </div>
  )
}

export default StoresPage
