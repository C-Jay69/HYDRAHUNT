'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Check, ArrowRight, Zap, Target, Search, Map, Shield,
  Cpu, Crosshair, TrendingUp, FileText, Database, Terminal,
  Layers, History, PenTool, Briefcase, ChevronDown, ChevronRight,
  Plus, Edit2, Upload, BarChart2, Folder, Trash2, Copy, Download, FileInput,
  X, User, GraduationCap, Wrench, FileType, FileUp, Bot, MessageSquare,
  Compass, Globe, GitBranch, Play, CheckCircle2, AlertTriangle, Lightbulb,
  Cloud, CloudOff, Save, Layout, ArrowLeft
} from 'lucide-react';
import { View, EditorTab, ResumeData, Experience, Education, Skill, User as UserType } from '@/types/hydranhunt';
import { COLORS, MOCK_RESUME } from '@/constants/hydranhunt';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage, Language } from '@/contexts/LanguageContext';

// Landing Page Components
const FeatureCard = ({ icon, title, desc, color, className = '' }: any) => (
  <div className={`bg-[#111] p-8 border-2 ${color} hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] ${className}`}>
    <div className="mb-4">{icon}</div>
    <h3 className="text-2xl font-bold mb-2 font-['Space_Grotesk']">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

const Step = ({ num, title, desc }: any) => (
  <div className="relative p-6 border-l-2 border-[#333] hover:border-[#00FFFF] transition-colors">
    <div className="text-5xl font-black text-[#222] absolute -top-6 -left-4 bg-black px-2">{num}</div>
    <div className="relative z-10 pt-2">
      <h3 className="text-2xl font-bold mb-3 text-[#00FFFF] font-['Space_Grotesk']">{title}</h3>
      <p className="text-gray-400 text-lg leading-relaxed">{desc}</p>
    </div>
  </div>
);

const ListItem = ({ text, color = 'text-[#FF00FF]' }: any) => (
  <li className="flex items-center gap-3 text-lg font-medium text-gray-300">
    <Check className={color} strokeWidth={3} size={20} />
    {text}
  </li>
);

const PricingCard = ({ title, price, desc, features, cta, highlight = false, color = 'border-[#333]', onSubscribe }: any) => (
  <div className={`p-8 border-2 flex flex-col h-full relative ${highlight ? 'bg-[#111] border-[#00FFFF] z-10 shadow-[0_0_30px_rgba(0,255,255,0.1)]' : `bg-black ${color}`}`}>
    {highlight && <div className="absolute top-0 right-0 bg-[#00FFFF] text-black text-xs font-bold px-3 py-1">POPULAR</div>}
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-400 mb-2 font-mono uppercase">{title}</h3>
      <div className="text-4xl font-black mb-2 text-white">{price}</div>
      <div className={`text-sm font-bold ${highlight ? 'text-[#00FFFF]' : 'text-gray-600'}`}>{desc}</div>
    </div>
    <ul className="space-y-4 mb-8 flex-1">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${highlight ? 'bg-[#00FFFF]' : 'bg-gray-600'}`}></div>
          {f}
        </li>
      ))}
    </ul>
    <button
      onClick={onSubscribe}
      className={`block w-full text-center py-3 font-bold border-2 transition-all ${highlight ? 'bg-[#00FFFF] text-black border-[#00FFFF] hover:bg-transparent hover:text-[#00FFFF]' : 'bg-transparent text-white border-white hover:bg-white hover:text-black'}`}
    >
      {cta}
    </button>
  </div>
);

// Dashboard Component
const Dashboard = ({ setCurrentView, setEditorResume }: { setCurrentView: (view: View) => void, setEditorResume: (resume: ResumeData) => void }) => {
  const [resumes, setResumes] = useState<ResumeData[]>([MOCK_RESUME]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ General: true });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      const newResume: ResumeData = {
        ...MOCK_RESUME,
        id: `resume-${Date.now()}`,
        title: `Imported Resume ${resumes.length + 1}`,
      };
      setResumes([...resumes, newResume]);
      setEditorResume(newResume);
      setCurrentView('editor');
    }, 2000);
  };

  const handleCreateResume = () => {
    const newResume: ResumeData = {
      ...MOCK_RESUME,
      id: `resume-${Date.now()}`,
      title: `New Resume ${resumes.length + 1}`,
    };
    setResumes([...resumes, newResume]);
    setEditorResume(newResume);
    setCurrentView('editor');
  };

  const handleSelectResume = (resume: ResumeData) => {
    setEditorResume(resume);
    setCurrentView('editor');
  };

  const groupedResumes = resumes.reduce((acc, resume) => {
    const folder = resume.folder || 'General';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(resume);
    return acc;
  }, {} as Record<string, ResumeData[]>);

  return (
    <div className="flex h-screen bg-black text-[#DCDFD5] overflow-hidden relative">
      {/* LEFT SIDEBAR */}
      <aside className="w-[260px] bg-[#000000] border-r border-[#1a1a1a] p-6 flex flex-col shrink-0 z-20">
        <div className="mb-10">
          <div className="text-xl font-bold text-[#FFBF00] flex items-center gap-2">
            <Shield size={24} className="text-[#FFBF00]" />
            HydraHunt
          </div>
          <div className="text-xs text-gray-500 mt-1 font-mono tracking-wide">JOB HUNTING IS DEAD.</div>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          <button onClick={handleCreateResume} className="py-3 px-4 rounded bg-[#0000FF] text-white font-bold text-left flex items-center gap-3 hover:shadow-[0_0_15px_#0000FF] transition-all group">
            <Zap size={18} className="group-hover:text-[#00FFFF] transition-colors" />
            Unleash Hunt Mode
          </button>

          <button className="py-3 px-4 rounded bg-[#111] hover:bg-[#1a1a1a] text-left flex items-center gap-3 text-gray-300 hover:text-white transition-all border border-transparent hover:border-[#333]">
            <Target size={18} /> Optimize My Strike
          </button>

          <button className="py-3 px-4 rounded bg-[#111] hover:bg-[#1a1a1a] text-left flex items-center gap-3 text-gray-300 hover:text-white transition-all border border-transparent hover:border-[#333]">
            <Crosshair size={18} /> Career Transition
          </button>

          <button className="py-3 px-4 rounded bg-[#111] hover:bg-[#1a1a1a] text-left flex items-center gap-3 text-gray-300 hover:text-white transition-all border border-transparent hover:border-[#333]">
            <FileInput size={18} /> File Converter
          </button>

          <div className="mt-8 border-t border-[#1a1a1a] pt-4">
            <div className="text-xs font-bold text-gray-500 mb-2 uppercase">System Links</div>
            <button onClick={() => setCurrentView('landing')} className="block py-2 text-sm text-gray-400 hover:text-[#00FFFF] w-full text-left">
              Mainframe (Home)
            </button>
            <button onClick={() => setCurrentView('pricing')} className="block py-2 text-sm text-gray-400 hover:text-[#FF00FF] w-full text-left">
              Upgrade Clearance
            </button>
          </div>
        </nav>

        <div className="mt-auto text-xs text-gray-600 font-mono">
          VIBE CODING v2.0 <br/>
          Logged in as: <span className="text-[#00FFFF]">Demo User</span>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* TOP BAR */}
        <header className="h-[64px] border-b border-[#1a1a1a] flex items-center px-8 justify-between bg-black/50 backdrop-blur-sm z-10 shrink-0">
          <div className="text-sm font-mono">
            STATUS: <span className="text-[#BEF754] animate-pulse">HUNT READY</span>
          </div>
          <div className="text-sm text-gray-400 font-mono">
            TARGETS FOUND: <span className="text-[#00FFFF] font-bold text-lg ml-2">{resumes.length * 3 + 12}</span>
          </div>
        </header>

        {/* CORE WORK AREA */}
        <section className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto h-full">

            {/* PRIMARY PANEL */}
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
              {/* UPLOAD ZONE */}
              <div className="bg-[#0b0b0b] rounded-xl p-8 border border-[#1a1a1a] shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FFBF00]"></div>
                <h2 className="text-2xl font-bold mb-2 text-white font-['Space_Grotesk']">Resume Forge</h2>
                <p className="text-sm text-gray-400 mb-6 font-mono">Give me your messy docs. I'll handle the hunt.</p>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#333] rounded-lg p-10 text-center mb-6 hover:border-[#FF00FF] hover:bg-[#FF00FF]/5 transition-all cursor-pointer group-hover:shadow-[0_0_20px_rgba(255,0,255,0.1)]"
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.docx,.txt" />
                  <Upload size={40} className="mx-auto text-[#333] mb-4 group-hover:text-[#FF00FF] transition-colors" />
                  <p className="text-sm mb-2 text-gray-300 font-bold">{isUploading ? 'PARSING DATA...' : 'Drop PDFs, DOCX, or TXT here'}</p>
                  <Button className="mt-4 bg-[#FF00FF] text-white border-[#FF00FF] hover:bg-white hover:text-black">
                    {isUploading ? 'PROCESSING...' : 'UPLOAD CHAOS'}
                  </Button>
                </div>

                <Button className="py-4 bg-[#FFBF00] text-black rounded-lg font-black text-xl border-[#FFBF00] hover:bg-white hover:border-white shadow-[0_0_15px_rgba(255,191,0,0.3)] w-full">
                  OPTIMIZE MY STRIKE
                </Button>
              </div>

              {/* ROLE-BASED RESUME LIST */}
              <div className="bg-[#0b0b0b] rounded-xl border border-[#1a1a1a] flex-1 overflow-hidden flex flex-col min-h-[400px]">
                <div className="p-4 border-b border-[#1a1a1a] flex justify-between items-center bg-black">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Active Weapons (By Role)</h3>
                  <span className="text-xs text-[#00FFFF]">{resumes.length} TOTAL</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-4">
                  {isLoading ? (
                    <div className="text-center py-10 text-gray-500 animate-pulse">SCANNING DATABASE...</div>
                  ) : resumes.length === 0 ? (
                    <div className="text-center py-10 text-gray-600">
                      <div>NO WEAPONS FOUND.</div>
                      <div className="text-xs mt-2 text-gray-700">Initiate forge to create your first role-specific resume.</div>
                    </div>
                  ) : (
                    Object.entries(groupedResumes).map(([folder, items]: [string, ResumeData[]]) => (
                      <div key={folder} className="border border-[#222] rounded overflow-hidden bg-[#111]">
                        <div
                          className="p-3 bg-[#151515] flex justify-between items-center cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                          onClick={() => toggleFolder(folder)}
                        >
                          <div className="flex items-center gap-2">
                            <Folder size={16} className="text-[#BEF754]" />
                            <span className="font-bold text-gray-300">{folder}</span>
                            <span className="text-xs bg-[#222] text-gray-500 px-2 py-0.5 rounded-full">{items.length}</span>
                          </div>
                          {expandedFolders[folder] ? <ChevronDown size={16} className="text-gray-500"/> : <ChevronRight size={16} className="text-gray-500"/>}
                        </div>

                        {expandedFolders[folder] && (
                          <div className="p-2 space-y-1 bg-[#0b0b0b] border-t border-[#222]">
                            {items.map(resume => (
                              <div
                                key={resume.id}
                                onClick={() => handleSelectResume(resume)}
                                className="group relative flex items-center justify-between p-3 rounded hover:bg-[#1a1a1a] border border-transparent hover:border-[#00FFFF]/30 cursor-pointer transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-gray-600 group-hover:text-[#00FFFF]">
                                    <FileText size={18} />
                                  </div>
                                  <div>
                                    <div className="font-bold text-sm text-gray-200 group-hover:text-white">{resume.title}</div>
                                    <div className="text-[10px] text-gray-600">{new Date(resume.updatedAt || Date.now()).toLocaleDateString()}</div>
                                  </div>
                                </div>

                                <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className="p-2 bg-[#222] hover:bg-[#BEF754] text-gray-400 hover:text-black rounded border border-[#333]"
                                    title="Download"
                                  >
                                    <Download size={14} />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className="p-2 bg-[#222] hover:bg-[#00FFFF] text-gray-400 hover:text-black rounded border border-[#333]"
                                    title="Duplicate"
                                  >
                                    <Copy size={14} />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className="p-2 bg-[#222] hover:bg-[#FF00FF] text-gray-400 hover:text-black rounded border border-[#333]"
                                    title="Delete"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* SECONDARY PANEL */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
              {/* HUNT STATS */}
              <div className="bg-[#0b0b0b] rounded-xl p-6 border border-[#1a1a1a]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Strike Analytics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Fit Score</span>
                      <span className="text-[#BEF754] font-bold">78%</span>
                    </div>
                    <Progress value={78} className="bg-[#222] h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Applications Sent</span>
                      <span className="text-[#00FFFF] font-bold">24</span>
                    </div>
                    <Progress value={24} className="bg-[#222] h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Interview Rate</span>
                      <span className="text-[#FF00FF] font-bold">42%</span>
                    </div>
                    <Progress value={42} className="bg-[#222] h-2" />
                  </div>
                </div>
              </div>

              {/* RECENT TARGETS */}
              <div className="bg-[#0b0b0b] rounded-xl p-6 border border-[#1a1a1a] flex-1">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Kill List (Recent Targets)</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {[
                    { title: 'Senior Developer', company: 'TechCorp', status: 'PENDING', score: 85 },
                    { title: 'Full Stack Engineer', company: 'StartupX', status: 'INTERVIEWING', score: 92 },
                    { title: 'Tech Lead', company: 'BigTech Inc', status: 'CONFIRMED', score: 78 },
                  ].map((job, i) => (
                    <div key={i} className="p-3 bg-[#111] rounded border border-[#222] hover:border-[#00FFFF]/30 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-bold text-sm text-gray-200">{job.title}</div>
                        <Badge className={`text-xs ${job.status === 'PENDING' ? 'bg-[#FFBF00]/20 text-[#FFBF00]' : job.status === 'INTERVIEWING' ? 'bg-[#00FFFF]/20 text-[#00FFFF]' : 'bg-[#BEF754]/20 text-[#BEF754]'}`}>
                          {job.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">{job.company}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#222] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${job.score >= 80 ? 'bg-[#BEF754]' : job.score >= 60 ? 'bg-[#FFBF00]' : 'bg-[#FF00FF]'}`}
                            style={{ width: `${job.score}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">{job.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// Resume Editor Component
const ResumeEditor = ({ resume, setCurrentView, setResume }: { resume: ResumeData, setCurrentView: (view: View) => void, setResume: (resume: ResumeData) => void }) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('personal');
  const [previewScale, setPreviewScale] = useState(0.65);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-black text-white">
      {/* EDITOR PANEL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-[#1a1a1a] flex items-center px-6 bg-black/50 backdrop-blur-sm">
          <button onClick={() => setCurrentView('dashboard')} className="p-2 hover:bg-[#111] rounded mr-4">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <Input
              value={resume.title}
              onChange={(e) => setResume({ ...resume, title: e.target.value })}
              className="bg-transparent border-none text-lg font-bold focus-visible:ring-0 px-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="border-[#333] text-gray-300 hover:border-[#00FFFF] hover:text-[#00FFFF]"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              size="sm"
              className="bg-[#FF00FF] text-white hover:bg-white hover:text-black"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </header>

        {/* Tabs and Content */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EditorTab)} className="flex-1 flex flex-col">
          <div className="border-b border-[#1a1a1a] bg-black/50">
            <TabsList className="bg-transparent h-16 px-6 justify-start gap-2">
              <TabsTrigger value="personal" className="data-[state=active]:bg-[#00FFFF]/20 data-[state=active]:text-[#00FFFF]">
                <User className="w-4 h-4 mr-2" /> Personal
              </TabsTrigger>
              <TabsTrigger value="experience" className="data-[state=active]:bg-[#00FFFF]/20 data-[state=active]:text-[#00FFFF]">
                <Briefcase className="w-4 h-4 mr-2" /> Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-[#00FFFF]/20 data-[state=active]:text-[#00FFFF]">
                <GraduationCap className="w-4 h-4 mr-2" /> Education
              </TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-[#00FFFF]/20 data-[state=active]:text-[#00FFFF]">
                <Wrench className="w-4 h-4 mr-2" /> Skills
              </TabsTrigger>
              <TabsTrigger value="intel" className="data-[state=active]:bg-[#FF00FF]/20 data-[state=active]:text-[#FF00FF]">
                <Bot className="w-4 h-4 mr-2" /> AI Intel
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'personal' && (
              <div className="max-w-2xl space-y-4">
                <Card className="bg-[#0b0b0b] border-[#1a1a1a]">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your contact details and professional summary</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Full Name</label>
                      <Input
                        value={resume.fullName}
                        onChange={(e) => setResume({ ...resume, fullName: e.target.value })}
                        className="bg-[#111] border-[#222]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-400">Email</label>
                        <Input
                          value={resume.email}
                          onChange={(e) => setResume({ ...resume, email: e.target.value })}
                          className="bg-[#111] border-[#222]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400">Phone</label>
                        <Input
                          value={resume.phone}
                          onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                          className="bg-[#111] border-[#222]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-400">Location</label>
                        <Input
                          value={resume.location}
                          onChange={(e) => setResume({ ...resume, location: e.target.value })}
                          className="bg-[#111] border-[#222]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400">Website</label>
                        <Input
                          value={resume.website || ''}
                          onChange={(e) => setResume({ ...resume, website: e.target.value })}
                          className="bg-[#111] border-[#222]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">Professional Summary</label>
                      <Textarea
                        value={resume.summary}
                        onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                        className="bg-[#111] border-[#222] min-h-[150px]"
                        placeholder="Write a compelling professional summary..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="max-w-2xl space-y-4">
                <Card className="bg-[#0b0b0b] border-[#1a1a1a]">
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                    <CardDescription>Your professional history and achievements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resume.experience.map((exp, index) => (
                      <div key={exp.id} className="p-4 bg-[#111] rounded-lg border border-[#222] space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="text-sm font-medium text-gray-400">Position {index + 1}</div>
                          <Button variant="ghost" size="sm" className="text-[#FF00FF] hover:text-[#FF00FF] hover:bg-[#FF00FF]/10">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-400">Company</label>
                            <Input
                              value={exp.company}
                              onChange={(e) => {
                                const newExp = [...resume.experience];
                                newExp[index] = { ...exp, company: e.target.value };
                                setResume({ ...resume, experience: newExp });
                              }}
                              className="bg-[#111] border-[#222]"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-400">Role</label>
                            <Input
                              value={exp.role}
                              onChange={(e) => {
                                const newExp = [...resume.experience];
                                newExp[index] = { ...exp, role: e.target.value };
                                setResume({ ...resume, experience: newExp });
                              }}
                              className="bg-[#111] border-[#222]"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-400">Start Date</label>
                            <Input
                              value={exp.startDate}
                              onChange={(e) => {
                                const newExp = [...resume.experience];
                                newExp[index] = { ...exp, startDate: e.target.value };
                                setResume({ ...resume, experience: newExp });
                              }}
                              className="bg-[#111] border-[#222]"
                              placeholder="YYYY-MM"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-400">End Date</label>
                            <Input
                              value={exp.endDate}
                              onChange={(e) => {
                                const newExp = [...resume.experience];
                                newExp[index] = { ...exp, endDate: e.target.value };
                                setResume({ ...resume, experience: newExp });
                              }}
                              className="bg-[#111] border-[#222]"
                              placeholder="Present or YYYY-MM"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-400">Description</label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) => {
                              const newExp = [...resume.experience];
                              newExp[index] = { ...exp, description: e.target.value };
                              setResume({ ...resume, experience: newExp });
                            }}
                            className="bg-[#111] border-[#222] min-h-[100px]"
                          />
                        </div>
                      </div>
                    ))}
                    <Button className="w-full bg-[#00FFFF] text-black hover:bg-white border-0">
                      <Plus className="mr-2 h-4 w-4" /> Add Experience
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="max-w-2xl space-y-4">
                <Card className="bg-[#0b0b0b] border-[#1a1a1a]">
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                    <CardDescription>Your educational background</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resume.education.map((edu, index) => (
                      <div key={edu.id} className="p-4 bg-[#111] rounded-lg border border-[#222] space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="text-sm font-medium text-gray-400">Education {index + 1}</div>
                          <Button variant="ghost" size="sm" className="text-[#FF00FF] hover:text-[#FF00FF] hover:bg-[#FF00FF]/10">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-400">School</label>
                          <Input
                            value={edu.school}
                            onChange={(e) => {
                              const newEdu = [...resume.education];
                              newEdu[index] = { ...edu, school: e.target.value };
                              setResume({ ...resume, education: newEdu });
                            }}
                            className="bg-[#111] border-[#222]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-400">Degree</label>
                            <Input
                              value={edu.degree}
                              onChange={(e) => {
                                const newEdu = [...resume.education];
                                newEdu[index] = { ...edu, degree: e.target.value };
                                setResume({ ...resume, education: newEdu });
                              }}
                              className="bg-[#111] border-[#222]"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-400">Year</label>
                            <Input
                              value={edu.year}
                              onChange={(e) => {
                                const newEdu = [...resume.education];
                                newEdu[index] = { ...edu, year: e.target.value };
                                setResume({ ...resume, education: newEdu });
                              }}
                              className="bg-[#111] border-[#222]"
                              placeholder="YYYY"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full bg-[#00FFFF] text-black hover:bg-white border-0">
                      <Plus className="mr-2 h-4 w-4" /> Add Education
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="max-w-2xl space-y-4">
                <Card className="bg-[#0b0b0b] border-[#1a1a1a]">
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription>Your technical and professional skills</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resume.skills.map((skill, index) => (
                      <div key={skill.id} className="p-4 bg-[#111] rounded-lg border border-[#222] space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="text-sm font-medium text-gray-400">Skill {index + 1}</div>
                          <Button variant="ghost" size="sm" className="text-[#FF00FF] hover:text-[#FF00FF] hover:bg-[#FF00FF]/10">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-400">Skill Name</label>
                          <Input
                            value={skill.name}
                            onChange={(e) => {
                              const newSkills = [...resume.skills];
                              newSkills[index] = { ...skill, name: e.target.value };
                              setResume({ ...resume, skills: newSkills });
                            }}
                            className="bg-[#111] border-[#222]"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-400">Proficiency Level: {skill.level}/5</label>
                          <Slider
                            value={[skill.level]}
                            onValueChange={(v) => {
                              const newSkills = [...resume.skills];
                              newSkills[index] = { ...skill, level: v[0] };
                              setResume({ ...resume, skills: newSkills });
                            }}
                            max={5}
                            min={1}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    ))}
                    <Button className="w-full bg-[#00FFFF] text-black hover:bg-white border-0">
                      <Plus className="mr-2 h-4 w-4" /> Add Skill
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'intel' && (
              <div className="max-w-2xl space-y-4">
                <Card className="bg-[#0b0b0b] border-[#1a1a1a]">
                  <CardHeader>
                    <CardTitle>AI Intelligence</CardTitle>
                    <CardDescription>Analyze your resume with AI power</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-[#0000FF] text-white hover:bg-[#00FFFF] hover:text-black border-0 mb-4">
                      <Bot className="mr-2 h-4 w-4" /> Analyze Resume
                    </Button>

                    <div className="p-4 bg-[#111] rounded-lg border border-[#222]">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="text-[#FFBF00]" size={20} />
                        <div className="font-bold">Quick Insights</div>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="text-[#BEF754] mt-0.5" size={16} />
                          <span>Strong action verbs used in experience descriptions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="text-[#FFBF00] mt-0.5" size={16} />
                          <span>Consider adding more quantitative achievements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="text-[#BEF754] mt-0.5" size={16} />
                          <span>Good balance of technical and soft skills</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 bg-[#111] rounded-lg border border-[#222]">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart2 className="text-[#00FFFF]" size={20} />
                        <div className="font-bold">Lethality Score</div>
                      </div>
                      <div className="text-4xl font-black text-[#00FFFF] mb-2">78/100</div>
                      <Progress value={78} className="bg-[#222] h-2" />
                      <p className="text-sm text-gray-400 mt-2">Your resume is strong but could be optimized for ATS systems.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

// Main App Component
export default function Home() {
  const { t, language, setLanguage } = useLanguage();
  const [currentView, setCurrentView] = useState<View>('landing');
  const [editorResume, setEditorResume] = useState<ResumeData>(MOCK_RESUME);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'zh', name: '简体中文', flag: '🇨🇳' },
  ];

  // Render different views
  if (currentView === 'dashboard') {
    return <Dashboard setCurrentView={setCurrentView} setEditorResume={setEditorResume} />;
  }

  if (currentView === 'editor') {
    return (
      <div className="h-screen flex flex-col bg-black text-white">
        <header className="h-16 border-b border-[#1a1a1a] flex items-center px-6 bg-black/50 backdrop-blur-sm shrink-0">
          <button onClick={() => setCurrentView('dashboard')} className="p-2 hover:bg-[#111] rounded mr-4">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="text-[#FF00FF]" size={24} />
            <span className="text-xl font-bold">HydraHunt</span>
          </div>
        </header>
        <ResumeEditor resume={editorResume} setCurrentView={setCurrentView} setResume={setEditorResume} />
      </div>
    );
  }

  // Landing Page (default view)
  return (
    <div className="bg-black text-white font-sans selection:bg-[#FF00FF] selection:text-white min-h-screen flex flex-col relative">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-50">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="appearance-none bg-[#111] border border-[#333] text-white px-4 py-2 pr-10 rounded-lg cursor-pointer hover:border-[#00FFFF] transition-colors font-mono text-sm"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden border-b border-[#333]">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-[#0000FF] opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-8">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-64 md:w-80 rounded-lg shadow-2xl border border-[#333] bg-gradient-to-br from-[#111] to-black flex items-center justify-center p-8 group-hover:scale-[1.02] transition-transform">
                <div className="text-center">
                  <Shield className="mx-auto mb-4 text-[#FF00FF]" size={64} />
                  <div className="text-4xl font-black">HYDRA</div>
                  <div className="text-2xl font-bold text-[#00FFFF]">HUNT</div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none tracking-tighter uppercase">
            HYDRA<span className="text-[#FF00FF]">HUNT</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF]">
              CAREER WARFARE
            </span>
          </h1>
          <h2 className="text-4xl md:text-5xl font-black mb-8 text-white">AUTOMATE YOUR HUNT</h2>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Transform messy career data into precision-striking resumes. Let multiple AI heads scour, match, and apply to jobs while you sleep.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="group relative px-8 py-5 bg-[#00FFFF] text-black font-black text-xl hover:bg-[#00FFFF]/90 transition-all w-full md:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                START HUNTING <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
              </span>
            </button>
            <button
              onClick={() => setCurrentView('pricing')}
              className="px-8 py-5 border-2 border-[#BEF754] text-[#BEF754] font-bold text-xl hover:bg-[#BEF754]/10 transition-all w-full md:w-auto"
            >
              VIEW PLANS
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-20 text-center tracking-tight">
            TURN CHAOS INTO <span className="text-[#0000FF]">CAREER DOMINANCE</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText size={40} className="text-[#FF00FF]" />}
              title="Killer Resume"
              desc="Transform messy documents into employer-melting resumes that strike hard and land interviews."
              color="border-[#FF00FF]"
            />
            <FeatureCard
              icon={<TrendingUp size={40} className="text-[#BEF754]" />}
              title="Career Analysis"
              desc="Analyze your fit for any role. Know your strengths, weaknesses, and exactly how to pivot."
              color="border-[#BEF754]"
            />
            <FeatureCard
              icon={<Crosshair size={40} className="text-[#00FFFF]" />}
              title="Auto-Hunt"
              desc="Multiple heads scouring, matching, and striking job applications automatically while you sleep."
              color="border-[#00FFFF]"
            />
            <FeatureCard
              icon={<Map size={40} className="text-[#FFBF00]" />}
              title="Transition Maps"
              desc="Plot complete career transitions with skill roadmaps and course recommendations that claim new territory."
              color="border-[#FFBF00]"
              className="md:col-span-2"
            />
            <FeatureCard
              icon={<Database size={40} className="text-[#DCDFD5]" />}
              title="Version Vault"
              desc="Every iteration stored, accessible, and ready to upgrade anytime you need a sharper weapon."
              color="border-[#DCDFD5]"
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-4 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0000FF]/5 to-black pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-20 text-center">HOW HYDRA HUNTS FOR YOU</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Step
              num="01"
              title="Feed the Beast"
              desc="PDFs, TXT files, random notes, bullet dumps — Hydra eats everything. Your messy career history becomes structured intelligence in seconds. No formatting required."
            />
            <Step
              num="02"
              title="Forge Your Weapon"
              desc="A polished, professional, employer-melting resume emerges. Plus deep analysis, weakness identification, improvement recommendations — everything you need to strike harder."
            />
            <Step
              num="03"
              title="Unleash the Hunt"
              desc="Job scouting, matching, applying. Multiple heads tracking multiple targets simultaneously. You just show up for the interviews and collect offers."
            />
          </div>
        </div>
      </section>

      {/* Deep Dive 1: Resume Forge */}
      <section className="py-24 px-4 bg-[#111] border-y border-[#333]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 order-2 md:order-1">
            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
              RESUME FORGE: <br/>
              RAW INFO → <span className="text-[#FF00FF]">WEAPONIZED OUTPUT</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Feed Hydra your scattered career history and watch it transform into a precision-engineered resume that hiring managers can't ignore. Every word optimized. Every bullet point sharpened. Every section strategically positioned to maximize your impact and land you in the interview chair.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-white text-lg mb-2">Intelligent parsing</h4>
                <p className="text-sm text-gray-400">Extracts key achievements, skills, and experience from any format</p>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg mb-2">Industry optimization</h4>
                <p className="text-sm text-gray-400">Tailors language and keywords for your target sector</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-bold text-white text-lg mb-2">ATS-proof formatting</h4>
                <p className="text-sm text-gray-400">Guaranteed to pass automated screening systems</p>
              </div>
            </div>
          </div>
          <div className="flex-1 order-1 md:order-2 h-80 w-full bg-gradient-to-br from-[#FF00FF]/10 to-transparent border border-[#FF00FF]/30 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <FileText size={100} className="text-[#FF00FF] relative z-10 drop-shadow-[0_0_15px_rgba(255,0,255,0.5)]" />
          </div>
        </div>
      </section>

      {/* Deep Dive 2: Strike Analysis */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
              STRIKE ANALYSIS: <br/>
              <span className="text-[#00FFFF]">KNOW YOUR WEAKNESSES BEFORE EMPLOYERS DO</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Hydra evaluates your resume like a ruthless hiring manager and tells you exactly how to hit harder. Get brutal, actionable feedback on gaps, weak points, and missed opportunities. Then watch as Hydra shows you precisely how to transform every weakness into a strength.
            </p>
            <ul className="space-y-4">
              <ListItem text="Gap analysis: Identify missing skills and experience" color="text-[#FF00FF]" />
              <ListItem text="Language audit: Replace weak verbs with power statements" color="text-[#FF00FF]" />
              <ListItem text="Achievement quantification: Add metrics that prove impact" color="text-[#FF00FF]" />
              <ListItem text="Competitive positioning: Stand out in your field" color="text-[#FF00FF]" />
            </ul>
          </div>
          <div className="flex-1 h-80 w-full bg-gradient-to-bl from-[#00FFFF]/10 to-transparent border border-[#00FFFF]/30 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <TrendingUp size={100} className="text-[#00FFFF] relative z-10 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
          </div>
        </div>
      </section>

      {/* Auto-Hunt Engine Banner */}
      <section className="py-20 px-4 bg-[#0a0a0a] border-y border-[#333]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-[#FF00FF]">
            AUTO-HUNT ENGINE: <span className="text-white">YOUR 24/7 JOB-SEEKING MACHINE</span>
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-0 mt-12 bg-[#151515] border border-[#333]">
            <div className="flex-1 p-8 border-r border-[#333] hover:bg-[#1a1a1a] transition-colors">
              <Search className="mx-auto text-[#BEF754] mb-4" size={40}/>
              <h3 className="font-bold text-xl mb-2 text-[#BEF754]">Scours the Web</h3>
              <p className="text-sm text-gray-500">Hydra searches thousands of job boards, company sites, and hidden listings simultaneously</p>
            </div>
            <div className="flex-1 p-8 border-r border-[#333] hover:bg-[#1a1a1a] transition-colors">
              <Target className="mx-auto text-[#BEF754] mb-4" size={40}/>
              <h3 className="font-bold text-xl mb-2 text-[#BEF754]">Matches Skills</h3>
              <p className="text-sm text-gray-500">AI algorithms identify perfect-fit opportunities based on your profile and career goals</p>
            </div>
            <div className="flex-1 p-8 hover:bg-[#1a1a1a] transition-colors">
              <Zap className="mx-auto text-[#BEF754] mb-4" size={40}/>
              <h3 className="font-bold text-xl mb-2 text-[#BEF754]">Strikes Fast</h3>
              <p className="text-sm text-gray-500">When prey is spotted, Hydra strikes automatically with optimized applications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-4">CHOOSE YOUR <span className="text-[#0000FF]">WEAPON</span></h1>
            <p className="text-xl text-gray-400">No contracts. No nonsense. Just results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Free Plan */}
            <PricingCard
              title="SCOUT MODE"
              price="$0"
              desc="For the curious hunters"
              features={[
                '1 Resume Forged',
                'Basic Templates',
                'Resume Forge',
              ]}
              cta="START SCOUTING"
              onSubscribe={() => setCurrentView('dashboard')}
            />

            {/* Pro Plan */}
            <PricingCard
              title="HUNTER MODE"
              price="$29/mo"
              desc="Serious firepower"
              features={[
                'Unlimited Resumes',
                'Full Strike Analysis',
                'AI-Fueled Editing',
                '30 Auto-Strikes/Day',
              ]}
              cta="ACTIVATE HUNTER"
              highlight={true}
              onSubscribe={() => alert('Hunter Mode coming soon!')}
            />

            {/* Enterprise Plan */}
            <PricingCard
              title="HYDRA MODE"
              price="$69/mo"
              desc="For the unstoppable"
              features={[
                'Everything in Hunter',
                'Unlimited Auto-Strikes',
                'Career Territory Mapping',
                'Priority Queue',
              ]}
              cta="UNLEASH HYDRA"
              color="border-[#BEF754]"
              onSubscribe={() => alert('Hydra Mode coming soon!')}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[#0a0a0a] border-t border-[#333] mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="text-[#FF00FF]" size={24} />
            <span className="text-xl font-bold">HydraHunt</span>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Career Warfare AI Platform
          </p>
          <p className="text-gray-600 text-xs font-mono">
            © 2024 HydraHunt. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
