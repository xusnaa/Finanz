'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const Hero = () => {
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHero(true), 500); // Delay 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`p-4 sm:p-7 mt-10 flex flex-col sm:flex-row items-center justify-start w-full h-[60vh] max-w-screen-xl mx-auto transition-opacity duration-1000 ${
        showHero ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Text Section */}
      <div className="text-left font-extrabold text-4xl sm:text-6xl text-slate-800 dark:text-slate-300 max-w-md sm:mr-20 leading-tight">
        Meet{' '}
        <span className="bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-500 bg-clip-text text-transparent">
          Finanz
        </span>
        <br />
        <span className="text-2xl sm:text-3xl font-light block mt-2">
          Your Intelligent Financial Sidekick
        </span>
      </div>

      {/* Image and Tags */}
      <div className="relative mt-10 sm:mt-0 w-full max-w-[500px] sm:max-w-[700px]">
        <Image
          src="/hero.png"
          alt="hero"
          width={900}
          height={800}
          className="object-contain w-full h-auto"
        />

        <div className="hidden sm:absolute sm:top-4 sm:-right-52 bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-500 bg-clip-text text-transparent font-extrabold flex-col items-end text-sm sm:text-base sm:flex">
          <div className="text-xl ml-4">Financial tracking</div>
          <Image
            src="/card2.png"
            alt="card"
            width={300}
            height={300}
            className="object-contain max-w-[70%] sm:max-w-[100%] mt-20 rotate-120"
          />
        </div>

        <div className="hidden sm:absolute sm:top-0 sm:left-4 bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-500 bg-clip-text text-transparent font-bold text-sm sm:text-base sm:block">
          <div className="text-xl">Budgeting</div>
          <Image
            src="/budegting.png"
            alt="budgeting"
            width={400}
            height={200}
            className="object-contain max-w-[80%] sm:max-w-[100%]"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
