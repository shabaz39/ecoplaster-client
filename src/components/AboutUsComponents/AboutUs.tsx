import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-productNameColor">About EcoPlaster</h1>
            <p className="text-lg sm:text-xl text-gray-700 mt-4">
              Leading the Way in Sustainable Wall Covering Material
            </p>
          </div>
          <div>
            <img src="/aboutusimages/about-hero.png" alt="About EcoPlaster" className="rounded-lg shadow-lg w-full" />
          </div>
        </div>

        {/* Sections */}
        {[{
          title: "Our Mission",
          description: "EcoPlaster has been committed to excellence in providing eco-friendly wall covering materials and sustainable wall solutions. Our drive for innovation led to the expansion of our product range, introducing a variety of decorative wall solutions and sustainable finishes.",
          extra: "We offer innovative textures and eco-friendly solutions that combine aesthetics with environmental responsibility. Leveraging cutting-edge machinery and advanced production techniques, EcoPlaster continues to lead the industry with high-quality eco-friendly wall finishes, transforming spaces while supporting sustainability.",
          image: "/aboutusimages/our-mission.png"
        }, {
          title: "Our Story",
          description: "EcoPlaster started with a simple idea—to create wall finishes that are luxurious, beautiful, durable, and kind to the environment. What began as a small endeavor quickly grew into a journey of innovation and dedication.",
          extra: "We focus on providing solutions that make walls not just look great but also stay protected. With easy application, repairability, and eco-friendly materials, EcoPlaster stands out as a modern choice for homes and businesses.",
          extraBold: "Let’s build a better future, one wall at a time!",
          image: "/aboutusimages/our-story.png"
        }, {
          title: "Our Technology",
          description: "EcoPlaster’s unique technology provides a smooth, durable, and flexible surface that enhances the beauty of any space. Easy to apply without specialized skills, our product covers surface flaws, offers thermal regulation, and provides long-lasting results without bubbling, chipping, or cracking.",
          image: "/aboutusimages/our-technology.png"
        }].map((section, index) => (
          <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <img src={section.image} alt={section.title} className="rounded-lg shadow-lg w-full" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-productNameColor mb-4">{section.title}</h2>
              <p className="text-lg text-gray-700 mb-4">{section.description}</p>
              {section.extra && <p className="text-lg text-gray-700 mb-4">{section.extra}</p>}
              {section.extraBold && <p className="text-lg text-gray-700 font-semibold">{section.extraBold}</p>}
            </div>
          </div>
        ))}

        {/* Industry Recognition */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-productNameColor mb-4">Industry Recognition</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our dedication to excellence has earned us industry recognition, including the prestigious Award from
            <strong> JD Institute, Bangalore</strong>, for our innovative approach to eco-friendly finishes and design solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
