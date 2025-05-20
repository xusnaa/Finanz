import { X } from "lucide-react";
import React, { useState } from "react";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        fullName: `${firstName} ${surName}`,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("User created!");
      handleModalclose();
    } else {
      alert(data.error || "Failed to register");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-gray-100 dark:bg-gray-950 rounded-lg shadow-lg w-full max-w-md md:max-w-xl p-6 overflow-y-auto max-h-[90vh]">
        <form
          onSubmit={handleRegister}
          className="relative flex flex-col gap-6"
        >
          <div
            className="absolute top-4 right-4 cursor-pointer dark:text-slate-300"
            onClick={handleModalclose}
          >
            <X size={24} />
          </div>

          <h1 className="text-3xl font-extrabold text-center dark:text-slate-300 mt-4">
            Register
          </h1>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 w-full bg-transparent rounded-lg border-2"
            placeholder="e-mail"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 w-full bg-transparent rounded-lg border-2"
            placeholder="password"
            required
          />
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="p-2 w-full bg-transparent rounded-lg border-2"
            placeholder="First Name"
            required
          />
          <input
            type="text"
            value={surName}
            onChange={(e) => setSurName(e.target.value)}
            className="p-2 w-full bg-transparent rounded-lg border-2"
            placeholder="SurName"
            required
          />
          <button
            type="submit"
            className="mt-6 p-2 w-full bg-black dark:bg-slate-300 text-xl text-slate-300 dark:text-black font-bold rounded-lg border-2"
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
      </div>
    </div>
  );
};

export default RegisterModal;
