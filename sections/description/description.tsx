import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

const Description = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
      className="bg-gray-100 dark:bg-transparent px-4 sm:px-7 py-16 w-full max-w-screen-xl mx-auto flex items-center justify-center"
    >
      <h1 className="w-full text-center mb-10 text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-500 bg-clip-text text-transparent">
        Smarter Spending Starts Here
      </h1>

      <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-8">
        {/* Left Text */}
        <div className="flex flex-col space-y-6 sm:w-1/4 text-left text-slate-700 dark:text-slate-300">
          <div className="text-lg font-semibold">3. Insightful Reports</div>
          <div className="text-lg font-semibold">4. Budget Alerts</div>
        </div>

        {/* Image */}
        <motion.div layoutId="card2" className="sm:w-1/2 flex justify-center">
          <Image
            src="/card2.png"
            alt="card2"
            width={400}
            height={300}
            className="object-contain rotate-100"
          />
        </motion.div>

        {/* Right Text */}
        <div className="flex flex-col space-y-6 sm:w-1/4 text-left text-slate-700 dark:text-slate-300">
          <div className="text-lg font-semibold">1. Real-time Tracking</div>
          <div className="text-lg font-semibold">2. Spending Categories</div>
        </div>
      </div>
    </motion.section>
  );
};

export default Description;
