import Banner from '@/components/BulkOrdersPageComponents/Banner'
import ContactUs from '@/components/ContactUsComponents/contactUs'
import AnnouncementBanner from '@/components/HomepageComponents/AnnouncementBanner'
import Footer from '@/components/HomepageComponents/Footer'
import Navbar from '@/components/HomepageComponents/Navbar'
import React from 'react'

const ContactUsPage = () => {
  return (
    <div>
      
        <AnnouncementBanner/>
     <Navbar/>
        <Banner/>
      <ContactUs/>
      <Footer/>
    </div>
  )
}

export default ContactUsPage
