import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

const Description = () => {
  return (
    <div className="p-8 bg-gray-100 dark:bg-transparent flex items-center flex-col">
      <h1 className="p-4 mb-10 text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-500 bg-clip-text text-transparent">
        Smarter Spending Starts Here
      </h1>
      <motion.div layoutId="card2" className="mt-8">
        <Image
          src="/card2.png"
          alt="card2"
          width={400}
          height={300}
          className="object-contain rotate-100"
        />
      </motion.div>
    </div>
  );
};

export default Description;
