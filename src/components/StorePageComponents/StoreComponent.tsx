import React from "react";
import { MapPin, Phone, Star } from "lucide-react";

const stores = [
  { name: "Tirupati, Andhra Pradesh", reviews: 5123, rating: 5, address: "EcoPlaster Store, Main Road, Tirupati, Andhra Pradesh", timing: "10:00AM to 09:00PM", phone: "9492991123", directions: "https://www.google.com/maps/place/Ecoplaster/@13.6157,79.411334,17z/data=!3m1!4b1!4m6!3m5!1s0x3a4d4b936751f17d:0x75634cd60e4c1d17!8m2!3d13.6156948!4d79.4139143!16s%2Fg%2F11y3nq6t7v?entry=ttu&g_ep=EgoyMDI1MDEyMi4wIKXMDSoASAFQAw%3D%3D" },
  { name: "Kakinada, Andhra Pradesh", reviews: 4321, rating: 5, address: "EcoPlaster Store, Downtown Kakinada, Andhra Pradesh", timing: "10:00AM to 09:00PM", phone: "9492991123", directions: "#" },
  { name: "Bangalore, Karnataka", reviews: 12345, rating: 5, address: "EcoPlaster Store, MG Road, Bangalore, Karnataka", timing: "10:00AM to 09:00PM", phone: "9492991123", directions: "#" },
  { name: "Koduvally, Calicut", reviews: 3456, rating: 5, address: "EcoPlaster Store, Market Road, Koduvally, Calicut", timing: "10:00AM to 09:00PM", phone: "9492991123", directions: "#" },
  { name: "Deoli, Rajasthan", reviews: 2789, rating: 5, address: "EcoPlaster Store, Main Bazar, Deoli, Rajasthan", timing: "10:00AM to 09:00PM", phone: "9492991123", directions: "#" },
  { name: "Bhubaneshwar, Odisha", reviews: 3987, rating: 5, address: "EcoPlaster Store, Janpath, Bhubaneshwar, Odisha", timing: "10:00AM to 09:00PM", phone: "9492991123", directions: "#" },
  { name: "Ambala, Haryana", reviews: 4521, rating: 5, address: "EcoPlaster Store, Sadar Bazar, Ambala, Haryana", timing: "10:00AM to 09:00PM", phone: "9492991123", directions: "#" },
  { name: "Hisar, Haryana", reviews: 3890, rating: 5, address: "EcoPlaster Store, Urban Estate, Hisar, Haryana", timing: "10:00AM to 09:00PM", phone: "9492991123", directions: "#" },
  { name: "Anantnag, Jammu and Kashmir", reviews: 2954, rating: 5, address: "EcoPlaster Store, Main Road, Anantnag, Jammu and Kashmir", timing: "10:00AM to 09:00PM", phone: "9492991123", directions: "#" },
  { name: "Srinagar, Jammu and Kashmir", reviews: 4120, rating: 5, address: "EcoPlaster Store, Lal Chowk, Srinagar, Jammu and Kashmir", timing: "10:00AM to 09:00PM", phone: "9492991123", directions: "#" },
];

const StoreCards = () => {
  // Generate a background color based on store name
  const getBackgroundColor = (name: string) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-yellow-500", 
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", 
      "bg-red-500", "bg-orange-500", "bg-teal-500"
    ];
    
    // Use the first character of store name to consistently select a color
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get initial letters from store name
  const getInitials = (name: string) => {
    // Extract city name from the store name (before the comma)
    const city = name.split(',')[0];
    return city.charAt(0);
  };

  return (
    <section className="bg-cream py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl font-bold text-productNameColor mb-6">
          Our Stores
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Placeholder with letter instead of image */}
              <div className={`w-full h-60 ${getBackgroundColor(store.name)} flex items-center justify-center`}>
                <span className="text-white text-8xl font-bold">
                  {getInitials(store.name)}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-productNameColor mb-2">
                  {store.name}
                </h3>
                <div className="flex items-center mb-2">
                  {[...Array(store.rating)].map((_, i) => (
                    <Star key={i} className="text-newgreen" size={16} fill="#FFD700" />
                  ))}
                  <span className="ml-2 text-gray-600 text-sm">
                    ({store.reviews} Reviews)
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-2">{store.address}</p>
                <p className="text-gray-700 text-sm font-semibold">
                  Timing: {store.timing}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Phone size={16} className="text-newgreen" />
                  <a href={`tel:${store.phone}`} className="text-newgreen font-semibold">
                    {store.phone}
                  </a>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreCards;