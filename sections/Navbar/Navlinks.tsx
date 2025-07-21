'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Avatar from './Avatar';

const Navlinks = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="text-slate-800 dark:text-slate-300 flex items-center justify-between sm:gap-20 relative w-full">
      {/* Desktop Links */}
      <div className="hidden sm:flex items-center gap-10">
        <a href="/">Home</a>
        <a href="/">How it Works</a>
      </div>

      {/* Mobile menu toggle (absolute right) */}
      <div className="sm:hidden absolute right-0">
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-900 text-slate-300 flex flex-col items-start gap-4 p-4 sm:hidden z-50">
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
