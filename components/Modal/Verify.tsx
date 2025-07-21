// components/VerifyOtpModal.tsx
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-gray-100 dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md p-6">
        <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
          <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
            <X size={24} />
          </div>
          <h1 className="text-2xl font-bold text-center text-white">Verify OTP</h1>
          <p className="text-sm text-gray-300 text-center">Sent to: {email}</p>
          <p className="text-sm text-gray-300 text-center">
            Expires in: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="p-2 rounded border bg-white text-black"
            placeholder="Enter OTP"
            required
          />
          {message && <p className="text-red-500 text-sm">{message}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
