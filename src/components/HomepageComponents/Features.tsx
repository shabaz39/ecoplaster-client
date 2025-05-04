"use client";

import React, { useState, useEffect } from "react";
import { Shield, Leaf, Droplet, Wind, Zap, PenTool, Flame, Volume2, Thermometer, Umbrella, Wifi, Heart, Sparkles } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    id: 1,
    title: "Eco-Friendly",
    description: "Made from sustainable, non-toxic materials, EcoPlaster is free from harmful chemicals, reducing environmental impact.",
    icon: <Leaf className="w-12 h-12 text-newgreen" />,
    color: "bg-green-50",
    detailedDescription: "EcoPlaster is manufactured using natural materials sourced responsibly. Our commitment to environmental sustainability means we avoid using harmful chemicals like VOCs (Volatile Organic Compounds) and synthetic polymers that are common in traditional plasters. By choosing EcoPlaster, you're not just enhancing your home, but also contributing to a healthier planet."
  },
  {
    id: 2,
    title: "Kids & Pet Friendly",
    description: "With no harsh chemicals or allergens, EcoPlaster ensures a safe and healthy environment for children and pets.",
    icon: <Heart className="w-12 h-12 text-newgreen" />,
    color: "bg-red-50",
    detailedDescription: "Children and pets often interact directly with wall surfaces, which is why we've made safety a priority. EcoPlaster contains no lead, formaldehyde, or other harmful substances that could be ingested or cause skin irritations. It's safe even if accidentally touched or scraped by curious little hands or paws."
  },
  {
    id: 3,
    title: "Odorless",
    description: "Unlike conventional paints and synthetic plasters, EcoPlaster emits no strong odors or harmful fumes, making it ideal for indoor spaces.",
    icon: <Droplet className="w-12 h-12 text-newgreen" />,
    color: "bg-blue-50",
    detailedDescription: "The absence of strong odors means you can occupy your newly plastered rooms immediately after application. There's no need to ventilate the space for days or worry about lingering chemical smells that can trigger headaches or respiratory discomfort. EcoPlaster creates a pleasant atmosphere from day one."
  },
  {
    id: 4,
    title: "Breathable Walls",
    description: "EcoPlaster allows moisture to escape, preventing mold growth, improving air quality, and maintaining a comfortable indoor environment.",
    icon: <Wind className="w-12 h-12 text-newgreen" />,
    color: "bg-cyan-50",
    detailedDescription: "The microporous structure of EcoPlaster allows walls to 'breathe' naturally, regulating humidity by absorbing excess moisture when the air is humid and releasing it when the air is dry. This prevents condensation and dampness, which are the primary causes of mold and mildew growth, leading to healthier indoor air quality."
  },
  {
    id: 5,
    title: "High Elasticity",
    description: "Its flexible nature helps prevent cracks and damage, ensuring a smooth and long-lasting finish.",
    icon: <Zap className="w-12 h-12 text-newgreen" />,
    color: "bg-yellow-50",
    detailedDescription: "EcoPlaster maintains its structural integrity even with building movements and temperature fluctuations. Unlike rigid conventional plasters that crack under stress, EcoPlaster's elasticity allows it to flex and adapt without breaking. This resilience means your walls remain beautiful for years with minimal maintenance."
  },
  {
    id: 6,
    title: "Easy to Apply",
    description: "Simple surface preparation, mixing, application, and finishing make EcoPlaster accessible for both professionals and DIY enthusiasts.",
    icon: <PenTool className="w-12 h-12 text-newgreen" />,
    color: "bg-purple-50",
    detailedDescription: "The application process consists of four simple steps: Surface Preparation (cleaning and smoothing), Mixing (combining EcoPlaster with water as per guidelines), Application (using a trowel or spatula to spread evenly), and Finishing (customizing with textures or smooth finishes). Our formulation is designed to be forgiving for beginners while offering versatility for professionals."
  },
  {
    id: 7,
    title: "Fire Retardant",
    description: "EcoPlaster provides an added layer of safety as it resists flames and slows fire spread.",
    icon: <Flame className="w-12 h-12 text-newgreen" />,
    color: "bg-orange-50",
    detailedDescription: "In the event of a fire, EcoPlaster doesn't ignite or contribute to flame spread. Instead, it acts as a protective barrier, giving valuable extra minutes for evacuation. The natural minerals in our plaster have inherent fire-resistant properties, enhancing the overall safety of your property without the need for chemical fire retardants."
  },
  {
    id: 8,
    title: "Sound Insulation",
    description: "Reduces noise transmission, making it ideal for peaceful homes and sound-sensitive environments.",
    icon: <Volume2 className="w-12 h-12 text-newgreen" />,
    color: "bg-indigo-50",
    detailedDescription: "The density and composition of EcoPlaster absorb sound waves rather than reflecting them, reducing echo within rooms and minimizing sound transmission between spaces. This acoustic performance makes it perfect for bedrooms, home offices, recording studios, or any environment where noise control is important for comfort and productivity."
  },
  {
    id: 9,
    title: "Heat Insulation",
    description: "Regulates indoor temperatures by keeping interiors cooler in summer and warmer in winter, reducing energy costs.",
    icon: <Thermometer className="w-12 h-12 text-newgreen" />,
    color: "bg-red-50",
    detailedDescription: "EcoPlaster's thermal mass properties help maintain consistent indoor temperatures. During summer, it absorbs heat during the day and releases it slowly at night, while in winter it retains warmth inside. This natural temperature regulation can lead to significant energy savings on heating and cooling, reducing both utility bills and environmental impact."
  },
  {
    id: 10,
    title: "Hypoallergenic",
    description: "Free from VOCs and allergens, EcoPlaster is gentle on sensitive individuals, reducing allergic reactions and respiratory issues.",
    icon: <Shield className="w-12 h-12 text-newgreen" />,
    color: "bg-green-50",
    detailedDescription: "For those with allergies, asthma, or chemical sensitivities, EcoPlaster provides a safe alternative to conventional wall finishes. It doesn't release harmful particles into the air, doesn't harbor allergens like dust mites, and doesn't contain respiratory irritants. This makes it especially beneficial in bedrooms, children's rooms, and healthcare facilities."
  },
  {
    id: 11,
    title: "Moisture Resistant",
    description: "Prevents water absorption, protecting walls from dampness, peeling, and mold formation.",
    icon: <Umbrella className="w-12 h-12 text-newgreen" />,
    color: "bg-blue-50",
    detailedDescription: "While allowing walls to breathe, EcoPlaster is formulated to resist water penetration from external sources. This dual functionality means moisture won't seep into the wall structure, preventing common issues like stains, paint bubbling, and structural damage. It's ideal for bathrooms, kitchens, and areas prone to high humidity or water exposure."
  },
  {
    id: 12,
    title: "Anti-Static",
    description: "Does not attract dust or dirt, keeping walls cleaner for longer and requiring minimal maintenance.",
    icon: <Wifi className="w-12 h-12 text-newgreen" />,
    color: "bg-gray-50",
    detailedDescription: "The natural composition of EcoPlaster doesn't generate static electricity, which means dust and airborne particles are less likely to adhere to the surface. This results in cleaner walls that maintain their appearance longer and require less frequent cleaning, saving time and effort in home maintenance."
  },
];

const FeaturePage = () => {
  const [selectedFeature, setSelectedFeature] = useState(features[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  const openModal = (feature:any) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-beige min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-newgreensecond text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/feature-bg.webp" 
            alt="Features Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Features of <span className="text-beige">EcoPlaster</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            EcoPlaster is a revolutionary wall finish that combines sustainability, durability, and aesthetic appeal. 
            Unlike conventional paints and synthetic plasters, it is made from natural materials, ensuring a healthier living space.
          </p>
          <div className="mt-6">
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <Sparkles className="h-10 w-10 text-beige mx-auto" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.id * 0.1 }}
                viewport={{ once: true }}
                className={`${feature.color} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all`}
              >
                <div className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <button
                    onClick={() => openModal(feature)}
                    className="text-newgreen font-medium hover:text-newgreensecond transition-colors"
                  >
                    Learn more →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Detail Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${selectedFeature.color} rounded-xl max-w-2xl w-full p-6 shadow-2xl`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div>{selectedFeature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800">{selectedFeature.title}</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">{selectedFeature.detailedDescription}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-newgreen text-white rounded-lg hover:bg-newgreensecond transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-newgreen text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Walls?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            EcoPlaster is not just a wall finish; it's a long-term investment in durability, safety, and sustainability. 
            Perfect for homes, offices, and commercial spaces, it offers a healthier and more efficient alternative to traditional wall coatings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
  <Link href="/allproducts">
    <button className="px-6 py-3 bg-white text-newgreen font-bold rounded-lg hover:bg-beige transition-colors">
      View Products
    </button>
  </Link>
  <Link href="/stores">
    <button className="px-6 py-3 bg-newgreensecond text-white font-bold rounded-lg hover:bg-green-800 transition-colors">
      Contact a Dealer
    </button>
  </Link>
</div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-beige">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">How long does EcoPlaster last?</h3>
              <p className="text-gray-600">
                With proper application and maintenance, EcoPlaster can last 15-20 years or more. Its durability is significantly higher than conventional paints, which typically require reapplication every 3-5 years.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Is EcoPlaster safe for indoor use?</h3>
              <p className="text-gray-600">
                Absolutely! EcoPlaster is specifically designed for indoor use, with a focus on improving indoor air quality. It's free from toxic chemicals, doesn't emit harmful VOCs, and is hypoallergenic.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">What surfaces can EcoPlaster be applied to?</h3>
              <p className="text-gray-600">
                EcoPlaster can be applied to most common construction surfaces, including concrete, brick, drywall, wood, and existing plaster. Each surface requires proper preparation for optimal adhesion and results.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Does it require special maintenance?</h3>
              <p className="text-gray-600">
                EcoPlaster requires minimal maintenance. Its anti-static properties keep walls cleaner longer. For cleaning, simply dust with a soft cloth or vacuum with a brush attachment. For stains, use a damp cloth with mild soap if necessary.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default FeaturePage;