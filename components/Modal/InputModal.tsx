import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-full max-w-md">
      <div className="relative w-full">
        <h2 className="text-xl text-center font-bold mb-4">{title}</h2>
        <Button className="absolute right-0 top-1/2 -translate-y-1/2 text-xl" onClick={onClose}>
          X
        </Button>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;
