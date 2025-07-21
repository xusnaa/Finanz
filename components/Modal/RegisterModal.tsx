'use client';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { Supabase } from '@/lib/supabase';
import { RegisterSchema } from '@/lib/schemas/auth';
import { z } from 'zod';

import VerifyOtpModal from './Verify';

interface RegisterModalProps {
  toggleModal: () => void;
  handleModalclose: () => void;
  openLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  toggleModal,
  handleModalclose,
  openLogin,
}) => {
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [latname, setLatName] = useState('');
  const [errors, setErrors] =
    useState<Partial<Record<keyof z.infer<typeof RegisterSchema>, string>>>();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = RegisterSchema.safeParse({ email, password, firstname, latname });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      setErrors({
        email: flat.email?.[0],
        password: flat.password?.[0],
        firstname: flat.firstname?.[0],
        latname: flat.latname?.[0],
      });
      return;
    }
    setErrors(undefined);

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        firstname,
        latname,
      }),
    });

    const resultApi = await res.json();

    if (!res.ok) {
      alert(resultApi.error || 'Failed to register');
      return;
    }

    // Redirect to OTP page with email param
    setShowOtpModal(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50 px-4">
      <div className="bg-gray-100 dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md md:max-w-xl p-6 overflow-y-auto max-h-[90vh]">
        <form onSubmit={handleRegister} className="relative flex flex-col gap-6">
          <div
            className="absolute top-4 right-4 cursor-pointer dark:text-slate-300"
            onClick={handleModalclose}
          >
            <X size={24} />
          </div>

          <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-500 bg-clip-text text-transparent mt-4">
            Register
          </h1>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 w-full bg-transparent rounded-lg border-2 text-black dark:text-slate-300"
            placeholder="e-mail"
            required
          />
          {errors?.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 w-full bg-transparent rounded-lg border-2 text-black dark:text-slate-300"
            placeholder="password"
            required
          />
          {errors?.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            className="p-2 w-full bg-transparent rounded-lg border-2 text-black dark:text-slate-300"
            placeholder="First Name"
            required
          />
          {errors?.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
          <input
            type="text"
            value={latname}
            onChange={(e) => setLatName(e.target.value)}
            className="p-2 w-full bg-transparent rounded-lg border-2 text-black dark:text-slate-300"
            placeholder="SurName"
            required
          />
          {errors?.latname && <p className="text-red-500 text-sm">{errors.latname}</p>}

          <button
            type="submit"
            className="mt-6 p-2 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-xl text-white dark:text-black font-bold rounded-full border-2"
          >
            Register
          </button>

          <p
            onClick={openLogin}
            className="text-center text-md dark:text-slate-300 cursor-pointer mt-6"
          >
            Already have an account? Login
          </p>
        </form>
        {showOtpModal && (
          <VerifyOtpModal
            email={email}
            onClose={() => setShowOtpModal(false)}
            onSuccess={() => {
              setShowOtpModal(false);
              handleModalclose(); // or redirect to login
              openLogin();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
