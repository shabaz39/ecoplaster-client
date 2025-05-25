"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, HelpCircle, PlayCircle, Download, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Link from "next/link";

const InstallationGuide = () => {
  const [activeTab, setActiveTab] = useState("preparation");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Installation steps with detailed instructions
  const installationSteps = {
    preparation: [
      {
        title: "Surface Inspection",
        description: "Check the wall surface for damages, cracks, or uneven areas. Repair any damages and ensure the wall is structurally sound before proceeding.",
        tips: [
          "Use a flashlight at an angle to spot minor imperfections",
          "Mark problem areas with painter's tape for easy identification"
        ]
      },
      {
        title: "Surface Cleaning",
        description: "Thoroughly clean the surface to remove dust, dirt, grease, and any loose particles. The surface must be completely clean for proper adhesion.",
        tips: [
          "Use a mild detergent solution for general cleaning",
          "For grease or oils, use a degreasing agent",
          "Allow the surface to dry completely before proceeding"
        ]
      },
      {
        title: "Surface Leveling",
        description: "Fill any holes, cracks, or uneven areas with appropriate patching compound. Sand the patches smooth once dry.",
        tips: [
          "Use a high-quality patching compound appropriate for your wall type",
          "For large repairs, consider using fiberglass mesh tape for reinforcement",
          "Sand in circular motions for best results"
        ]
      },
      {
        title: "Primer Application",
        description: "Apply EcoPlaster Primer to the entire surface using a roller or brush. This improves adhesion and ensures uniform absorption of the plaster.",
        tips: [
          "Use a primer specifically designed for plaster applications",
          "Apply in thin, even coats",
          "Allow primer to dry completely (typically 12-24 hours) before applying plaster"
        ]
      }
    ],
    mixing: [
      {
        title: "Gather Materials",
        description: "Prepare a clean mixing container, clean water, mixing paddle, and the appropriate EcoPlaster product for your project.",
        tips: [
          "Use a container at least twice the volume of the material you're mixing",
          "Ensure all tools are clean and free from old plaster residue",
          "Have everything ready before opening the EcoPlaster package"
        ]
      },
      {
        title: "Measure Water",
        description: "Add the recommended amount of clean, room-temperature water to your mixing container (approximately 6-7 liters per 20kg box, check product packaging for exact ratios).",
        tips: [
          "Use a measuring container for precise water amounts",
          "Water temperature should be between 15-25°C (59-77°F)",
          "Using too much water will weaken the final product"
        ]
      },
      {
        title: "Add EcoPlaster",
        description: "Gradually add the EcoPlaster powder to the water while mixing slowly to avoid lumps.",
        tips: [
          "Add powder to water, not water to powder",
          "Add the material in portions, mixing each addition thoroughly",
          "Avoid creating dust clouds by adding the powder gently"
        ]
      },
      {
        title: "Mix Thoroughly",
        description: "Mix for 3-5 minutes until you achieve a smooth, homogeneous, lump-free consistency. Use a low-speed mechanical mixer for best results.",
        tips: [
          "Mix at low speed (400-600 RPM) to avoid air bubbles",
          "Scrape the sides and bottom of the container during mixing",
          "The mixture should be creamy and easy to spread, but not runny"
        ]
      },
      {
        title: "Let Stand",
        description: "Allow the mixed plaster to stand for 5-10 minutes (slaking time). This activates the ingredients and improves workability.",
        tips: [
          "Cover the mixture during standing time to prevent skin formation",
          "Briefly remix for 30 seconds after standing",
          "Do not add more water after the standing period"
        ]
      }
    ],
    application: [
      {
        title: "Test Application",
        description: "Apply a small test area to ensure proper consistency and appearance before proceeding with the entire surface.",
        tips: [
          "Choose an inconspicuous area for testing",
          "This step helps confirm your technique and material consistency"
        ]
      },
      {
        title: "First Coat Application",
        description: "Using a clean stainless steel trowel, apply the first coat of EcoPlaster in upward strokes with firm pressure. Aim for a thickness of 1-2mm.",
        tips: [
          "Hold the trowel at approximately a 15-30° angle to the wall",
          "Work in small sections of about 1 square meter at a time",
          "Maintain a wet edge by working continuously across the surface"
        ]
      },
      {
        title: "Allow Partial Drying",
        description: "Let the first coat dry partially, typically 1-2 hours depending on temperature and humidity, until it's firm but still slightly damp.",
        tips: [
          "The surface should be touch-dry but not completely hardened",
          "Avoid applying in direct sunlight or high winds which accelerate drying",
          "If working in sections, slightly dampen the edge of the previous section before continuing"
        ]
      },
      {
        title: "Second Coat Application",
        description: "Apply the second coat in a crisscross pattern (perpendicular to the first coat) for even coverage. This coat determines the final texture and appearance.",
        tips: [
          "The second coat can be slightly thinner than the first",
          "For smoother finishes, use less pressure and more passes",
          "For textured finishes, use specific techniques appropriate for your chosen texture"
        ]
      },
      {
        title: "Texturing",
        description: "While the second coat is still workable, create the desired texture using appropriate tools and techniques specific to your chosen EcoPlaster finish.",
        tips: [
          "For smooth finishes, use a clean trowel with light pressure",
          "For textured finishes, use specialized tools like sponges, brushes, or combs",
          "Practice your texturing technique on a sample board first"
        ]
      }
    ],
    finishing: [
      {
        title: "Initial Drying",
        description: "Allow the plaster to dry for at least 24-48 hours. The surface should not be touched during this period.",
        tips: [
          "Maintain good ventilation but avoid direct fans or forced air",
          "Protect from direct sunlight during initial drying",
          "Optimum conditions are 20-25°C (68-77°F) and 50-70% relative humidity"
        ]
      },
      {
        title: "Curing",
        description: "Full curing takes approximately 7 days. During this time, the plaster reaches its full hardness and durability.",
        tips: [
          "Avoid water contact during the first week",
          "No cleaning or washing during the curing period",
          "For exterior applications, protect from rain for at least 7 days"
        ]
      },
      {
        title: "Sealing (Optional)",
        description: "For areas with high moisture exposure (bathrooms, kitchens), apply an appropriate sealer to enhance water resistance.",
        tips: [
          "Use a breathable sealer specifically designed for plaster",
          "Apply in thin, even coats with a roller or brush",
          "Follow manufacturer recommendations for application and drying times"
        ]
      },
      {
        title: "Final Inspection",
        description: "Examine the finished surface for any imperfections or areas that might need touch-ups.",
        tips: [
          "Inspect under various lighting conditions",
          "Small touch-ups can be done with leftover material if needed",
          "Take photos for warranty documentation"
        ]
      }
    ]
  };

  // FAQs about installation
  const faqs = [
    {
      question: "How long does EcoPlaster take to dry completely?",
      answer: "EcoPlaster typically requires 24-48 hours for initial drying, depending on ambient temperature and humidity. However, full curing takes approximately 7 days. During this time, the plaster develops its full hardness and durability. It's important to maintain good ventilation during the drying period while avoiding direct fans or forced air that could cause uneven drying."
    },
    {
      question: "Can I apply EcoPlaster over existing paint or wallpaper?",
      answer: "EcoPlaster can be applied over existing painted surfaces if the paint is in good condition, firmly adhered to the wall, and not glossy. Glossy paints should be sanded to create a rough surface for better adhesion. However, EcoPlaster should NOT be applied over wallpaper. Wallpaper must be completely removed, and the wall surface properly prepared before application."
    },
    {
      question: "How much EcoPlaster do I need for my project?",
      answer: "As a general guideline, one 20kg box of EcoPlaster covers approximately 45-50 square feet (4.2-4.6 square meters) when applied at the recommended thickness. However, coverage may vary based on surface conditions, application technique, and desired finish. For precise calculations, use our Project Cost Calculator available on our website."
    },
    {
      question: "What tools do I need for applying EcoPlaster?",
      answer: "Essential tools include: stainless steel trowel (various sizes), mixing paddle and drill, clean mixing containers, measuring tools, sandpaper or sanding blocks, clean water, painter's tape, drop cloths, and personal protective equipment (gloves, eye protection, dust mask). Specialized texturing tools may be required depending on your desired finish."
    },
    {
      question: "Is professional installation recommended for EcoPlaster?",
      answer: "While EcoPlaster is designed to be DIY-friendly, professional installation is recommended for large areas or complex texturing techniques. Professionals have the experience, tools, and techniques to ensure optimal results. For first-time users, we recommend starting with smaller projects or hiring a professional for the best outcome."
    },
    {
      question: "How do I clean and maintain EcoPlaster walls?",
      answer: "For routine cleaning, use a soft cloth or duster to remove dust. For occasional deeper cleaning, use a slightly damp cloth with mild soap if necessary. Avoid abrasive cleaners, scrubbing brushes, or excessive moisture. Wait at least 30 days after application before the first wet cleaning. For sealed surfaces, follow the sealer manufacturer's cleaning recommendations."
    }
  ];

  return (
    <div className="bg-beige min-h-screen text-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-newgreensecond text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">EcoPlaster Installation Guide</h1>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Complete instructions for preparing, mixing, applying, and finishing your EcoPlaster project
            for professional results.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {/* <button className="bg-white text-newgreen px-6 py-3 rounded-lg font-bold hover:bg-beige transition-colors flex items-center gap-2">
              <Download size={20} />
              Download PDF Guide
            </button> */}
            <Link href="https://res.cloudinary.com/djzmj5oqp/video/upload/v1748158343/xso18jynndv8tvdvmfmn.mp4" >
            <button className="bg-newgreen text-white px-6 py-3 rounded-lg font-bold hover:bg-green-800 transition-colors flex items-center gap-2">
              <PlayCircle size={20} />
              Watch Video Tutorial
            </button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Installation Steps */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Tabs */}
          <div className="flex flex-wrap border-b mb-8">
            {Object.keys(installationSteps).map((step) => (
              <button
                key={step}
                onClick={() => setActiveTab(step)}
                className={`px-4 py-3 font-medium text-base capitalize transition-colors ${
                  activeTab === step
                    ? "border-b-2 border-newgreen text-newgreen"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {step}
              </button>
            ))}
          </div>
          
          {/* Step Content */}
          <div className="space-y-10">
            {installationSteps[activeTab as keyof typeof installationSteps].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-newgreen text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      
                      {/* Pro Tips */}
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <h4 className="font-bold text-gray-800 mb-2">Pro Tips:</h4>
                        <ul className="space-y-2">
                          {step.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start">
                              <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => {
                const steps = Object.keys(installationSteps);
                const currentIndex = steps.indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(steps[currentIndex - 1]);
                }
              }}
              className={`px-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 ${
                activeTab === Object.keys(installationSteps)[0]
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              disabled={activeTab === Object.keys(installationSteps)[0]}
            >
              Previous: {activeTab === Object.keys(installationSteps)[0] 
                ? "" 
                : Object.keys(installationSteps)[Object.keys(installationSteps).indexOf(activeTab) - 1].charAt(0).toUpperCase() + 
                  Object.keys(installationSteps)[Object.keys(installationSteps).indexOf(activeTab) - 1].slice(1)}
            </button>
            
            <button
              onClick={() => {
                const steps = Object.keys(installationSteps);
                const currentIndex = steps.indexOf(activeTab);
                if (currentIndex < steps.length - 1) {
                  setActiveTab(steps[currentIndex + 1]);
                }
              }}
              className={`px-4 py-2 bg-newgreen text-white rounded-md flex items-center gap-2 ${
                activeTab === Object.keys(installationSteps)[Object.keys(installationSteps).length - 1]
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-newgreensecond"
              }`}
              disabled={activeTab === Object.keys(installationSteps)[Object.keys(installationSteps).length - 1]}
            >
              Next: {activeTab === Object.keys(installationSteps)[Object.keys(installationSteps).length - 1]
                ? ""
                : Object.keys(installationSteps)[Object.keys(installationSteps).indexOf(activeTab) + 1].charAt(0).toUpperCase() +
                  Object.keys(installationSteps)[Object.keys(installationSteps).indexOf(activeTab) + 1].slice(1)}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
      
      {/* Installation Tips */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Installation Tips & Best Practices</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Temperature & Humidity</h3>
              <p className="text-gray-600 mb-4">
                Optimal conditions for EcoPlaster application are 20-25°C (68-77°F) and 50-70% relative humidity.
                Extreme conditions can affect drying time and final appearance.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Avoid applying below 10°C (50°F) or above 35°C (95°F)</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>In hot conditions, dampen the wall slightly before application</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Use dehumidifiers in extremely humid environments</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Working Time</h3>
              <p className="text-gray-600 mb-4">
                EcoPlaster remains workable for approximately 1-2 hours after mixing, depending on
                temperature and humidity. Plan your work accordingly.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Mix only the amount you can apply within the working time</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Cover unused mixture with plastic wrap to extend working time</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Never add water to hardening plaster to extend workability</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Tool Maintenance</h3>
              <p className="text-gray-600 mb-4">
                Proper tool care ensures optimal results and extends the life of your equipment.
                Clean tools immediately after use.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Clean tools with water before plaster hardens</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Use a stiff brush to remove residual material</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Store trowels flat to prevent warping</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Surface Considerations</h3>
              <p className="text-gray-600 mb-4">
                Different surfaces require specific preparation techniques for optimal adhesion
                and finish quality.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Use PVA primer for highly absorbent surfaces</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Apply bonding agent for smooth or non-porous surfaces</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Install mesh for transitioning between different materials</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                >
                  <h3 className="font-bold text-gray-800">{faq.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </button>
                
                {expandedFaq === index && (
                  <div className="px-6 py-4 border-t">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Technical Support */}
      <section className="py-16 px-4 bg-newgreen text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Need Additional Help?</h2>
          <p className="text-lg mb-8">
            Our technical support team is available to assist with installation questions
            and provide guidance for your EcoPlaster project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:9492991123"
              className="px-6 py-3 bg-white text-newgreen font-bold rounded-lg hover:bg-beige transition-colors flex items-center justify-center gap-2"
            >
              <HelpCircle size={20} />
              Call Support: 9492991123
            </a>
 
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default InstallationGuide;