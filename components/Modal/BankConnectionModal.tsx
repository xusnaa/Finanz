'use client';

import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Your bank logos and names with updated URLs
const supportedBanks = [
  {
    name: 'Wells Fargo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wells_Fargo_Bank.svg/2048px-Wells_Fargo_Bank.svg.png',
  },
  { name: 'Chase', logo: 'https://www.svgrepo.com/show/303637/chase-logo.svg' },
  {
    name: 'Citi',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Citi.svg/2560px-Citi.svg.png',
  },
  {
    name: 'Bank of America',
    logo: 'https://www.logo.wine/a/logo/Bank_of_America/Bank_of_America-Logo.wine.svg',
  },
  {
    name: 'US Bank',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9-XobsSvGp696OuSP65Iy6R9PGCHNlDw8Nw&s',
  },
  {
    name: 'Capital One',
    logo: 'https://images.seeklogo.com/logo-png/42/1/capital-one-logo-png_seeklogo-425557.png',
  },
];

interface BankConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBank: (bank: string) => void;
}

export default function BankConnectModal({ isOpen, onClose, onSelectBank }: BankConnectModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 text-center  bg-opacity-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="inline-block w-full max-w-md p-6 my-20 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-xl rounded-2xl relative">
              {/* X Close Button */}
              <button
                aria-label="Close modal"
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-6">
                Select your bank
              </Dialog.Title>

              <div className="grid grid-cols-2 gap-6">
                {supportedBanks.map(({ name, logo }) => (
                  <button
                    key={name}
                    onClick={() => {
                      onSelectBank(name);
                      onClose();
                    }}
                    className="flex flex-col items-center gap-2 p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition"
                  >
                    <img src={logo} alt={`${name} logo`} className="w-16 h-16 object-contain" />
                    {/* <span className="text-gray-900 dark:text-gray-100 font-semibold text-center">
                      {name}
                    </span> */}
                  </button>
                ))}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
