"use client"
import React, { useState } from "react";

const faqs = [
  {
    category: "FAQ",
    questions: [
      { question: "On which surfaces can EcoPlaster be applied?", answer: "EcoPlaster can be applied to a variety of surfaces, including concrete, cement, drywall, wood, and brick after applying one coat of base primer." },
      { question: "Can EcoPlaster be applied easily?", answer: "EcoPlaster is a DIY-friendly product that doesn’t require special skills for application. However, consulting a professional is recommended for the best results." },
      { question: "What are the key benefits of using liquid wallpapers?", answer: "Liquid wallpapers offer several key benefits, including eco-friendliness, easy application, odorlessness, heat & sound insulation, moisture resistance, seamless finishes, and long-lasting durability." },
      { question: "What ingredients are used in EcoPlaster?", answer: "EcoPlaster is made from a blend of high-quality materials, including Silk & Cotton Fibers, Natural Glue, Mineral additives, glitter, and decorative chips." },
      { question: "Can I apply liquid wallpaper myself?", answer: "Yes, you can apply liquid wallpaper yourself as a DIY, but for a professional finish, hiring an expert is recommended." },
      { question: "How long does liquid wallpaper last?", answer: "With proper care, it can last up to 10-15 years." },
      { question: "Is liquid wallpaper waterproof?", answer: "While it’s moisture-resistant, it’s not completely waterproof. Suitable for areas with moderate humidity." }
    ]
  },
  {
    category: "Delivery Questions",
    questions: [
      { question: "How long does it take for EcoPlaster to be delivered?", answer: "Your EcoPlaster order will be processed and ready for dispatch within 1-2 business days. Delivery typically takes between 4-7 business days, depending on your location." },
      { question: "Can I track my EcoPlaster delivery?", answer: "You can easily track your EcoPlaster order using Shiprocket and Indian Post solutions, allowing you to monitor your delivery status in real-time." },
      { question: "Do you offer free delivery?", answer: "Yes, we offer free delivery on all EcoPlaster orders. Enjoy hassle-free shopping with no extra shipping costs!" }
    ]
  }
];

const FAQPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(faqs[0]);
  const [selectedQuestion, setSelectedQuestion] = useState(selectedCategory.questions[0]);

  return (
    <div className="bg-white py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">FAQs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
        <div className="border-r border-gray-300 pr-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">1. Topic</h2>
          {faqs.map((category) => (
            <button key={category.category} className={`block w-full py-2 px-4 text-left rounded-md mb-2 ${selectedCategory.category === category.category ? "bg-newgreen text-white" : "hover:bg-gray-200"}`} onClick={() => { setSelectedCategory(category); setSelectedQuestion(category.questions[0]); }}>
              {category.category}
            </button>
          ))}
        </div>
        <div className="border-r border-gray-300 pr-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">2. Issue</h2>
          {selectedCategory.questions.map((q) => (
            <button key={q.question} className={`block w-full py-2 px-4 text-left rounded-md mb-2 ${selectedQuestion.question === q.question ? "bg-newgreen text-white" : "hover:bg-gray-200"}`} onClick={() => setSelectedQuestion(q)}>
              {q.question}
            </button>
          ))}
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4">3. Assistance</h2>
          <div className="bg-gray-100 p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-bold text-newgreensecond mb-2">{selectedQuestion.question}</h3>
            <p className="text-gray-700">{selectedQuestion.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
