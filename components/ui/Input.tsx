
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-bold mb-1 text-[#00FFFF] bg-black inline-block px-2 py-0.5 transform -skew-x-12 border border-[#00FFFF]/30">
          <span className="transform skew-x-12 inline-block tracking-wider">{label}</span>
        </label>
      )}
      <input
        className={`w-full bg-[#111] text-white border-2 border-[#333] px-3 py-2 focus:outline-none focus:border-[#00FFFF] focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all placeholder-gray-600 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;