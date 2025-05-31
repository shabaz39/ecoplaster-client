"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const rooms = [
  { name: "Bedroom", image: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687357/lb7iwh7e90moshayjhsi.webp" },
  { name: "Living", image: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687357/ry7yujzrgqingxxa8lkd.webp" },
  { name: "Kitchen", image: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687355/dlsaymrjeystqswgdsta.webp" },
  { name: "Dining", image: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687357/e6nmjpoya4hbspifpr08.webp" },
  { name: "Study", image: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687358/fak0ld0yp5uc5iyolb7k.webp" },
  { name: "Kids", image: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687355/a0pbuko04rotglciz6y6.webp" },
];

const ShopByRooms: React.FC = () => {
  const router = useRouter();

  const navigateToAllProducts = () => {
    router.push("/allproducts");
  };

  return (
    <section className="py-8 px-4 sm:px-8 lg:px-64 bg-white">
      {/* Section Title */}
      <h2 className="relative pb-2 text-2xl font-bold text-gray-800">
        Shop By Rooms
        <div className="flex justify-center mt-1">
          <span className="absolute left-0 bottom-0 h-[3px] w-14 bg-newgreen rounded-md"></span>
        </div>
      </h2>

      {/* Rooms Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mt-4 gap-4">
        {rooms.map((room, index) => (
          <Link href="/allproducts" key={index}>
            <div
              className="group cursor-pointer relative bg-white rounded-lg shadow-md overflow-hidden text-gray-500 hover:text-gray-900"
            >
              {/* Image */}
              <div className="overflow-hidden rounded-lg">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-36 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              {/* Label */}
              <p className="mt-2 text-center font-semibold">
                {room.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShopByRooms;