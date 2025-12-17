
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
  disabled,
  ...props 
}) => {
  // Base styles: Increased border width, added better disabled states, ensured high contrast fonts
  const baseStyles = "font-bold font-['Space_Grotesk'] border-2 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale uppercase tracking-wider flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#0000FF] border-[#0000FF] text-white hover:bg-white hover:text-[#0000FF] hover:shadow-[4px_4px_0px_0px_#fff]",
    secondary: "bg-[#00FFFF] border-[#00FFFF] text-black hover:bg-black hover:text-[#00FFFF] hover:shadow-[4px_4px_0px_0px_#00FFFF]",
    success: "bg-[#BEF754] border-[#BEF754] text-black hover:bg-black hover:text-[#BEF754] hover:shadow-[4px_4px_0px_0px_#BEF754]",
    danger: "bg-[#FF00FF] border-[#FF00FF] text-white hover:bg-white hover:text-[#FF00FF] hover:shadow-[4px_4px_0px_0px_#fff]",
    ghost: "bg-transparent border-white/30 text-white hover:bg-white hover:text-black hover:border-white",
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} py-3 px-5 text-sm md:text-base ${className}`}
      disabled={disabled}
      type="button" // Default to button to prevent form submission issues
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
