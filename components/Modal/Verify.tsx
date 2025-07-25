'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface VerifyOtpModalProps {
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VerifyOtpModal({ email, onClose, onSuccess }: VerifyOtpModalProps) {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Email verified!');
      onSuccess();
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 dark:bg-transparent bg-opacity-100 z-50 px-4">
      <div className="bg-gray-200 dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md md:max-w-xl p-6 overflow-y-auto max-h-[90vh]">
        <form onSubmit={handleSubmit} className="relative flex flex-col gap-6">
          <div
            className="absolute top-4 right-4 cursor-pointer text-black dark:text-slate-300"
            onClick={onClose}
          >
            <X size={24} />
          </div>

          <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-500 bg-clip-text text-transparent mt-4">
            Verify OTP
          </h1>

          <p className="text-center text-gray-600 dark:text-gray-400">
            Sent to: <span className="font-semibold">{email}</span>
          </p>

          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            Expires in: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </p>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="p-3 w-full bg-transparent rounded-lg border-2 border-gray-400 text-black dark:text-slate-300"
            placeholder="Enter OTP"
            required
            maxLength={6}
          />

          {message && <p className="text-red-500 text-sm text-center">{message}</p>}

          <button
            type="submit"
            className="mt-6 p-3 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-xl text-white font-bold rounded-full border-2 border-transparent"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
