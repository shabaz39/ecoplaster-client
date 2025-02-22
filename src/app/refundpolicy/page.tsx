import Footer from '@/components/HomepageComponents/Footer'
 import Navbar from '@/components/HomepageComponents/Navbar'
import RefundPolicy from '@/components/Payment,Returns&RefundsComponent/RefundComponent'
  import React from 'react'

const RefundPolicyPage = () => {
  return (
    <div>
      <Navbar/>
      <RefundPolicy/>
      <Footer/>
    </div>
  )
}

export default RefundPolicyPage
