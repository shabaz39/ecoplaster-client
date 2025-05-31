"use client"
import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, HelpCircle, Phone } from "lucide-react";

const faqs = [
  {
    category: "🌿 Product Information",
    questions: [
      { 
        question: "What is Ecoplaster?", 
        answer: "Ecoplaster is a natural wall décor material made from silk and cotton material, used for interior walls and ceilings. It comes in over 148 shades and creates beautiful, textured finishes without the need for paint or putty."
      },
      { 
        question: "Why use Ecoplaster?", 
        answer: "Ecoplaster offers a premium look, is eco-friendly, hides cracks, is safe for kids and elders, and helps reduce heat and sound. It's easy to apply, long-lasting, and can be repaired easily."
      },
      { 
        question: "Is it child-safe and allergy-free?", 
        answer: "Yes! It's non-toxic, odourless, and hypoallergenic – safe for kids and elders."
      },
      { 
        question: "Does it reduce heat and sound?", 
        answer: "Yes! The silk-cotton blend helps reduce room temperature and echo."
      },
      { 
        question: "Is it resistant to fire and water?", 
        answer: "Yes. Ecoplaster is fire-retardant and water-resistant once fully dried."
      }
    ]
  },
  {
    category: "🎨 Application & Usage",
    questions: [
      { 
        question: "Where can Ecoplaster be applied?", 
        answer: "Ecoplaster is suitable for interior walls, wooden panels, and ceilings."
      },
      { 
        question: "Can I apply Ecoplaster over existing paint?", 
        answer: "Yes! If you're using a similar colour, apply directly. For different shades, apply one coat of white primer before applying Ecoplaster."
      },
      { 
        question: "Is paint or putty needed before applying Ecoplaster?", 
        answer: "No, only one coat of white primer is required."
      },
      { 
        question: "Can I apply it myself (DIY)?", 
        answer: "Absolutely! Ecoplaster is DIY-friendly and can be applied with basic Trowel. We also provide video support."
      },
      { 
        question: "Can I use Ecoplaster in the kitchen or bathroom?", 
        answer: "Yes, on dry kitchen walls. Avoid wet or splash-prone areas like inside bathrooms."
      }
    ]
  },
  {
    category: "🧮 Coverage & Calculation",
    questions: [
      { 
        question: "How much area does 1 packet cover?", 
        answer: "One 1 kg packet of Ecoplaster covers 45 sq. ft. 👉 Example Calculation: If your wall is 9 ft height × 9 ft length = 81 sq. ft., then: 81 ÷ 45 = approx. 2 packets needed. ✅ Use this formula: (Height × Length in ft) ÷ 45 = No. of packets required."
      }
    ]
  },
  {
    category: "🔧 Maintenance & Care",
    questions: [
      { 
        question: "How do I clean Ecoplaster walls?", 
        answer: "You can dust the walls with a dry cloth or use a vacuum cleaner with a brush attachment. Avoid scrubbing or using wet cloths to maintain the finish."
      },
      { 
        question: "What if tea or coffee spills on Ecoplaster walls?", 
        answer: "No worries! Simply spray water, scrape off the affected area, and reapply fresh material. It's that easy to repair."
      },
      { 
        question: "Can it hide wall cracks and imperfections?", 
        answer: "Yes! Ecoplaster is excellent for covering hairline cracks and uneven surfaces."
      },
      { 
        question: "How long does Ecoplaster last?", 
        answer: "With proper care, it lasts 7–10 years in excellent condition."
      }
    ]
  },
  {
    category: "🛡️ Warranty & Delivery",
    questions: [
      { 
        question: "Do you offer a warranty?", 
        answer: "Yes, we provide a 3-year warranty on color stability and adhesion. If the material peels or fades on its own (not caused by wall issues or external damage), we will supply free replacement material during the warranty period."
      },
      { 
        question: "Is Ecoplaster available across India?", 
        answer: "Yes! We ship Pan India with free shipping on all orders."
      }
    ]
  }
];

const FAQPage = () => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set(['0-0'])); // First question expanded by default
  const [searchTerm, setSearchTerm] = useState("");

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedQuestions(newExpanded);
  };

  // Filter all questions based on search term
  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-3 sm:mb-4 px-2">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-black max-w-2xl mx-auto px-2">
            Everything you need to know about Ecoplaster. Find quick answers to common questions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-sm sm:max-w-md mx-auto mb-8 sm:mb-10 px-2">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-newgreen focus:border-newgreen transition-all bg-white shadow-sm text-black text-sm sm:text-base"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6 sm:space-y-8">
          {filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
              {/* Category Header */}
              <div className="bg-newgreen text-white p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl md:text-3xl">{category.category.split(' ')[0]}</span>
                  <span className="break-words">{category.category.substring(2)}</span>
                </h2>
                <p className="text-white mt-1 sm:mt-2 opacity-90 text-sm sm:text-base">
                  {category.questions.length} question{category.questions.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Questions */}
              <div className="divide-y divide-gray-200">
                {category.questions.map((faq, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  const isExpanded = expandedQuestions.has(key);

                  return (
                    <div key={questionIndex} className="transition-all duration-200">
                      {/* Question Header */}
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex justify-between items-start sm:items-center hover:bg-green-50 transition-colors"
                      >
                        <h3 className="text-base sm:text-lg font-semibold text-black pr-3 sm:pr-4 leading-tight sm:leading-normal">
                          {faq.question}
                        </h3>
                        <div className="flex-shrink-0 mt-1 sm:mt-0">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-newgreen" />
                          ) : (
                            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-newgreen" />
                          )}
                        </div>
                      </button>

                      {/* Answer */}
                      {isExpanded && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 bg-green-50">
                          <div className="bg-white p-4 sm:p-5 rounded-lg sm:rounded-xl border border-gray-200">
                            <p className="text-black leading-relaxed text-sm sm:text-base">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFaqs.length === 0 && searchTerm && (
          <div className="text-center py-8 sm:py-12 px-4">
            <HelpCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">No results found</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">Try searching with different keywords or browse all categories above.</p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 sm:mt-4 px-4 sm:px-6 py-2 bg-newgreen text-white rounded-lg hover:bg-newgreensecond transition-colors text-sm sm:text-base"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <div className="bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center shadow-md">
            <div className="text-2xl sm:text-3xl font-bold text-newgreen mb-1 sm:mb-2">148+</div>
            <div className="text-xs sm:text-sm text-black font-medium">Shades Available</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center shadow-md">
            <div className="text-2xl sm:text-3xl font-bold text-newgreen mb-1 sm:mb-2">45</div>
            <div className="text-xs sm:text-sm text-black font-medium">Sq Ft per Packet</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center shadow-md">
            <div className="text-2xl sm:text-3xl font-bold text-newgreen mb-1 sm:mb-2">7-10</div>
            <div className="text-xs sm:text-sm text-black font-medium">Years Lasting</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center shadow-md">
            <div className="text-2xl sm:text-3xl font-bold text-newgreen mb-1 sm:mb-2">3</div>
            <div className="text-xs sm:text-sm text-black font-medium">Year Warranty</div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 sm:mt-12 bg-newgreensecond rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center mx-2 sm:mx-0">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Still have questions?</h3>
          <p className="text-white text-base sm:text-lg opacity-90 mb-4 sm:mb-6 leading-relaxed">
            Our support team is ready to help you with any additional questions about Ecoplaster.
          </p>
          <a
            href="tel:9492991123"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-newgreensecond font-bold rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors shadow-lg text-sm sm:text-base"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Call Support: 9492991123</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;