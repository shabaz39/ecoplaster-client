"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, HelpCircle, PlayCircle, Download, ChevronDown, ChevronUp, Droplets, Paintbrush, Wrench, Sparkles, Settings } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Link from "next/link";

const InstallationGuide = () => {
  const [activeTab, setActiveTab] = useState("preparation");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Installation steps with simplified instructions
  const installationSteps = {
    preparation: [
      {
        title: "Clean the Wall",
        description: "Clean the wall to remove dust, grease, or loose particles",
        icon: "🧹",
        tips: [
          "Use a damp cloth or brush to remove all dirt and debris",
          "Make sure the surface is completely dry before proceeding",
          "Check for any holes or cracks that need filling"
        ]
      },
      {
        title: "Apply White Primer",
        description: "Apply one coat of white primer (no putty or paint required)",
        icon: "🎨",
        tips: [
          "Use a quality white primer suitable for your wall type",
          "Apply evenly with a brush or roller",
          "Ensure complete coverage of the entire surface"
        ]
      },
      {
        title: "Let Primer Dry",
        description: "Let the primer dry completely (6–8 hours)",
        icon: "⏰",
        tips: [
          "Avoid touching the wall during drying time",
          "Ensure good ventilation for faster drying",
          "Check that primer is completely dry before proceeding"
        ]
      }
    ],
    mixing: [
      {
        title: "Prepare Clean Bucket",
        description: "Use a clean bucket for mixing",
        icon: "🪣",
        tips: [
          "Ensure the bucket is completely clean and dry",
          "Use a bucket large enough to mix comfortably",
          "Have all materials ready before starting"
        ]
      },
      {
        title: "Add Hot Water",
        description: "Add 5 litres of mineral hot water per Packet",
        icon: "💧",
        tips: [
          "Use clean, mineral hot water for best results",
          "Measure water accurately - 5 litres per 20kg packet",
          "Water temperature should be warm but not boiling"
        ]
      },
      {
        title: "Mix Thoroughly",
        description: "Mix thoroughly by hand until it becomes a thick paste",
        icon: "🥄",
        tips: [
          "Mix slowly to avoid creating air bubbles",
          "Continue mixing until completely smooth",
          "Ensure no lumps remain in the mixture"
        ]
      },
      {
        title: "Rest the Mixture",
        description: "Let the mixture rest for a minimum of 2 hours or up to 8 hours before applying",
        icon: "⏱️",
        tips: [
          "Cover the mixture to prevent skin formation",
          "This resting time improves workability",
          "Stir briefly before application if needed"
        ]
      }
    ],
    application: [
      {
        title: "Choose Your Tool",
        description: "Use an acrylic trowel or flat steel trowel",
        icon: "🔧",
        tips: [
          "Acrylic trowels are easier for beginners",
          "Steel trowels give smoother finishes",
          "Ensure tools are clean and in good condition"
        ]
      },
      {
        title: "Apply Evenly",
        description: "Start applying evenly from bottom to top or top to bottom",
        icon: "📏",
        tips: [
          "Choose one direction and stick to it",
          "Work in manageable sections",
          "Maintain consistent pressure throughout"
        ]
      },
      {
        title: "Maintain Thickness",
        description: "Maintain 1–2 mm thickness for the best finish",
        icon: "📐",
        tips: [
          "Too thick application may crack when drying",
          "Too thin application won't provide proper coverage",
          "Practice on a small area first"
        ]
      },
      {
        title: "Gentle Coverage",
        description: "Cover the surface gently without pressing too hard",
        icon: "🤲",
        tips: [
          "Let the material do the work",
          "Excessive pressure can create uneven surfaces",
          "Work with smooth, flowing motions"
        ]
      }
    ],
    finishing: [
      {
        title: "Natural Drying",
        description: "Let it dry naturally for 12–24 hours (you can use a fan to speed up drying)",
        icon: "🌬️",
        tips: [
          "Avoid direct sunlight during drying",
          "Good ventilation helps even drying",
          "Fan can be used but avoid direct airflow"
        ]
      },
      {
        title: "Avoid Touching",
        description: "Avoid touching the wall during drying time",
        icon: "🚫",
        tips: [
          "Even light touches can leave marks",
          "Keep children and pets away during drying",
          "Mark the area if needed to remind others"
        ]
      },
      {
        title: "Enjoy Your Wall",
        description: "Once dry, enjoy your elegant, crack-free, eco-friendly wall finish!",
        icon: "✨",
        tips: [
          "Your wall is now ready for use",
          "The finish will continue to harden over time",
          "Admire your beautiful, eco-friendly wall!"
        ]
      }
    ],
    repair: [
      {
        title: "Spray with Water",
        description: "Spray the affected area with water and let it soak into the material",
        icon: "💦",
        tips: [
          "Use a spray bottle for even distribution",
          "Allow water to penetrate for 5-10 minutes",
          "Don't oversoak - just enough to soften the material"
        ]
      },
      {
        title: "Remove Damaged Area",
        description: "Gently scrape off the damaged or stained Ecoplaster",
        icon: "🔨",
        tips: [
          "Use a plastic scraper to avoid wall damage",
          "Remove only the damaged portion",
          "Clean the area thoroughly after scraping"
        ]
      },
      {
        title: "Mix Fresh Batch",
        description: "Mix a fresh batch of Ecoplaster as per instructions",
        icon: "🧪",
        tips: [
          "Follow the same mixing ratios as original application",
          "Mix only what you need for the repair",
          "Ensure consistency matches existing wall"
        ]
      },
      {
        title: "Apply and Blend",
        description: "Apply the new material smoothly to the damaged spot, blending it with the surrounding wall",
        icon: "🎨",
        tips: [
          "Feather the edges to blend seamlessly",
          "Match the texture of the surrounding area",
          "Work quickly while material is workable"
        ]
      },
      {
        title: "Natural Drying",
        description: "Let it dry naturally—no special treatment needed",
        icon: "🌟",
        tips: [
          "Allow same drying time as original application",
          "Avoid touching during drying process",
          "The repair should blend invisibly when dry"
        ]
      }
    ]
  };

  // Updated FAQs
  const faqs = [
    {
      question: "What is Ecoplaster?",
      answer: "Ecoplaster is a natural wall décor material made from silk and cotton material, used for interior walls and ceilings. It comes in over 148 shades and creates beautiful, textured finishes without the need for paint or putty."
    },
    {
      question: "Why use Ecoplaster?",
      answer: "Ecoplaster offers a premium look, is eco-friendly, hides cracks, is safe for kids and elders, and helps reduce heat and sound. It's easy to apply, long-lasting, and can be repaired easily."
    },
    {
      question: "Can I apply Ecoplaster over existing paint?",
      answer: "Yes! If you're using a similar colour, apply directly. For different shades, apply one coat of white primer before applying Ecoplaster."
    },
    {
      question: "Where can Ecoplaster be applied?",
      answer: "Ecoplaster is suitable for interior walls, wooden panels, and ceilings."
    },
    {
      question: "Is paint or putty needed before applying Ecoplaster?",
      answer: "No, only one coat of white primer is required."
    },
    {
      question: "What if tea or coffee spills on Ecoplaster walls?",
      answer: "No worries! Simply spray water, scrape off the affected area, and reapply fresh material. It's that easy to repair."
    },
    {
      question: "How long does Ecoplaster last?",
      answer: "With proper care, it lasts 7–10 years in excellent condition."
    },
    {
      question: "Do you offer a warranty?",
      answer: "Yes, we provide a 3-year warranty on color stability and adhesion. If the material peels or fades on its own (not caused by wall issues or external damage), we will supply free replacement material during the warranty period."
    },
    {
      question: "How much area does 1 packet cover?",
      answer: "One 1 kg packet of Ecoplaster covers 45 sq. ft. Example Calculation: If your wall is 9 ft height × 9 ft length = 81 sq. ft., then: 81 ÷ 45 = approx. 2 packets needed. Use this formula: (Height × Length in ft) ÷ 45 = No. of packets required."
    },
    {
      question: "Can I apply it myself (DIY)?",
      answer: "Absolutely! Ecoplaster is DIY-friendly and can be applied with basic Trowel. We also provide video support."
    },
    {
      question: "Is it child-safe and allergy-free?",
      answer: "Yes! It's non-toxic, odourless, and hypoallergenic – safe for kids and elders."
    },
    {
      question: "How do I clean Ecoplaster walls?",
      answer: "You can dust the walls with a dry cloth or use a vacuum cleaner with a brush attachment. Avoid scrubbing or using wet cloths to maintain the finish."
    },
    {
      question: "Can it hide wall cracks and imperfections?",
      answer: "Yes! Ecoplaster is excellent for covering hairline cracks and uneven surfaces."
    },
    {
      question: "Can I use Ecoplaster in the kitchen or bathroom?",
      answer: "Yes, on dry kitchen walls. Avoid wet or splash-prone areas like inside bathrooms."
    },
    {
      question: "Does it reduce heat and sound?",
      answer: "Yes! The silk-cotton blend helps reduce room temperature and echo."
    },
    {
      question: "Is it resistant to fire and water?",
      answer: "Yes. Ecoplaster is fire-retardant and water-resistant once fully dried."
    },
    {
      question: "Is Ecoplaster available across India?",
      answer: "Yes! We ship Pan India with free shipping on all orders."
    }
  ];

  const tabIcons = {
    preparation: "🧱",
    mixing: "🧪", 
    application: "🎨",
    finishing: "✨",
    repair: "🔧"
  };

  return (
    <div className="bg-beige min-h-screen text-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-newgreensecond text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">EcoPlaster Installation Guide</h1>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Simple, step-by-step instructions for applying EcoPlaster. 
            No putty or paint required - just primer and EcoPlaster!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="https://res.cloudinary.com/djzmj5oqp/video/upload/v1748158343/xso18jynndv8tvdvmfmn.mp4">
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
          <div className="flex flex-wrap border-b mb-8 justify-center">
            {Object.keys(installationSteps).map((step) => (
              <button
                key={step}
                onClick={() => setActiveTab(step)}
                className={`px-4 py-3 font-medium text-base capitalize transition-colors flex items-center gap-2 ${
                  activeTab === step
                    ? "border-b-2 border-newgreen text-newgreen"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <span className="text-xl">{tabIcons[step as keyof typeof tabIcons]}</span>
                {step === "repair" ? "Repair" : step}
              </button>
            ))}
          </div>
          
          {/* Step Content */}
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-3">
                <span className="text-3xl">{tabIcons[activeTab as keyof typeof tabIcons]}</span>
                {activeTab === "preparation" && "Preparation of Wall"}
                {activeTab === "mixing" && "Mixing Ecoplaster Material"}
                {activeTab === "application" && "Applying Ecoplaster"}
                {activeTab === "finishing" && "Finishing"}
                {activeTab === "repair" && "How to Repair Ecoplaster"}
              </h2>
            </div>

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
                    <div className="bg-newgreen text-white w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xl">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                      <p className="text-gray-600 mb-4 text-lg">{step.description}</p>
                      
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
      
      {/* Quick Tips */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">🚀 Quick Application Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🌡️</span> Temperature & Timing
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Apply in moderate temperatures (15-30°C)</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Let mixture rest 2-8 hours before application</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Allow 12-24 hours for complete drying</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>💧</span> Water & Mixing
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Use exactly 5 litres hot water per packet</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Mix until smooth, thick paste consistency</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Never add extra water after mixing</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎯</span> Application Tips
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Maintain 1-2mm thickness throughout</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Apply gently without excessive pressure</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Work in consistent direction (top to bottom or bottom to top)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>⚠️</span> Important Don'ts
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Don't use putty or paint before primer</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Don't touch wall during drying time</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-newgreen mt-0.5 mr-2 flex-shrink-0" />
                  <span>Don't apply in direct sunlight or extreme weather</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">❓ Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-bold text-gray-800">{faq.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </button>
                
                {expandedFaq === index && (
                  <div className="px-6 py-4 border-t bg-gray-50">
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
          <h2 className="text-3xl font-bold mb-4"> Need Additional Help? - 📞8790 5050 42</h2>
          <p className="text-lg mb-8">
            Our technical support team is available to assist with installation questions
            and provide guidance for your EcoPlaster project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:8790505042"
              className="px-6 py-3 bg-white text-newgreen font-bold rounded-lg hover:bg-beige transition-colors flex items-center justify-center gap-2"
            >
              <HelpCircle size={20} />
              Call Support: 8790 5050 42
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default InstallationGuide;