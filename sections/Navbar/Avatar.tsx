"use client";

import { useState } from "react";
import { User, LogIn, UserPlus } from "lucide-react";
import LoginModal from "@/components/Modal/LoginModal";
import RegisterModal from "@/components/Modal/RegisterModal";

const Avatar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const toggleMenu = () => setShowMenu((prev) => !prev);
  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const openLogin = () => {
    closeModals();
    setShowLogin(true);
    setShowMenu(false);
  };

  const openRegister = () => {
    closeModals();
    setShowRegister(true);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <div
        className="w-10 h-10  flex items-center justify-center cursor-pointer"
        onClick={toggleMenu}
      >
        <User className="text-black dark:text-white" />
      </div>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 py-2">
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            onClick={openLogin}
          >
            <LogIn size={16} /> Login
          </button>
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            onClick={openRegister}
          >
            <UserPlus size={16} /> Register
          </button>
        </div>
      )}

      {showLogin && (
        <LoginModal
          handleModalclose={closeModals}
          openRegister={openRegister}
        />
      )}

      {showRegister && (
        <RegisterModal
          toggleModal={toggleMenu}
          handleModalclose={closeModals}
          openLogin={openLogin}
        />
      )}
    </div>
  );
};

export default Avatar;
