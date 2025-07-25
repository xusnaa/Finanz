'use client';
import React from 'react';
import Navbar from '@/sections/Navbar/Navbar';
import Hero from '@/sections/hero/hero';
// import Description from '@/sections/description/description';
import BankLogoScroller from '@/sections/banks/banks';
import Footer from '@/sections/footer/footer';
import Analysis from '@/sections/analysis/analysis';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <Hero />
      {/* <Description /> */}
      <BankLogoScroller />
      <Analysis />
      <Footer />
    </div>
  );
}
