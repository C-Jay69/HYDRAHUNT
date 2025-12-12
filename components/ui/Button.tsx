import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-bold font-['Space_Grotesk'] border-2 border-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#0000FF] text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    secondary: "bg-[#00FFFF] text-black hover:bg-[#00FFFF]/80 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    success: "bg-[#BEF754] text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    danger: "bg-[#FF00FF] text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    ghost: "bg-transparent border-transparent hover:bg-black/5 text-black",
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} py-2 px-4 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
