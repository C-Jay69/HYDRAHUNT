
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full mb-5">
      {label && (
        <label className="block text-xs font-black mb-2 text-[#00FFFF] tracking-widest uppercase flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00FFFF] inline-block"></span>
          {label}
        </label>
      )}
      <input
        className={`w-full bg-[#0a0a0a] text-white border-2 border-[#333] px-4 py-3 focus:outline-none focus:border-[#00FFFF] focus:bg-black focus:shadow-[0_0_20px_rgba(0,255,255,0.1)] transition-all placeholder-gray-600 font-medium ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
