import React from "react";

interface HeroSectionProps {
  scrollToImages: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToImages }) => {
  return (
    <section className="w-full py-16">
      <div className="container flex flex-col items-center justify-between px-6 mx-auto md:flex-row">
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="mb-6 text-5xl font-bold leading-snug text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text">
            Explore Your World of Images
          </h1>
          <p className="mb-8 text-lg text-gray-300 md:text-xl">
            Upload and manage your personal images.
          </p>
          <button
            onClick={scrollToImages}
            className="relative inline-block px-8 py-2 mb-10 text-lg font-semibold text-white transition-all bg-orange-500 rounded-lg shadow-lg md:mb-1 hover:bg-orange-400"
          >
            Explore
          </button>
        </div>

        {/* Right Side Image */}
        <div className="mb-6 md:w-1/2 md:mb-0">
          <img
            src="/hero-image.png"
            alt="hero"
            className="object-cover w-[95%] h-[95%] rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
