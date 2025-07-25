'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const Analysis = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 500); // show after 0.5 sec
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className={`w-full bg-gray-100 dark:bg-transparent py-16 px-4 sm:px-7 max-w-full mx-auto transition-opacity duration-700 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Title centered on top with gradient */}
      <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        Smart Financial Analysis
      </h2>

      {/* Content: text left, image right */}
      <div className="flex flex-col sm:flex-row items-center max-w-screen-xl mx-auto gap-10">
        {/* Text below title, left-aligned */}
        <div className="sm:w-1/2 text-left text-gray-600 dark:text-gray-400 text-lg">
          Finanz analyzes your spending and savings trends to give you actionable insights. Whether
          you're planning for the month or saving for a goal, Finanz helps you stay informed and
          ahead.
        </div>

        {/* Image on right */}
        <div className="sm:w-1/2 w-full">
          <Image
            src="/analysis.png"
            alt="Financial Analysis"
            width={600}
            height={400}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Analysis;
