import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div className="p-4 sm:p-7 mt-10 flex flex-col sm:flex-row items-center justify-center w-full h-[60vh] max-w-screen-xl mx-auto">
      {/* Text Section */}
      <div className="text-center sm:text-left font-extrabold text-4xl sm:text-6xl text-slate-300 max-w-md sm:mr-20 leading-tight">
        Meet Finanz <br />
        <span className="text-2xl sm:text-3xl font-light block mt-2">
          Your Intelligent Financial Sidekick
        </span>
      </div>

      {/* Image and Tags */}
      <div className="relative mt-10 sm:mt-0 w-full max-w-[500px] sm:max-w-[700px]">
        {/* Main Image */}
        <Image
          src="/hero.png"
          alt="hero"
          width={900}
          height={800}
          className="object-contain w-full h-auto"
        />

        {/* Top Right - Hidden on small screens */}
        <div className="hidden sm:absolute sm:top-4 sm:-right-52 text-slate-300 font-extrabold flex-col items-end text-sm sm:text-base sm:flex">
          <div className="text-xl ml-4">Financial tracking</div>
          <Image
            src="/card.png"
            alt="card"
            width={300}
            height={300}
            className="object-contain max-w-[70%] sm:max-w-[100%]"
          />
        </div>

        {/* Top Left - Hidden on small screens */}
        <div className="hidden sm:absolute sm:top-0 sm:left-4 text-slate-300 font-bold text-sm sm:text-base sm:block">
          <div className="text-xl">Budgeting</div>
          <Image
            src="/budegting.png"
            alt="budgeting"
            width={400}
            height={200}
            className="object-contain max-w-[80%] sm:max-w-[100%]"
          />
        </div>

        {/* Bottom Left - Hidden on small screens
        <div className="hidden sm:absolute sm:bottom-0 sm:left-1 text-slate-300 font-bold text-sm sm:text-base sm:block">
          <Image
            src="/goals.png"
            alt="goals"
            width={300}
            height={300}
            className="object-contain max-w-[80%] sm:max-w-[100%]"
                  />
                  
        </div> */}
      </div>
    </div>
  );
};

export default Hero;
