
import React from 'react';
import { ResumeData, TemplateId } from '../types';
import { Mail, Phone, MapPin, Globe, Terminal, Hash, Hexagon, Grid, Type } from 'lucide-react';

interface Props {
  data: ResumeData;
  scale?: number;
  id?: string;
}

const ResumePreview: React.FC<Props> = ({ data, scale = 1, id }) => {
  const containerStyle = {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: '210mm',
    minHeight: '297mm',
  };

  // --- TEMPLATE 1: CYBER FUNK ---
  if (data.templateId === TemplateId.CYBER) {
    return (
      <div id={id} style={containerStyle} className="bg-white text-black p-8 font-['Space_Grotesk'] shadow-lg mx-auto relative overflow-hidden border-2 border-black">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF00FF] rounded-bl-full opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00FFFF] rounded-tr-full opacity-20"></div>

        <header className="border-b-4 border-black pb-6 mb-8 relative z-10">
          <h1 className="text-5xl font-black mb-2 uppercase tracking-tighter">{data.fullName}</h1>
          <p className="text-xl font-bold text-[#0000FF]">{data.title}</p>
          
          <div className="flex flex-wrap gap-4 mt-4 text-sm font-bold">
            {data.email && <div className="flex items-center gap-1 bg-[#DCDFD5] px-2 py-1"><Mail size={14}/> {data.email}</div>}
            {data.phone && <div className="flex items-center gap-1 bg-[#DCDFD5] px-2 py-1"><Phone size={14}/> {data.phone}</div>}
            {data.location && <div className="flex items-center gap-1 bg-[#DCDFD5] px-2 py-1"><MapPin size={14}/> {data.location}</div>}
            {data.website && <div className="flex items-center gap-1 bg-[#DCDFD5] px-2 py-1"><Globe size={14}/> {data.website}</div>}
          </div>
        </header>

        <section className="mb-8 relative z-10">
          <h2 className="text-2xl font-black bg-black text-[#BEF754] inline-block px-3 py-1 mb-4 transform -skew-x-6">SUMMARY</h2>
          <p className="text-lg leading-relaxed font-medium">{data.summary}</p>
        </section>

        <div className="grid grid-cols-3 gap-8 relative z-10">
          <div className="col-span-2">
            <h2 className="text-2xl font-black bg-black text-[#00FFFF] inline-block px-3 py-1 mb-6 transform -skew-x-6">EXPERIENCE</h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="border-l-4 border-[#0000FF] pl-4">
                  <h3 className="text-xl font-bold">{exp.role}</h3>
                  <div className="text-sm font-bold mb-2 flex justify-between items-center">
                    <span className="text-[#FF00FF]">{exp.company}</span>
                    <span className="bg-[#DCDFD5] px-2 text-xs">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-1">
            <h2 className="text-2xl font-black bg-black text-[#FFBF00] inline-block px-3 py-1 mb-6 transform -skew-x-6">EDUCATION</h2>
             <div className="space-y-4 mb-8">
              {data.education.map((edu) => (
                <div key={edu.id} className="border-2 border-black p-3 bg-[#DCDFD5]">
                  <h3 className="font-bold">{edu.school}</h3>
                  <p className="text-sm">{edu.degree}</p>
                  <p className="text-xs text-gray-600">{edu.year}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-black bg-black text-[#FFBF00] inline-block px-3 py-1 mb-6 transform -skew-x-6">SKILLS</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span key={skill.id} className="border-2 border-black px-2 py-1 font-bold text-sm bg-white shadow-[2px_2px_0px_0px_#000000]">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- TEMPLATE 2: TERMINAL (MAINFRAME) ---
  if (data.templateId === TemplateId.TERMINAL) {
    return (
      <div id={id} style={containerStyle} className="bg-black text-[#00FF00] p-10 font-mono shadow-lg mx-auto border-none">
         <div className="mb-8 border-b border-[#00FF00] pb-4 flex justify-between items-end">
            <div>
               <div className="text-xs mb-1 opacity-70">root@SYSTEM:~/resume/users/{data.fullName.toLowerCase().replace(' ', '_')}</div>
               <h1 className="text-5xl font-bold">{data.fullName}</h1>
               <p className="text-xl mt-2">{'>'} {data.title}<span className="animate-pulse">_</span></p>
            </div>
            <div className="text-right text-xs opacity-70">
               <p>ID: {data.id.substring(0,8)}</p>
               <p>LOC: {data.location}</p>
            </div>
         </div>

         <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8">
                <section className="mb-8">
                    <h3 className="text-xl font-bold mb-4 border-b border-[#00FF00] inline-block pr-4">{'>'} SUMMARY</h3>
                    <p className="text-sm leading-relaxed opacity-90">{data.summary}</p>
                </section>

                <section className="mb-8">
                    <h3 className="text-xl font-bold mb-6 border-b border-[#00FF00] inline-block pr-4">{'>'} PROCESSES (EXPERIENCE)</h3>
                    <div className="space-y-6 border-l border-[#00FF00] pl-4 ml-2">
                       {data.experience.map((exp) => (
                          <div key={exp.id} className="relative">
                             <div className="absolute -left-[21px] top-1 w-2 h-2 bg-[#00FF00]"></div>
                             <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-bold text-lg">{exp.role}</h4>
                                <span className="text-xs bg-[#00FF00] text-black px-2 py-0.5">{exp.startDate} :: {exp.endDate}</span>
                             </div>
                             <p className="text-sm font-bold opacity-80 mb-2">@{exp.company}</p>
                             <p className="text-xs opacity-70">{exp.description}</p>
                          </div>
                       ))}
                    </div>
                </section>
            </div>

            <div className="col-span-4 border-l border-[#00FF00] pl-6 border-dashed opacity-80">
                <section className="mb-8">
                    <h3 className="text-lg font-bold mb-4">{'>'} CONTACT</h3>
                    <div className="text-xs space-y-2">
                       {data.email && <div className="flex gap-2"><span>[@]</span> {data.email}</div>}
                       {data.phone && <div className="flex gap-2"><span>[#]</span> {data.phone}</div>}
                       {data.website && <div className="flex gap-2"><span>[W]</span> {data.website}</div>}
                    </div>
                </section>

                <section className="mb-8">
                   <h3 className="text-lg font-bold mb-4">{'>'} MODULES (SKILLS)</h3>
                   <div className="flex flex-col gap-1">
                      {data.skills.map((skill) => (
                         <div key={skill.id} className="text-xs flex justify-between">
                            <span>{skill.name}</span>
                            <span>[{'|'.repeat(skill.level)}{'.'.repeat(5-skill.level)}]</span>
                         </div>
                      ))}
                   </div>
                </section>

                <section>
                   <h3 className="text-lg font-bold mb-4">{'>'} EDUCATION</h3>
                   {data.education.map((edu) => (
                      <div key={edu.id} className="mb-4 text-xs">
                         <div className="font-bold text-[#00FF00]">{edu.school}</div>
                         <div>{edu.degree}</div>
                         <div className="opacity-60">{edu.year}</div>
                      </div>
                   ))}
                </section>
            </div>
         </div>
      </div>
    );
  }

  // --- TEMPLATE 3: BRUTALIST ---
  if (data.templateId === TemplateId.BRUTALIST) {
      return (
          <div id={id} style={containerStyle} className="bg-white text-black font-sans shadow-lg mx-auto border-8 border-black p-0">
             <header className="border-b-8 border-black p-8 bg-[#FF0000] text-white">
                <h1 className="text-7xl font-black uppercase tracking-tighter leading-none mb-4">{data.fullName}</h1>
                <p className="text-3xl font-bold bg-white text-black inline-block px-4 py-2 transform -rotate-1 border-4 border-black shadow-[4px_4px_0px_0px_black]">{data.title.toUpperCase()}</p>
             </header>

             <div className="grid grid-cols-2 border-b-8 border-black">
                <div className="p-8 border-r-8 border-black">
                   <h2 className="text-4xl font-black mb-4 uppercase underline decoration-8 decoration-[#0000FF]">Profile</h2>
                   <p className="text-xl font-bold leading-tight">{data.summary}</p>
                </div>
                <div className="p-8 bg-[#FFFF00]">
                   <h2 className="text-4xl font-black mb-4 uppercase">Contact</h2>
                   <ul className="text-lg font-bold space-y-2">
                      <li>{data.email}</li>
                      <li>{data.phone}</li>
                      <li>{data.location}</li>
                      <li>{data.website}</li>
                   </ul>
                </div>
             </div>

             <div className="p-8">
                <h2 className="text-5xl font-black mb-8 uppercase bg-black text-white inline-block px-4">Experience</h2>
                <div className="space-y-12">
                   {data.experience.map((exp) => (
                      <div key={exp.id} className="grid grid-cols-12 gap-4">
                         <div className="col-span-3 font-black text-2xl text-right pr-4 border-r-4 border-black">
                            {exp.startDate}<br/>{exp.endDate}
                         </div>
                         <div className="col-span-9 pl-4">
                             <h3 className="text-3xl font-black uppercase">{exp.role}</h3>
                             <div className="text-xl font-bold mb-2 bg-[#DCDFD5] inline-block px-2">{exp.company}</div>
                             <p className="text-lg font-medium border-l-4 border-black pl-4">{exp.description}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-2 border-t-8 border-black h-full">
                <div className="p-8 border-r-8 border-black">
                    <h2 className="text-3xl font-black mb-6 uppercase decoration-wavy underline">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                       {data.skills.map(skill => (
                          <span key={skill.id} className="border-2 border-black px-3 py-1 font-black text-lg hover:bg-black hover:text-white transition-colors cursor-default">{skill.name}</span>
                       ))}
                    </div>
                </div>
                <div className="p-8 bg-[#0000FF] text-white">
                    <h2 className="text-3xl font-black mb-6 uppercase">Education</h2>
                    {data.education.map(edu => (
                       <div key={edu.id} className="mb-4">
                          <div className="text-2xl font-bold">{edu.school}</div>
                          <div className="text-xl">{edu.degree}</div>
                       </div>
                    ))}
                </div>
             </div>
          </div>
      );
  }

  // --- TEMPLATE 4: NEON (NIGHT CITY) ---
  if (data.templateId === TemplateId.NEON) {
      return (
          <div id={id} style={containerStyle} className="bg-[#1a1a1a] text-white font-['Space_Grotesk'] shadow-lg mx-auto p-10 border border-[#333]">
              <div className="flex justify-between items-start mb-12 border-b border-[#00FFFF] pb-8 relative">
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00FFFF] blur-[4px] opacity-50"></div>
                  <div>
                      <h1 className="text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{data.fullName}</h1>
                      <p className="text-2xl text-[#00FFFF] mt-2 font-light tracking-widest uppercase drop-shadow-[0_0_5px_#00FFFF]">{data.title}</p>
                  </div>
                  <div className="text-right text-gray-400 space-y-1 text-sm font-mono">
                      <p>{data.email}</p>
                      <p>{data.phone}</p>
                      <p>{data.location}</p>
                  </div>
              </div>

              <div className="grid grid-cols-3 gap-12">
                  <div className="col-span-2 space-y-10">
                      <section>
                          <h2 className="text-2xl font-bold text-[#FF00FF] mb-6 flex items-center gap-3">
                              <span className="w-8 h-[2px] bg-[#FF00FF] shadow-[0_0_10px_#FF00FF]"></span>
                              PROFILE
                          </h2>
                          <p className="text-gray-300 leading-relaxed text-lg font-light">{data.summary}</p>
                      </section>

                      <section>
                          <h2 className="text-2xl font-bold text-[#FF00FF] mb-6 flex items-center gap-3">
                              <span className="w-8 h-[2px] bg-[#FF00FF] shadow-[0_0_10px_#FF00FF]"></span>
                              EXPERIENCE
                          </h2>
                          <div className="space-y-8">
                              {data.experience.map(exp => (
                                  <div key={exp.id} className="relative pl-6 border-l border-[#333]">
                                      <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-[#00FFFF] shadow-[0_0_10px_#00FFFF]"></div>
                                      <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                                      <div className="text-[#00FFFF] text-sm mb-2">{exp.company} <span className="text-gray-500 mx-2">|</span> {exp.startDate} - {exp.endDate}</div>
                                      <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                                  </div>
                              ))}
                          </div>
                      </section>
                  </div>

                  <div className="space-y-10">
                      <section className="bg-[#222] p-6 rounded-xl border border-[#333] shadow-inner">
                          <h2 className="text-xl font-bold text-[#BEF754] mb-4 tracking-wider">SKILLS</h2>
                          <div className="flex flex-wrap gap-2">
                              {data.skills.map(skill => (
                                  <span key={skill.id} className="text-xs bg-black text-white px-3 py-1 rounded-full border border-[#BEF754] shadow-[0_0_5px_rgba(190,247,84,0.3)]">
                                      {skill.name}
                                  </span>
                              ))}
                          </div>
                      </section>

                      <section>
                           <h2 className="text-xl font-bold text-[#BEF754] mb-4 tracking-wider">EDUCATION</h2>
                           {data.education.map(edu => (
                               <div key={edu.id} className="mb-4">
                                   <div className="text-white font-bold">{edu.school}</div>
                                   <div className="text-gray-400 text-sm">{edu.degree}</div>
                                   <div className="text-gray-500 text-xs">{edu.year}</div>
                               </div>
                           ))}
                      </section>
                  </div>
              </div>
          </div>
      );
  }

  // --- TEMPLATE 5: QUANTUM ---
  if (data.templateId === TemplateId.QUANTUM) {
      return (
          <div id={id} style={containerStyle} className="bg-white text-gray-800 font-sans shadow-lg mx-auto p-12">
               <div className="text-center mb-16 relative">
                   <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-200 -z-10"></div>
                   <h1 className="text-5xl font-light tracking-[0.2em] bg-white inline-block px-8 text-black uppercase">{data.fullName}</h1>
                   <p className="text-sm tracking-[0.3em] mt-4 text-[#0000FF] font-bold">{data.title}</p>
               </div>

               <div className="grid grid-cols-12 gap-8 h-full">
                   <div className="col-span-4 text-right border-r border-gray-200 pr-8">
                       <section className="mb-10">
                           <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-400">Contact</h3>
                           <div className="text-sm space-y-2">
                               <p>{data.email}</p>
                               <p>{data.phone}</p>
                               <p>{data.location}</p>
                               <p>{data.website}</p>
                           </div>
                       </section>

                       <section className="mb-10">
                           <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-400">Education</h3>
                           {data.education.map(edu => (
                               <div key={edu.id} className="mb-4">
                                   <div className="font-bold">{edu.school}</div>
                                   <div className="text-xs text-gray-500">{edu.degree}</div>
                                   <div className="text-xs text-gray-400">{edu.year}</div>
                               </div>
                           ))}
                       </section>

                       <section>
                           <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-400">Competencies</h3>
                           <div className="flex flex-col gap-2 items-end">
                               {data.skills.map(skill => (
                                   <span key={skill.id} className="text-sm">{skill.name}</span>
                               ))}
                           </div>
                       </section>
                   </div>

                   <div className="col-span-8 pl-4">
                       <section className="mb-12">
                           <p className="text-lg font-light leading-relaxed italic text-gray-600">"{data.summary}"</p>
                       </section>

                       <section>
                           <h3 className="text-xs font-bold uppercase tracking-widest mb-8 text-[#0000FF] flex items-center gap-2">
                               Experience <span className="flex-1 h-[1px] bg-[#0000FF]"></span>
                           </h3>
                           <div className="space-y-10">
                               {data.experience.map(exp => (
                                   <div key={exp.id}>
                                       <div className="flex justify-between items-baseline mb-2">
                                           <h4 className="text-xl font-light">{exp.role}</h4>
                                           <span className="text-xs font-bold text-gray-400">{exp.startDate} - {exp.endDate}</span>
                                       </div>
                                       <div className="text-sm font-bold mb-2 uppercase tracking-wide text-gray-800">{exp.company}</div>
                                       <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                                   </div>
                               ))}
                           </div>
                       </section>
                   </div>
               </div>
          </div>
      );
  }

  // --- TEMPLATE 6: GRID ---
  if (data.templateId === TemplateId.GRID) {
      return (
          <div id={id} style={containerStyle} className="bg-[#f0f0f0] text-black font-sans shadow-lg mx-auto p-8">
              <div className="grid grid-cols-3 gap-4 h-full">
                  {/* Header Box */}
                  <div className="col-span-2 bg-black text-white p-8 flex flex-col justify-center">
                      <h1 className="text-4xl font-bold mb-2">{data.fullName}</h1>
                      <p className="text-[#BEF754] font-mono text-lg">{data.title}</p>
                  </div>

                  {/* Contact Box */}
                  <div className="col-span-1 bg-white p-6 flex flex-col justify-center text-sm space-y-1 border-l-4 border-[#BEF754]">
                      <p className="font-bold text-gray-400 text-xs uppercase mb-2">Coordinates</p>
                      <p>{data.email}</p>
                      <p>{data.phone}</p>
                      <p>{data.location}</p>
                  </div>

                  {/* Experience Box - Large */}
                  <div className="col-span-2 row-span-2 bg-white p-8">
                       <h2 className="text-2xl font-bold mb-6 border-b-2 border-gray-100 pb-2">Experience</h2>
                       <div className="space-y-8">
                           {data.experience.map(exp => (
                               <div key={exp.id} className="grid grid-cols-4 gap-4">
                                   <div className="col-span-1 text-sm text-gray-500 font-mono pt-1">
                                       {exp.startDate}<br/>{exp.endDate}
                                   </div>
                                   <div className="col-span-3">
                                       <h3 className="font-bold text-lg">{exp.role}</h3>
                                       <div className="text-[#0000FF] text-sm font-bold mb-2">{exp.company}</div>
                                       <p className="text-gray-600 text-sm">{exp.description}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                  </div>

                  {/* Skills Box */}
                  <div className="col-span-1 bg-black text-white p-6">
                      <h2 className="text-xl font-bold mb-4 text-[#BEF754]">Skills</h2>
                      <div className="space-y-3">
                          {data.skills.map(skill => (
                              <div key={skill.id}>
                                  <div className="flex justify-between text-xs mb-1">
                                      <span>{skill.name}</span>
                                      <span className="text-gray-500">{skill.level}/5</span>
                                  </div>
                                  <div className="h-1 bg-gray-800 w-full">
                                      <div className="h-full bg-white" style={{ width: `${(skill.level/5)*100}%`}}></div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Summary Box */}
                  <div className="col-span-1 bg-[#BEF754] p-6 text-black">
                      <h2 className="text-xl font-bold mb-4">Profile</h2>
                      <p className="text-sm font-medium leading-relaxed opacity-90">{data.summary}</p>
                  </div>

                   {/* Education Box */}
                   <div className="col-span-3 bg-white p-6 flex gap-8 items-center border-t-4 border-black">
                      <h2 className="text-xl font-bold mr-8">Education</h2>
                      {data.education.map(edu => (
                          <div key={edu.id} className="text-sm">
                              <span className="font-bold">{edu.school}</span> • {edu.degree} <span className="text-gray-500">({edu.year})</span>
                          </div>
                      ))}
                   </div>
              </div>
          </div>
      );
  }

  // --- TEMPLATE 7: SWISS (HELVETICA) ---
  if (data.templateId === TemplateId.SWISS) {
      return (
          <div id={id} style={containerStyle} className="bg-[#f5f5f5] text-black font-sans shadow-lg mx-auto p-12 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-32 h-full bg-[#FF0000] z-0"></div>
               
               <div className="relative z-10 flex h-full">
                   <div className="w-20 pt-12">
                       <h1 className="text-6xl font-black text-white transform -rotate-90 origin-bottom-left whitespace-nowrap absolute bottom-20 left-20">{data.fullName.toUpperCase()}</h1>
                   </div>

                   <div className="flex-1 pl-16 pt-8">
                        <header className="mb-16">
                            <h2 className="text-4xl font-bold mb-2">{data.title}</h2>
                            <div className="flex gap-6 text-sm font-bold text-gray-500">
                                <span>{data.email}</span>
                                <span>/</span>
                                <span>{data.location}</span>
                                <span>/</span>
                                <span>{data.phone}</span>
                            </div>
                        </header>

                        <div className="grid grid-cols-12 gap-12">
                            <div className="col-span-8">
                                <section className="mb-16">
                                    <h3 className="text-sm font-black uppercase mb-6 tracking-widest text-[#FF0000]">About</h3>
                                    <p className="text-xl font-medium leading-relaxed">{data.summary}</p>
                                </section>

                                <section>
                                    <h3 className="text-sm font-black uppercase mb-8 tracking-widest text-[#FF0000]">Experience</h3>
                                    <div className="space-y-12">
                                        {data.experience.map(exp => (
                                            <div key={exp.id}>
                                                <h4 className="text-2xl font-bold mb-1">{exp.role}</h4>
                                                <div className="text-lg mb-4">{exp.company}, {exp.startDate} - {exp.endDate}</div>
                                                <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="col-span-4 space-y-12">
                                <section>
                                    <h3 className="text-sm font-black uppercase mb-6 tracking-widest text-[#FF0000]">Skills</h3>
                                    <ul className="text-lg font-bold leading-loose">
                                        {data.skills.map(skill => (
                                            <li key={skill.id}>{skill.name}</li>
                                        ))}
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-sm font-black uppercase mb-6 tracking-widest text-[#FF0000]">Education</h3>
                                    {data.education.map(edu => (
                                        <div key={edu.id} className="mb-4">
                                            <div className="font-bold text-lg">{edu.school}</div>
                                            <div>{edu.degree}</div>
                                            <div className="text-gray-500">{edu.year}</div>
                                        </div>
                                    ))}
                                </section>
                            </div>
                        </div>
                   </div>
               </div>
          </div>
      );
  }

  // Fallback / Minimal Template
  if (data.templateId === TemplateId.MINIMAL) {
    return (
      <div id={id} style={containerStyle} className="bg-white text-black p-10 font-sans shadow-lg mx-auto border-t-8 border-[#BEF754]">
        <header className="mb-8 flex justify-between items-end border-b-2 border-gray-100 pb-4">
          <div>
            <h1 className="text-4xl font-bold mb-1 tracking-tight">{data.fullName}</h1>
            <p className="text-lg text-gray-600 font-medium">{data.title}</p>
          </div>
          <div className="text-right text-sm text-gray-500 space-y-1">
             <p>{data.email}</p>
             <p>{data.phone}</p>
             <p>{data.location}</p>
          </div>
        </header>

        <section className="mb-8">
          <h3 className="text-xs font-bold tracking-widest text-[#0000FF] uppercase mb-3 border-b border-[#0000FF] pb-1">Profile</h3>
          <p className="text-sm text-gray-800 leading-relaxed">{data.summary}</p>
        </section>

        <section className="mb-8">
          <h3 className="text-xs font-bold tracking-widest text-[#0000FF] uppercase mb-4 border-b border-[#0000FF] pb-1">Experience</h3>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between mb-1">
                  <h4 className="font-bold text-gray-900">{exp.role}</h4>
                  <span className="text-sm text-gray-500 font-mono">{exp.startDate} – {exp.endDate}</span>
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-2">{exp.company}</p>
                <p className="text-sm text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-8">
          <section>
            <h3 className="text-xs font-bold tracking-widest text-[#0000FF] uppercase mb-4 border-b border-[#0000FF] pb-1">Education</h3>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h4 className="font-bold text-sm">{edu.school}</h4>
                <p className="text-sm text-gray-600">{edu.degree}</p>
                <p className="text-xs text-gray-400">{edu.year}</p>
              </div>
            ))}
          </section>
          <section>
            <h3 className="text-xs font-bold tracking-widest text-[#0000FF] uppercase mb-4 border-b border-[#0000FF] pb-1">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span key={skill.id} className="px-2 py-1 bg-gray-100 text-xs font-semibold rounded">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Bold Template (Executive Pop) - Fallback for others
  return (
    <div id={id} style={containerStyle} className="bg-white text-black shadow-lg mx-auto flex flex-col h-full font-['Space_Grotesk']">
       <div className="bg-[#0000FF] text-white p-10 flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
             <h1 className="text-5xl font-black mb-1">{data.fullName}</h1>
             <p className="text-2xl opacity-90">{data.title}</p>
          </div>
          <div className="text-right text-sm font-medium relative z-10 opacity-90 space-y-1">
             <div className="flex items-center justify-end gap-2"><Mail size={14}/> {data.email}</div>
             <div className="flex items-center justify-end gap-2"><Phone size={14}/> {data.phone}</div>
             <div className="flex items-center justify-end gap-2"><MapPin size={14}/> {data.location}</div>
          </div>
          <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-[#FFBF00] rounded-full opacity-50"></div>
       </div>

       <div className="p-10 flex-1 grid grid-cols-3 gap-10">
          <div className="col-span-1 space-y-8">
             <section>
                <h3 className="text-xl font-black text-[#0000FF] mb-4 uppercase border-b-2 border-[#FFBF00] pb-1">Education</h3>
                {data.education.map((edu) => (
                   <div key={edu.id} className="mb-4">
                      <div className="font-bold">{edu.school}</div>
                      <div className="text-sm">{edu.degree}</div>
                      <div className="text-xs text-gray-500">{edu.year}</div>
                   </div>
                ))}
             </section>
             <section>
                <h3 className="text-xl font-black text-[#0000FF] mb-4 uppercase border-b-2 border-[#FFBF00] pb-1">Skills</h3>
                <div className="space-y-2">
                   {data.skills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between">
                         <span className="font-medium text-sm">{skill.name}</span>
                         <div className="flex gap-1">
                            {[1,2,3,4,5].map(v => (
                               <div key={v} className={`w-2 h-2 rounded-full ${v <= skill.level ? 'bg-[#FFBF00]' : 'bg-gray-200'}`}></div>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>
             </section>
             <section>
                 <h3 className="text-xl font-black text-[#0000FF] mb-4 uppercase border-b-2 border-[#FFBF00] pb-1">Contact</h3>
                 <div className="text-sm space-y-2 break-all">
                    {data.website && <p className="flex items-center gap-2"><Globe size={14}/> {data.website}</p>}
                 </div>
             </section>
          </div>

          <div className="col-span-2 space-y-8">
             <section>
                <h3 className="text-xl font-black text-[#0000FF] mb-4 uppercase border-b-2 border-[#FFBF00] pb-1">Profile</h3>
                <p className="leading-relaxed text-gray-800">{data.summary}</p>
             </section>
             <section>
                <h3 className="text-xl font-black text-[#0000FF] mb-4 uppercase border-b-2 border-[#FFBF00] pb-1">Work Experience</h3>
                <div className="space-y-6">
                   {data.experience.map((exp) => (
                      <div key={exp.id}>
                         <div className="flex justify-between items-baseline mb-1">
                            <h4 className="text-lg font-bold">{exp.role}</h4>
                            <span className="text-sm font-bold text-[#FFBF00]">{exp.startDate} - {exp.endDate}</span>
                         </div>
                         <div className="text-[#0000FF] font-bold text-sm mb-2">{exp.company}</div>
                         <p className="text-sm text-gray-700">{exp.description}</p>
                      </div>
                   ))}
                </div>
             </section>
          </div>
       </div>
    </div>
  );
};

export default ResumePreview;