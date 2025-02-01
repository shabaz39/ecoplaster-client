import Banner from '@/components/BulkOrdersPageComponents/Banner'
import ContactUs from '@/components/ContactUsComponents/contactUs'
import AnnouncementBanner from '@/components/HomepageComponents/AnnouncementBanner'
import Footer from '@/components/HomepageComponents/Footer'
import Hero from '@/components/HomepageComponents/Hero'
import Navbar from '@/components/HomepageComponents/Navbar'
import React from 'react'

const ContactUsPage = () => {
  return (
    <div>
      
        <AnnouncementBanner/>
     <Navbar/>
        <Hero/>
      <ContactUs/>
      <Footer/>
    </div>
  )
}

export default ContactUsPage
