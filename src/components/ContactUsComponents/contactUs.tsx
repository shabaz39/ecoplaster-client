"use client"
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_CONTACT } from "../../constants/mutations/contactusmutation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    category: "",
    description: "",
  });

  const [createContact, { loading, error }] = useMutation(CREATE_CONTACT);

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (category:any) => {
    setFormData({ ...formData, category });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      await createContact({ variables: { input: formData } });
      toast.success("Contact request submitted successfully!");
      setFormData({ name: "", email: "", mobile: "", category: "", description: "" });
    } catch (err) {
      toast.error("Error submitting the form. Please try again.");
      console.error("Submission error", err);
    }
  };

  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto text-black">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-productNameColor">Contact Us</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-productNameColor mb-4">Come, meet us!</h2>
            <p className="text-gray-700 mb-4">Manufactured, Packed & Marketed By:</p>
            <p className="text-gray-700">
              <strong>Registered Address:</strong> <br />
              RXW Group Pvt Ltd <br />
              2nd Floor, 14-40/A, <br />
              Dhanalakshmi Nagar, VK Puram, <br />
              Tirupati, Andhra Pradesh, India.
            </p>
            <p className="mt-4 text-gray-700">
              <strong>Customer Support:</strong>
            </p>
            <ul className="list-disc ml-5 text-gray-700">
              <li>Phone: +91 87905 05042</li>
             </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-productNameColor mb-4">Want to connect with us for something else?</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Enter Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-newgreen"
                  placeholder="Enter Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Enter Email Address:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-newgreen"
                  placeholder="Enter Email Address"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Enter Mobile Number:</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-newgreen"
                  placeholder="Enter Mobile Number"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Select Category:</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Placing a new order", "Order modification", "Delivery information", "Issue with delivered products", "Order cancellation", "Others"].map((category, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleCategorySelect(category)}
                      className={`py-2 px-4 rounded-md transition ${formData.category === category ? "bg-newgreen text-white" : "bg-newgreensecond text-white hover:bg-newgreen"}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-newgreen"
                  placeholder="Enter description"
                  rows={4}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-newgreensecond text-white font-bold rounded-md hover:bg-newgreen transition"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
              {error && <p className="text-red-500 mt-2">Error submitting the form. Please try again.</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;