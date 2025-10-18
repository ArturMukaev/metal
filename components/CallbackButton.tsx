'use client';

import { useState } from 'react';
import { CallbackModal } from '@/components/CallbackModal';

interface CallbackButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'full-width';
}

export function CallbackButton({ 
  children, 
  className = '', 
  variant = 'default' 
}: CallbackButtonProps) {
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);

  const baseClasses = 'bg-primary hover:bg-primary-dark text-dark font-semibold rounded transition-colors';
  const variantClasses = {
    default: 'px-4 py-2',
    'full-width': 'w-full py-3 px-4 text-lg'
  };

  return (
    <>
      <button
        onClick={() => setIsCallbackModalOpen(true)}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
      
      <CallbackModal 
        isOpen={isCallbackModalOpen} 
        onClose={() => setIsCallbackModalOpen(false)} 
      />
    </>
  );
}
