"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

const testimonials = [
  {
    name: "Ecoplaster",
    role: "Sustainable Wall solutions",
    description:
      "Ecoplaster is not only a piece of wall decor, it is part of your life, supporting you in all aspects of your life.",
    videoThumbnail: "/video-thumbnail-1.webp",
    videoUrl: "https://www.youtube.com/embed/qg8uUo6tW8M", // YouTube Embed URL
  },
  {
    name: "Sushmitha",
    role: "Learning Experience Designer",
    description:
      "A lot of times to me the cot is inviting. It’s like a panda. Even when I want to get active it’s like come be lazy and just snuggle and be comfortable.",
    videoThumbnail: "/video-thumbnail-2.webp",
  },
  {
    name: "Ajay",
    role: "Entrepreneur",
    description:
      "When people sit on the sofa, I am not worried, what happens if they spill something. That’s the comfort, the peace.",
    videoThumbnail: "/video-thumbnail-1.webp",
  },
  {
    name: "Maya",
    role: "Architect",
    description:
      "The sofa design perfectly complements my living space. It’s stylish, durable, and worth every penny.",
    videoThumbnail: "/video-thumbnail-2.webp",
  },
];

const TestimonialsSection: React.FC = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(testimonials[0]);

  return (
    <section className="bg-black lg:mt-10 py-24 px-4 sm:px-8 lg:px-64">
      <div className="pb-4">
        <h2 className="relative pb-2 lg:text-2xl font-bold text-white">
          Customer Testimonials        
          <div className="flex justify-center mt-1">
            <span className="absolute left-0 bottom-0 h-[3px] w-14 bg-newgreen rounded-md"></span>
          </div>
        </h2>
      </div>   
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Video Card */}
        <div className="flex-1">
          <div className="relative bg-black rounded-lg overflow-hidden shadow-md">
            {selectedTestimonial.videoUrl ? (
              <iframe
                src={selectedTestimonial.videoUrl}
                title={selectedTestimonial.name}
                className="w-full h-64 sm:h-80"
                allowFullScreen
              />
            ) : (
              <img
                src={selectedTestimonial.videoThumbnail}
                alt={selectedTestimonial.name}
                className="w-full h-64 sm:h-80 object-cover"
              />
            )}
            {!selectedTestimonial.videoUrl && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                <PlayCircle size={60} className="text-white" />
              </motion.div>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-white">
              {selectedTestimonial.name} | {selectedTestimonial.role}
            </h3>
            <p className="mt-2 text-gray-400">{selectedTestimonial.description}</p>
          </div>
        </div>

        {/* Vertical Scrollable Testimonial Cards */}
        <div className="flex-1 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-newgreen scrollbar-track-gray-800 rounded-lg">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              onClick={() => setSelectedTestimonial(testimonial)}
              className={`flex gap-4 bg-black rounded-lg p-4 mb-4 shadow-md cursor-pointer transition-all ${
                selectedTestimonial.name === testimonial.name
                  ? "bg-gray-800"
                  : "hover:bg-gray-700"
              }`}
            >
              <div className="relative w-1/3">
                <img
                  src={testimonial.videoThumbnail}
                  alt={testimonial.name}
                  className="w-full h-24 object-cover rounded-md"
                />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                >
                  <PlayCircle size={30} className="text-white" />
                </motion.div>
              </div>
              <div className="w-2/3">
                <h4 className="text-lg font-bold text-white">
                  {testimonial.name} | {testimonial.role}
                </h4>
                <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                  {testimonial.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
