import AboutUs from '@/components/AboutUsComponents/AboutUs'
import Banner from '@/components/BulkOrdersPageComponents/Banner'
import AnnouncementBanner from '@/components/HomepageComponents/AnnouncementBanner'
import Footer from '@/components/HomepageComponents/Footer'
import Navbar from '@/components/HomepageComponents/Navbar'
import React from 'react'

const AboutUsPage = () => {
  return (
    <div>
          <AnnouncementBanner/>
     <Navbar/>
        <Banner/>
      <AboutUs/>
      <Footer/>
    </div>
  )
}

export default AboutUsPage
