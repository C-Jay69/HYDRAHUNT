
import React from 'react';
import { TEMPLATES } from '../constants';
import Button from '../components/ui/Button';

const Templates: React.FC = () => {
  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-black text-center mb-12 text-white">
          SELECT YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF]">AVATAR</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {TEMPLATES.map((template) => (
            <div key={template.id} className="group relative bg-[#111] border-2 border-[#333] hover:border-[#BEF754] transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
               {/* Selection Indicator */}
               <div className="absolute top-0 left-0 w-full h-1 bg-[#BEF754] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-20"></div>
               
               {/* Preview Area */}
               <div className="h-80 bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center">
                   {/* Abstract Preview */}
                   <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-90"></div>
                   
                   {/* Dynamic Preview Elements based on Colors */}
                   <div className="relative z-10 w-40 h-56 bg-white shadow-2xl transform group-hover:scale-105 transition-transform duration-500 flex flex-col p-2 gap-2 opacity-80">
                      <div className="h-4 w-full" style={{ backgroundColor: template.colors[0] }}></div>
                      <div className="h-2 w-2/3 bg-gray-300"></div>
                      <div className="h-2 w-1/2 bg-gray-200"></div>
                      <div className="flex-1 w-full bg-gray-100 mt-2"></div>
                   </div>

                   {/* Color Dots */}
                   <div className="absolute bottom-4 left-4 flex gap-2 z-20">
                      {template.colors.map(c => (
                        <div key={c} className="w-6 h-6 rounded-full border border-white shadow-md" style={{ backgroundColor: c }}></div>
                      ))}
                   </div>
               </div>

               <div className="p-6 bg-[#111] border-t border-[#333]">
                  <h3 className="text-2xl font-bold font-['Space_Grotesk'] mb-2 text-white group-hover:text-[#BEF754]">{template.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 font-mono">{template.description}</p>
                  
                  <Button variant="primary" fullWidth className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all bg-[#BEF754] text-black border-[#BEF754] hover:bg-white">
                    EQUIP TEMPLATE
                  </Button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;