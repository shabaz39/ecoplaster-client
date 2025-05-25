"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Heart, ShoppingCart, ChevronDown, ChevronUp, Check, Minus, 
  Plus, Leaf, Shield, Wind, Droplet, Volume2, Thermometer, Flame
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Feature icons and their descriptions
const productFeatures = [
  {
    icon: <Leaf className="w-5 h-5" />,
    title: "Eco-Friendly",
    description: "Made from sustainable, non-toxic materials, reducing environmental impact.",
    details: "Our eco-friendly formulation uses natural materials sourced responsibly. We avoid harmful chemicals like VOCs and synthetic polymers common in traditional plasters."
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Kids & Pet Friendly",
    description: "Safe and healthy environment with no harsh chemicals or allergens.",
    details: "Contains no lead, formaldehyde, or harmful substances that could be ingested or cause skin irritations. Safe for all family members including children and pets."
  },
  {
    icon: <Droplet className="w-5 h-5" />,
    title: "Odorless",
    description: "No strong odors or harmful fumes, ideal for indoor spaces.",
    details: "Occupy newly plastered rooms immediately after application with no lingering chemical smells that can trigger headaches or respiratory discomfort."
  },
  {
    icon: <Wind className="w-5 h-5" />,
    title: "Breathable Walls",
    description: "Allows moisture to escape, preventing mold growth and improving air quality.",
    details: "Microporous structure allows walls to 'breathe' naturally, regulating humidity by absorbing excess moisture when the air is humid and releasing it when dry."
  },
  {
    icon: <Flame className="w-5 h-5" />,
    title: "Fire Retardant",
    description: "Resists flames and slows fire spread for added safety.",
    details: "Natural minerals in our plaster have inherent fire-resistant properties, enhancing overall safety without chemical fire retardants."
  },
  {
    icon: <Volume2 className="w-5 h-5" />,
    title: "Sound Insulation",
    description: "Reduces noise transmission for a peaceful environment.",
    details: "The density and composition absorb sound waves rather than reflecting them, reducing echo within rooms and minimizing sound transmission between spaces."
  },
  {
    icon: <Thermometer className="w-5 h-5" />,
    title: "Heat Insulation",
    description: "Regulates indoor temperatures and reduces energy costs.",
    details: "Thermal mass properties help maintain consistent indoor temperatures, leading to significant energy savings on heating and cooling."
  }
];

export const ProductDescription = ({ productData = null }) => {

    
  // Default product data if none is provided
  const defaultProduct = {
    id: "ep-123",
    name: "EcoPlaster Silk Series - EP 216",
    price: { mrp: 99.99, offerPrice: 79.99 },
    rating: 4.8,
    reviewCount: 128,
    description: "Transform your walls with the luxurious Silk Series, offering a smooth, elegant finish with subtle texture. Ideal for living rooms, bedrooms, and formal spaces where a sophisticated ambiance is desired.",
    color: "Soft Cream",
    code: "EP 216",
    series: "Silk Series",
    finish: "Matte",
    coverage: "45-50 sq.ft. per box",
    thickness: "2-3 mm",
    applicationMethod: "Trowel",
    dryingTime: "24-48 hours",
    packSize: "20 kg",
    stock: 23,
    images: [
      "/product1 (1).webp",
      "/product1 (2).webp",
      "/product1 (3).webp",
      "/product1 (4).webp"
    ],
    features: ["Eco-Friendly", "Kids & Pet Friendly", "Odorless", "Breathable Walls", "Fire Retardant", "Sound Insulation", "Heat Insulation"],
    applications: ["Living Rooms", "Bedrooms", "Dining Areas", "Corridors", "Office Spaces"],
    relatedProducts: [
      { id: "ep-124", name: "EcoPlaster Silk Series - EP 218", image: "/product1 (1).webp", price: 79.99 },
      { id: "ep-125", name: "EcoPlaster Silk Series - EP 220", image: "/product1 (2).webp", price: 79.99 },
      { id: "ep-126", name: "EcoPlaster Gold Series - EP 315", image: "/product1 (3).webp", price: 89.99 }
    ]
  };


  // Use provided product data or fall back to default
  const product = productData || defaultProduct;
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState("description");
  
  // Image gallery handlers
  const handleThumbnailClick = (index:any) => {
    setSelectedImage(index);
  };
  
  // Quantity handlers
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  // Accordion toggle
  const toggleSection = (section:any) => {
    if (expandedSection === section) {
      setExpandedSection("");
    } else {
      setExpandedSection(section);
    }
  };
  
  return (
    <div className="bg-beige min-h-screen">
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="bg-white py-3 border-b">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li><a href="/" className="text-gray-500 hover:text-newgreen">Home</a></li>
              <li><span className="text-gray-400 mx-1">/</span></li>
              <li><a href="/products" className="text-gray-500 hover:text-newgreen">Products</a></li>
              <li><span className="text-gray-400 mx-1">/</span></li>
              <li><a href={`/productDescription/${product.series.toLowerCase().replace(' ', '-')}`} className="text-gray-500 hover:text-newgreen">{product.series}</a></li>
              <li><span className="text-gray-400 mx-1">/</span></li>
              <li className="text-newgreen font-medium">{product.code}</li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Product Detail */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Images */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`bg-white rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-newgreen"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Details */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold text-gray-800">₹{product.price.offerPrice}</span>
                  {product.price.mrp > product.price.offerPrice && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{product.price.mrp}
                      </span>
                      <span className="text-sm bg-green-100 text-newgreen px-2 py-1 rounded">
                        {Math.round(
                          ((product.price.mrp - product.price.offerPrice) /
                            product.price.mrp) *
                            100
                        )}% OFF
                      </span>
                    </>
                  )}
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-600">{product.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-medium">{product.color}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Code</p>
                    <p className="font-medium">{product.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Series</p>
                    <p className="font-medium">{product.series}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Finish</p>
                    <p className="font-medium">{product.finish}</p>
                  </div>
                </div>
                
                {/* Quantity Selector */}
                <div className="mb-6">
                  <p className="text-sm text-gray-800 font-medium mb-2">Quantity</p>
                  <div className="flex items-center">
                    <button
                      onClick={decreaseQuantity}
                      className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 border-t border-b border-gray-300 py-2 text-center"
                    />
                    <button
                      onClick={increaseQuantity}
                      className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                    <span className="ml-3 text-sm text-gray-500">
                      {product.stock} boxes available
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4 mb-6">
                  <button className="flex-1 bg-newgreen hover:bg-newgreensecond text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                  <button className="bg-white border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <Heart size={20} />
                  </button>
                </div>
                
                {/* Estimated Coverage */}
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-gray-800 mb-2">Estimated Coverage</h3>
                  <p className="text-gray-600 mb-2">
                    {product.coverage} (varies based on surface texture and application thickness)
                  </p>
                  <a href="#" className="text-newgreen hover:underline text-sm font-medium">
                    Use our calculator for a precise estimate →
                  </a>
                </div>
                
                {/* Key Features Icons */}
                <div className="mb-4">
                  <h3 className="font-bold text-gray-800 mb-3">Key Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature) => {
                      const featureInfo = productFeatures.find(f => f.title === feature);
                      return featureInfo ? (
                        <div
                          key={feature}
                          className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-1"
                          title={featureInfo.description}
                        >
                          <span className="text-newgreen">{featureInfo.icon}</span>
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Product Information Tabs */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Features */}
            <div className="border-b">
              <button
                onClick={() => toggleSection("features")}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-bold text-gray-800">Features & Benefits</h3>
                {expandedSection === "features" ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
              {expandedSection === "features" && (
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.features.map((feature) => {
                      const featureInfo = productFeatures.find(f => f.title === feature);
                      return featureInfo ? (
                        <div key={feature} className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-newgreen">{featureInfo.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{feature}</h4>
                            <p className="text-gray-600 text-sm mb-2">{featureInfo.description}</p>
                            <p className="text-gray-700">{featureInfo.details}</p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Specifications */}
            <div className="border-b">
              <button
                onClick={() => toggleSection("specs")}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-bold text-gray-800">Technical Specifications</h3>
                {expandedSection === "specs" ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
              {expandedSection === "specs" && (
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-b border-gray-200 py-3 flex">
                      <span className="font-medium text-gray-600 w-1/3">Coverage</span>
                      <span className="text-gray-800 w-2/3">{product.coverage}</span>
                    </div>
                    <div className="border-b border-gray-200 py-3 flex">
                      <span className="font-medium text-gray-600 w-1/3">Thickness</span>
                      <span className="text-gray-800 w-2/3">{product.thickness}</span>
                    </div>
                    <div className="border-b border-gray-200 py-3 flex">
                      <span className="font-medium text-gray-600 w-1/3">Application</span>
                      <span className="text-gray-800 w-2/3">{product.applicationMethod}</span>
                    </div>
                    <div className="border-b border-gray-200 py-3 flex">
                      <span className="font-medium text-gray-600 w-1/3">Drying Time</span>
                      <span className="text-gray-800 w-2/3">{product.dryingTime}</span>
                    </div>
                    <div className="border-b border-gray-200 py-3 flex">
                      <span className="font-medium text-gray-600 w-1/3">Pack Size</span>
                      <span className="text-gray-800 w-2/3">{product.packSize}</span>
                    </div>
                    <div className="border-b border-gray-200 py-3 flex">
                      <span className="font-medium text-gray-600 w-1/3">Finish</span>
                      <span className="text-gray-800 w-2/3">{product.finish}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Application */}
            <div className="border-b">
              <button
                onClick={() => toggleSection("application")}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-bold text-gray-800">Application Guide</h3>
                {expandedSection === "application" ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
              {expandedSection === "application" && (
                <div className="px-6 py-4">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Surface Preparation</h4>
                      <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                        <li>Ensure the surface is clean, dry, and free from loose particles.</li>
                        <li>Repair any cracks or damage to the surface before application.</li>
                        <li>Apply a coat of EcoPlaster Primer and allow it to dry completely (12-24 hours).</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Mixing</h4>
                      <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                        <li>Empty the contents of the EcoPlaster box into a clean mixing container.</li>
                        <li>Add clean water gradually (approximately 6-7 liters per 20kg box).</li>
                        <li>Mix thoroughly until you achieve a smooth, lump-free consistency.</li>
                        <li>Allow the mixed plaster to rest for 10 minutes before application.</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Application</h4>
                      <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                        <li>Using a clean stainless-steel trowel, apply the first coat in upward strokes.</li>
                        <li>Allow the first coat to dry partially (1-2 hours) before applying the second coat.</li>
                        <li>Apply the second coat in a crisscross pattern for even coverage.</li>
                        <li>Achieve the desired texture by varying the trowel technique during final application.</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Drying & Curing</h4>
                      <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                        <li>Allow the plaster to dry for at least 24-48 hours.</li>
                        <li>Full curing takes approximately 7 days.</li>
                        <li>Avoid water contact during the first week after application.</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <h4 className="font-bold text-gray-800 mb-2">Pro Tips</h4>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Work in sections to avoid dry edges.</li>
                        <li>Maintain a wet edge when applying large areas.</li>
                        <li>Use consistent pressure for uniform texture.</li>
                        <li>Clean tools immediately after use with water.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Ideal Applications */}
            <div>
              <button
                onClick={() => toggleSection("ideal")}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-bold text-gray-800">Ideal Applications</h3>
                {expandedSection === "ideal" ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
              {expandedSection === "ideal" && (
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {product.applications.map((app, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-800 mb-2">{app}</h4>
                        <p className="text-gray-600 text-sm">
                          The {product.series} is an excellent choice for {app.toLowerCase()}, providing a sophisticated finish while enhancing the space's aesthetics and functionality.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Products */}
      <section className="py-12 bg-beige">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((related) => (
              <motion.div
                key={related.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={related.image}
                    alt={related.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 mb-2">{related.name}</h3>
                  <p className="text-newgreen font-bold">₹{related.price}</p>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-newgreen hover:bg-newgreensecond text-white py-2 rounded-lg text-sm transition-colors">
                      Add to Cart
                    </button>
                    <button className="bg-white border border-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};