"use client"; // if you're using Next.js App Router

import React, { useState } from "react";
import Theme from "./theme";
import { Menu, X } from "lucide-react";
import Avatar from "./Avatar";

const Navlinks = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="text-slate-300 flex items-center justify-between  sm:gap-20 relative">
      {/* Desktop Links */}
      <div className="hidden sm:flex justify-between items-center gap-10">
        <a href="/">Home</a>
        <a href="/">How it Works</a>
      </div>

      {/* Mobile menu toggle */}
      <div className="sm:hidden ml-auto">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu list */}
      {menuOpen && (
        <div className="absolute top-full left-0  w-full bg-slate-900  text-slate-300 flex flex-col items-start gap-4 p-4 sm:hidden z-50">
          <a href="/" onClick={() => setMenuOpen(false)}>
            Home
          </a>
          <a href="/" onClick={() => setMenuOpen(false)}>
            How it Works
          </a>
          <a href="/sign-up" onClick={() => setMenuOpen(false)}>
            Login
          </a>
        </div>
      )}
    </div>
  );
};

export default Navlinks;
