'use client';

import { X } from 'lucide-react';
import React, { useState } from 'react';

interface LoginModalProps {
  handleModalclose: () => void;
  openRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ handleModalclose, openRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Login successful');
      console.log('User:', data.user);
      handleModalclose();
    } else {
      alert(data.error || 'Login failed');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 px-4">
      <div className=" bg-gray-950 rounded-lg shadow-lg w-full max-w-md md:max-w-xl p-6 overflow-y-auto max-h-[90vh]">
        <form onSubmit={handleLogin} className="relative flex flex-col gap-6">
          <div
            className="absolute top-4 right-4 cursor-pointer text-slate-300"
            onClick={handleModalclose}
          >
            <X size={24} />
          </div>

          <h1 className="text-3xl font-extrabold text-center text-slate-300 mt-4">Login</h1>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 w-full bg-transparent rounded-lg border-2 text-slate-300"
            placeholder="e-mail"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 w-full bg-transparent rounded-lg border-2 text-slate-300"
            placeholder="password"
            required
          />
          <button
            type="submit"
            className="mt-6 p-2 w-full bg-black dark:bg-slate-300 text-xl text-slate-300 dark:text-black font-bold rounded-lg border-2"
          >
            Login
          </button>

          <p
            onClick={openRegister}
            className="text-center text-md dark:text-slate-300 cursor-pointer mt-6"
          >
            Dont have an account? Sign Up
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
