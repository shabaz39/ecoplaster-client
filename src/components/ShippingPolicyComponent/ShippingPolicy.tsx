import React from 'react';

const ShippingPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>

      {/* Order Processing */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Order Processing</h2>
        <p className="mb-4">
          Please note that your order processing times are separate from the shipping times you see at checkout.
          All orders are processed within <strong>3-7</strong> business days (excluding weekends and holidays)
          after receiving your order confirmation email. You will receive another notification when your order has shipped.
        </p>
        <p>
          Please allow additional time for any delays due to high order volume or postal service issues that are beyond our control.
        </p>
      </section>

      {/* Domestic Shipping */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Domestic Shipping Rates and Estimates</h2>
        <p className="mb-4">
          For all orders within India, we offer <strong>free shipping</strong>—no matter where you are in India.
          Your shipping charges will be $0 at checkout.
        </p>
        <p>
          Please note that processing times and shipping times are separate. Your order will be processed within
          <strong> 3-7</strong> business days and shipped promptly thereafter.
        </p>
      </section>

      {/* Local Delivery & In-Store Pickup */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Local Delivery & In-Store Pickup</h2>
        <p className="mb-4">
          For customers in our local area, we offer free local delivery or in-store pickup.
          If you choose in-store pickup at checkout, your order will be prepared and ready for collection within
          <strong> 3-7</strong> business days. We will notify you via email when your order is ready along with further instructions.
        </p>
        <p>
          Please check our website for the latest information on local delivery areas and in-store pickup hours.
        </p>
      </section>

      {/* International Shipping */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
        <p>
          Currently, we do not offer international shipping. We exclusively serve customers within India.
        </p>
      </section>

      {/* Additional Information */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
        <p>
          If you have any questions regarding our shipping policy, please do not hesitate to contact us.
        </p>
      </section>
    </div>
  );
};

export default ShippingPolicy;
