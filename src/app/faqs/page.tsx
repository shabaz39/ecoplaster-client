import Banner from '@/components/BulkOrdersPageComponents/Banner'
import FAQPage from '@/components/FAQComponents/Faqpage'
import AnnouncementBanner from '@/components/HomepageComponents/AnnouncementBanner'
import Footer from '@/components/HomepageComponents/Footer'
import Navbar from '@/components/HomepageComponents/Navbar'
import React from 'react'

const FreqPage = () => {
  return (
    <div>
           <AnnouncementBanner/>
     <Navbar/>
        <Banner/>
      <FAQPage/>
      <Footer/>
    </div>
  )
}

export default FreqPage
