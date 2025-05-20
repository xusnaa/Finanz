"use client";

import { BankLogos } from "@/constants/data";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const SCROLL_DURATION = 20; // in seconds

const BankLogoScroller: React.FC = () => {
  const logos = [...BankLogos, ...BankLogos]; // duplicate for looping

  return (
    <div className="w-full overflow-hidden p-7 text-slate-300">
      <div className="flex items-center justify-center p-4 m-6 text-3xl  font-light">
        Get access to your personal Bank
      </div>
      <motion.div
        className="flex space-x-16"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: SCROLL_DURATION,
        }}
      >
        {logos.map((src, index) => (
          <div key={index} className="flex-shrink-0 w-36 h-20 relative">
            <img
              src={src}
              alt={`Bank logo ${index}`}
              className="h-full object-contain"
              // load only first row eagerly
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default BankLogoScroller;
