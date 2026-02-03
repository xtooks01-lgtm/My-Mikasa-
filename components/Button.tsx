
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '' }) => {
  const baseStyles = "px-8 py-3 rounded-full transition-all duration-300 transform active:scale-95 shadow-sm font-medium tracking-wide";
  const variants = {
    primary: "bg-pink-100 text-pink-600 hover:bg-pink-200 border border-pink-200",
    secondary: "bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-100",
    outline: "bg-white text-pink-400 border border-pink-100 hover:bg-pink-50",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};
