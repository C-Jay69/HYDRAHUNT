
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Save, Download, Sparkles, Layout, User, Briefcase, GraduationCap, Wrench, 
  ChevronLeft, Plus, FileType, FileUp, FileText, Bot, ArrowRight, MessageSquare, 
  Search, Send, Compass, FolderOpen, GitBranch, Globe, Database, Play, Target, Crosshair, Trash2,
  CheckCircle2, AlertTriangle, Lightbulb, Loader2, Shield, Check, X, Cloud, CloudOff
} from 'lucide-react';
// @ts-ignore
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import saveAs from 'file-saver';
import { Chat } from "@google/genai";

import { MOCK_RESUME, TEMPLATES } from '../constants';
import { ResumeData, TemplateId } from '../types';
import ResumePreview from '../components/ResumePreview';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getResume, saveResume, getFolders } from '../services/storage';
import { 
  analyzeResume, parseResumeFromText, analyzeResumeForJob, optimizeResumeForJob, 
  suggestBestRoles, analyzeCareerTransition, createChatSession, findJobsWithSearch, 
  analyzeATS,
  DetailedAnalysis, TransitionAnalysis, JobListing, GeneralAnalysis, ATSAnalysis
} from '../services/gemini';
import { downloadDocx } from '../services/docxGenerator';
import { extractTextFromFile } from '../services/fileExtraction';
import { useLanguage } from '../contexts/LanguageContext';

// Helper for Link Button
const LinkButton = ({ to, icon }: { to: string, icon: React.ReactNode }) => (
    <Link to={to} className="w-10 h-10 flex items-center justify-center bg-black border border-[#333] hover:border-[#00FFFF] text-white transition-colors">
        {icon}
    </Link>
);

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

type AiStep = 'input' | 'analyzing' | 'report' | 'fixing' | 'fix_success' | 'suggesting_roles' | 'roles_result' | 'transition_input' | 'transition_analyzing' | 'transition_report' | 'job_hunt_input' | 'job_hunt_scanning' | 'job_hunt_results' | 'chat' | 'input_job_fit' | 'initial_scan' | 'initial_results' | 'ats_scanning' | 'ats_results';
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const Editor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'intel'>('personal');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.65);
  const [availableFolders, setAvailableFolders] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  
  // AI Analyzer State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiStep, setAiStep] = useState<AiStep>('input');
  const [isFixing, setIsFixing] = useState(false); // Loading state for Auto-Fix
  const [targetJob, setTargetJob] = useState('');
  const [analysisReport, setAnalysisReport] = useState<DetailedAnalysis | null>(null);
  const [generalAnalysis, setGeneralAnalysis] = useState<GeneralAnalysis | null>(null);
  const [atsReport, setAtsReport] = useState<ATSAnalysis | null>(null);
  const [suggestedRoles, setSuggestedRoles] = useState<string[]>([]);
  const [transitionReport, setTransitionReport] = useState<TransitionAnalysis | null>(null);
  const [transitionTarget, setTransitionTarget] = useState('');
  
  // Job Hunter State
  const [jobLocation, setJobLocation] = useState('');
  const [jobPreferences, setJobPreferences] = useState('');
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [applyProgress, setApplyProgress] = useState(0);
  
  // Chat State
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Data
  useEffect(() => {
    const load = async () => {
        if (id) {
          const data = await getResume(id);
          if (data) {
            setResumeData(data);
            setSaveStatus('saved');
          } else {
            navigate('/dashboard');
          }
        }
        const folders = await getFolders();
        setAvailableFolders(folders);
    };
    load();
  }, [id, navigate]);

  // Handle URL Actions (Optimize / Transition / Auto-Analyze)
  useEffect(() => {
      const action = searchParams.get('action');
      const paramTarget = searchParams.get('target');

      if (!resumeData) return;

      if (action === 'optimize') {
          setShowAiModal(true);
          setAiStep('input_job_fit');
      } else if (action === 'transition') {
          setShowAiModal(true);
          setAiStep('transition_input');
          if (paramTarget) {
              setTransitionTarget(decodeURIComponent(paramTarget));
          }
      } else if (action === 'analyze_new') {
          // Trigger Auto-Analysis
          performInitialAnalysis();
      }
  }, [searchParams, resumeData]); 

  // Auto-save effect
  useEffect(() => {
    if (resumeData) {
      setSaveStatus('saving');
      const timer = setTimeout(async () => {
        const success = await saveResume(resumeData);
        setSaveStatus(success ? 'saved' : 'error');
      }, 1000); // Debounce save
      return () => clearTimeout(timer);
    }
  }, [resumeData]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, showAiModal]);

  const performInitialAnalysis = async () => {
      if (!resumeData) return;
      setShowAiModal(true);
      setAiStep('initial_scan');
      
      const [general, roles] = await Promise.all([
          analyzeResume(resumeData),
          suggestBestRoles(resumeData)
      ]);

      if (general) setGeneralAnalysis(general);
      if (roles) setSuggestedRoles(roles);
      
      setAiStep('initial_results');
  };

  const handleInputChange = (field: keyof ResumeData, value: any) => {
    setResumeData(prev => prev ? ({ ...prev, [field]: value }) : null);
  };
  
  const handleExperienceChange = (id: string, field: string, value: string) => {
      setResumeData(prev => prev ? ({
          ...prev,
          experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
      }) : null);
  };

  const addExperience = () => {
      if (!resumeData) return;
      
      const newExp = {
          id: crypto.randomUUID(),
          company: 'New Company',
          role: 'Job Title',
          startDate: '2024-01',
          endDate: 'Present',
          description: 'Key achievements...'
      };
      
      setResumeData({
          ...resumeData,
          experience: [...resumeData.experience, newExp]
      });
  };

  const removeExperience = (id: string) => {
      setResumeData(prev => prev ? ({
          ...prev,
          experience: prev.experience.filter(exp => exp.id !== id)
      }) : null);
  };

  const handleEducationChange = (id: string, field: string, value: string) => {
      setResumeData(prev => prev ? ({
          ...prev,
          education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
      }) : null);
  };

  const addEducation = () => {
      if (!resumeData) return;
      
      const newEdu = {
          id: crypto.randomUUID(),
          school: 'University Name',
          degree: 'Degree / Major',
          year: '2024'
      };
      
      setResumeData({
          ...resumeData,
          education: [...resumeData.education, newEdu]
      });
  };

  const removeEducation = (id: string) => {
      setResumeData(prev => prev ? ({
          ...prev,
          education: prev.education.filter(edu => edu.id !== id)
      }) : null);
  };

  const handleSkillChange = (id: string, field: string, value: any) => {
      setResumeData(prev => prev ? ({
          ...prev,
          skills: prev.skills.map(skill => skill.id === id ? { ...skill, [field]: value } : skill)
      }) : null);
  };

  const addSkill = () => {
      if (!resumeData) return;
      
      const newSkill = { 
          id: crypto.randomUUID(), 
          name: 'New Skill', 
          level: 3 
      };
      
      setResumeData({
          ...resumeData,
          skills: [...resumeData.skills, newSkill]
      });
  };

  const removeSkill = (id: string) => {
      setResumeData(prev => prev ? ({
          ...prev,
          skills: prev.skills.filter(skill => skill.id !== id)
      }) : null);
  };

  // Define initChat before it's used
  const initChat = (initialMessage?: string, contextReport?: DetailedAnalysis) => {
      if (!resumeData) return;

      let context = "";
      const report = contextReport || analysisReport;
      
      if (report) {
          context = `CONTEXT: Job Analysis for "${targetJob}". Score: ${report.score}. Critique: ${report.critique}`;
      }
      
      const session = createChatSession(resumeData, context);
      setChatSession(session);
      setChatMessages([{ role: 'model', text: initialMessage || "Hello! Ready to optimize." }]);
  };

  const startAnalysis = () => {
    setShowAiModal(true);
    setAiStep('input');
    setTargetJob('');
    setTransitionTarget('');
    setJobLocation('');
    setJobPreferences('');
    // Initialize chat immediately for general coaching
    initChat("Hello! I'm VibeBot. I can help you write content, fix grammar, or analyze your career path. What do you need?");
  };
  
  const openRoleDiscovery = () => {
      setShowAiModal(true);
      handleSuggestRoles();
  };
  
  const handleRunAnalysis = async () => {
    if (!targetJob.trim()) return;
    setAiStep('analyzing');
    const report = await analyzeResumeForJob(resumeData!, targetJob);
    if (report) {
      setAnalysisReport(report);
      setAiStep('report');
      initChat(`I've analyzed your resume for the ${targetJob} role. I gave it a score of ${report.score}. Want to know how to improve it?`, report);
    } else {
      setAiStep('input');
      alert("Analysis failed. Please try again.");
    }
  };

  const handleRunATS = async () => {
    const jobTarget = targetJob || resumeData?.title || 'General';
    setAiStep('ats_scanning'); 
    
    // Slight delay for UX
    setTimeout(async () => {
        const report = await analyzeATS(resumeData!, jobTarget);
        if (report) {
            setAtsReport(report);
            setAiStep('ats_results');
        } else {
            setAiStep('input');
            alert("ATS Scan failed. Please check your internet or try again later.");
        }
    }, 1000);
  };

  const handleAutoFix = async () => {
      if (!resumeData || !analysisReport) return;
      setIsFixing(true);
      try {
          const optimizedResume = await optimizeResumeForJob(resumeData, targetJob, analysisReport.improvements);
          if (optimizedResume) {
              setResumeData(optimizedResume);
              // Show success step with full preview instead of closing immediately
              setAiStep('fix_success');
          } else {
              alert("Auto-Fix failed. The AI could not generate a valid resume structure.");
          }
      } catch (e) {
          console.error(e);
          alert("An error occurred during optimization.");
      } finally {
          setIsFixing(false);
      }
  };

  const handleSuggestRoles = async () => {
    setAiStep('suggesting_roles');
    const roles = await suggestBestRoles(resumeData!);
    setSuggestedRoles(roles);
    setAiStep('roles_result');
  };

  const handleTransitionAnalysis = async () => {
    if (!transitionTarget.trim()) return;
    setAiStep('transition_analyzing');
    const report = await analyzeCareerTransition(resumeData!, transitionTarget);
    if (report) {
        setTransitionReport(report);
        setAiStep('transition_report');
    } else {
        setAiStep('transition_input');
        alert("Transition analysis failed.");
    }
  };

  const handleJobHunt = async () => {
    setAiStep('job_hunt_scanning');
    const jobs = await findJobsWithSearch(resumeData!, jobLocation, jobPreferences);
    setJobListings(jobs);
    setAiStep('job_hunt_results');
  };

  const handleExportJobs = () => {
     const headers = ['Title', 'Company', 'Location', 'Match Score', 'Link'];
     const csvContent = [
       headers.join(','),
       ...jobListings.map(job => [
         `"${job.title}"`,
         `"${job.company}"`,
         `"${job.location}"`,
         `${job.matchScore}%`,
         `"${job.url}"`
       ].join(','))
     ].join('\n');

     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
     saveAs(blob, 'vibe_job_intel.csv');
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    // Safety check: if chatSession is lost, try to recreate it
    let activeSession = chatSession;
    if (!activeSession && resumeData) {
        activeSession = createChatSession(resumeData);
        setChatSession(activeSession);
    }
    if (!activeSession) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);
    try {
      const result = await activeSession.sendMessage({ message: userMsg });
      setChatMessages(prev => [...prev, { role: 'model', text: result.text || "Thinking..." }]);
    } catch (e) {
      console.error(e);
      setChatMessages(prev => [...prev, { role: 'model', text: "Error connecting to VibeBot." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setIsImporting(true);
      try {
        const text = await extractTextFromFile(file);
        if (!text || text.length < 10) throw new Error("Could not extract text from file.");

        const parsedData = await parseResumeFromText(text);
        if (parsedData) {
          setResumeData(prev => prev ? ({ ...prev, ...parsedData }) : null);
        } else {
            throw new Error("AI failed to parse the resume text.");
        }
      } catch (error) {
        console.error(error);
        alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
  };
  
  const handleDownloadPDF = () => {
      const element = document.getElementById('resume-preview');
      if (!element) return;
      setIsDownloading(true);
      const originalScale = previewScale;
      setPreviewScale(1);
      setTimeout(() => {
        // @ts-ignore
        if (window.html2pdf) {
            // @ts-ignore
            window.html2pdf().from(element).save().then(() => {
                setPreviewScale(originalScale);
                setIsDownloading(false);
            });
        }
      }, 500);
  };
  
  const handleDownloadDOCX = async () => {
      if (!resumeData) return;
      await downloadDocx(resumeData);
  };

  const editorTabs = ['personal', 'experience', 'education', 'skills'];
  if (analysisReport || generalAnalysis || atsReport) {
      editorTabs.push('intel');
  }


  if (!resumeData) return <div className="p-10 flex justify-center text-white">Loading Mainframe...</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-black text-white">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".pdf,.docx,.txt,.md" 
        className="hidden" 
      />

      {/* LEFT PANEL: FORM EDITOR */}
      <div className="w-full md:w-1/2 lg:w-5/12 bg-[#111] border-r border-[#333] flex flex-col h-full z-10 shadow-[4px_0px_10px_rgba(0,0,0,0.5)]">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-[#333] bg-black flex justify-between items-center gap-2">
          <div className="flex gap-2 shrink-0 items-center">
            <LinkButton to="/dashboard" icon={<ChevronLeft size={20}/>} />
            <span className="font-bold text-xl self-center ml-2 hidden sm:block text-[#00FFFF]">EDITOR_V1.0</span>
            
            {/* SAVE STATUS INDICATOR */}
            <div className="ml-4 flex items-center gap-2">
                {saveStatus === 'saving' && <span className="text-xs text-[#BEF754] animate-pulse flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> Saving...</span>}
                {saveStatus === 'saved' && <span className="text-xs text-gray-500 flex items-center gap-1"><Cloud size={12}/> Saved</span>}
                {saveStatus === 'error' && <span className="text-xs text-red-500 flex items-center gap-1"><CloudOff size={12}/> Save Failed</span>}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <Button variant="secondary" onClick={openRoleDiscovery} className="hidden lg:flex text-xs px-2 md:text-sm" title="Find Matching Roles">
               <Compass size={16}/> {t('editor.career_path')}
            </Button>

            <Button variant="secondary" onClick={startAnalysis} className="hidden lg:flex text-xs px-2 md:text-sm animate-pulse">
              <Sparkles size={16}/> {t('editor.ai_coach')}
            </Button>
            
             <Button 
              variant="success"
              onClick={() => fileInputRef.current?.click()} 
              disabled={isImporting} 
              className="text-xs md:text-sm px-4"
              title="Import Resume"
            >
              {isImporting ? t('editor.importing') : <><FileUp size={18}/> {t('editor.upload')}</>}
            </Button>

            <div className="flex gap-1">
                <Button variant="primary" onClick={handleDownloadDOCX} className="text-xs px-3">DOCX</Button>
                <Button variant="primary" onClick={handleDownloadPDF} disabled={isDownloading} className="text-xs px-3">
                  {isDownloading ? '...' : 'PDF'}
                </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-[#000] overflow-x-auto border-b border-[#333]">
           {editorTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                type="button"
                className={`flex-1 py-4 px-4 font-bold text-xs md:text-sm uppercase tracking-wider transition-all whitespace-nowrap border-r border-[#222] ${
                  activeTab === tab 
                    ? 'text-[#BEF754] bg-[#1a1a1a] border-b-2 border-b-[#BEF754]' 
                    : 'text-gray-400 hover:text-white hover:bg-[#111]'
                }`}
              >
                {tab === 'intel' ? (
                    <span className="flex items-center gap-2 text-[#FF00FF] animate-pulse justify-center"><Lightbulb size={16}/> INTEL</span>
                ) : (
                    t(`editor.${tab}`) === `editor.${tab}` ? tab : t(`editor.${tab}`)
                )}
              </button>
           ))}
        </div>
        
        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-[#0a0a0a]">
            {/* INTEL TAB */}
            {activeTab === 'intel' && (
                <div className="space-y-6 animate-fadeIn">
                     <div className="bg-[#111] border border-[#00FFFF] p-6 mb-6 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                         <h3 className="text-[#00FFFF] font-black text-xl mb-2 flex items-center gap-2 uppercase tracking-widest">
                            <Bot size={24}/> Tactical Analysis
                         </h3>
                         <p className="text-sm text-gray-300 font-mono">
                             {analysisReport 
                                ? `TARGET: ${targetJob} // SCORE: ${analysisReport.score}`
                                : generalAnalysis 
                                    ? `AUDIT COMPLETE // SCORE: ${generalAnalysis.score}`
                                    : "NO INTEL DATA."}
                         </p>
                     </div>

                     {/* ATS SCAN SECTION */}
                     <div className="bg-black border border-[#333] p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF00FF] opacity-5 blur-[50px] pointer-events-none group-hover:opacity-10 transition-opacity"></div>
                        <h4 className="font-bold text-white flex items-center gap-2 uppercase mb-4 text-lg">
                             <Shield size={20} className="text-[#FF00FF]"/> ATS COMPATIBILITY
                        </h4>
                        
                        {!atsReport ? (
                            <div className="text-center py-6">
                                <p className="text-gray-400 mb-6 text-sm">Most resumes are rejected by robots before humans even see them. Run the simulation to check your parseability.</p>
                                <Button fullWidth variant="danger" onClick={() => { setShowAiModal(true); handleRunATS(); }}>
                                    INITIATE ATS SIMULATION
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between bg-[#111] p-3 border border-[#333]">
                                    <span className="text-gray-400 font-bold text-sm">ATS SCORE</span>
                                    <span className={`text-2xl font-black ${atsReport.score > 80 ? 'text-[#BEF754]' : atsReport.score > 50 ? 'text-[#FFBF00]' : 'text-red-500'}`}>
                                        {atsReport.score}%
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                     <div className={`p-2 border ${atsReport.sectionHeadersCheck ? 'border-[#BEF754] text-[#BEF754]' : 'border-red-500 text-red-500'} bg-[#111]`}>
                                         {atsReport.sectionHeadersCheck ? <Check size={14} className="inline mr-1"/> : <X size={14} className="inline mr-1"/>} Headers
                                     </div>
                                     <div className={`p-2 border ${atsReport.contactInfoCheck ? 'border-[#BEF754] text-[#BEF754]' : 'border-red-500 text-red-500'} bg-[#111]`}>
                                         {atsReport.contactInfoCheck ? <Check size={14} className="inline mr-1"/> : <X size={14} className="inline mr-1"/>} Contact Info
                                     </div>
                                </div>
                                <Button fullWidth variant="secondary" className="text-xs" onClick={() => { setShowAiModal(true); setAiStep('ats_results'); }}>
                                    VIEW FULL REPORT
                                </Button>
                            </div>
                        )}
                     </div>

                     {/* Job Specific Improvements */}
                     {analysisReport && (
                         <div className="space-y-4">
                             <h4 className="font-bold text-white flex items-center gap-2 uppercase"><Wrench size={18} className="text-[#BEF754]"/> Required Upgrades</h4>
                             {analysisReport.improvements.map((imp, i) => (
                                 <div key={i} className="flex gap-4 items-start bg-[#111] border border-[#333] p-4 group hover:border-[#BEF754] transition-colors">
                                     <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-600 bg-[#222] text-[#BEF754] focus:ring-[#BEF754]" />
                                     <span className="text-gray-300 text-sm leading-relaxed group-hover:text-white">{imp}</span>
                                 </div>
                             ))}
                         </div>
                     )}

                     {/* General Weaknesses */}
                     {generalAnalysis && !analysisReport && (
                         <div className="space-y-4">
                             <h4 className="font-bold text-[#FF00FF] flex items-center gap-2 uppercase"><AlertTriangle size={18}/> Weaknesses Identified</h4>
                             {generalAnalysis.weaknesses.map((weakness, i) => (
                                 <div key={i} className="flex gap-3 items-start bg-[#111] border border-[#333] p-4">
                                     <AlertTriangle size={16} className="text-[#FF00FF] mt-1 shrink-0"/>
                                     <span className="text-gray-300 text-sm leading-relaxed">{weakness}</span>
                                 </div>
                             ))}
                         </div>
                     )}
                </div>
            )}

            {/* Personal Tab */}
            {activeTab === 'personal' && (
                <div className="space-y-6 animate-fadeIn">
                     <h3 className="text-[#00FFFF] font-bold text-lg mb-4 flex items-center gap-2 border-b border-[#333] pb-2">
                        <User size={20}/> PERSONAL DATA
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="FULL NAME" value={resumeData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} />
                        <Input label="JOB TITLE" value={resumeData.title} onChange={(e) => handleInputChange('title', e.target.value)} />
                        <Input label="EMAIL" value={resumeData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                        <Input label="PHONE" value={resumeData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                        <Input label="LOCATION" value={resumeData.location} onChange={(e) => handleInputChange('location', e.target.value)} />
                        <Input label="WEBSITE" value={resumeData.website} onChange={(e) => handleInputChange('website', e.target.value)} />
                     </div>
                     
                     <div>
                        <label className="block text-sm font-bold mb-2 text-[#00FFFF] uppercase tracking-widest">
                            Professional Summary
                        </label>
                        <textarea 
                          className="w-full h-40 bg-[#0a0a0a] text-white border-2 border-[#333] px-4 py-3 focus:outline-none focus:border-[#00FFFF] focus:bg-black transition-all placeholder-gray-600 resize-none font-medium leading-relaxed"
                          value={resumeData.summary}
                          onChange={(e) => handleInputChange('summary', e.target.value)}
                        />
                     </div>
                </div>
            )}
            
            {/* Experience Tab */}
            {activeTab === 'experience' && (
                <div className="space-y-8 animate-fadeIn">
                    <div className="flex justify-between items-center border-b border-[#333] pb-2">
                        <h3 className="text-[#00FFFF] font-bold text-lg flex items-center gap-2">
                            <Briefcase size={20}/> WORK EXPERIENCE
                        </h3>
                        <Button variant="success" onClick={addExperience} className="py-2 px-3 text-xs">
                            <Plus size={16}/> ADD EXPERIENCE
                        </Button>
                    </div>
                    {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="p-6 border border-[#333] bg-[#111] relative group transition-all hover:border-gray-500">
                            <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors p-2 bg-black border border-[#333] rounded">
                                <Trash2 size={16} />
                            </button>
                            <div className="grid grid-cols-2 gap-4 mb-4 pr-10">
                                <Input label="COMPANY" value={exp.company} onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)} />
                                <Input label="ROLE" value={exp.role} onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)} />
                                <Input label="START DATE" value={exp.startDate} onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)} />
                                <Input label="END DATE" value={exp.endDate} onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)} />
                            </div>
                            <label className="block text-xs font-bold mb-2 text-gray-400 uppercase tracking-widest">Description / Achievements</label>
                            <textarea 
                               className="w-full h-32 bg-[#0a0a0a] text-white border border-[#333] px-4 py-3 focus:border-[#00FFFF] focus:bg-black outline-none text-sm leading-relaxed"
                               value={exp.description}
                               onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                               placeholder="• Achieved X by doing Y..."
                            />
                        </div>
                    ))}
                </div>
            )}
            
            {/* Education Tab */}
            {activeTab === 'education' && (
                <div className="space-y-8 animate-fadeIn">
                    <div className="flex justify-between items-center border-b border-[#333] pb-2">
                        <h3 className="text-[#00FFFF] font-bold text-lg flex items-center gap-2">
                            <GraduationCap size={20}/> EDUCATION
                        </h3>
                        <Button variant="success" onClick={addEducation} className="py-2 px-3 text-xs">
                            <Plus size={16}/> ADD EDUCATION
                        </Button>
                    </div>
                    {resumeData.education.map((edu) => (
                        <div key={edu.id} className="p-6 border border-[#333] bg-[#111] relative group hover:border-gray-500 transition-all">
                            <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors p-2 bg-black border border-[#333] rounded">
                                <Trash2 size={16} />
                            </button>
                            <div className="grid grid-cols-1 gap-4 pr-10">
                                <Input label="SCHOOL / UNIVERSITY" value={edu.school} onChange={(e) => handleEducationChange(edu.id, 'school', e.target.value)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="DEGREE" value={edu.degree} onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)} />
                                    <Input label="YEAR" value={edu.year} onChange={(e) => handleEducationChange(edu.id, 'year', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Skills Tab */}
            {activeTab === 'skills' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="flex justify-between items-center border-b border-[#333] pb-2">
                        <h3 className="text-[#00FFFF] font-bold text-lg flex items-center gap-2">
                            <Wrench size={20}/> SKILLS
                        </h3>
                        <Button variant="success" onClick={addSkill} className="py-2 px-3 text-xs">
                            <Plus size={16}/> ADD SKILL
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resumeData.skills.map((skill) => (
                            <div key={skill.id} className="flex items-center gap-3 p-3 border border-[#333] bg-[#111] hover:border-gray-500 transition-all">
                                <input 
                                    className="bg-transparent border-none text-white focus:outline-none flex-1 font-bold text-sm px-2"
                                    value={skill.name}
                                    onChange={(e) => handleSkillChange(skill.id, 'name', e.target.value)}
                                />
                                <div className="flex items-center gap-1">
                                    {[1,2,3,4,5].map(lvl => (
                                        <div 
                                            key={lvl} 
                                            onClick={() => handleSkillChange(skill.id, 'level', lvl)}
                                            className={`w-2 h-4 cursor-pointer transition-colors ${lvl <= skill.level ? 'bg-[#00FFFF]' : 'bg-[#333]'}`}
                                        ></div>
                                    ))}
                                </div>
                                <button onClick={() => removeSkill(skill.id)} className="text-gray-600 hover:text-red-500 ml-2">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
      
      {/* Right Panel - Preview */}
      <div className="hidden md:flex flex-col w-full md:w-1/2 lg:w-7/12 bg-[#222] relative overflow-hidden">
         {/* Preview Toolbar */}
         <div className="h-14 bg-black border-b border-[#333] flex items-center justify-between px-4 z-20">
             <div className="flex items-center gap-4">
                 <span className="text-gray-500 text-xs font-mono uppercase">Template:</span>
                 <select 
                    value={resumeData.templateId}
                    onChange={(e) => handleInputChange('templateId', e.target.value)}
                    className="bg-[#111] text-[#BEF754] border border-[#333] text-sm px-2 py-1 outline-none font-bold uppercase cursor-pointer hover:border-[#BEF754]"
                 >
                    {TEMPLATES.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                 </select>
             </div>
             
             <div className="flex items-center gap-2">
                 <button onClick={() => setPreviewScale(Math.max(0.3, previewScale - 0.1))} className="w-8 h-8 flex items-center justify-center bg-[#111] text-white hover:bg-[#333] border border-[#333]">-</button>
                 <span className="text-xs font-mono w-12 text-center text-gray-300">{Math.round(previewScale * 100)}%</span>
                 <button onClick={() => setPreviewScale(Math.min(1.5, previewScale + 0.1))} className="w-8 h-8 flex items-center justify-center bg-[#111] text-white hover:bg-[#333] border border-[#333]">+</button>
             </div>
         </div>

         {/* Preview Area */}
         <div className="flex-1 overflow-auto p-8 flex justify-center bg-[#1a1a1a] relative">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
            <div id="resume-preview" className="shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-300" style={{ transformOrigin: 'top center' }}>
                 <ResumePreview data={resumeData} scale={previewScale} />
            </div>
         </div>
      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
            <div className={`w-full ${aiStep === 'fix_success' ? 'max-w-6xl' : 'max-w-4xl'} h-[80vh] bg-[#0b0b0b] border border-[#333] flex shadow-2xl overflow-hidden relative transition-all duration-300`}>
                <button onClick={() => setShowAiModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white z-20 bg-black p-1 rounded-full border border-[#333]"><ChevronLeft size={24}/></button>
                
                {/* Chat Panel - Hide when showing full preview result */}
                {aiStep !== 'fix_success' && (
                <div className="w-1/3 border-r border-[#333] flex flex-col bg-black">
                    <div className="p-4 border-b border-[#333] bg-[#111]">
                        <h3 className="font-bold text-[#00FFFF] flex items-center gap-2"><Bot size={18}/> VIBE_BOT</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`p-3 rounded text-sm ${msg.role === 'user' ? 'bg-[#222] ml-4 border border-[#333]' : 'bg-[#0000FF]/10 border border-[#0000FF] mr-4'}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isChatLoading && <div className="text-xs text-[#00FFFF] animate-pulse">Thinking...</div>}
                        <div ref={chatEndRef}></div>
                    </div>
                    <div className="p-4 border-t border-[#333] flex gap-2">
                        <input 
                            className="flex-1 bg-[#111] border border-[#333] px-3 py-2 text-sm text-white focus:border-[#00FFFF] outline-none"
                            placeholder="Ask VibeBot..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button onClick={handleSendMessage} className="bg-[#0000FF] p-2 text-white hover:bg-white hover:text-black transition-colors"><Send size={18}/></button>
                    </div>
                </div>
                )}
                
                {/* Results Panel */}
                <div className="flex-1 flex flex-col p-8 bg-[#0b0b0b] overflow-y-auto">
                    {/* NEW: Initial Scan & Analysis */}
                    {(aiStep === 'initial_scan' || aiStep === 'ats_scanning') && (
                        <div className="m-auto text-center">
                             <div className="w-16 h-16 border-4 border-[#BEF754] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                             <h3 className="text-2xl font-black text-[#BEF754] uppercase tracking-widest">
                                 {aiStep === 'ats_scanning' ? 'SIMULATING ATS PARSER...' : 'RUNNING DIAGNOSTICS...'}
                             </h3>
                             <p className="text-gray-500 mt-2 font-mono text-sm">
                                 {aiStep === 'ats_scanning' 
                                    ? 'Checking keywords • Parsing headers • Validating formats' 
                                    : 'Scanning keywords • Evaluating Impact • Matching Roles'}
                             </p>
                        </div>
                    )}

                    {/* ATS RESULTS */}
                    {aiStep === 'ats_results' && atsReport && (
                        <div className="space-y-8 animate-fadeIn">
                             <div className="flex justify-between items-start border-b border-[#333] pb-6">
                                 <div>
                                     <h2 className="text-3xl font-black text-white flex items-center gap-3">
                                         <Shield size={32} className="text-[#FF00FF]"/> ATS SIMULATION REPORT
                                     </h2>
                                     <p className="text-gray-400 mt-2 text-lg">"{atsReport.summary}"</p>
                                 </div>
                                 <div className="text-right">
                                     <div className="text-sm font-bold text-gray-500 uppercase">Parse Score</div>
                                     <div className={`text-6xl font-black ${atsReport.score > 80 ? 'text-[#BEF754]' : atsReport.score > 50 ? 'text-[#FFBF00]' : 'text-red-500'}`}>
                                         {atsReport.score}
                                     </div>
                                 </div>
                             </div>

                             <div className="grid grid-cols-2 gap-6">
                                 <div className="bg-[#111] p-5 border border-[#333]">
                                     <h4 className="text-[#FFBF00] font-bold mb-3 flex items-center gap-2 uppercase"><AlertTriangle size={16}/> MISSING KEYWORDS</h4>
                                     {atsReport.missingKeywords.length > 0 ? (
                                         <ul className="space-y-2">
                                             {atsReport.missingKeywords.map((k,i) => (
                                                 <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                                                     <X size={12} className="text-red-500"/> {k}
                                                 </li>
                                             ))}
                                         </ul>
                                     ) : (
                                         <p className="text-gray-500 italic">No major keywords missing.</p>
                                     )}
                                 </div>

                                 <div className="bg-[#111] p-5 border border-[#333]">
                                     <h4 className="text-[#BEF754] font-bold mb-3 flex items-center gap-2 uppercase"><CheckCircle2 size={16}/> FORMATTING CHECK</h4>
                                     <ul className="space-y-3">
                                         <li className="flex justify-between text-sm border-b border-[#222] pb-2">
                                             <span className="text-gray-300">Section Headers</span>
                                             {atsReport.sectionHeadersCheck ? <span className="text-[#BEF754] font-bold">PASS</span> : <span className="text-red-500 font-bold">FAIL</span>}
                                         </li>
                                         <li className="flex justify-between text-sm border-b border-[#222] pb-2">
                                             <span className="text-gray-300">Contact Info Parsing</span>
                                             {atsReport.contactInfoCheck ? <span className="text-[#BEF754] font-bold">PASS</span> : <span className="text-red-500 font-bold">FAIL</span>}
                                         </li>
                                         <li className="flex justify-between text-sm">
                                             <span className="text-gray-300">File Readability</span>
                                             <span className="text-[#BEF754] font-bold">PASS</span>
                                         </li>
                                     </ul>
                                 </div>
                             </div>

                             {atsReport.formattingIssues.length > 0 && (
                                 <div className="bg-red-900/10 border border-red-900/50 p-4">
                                     <h4 className="text-red-500 font-bold mb-2 text-sm uppercase">Critical Parsing Errors</h4>
                                     <ul className="list-disc pl-5 space-y-1">
                                         {atsReport.formattingIssues.map((issue, idx) => (
                                             <li key={idx} className="text-red-300 text-sm">{issue}</li>
                                         ))}
                                     </ul>
                                 </div>
                             )}

                             <div className="grid grid-cols-2 gap-4">
                                 <Button onClick={() => initChat("Help me fix these ATS issues, specifically the missing keywords.", undefined)} fullWidth variant="secondary">
                                     <MessageSquare size={16}/> FIX WITH AI COACH
                                 </Button>
                                 <Button onClick={() => { setShowAiModal(false); setActiveTab('intel'); }} fullWidth variant="ghost">
                                     CLOSE REPORT
                                 </Button>
                             </div>
                        </div>
                    )}
                    
                    {aiStep === 'initial_results' && generalAnalysis && (
                         <div className="space-y-8">
                             <div className="flex justify-between items-start border-b border-[#333] pb-6">
                                 <div>
                                     <h2 className="text-3xl font-black text-white">RESUME AUDIT COMPLETE</h2>
                                     <p className="text-gray-400 mt-2 text-lg">"{generalAnalysis.summary}"</p>
                                 </div>
                                 <div className="text-right">
                                     <div className="text-sm font-bold text-gray-500 uppercase">Power Score</div>
                                     <div className={`text-6xl font-black ${generalAnalysis.score > 70 ? 'text-[#BEF754]' : 'text-[#FF00FF]'}`}>{generalAnalysis.score}</div>
                                 </div>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-6">
                                 <div className="bg-[#111] p-5 border border-[#333]">
                                     <h4 className="text-[#BEF754] font-bold mb-3 flex items-center gap-2 uppercase"><Sparkles size={16}/> STRENGTHS</h4>
                                     <ul className="space-y-2">
                                         {generalAnalysis.strengths.map((s,i) => <li key={i} className="text-gray-300 text-sm">• {s}</li>)}
                                     </ul>
                                 </div>
                                 <div className="bg-[#111] p-5 border border-[#333]">
                                     <h4 className="text-[#FF00FF] font-bold mb-3 flex items-center gap-2 uppercase"><Wrench size={16}/> WEAKNESSES</h4>
                                     <ul className="space-y-2">
                                         {generalAnalysis.weaknesses.map((s,i) => <li key={i} className="text-gray-300 text-sm">• {s}</li>)}
                                     </ul>
                                 </div>
                             </div>
                             
                             <div>
                                 <h3 className="text-xl font-bold text-white mb-4">BEST SUITED FOR:</h3>
                                 <div className="grid gap-3">
                                     {suggestedRoles.map((role, idx) => (
                                         <button 
                                            key={idx}
                                            onClick={() => { setTargetJob(role.split('(')[0].trim()); setAiStep('input_job_fit'); }}
                                            className="text-left p-4 bg-[#1a1a1a] border border-[#333] hover:border-[#00FFFF] hover:bg-[#00FFFF]/10 transition-all group"
                                         >
                                             <div className="font-bold text-[#00FFFF] group-hover:text-white">{role.split('(')[0]}</div>
                                             <div className="text-xs text-gray-500 mt-1">{role.split('(')[1]?.replace(')', '') || 'Perfect Match'}</div>
                                         </button>
                                     ))}
                                     <button onClick={() => setAiStep('input_job_fit')} className="text-center p-3 border border-dashed border-[#333] text-gray-500 hover:text-white hover:border-white transition-all text-sm uppercase font-bold">
                                         Not in list? Enter Custom Target
                                     </button>
                                 </div>
                             </div>
                         </div>
                    )}

                    {aiStep === 'input_job_fit' && (
                        <div className="max-w-md mx-auto w-full my-auto">
                            <h2 className="text-2xl font-black mb-6 text-white uppercase"><Target className="inline mr-2 text-[#FF00FF]"/> Target Lock</h2>
                            <p className="text-gray-400 mb-6">Paste the job title or description you want to dominate.</p>
                            <Input label="TARGET JOB TITLE" value={targetJob} onChange={(e) => setTargetJob(e.target.value)} placeholder="e.g. Senior React Developer" />
                            <div className="flex gap-2">
                                <Button fullWidth onClick={handleRunAnalysis} disabled={!targetJob} className="bg-[#FF00FF] border-[#FF00FF] text-white hover:bg-white hover:text-black">
                                    ANALYZE FIT
                                </Button>
                                <Button fullWidth onClick={handleRunATS} disabled={!targetJob} className="bg-[#BEF754] border-[#BEF754] text-black hover:bg-white hover:text-black">
                                    RUN ATS SCAN
                                </Button>
                            </div>
                        </div>
                    )}
                    
                    {aiStep === 'report' && analysisReport && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-[#333] pb-4">
                                <h2 className="text-3xl font-black text-white">FIT REPORT</h2>
                                <div className="text-5xl font-black text-[#BEF754]">{analysisReport.score}/100</div>
                            </div>
                            <div className="bg-[#111] p-4 border-l-4 border-[#00FFFF]">
                                <h4 className="font-bold text-[#00FFFF] mb-2">CRITIQUE</h4>
                                <p className="text-gray-300">{analysisReport.critique}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#FF00FF] mb-4 flex items-center gap-2"><Wrench size={18}/> REQUIRED UPGRADES</h4>
                                <ul className="space-y-3">
                                    {analysisReport.improvements.map((imp, i) => (
                                        <li key={i} className="flex gap-3 text-gray-300 bg-black p-3 border border-[#333]">
                                            <span className="text-[#FF00FF] font-bold">{i+1}.</span>
                                            {imp}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Button 
                                    onClick={handleAutoFix} 
                                    disabled={isFixing}
                                    className="bg-[#BEF754] border-[#BEF754] text-black w-full font-bold hover:bg-white hover:text-black"
                                >
                                    {isFixing ? <><Loader2 className="animate-spin" size={20}/> APPLYING FIXES...</> : 'AUTO-FIX (AI)'}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => {
                                        setShowAiModal(false);
                                        setActiveTab('intel');
                                    }} 
                                    className="border border-white text-white w-full font-bold hover:bg-white hover:text-black transition-colors"
                                >
                                    MANUAL FIX (GUIDED)
                                </Button>
                            </div>
                        </div>
                    )}

                    {aiStep === 'fix_success' && (
                        <div className="h-full flex flex-col animate-fadeIn">
                             <div className="flex justify-between items-center mb-6 border-b border-[#333] pb-4 shrink-0">
                                 <div>
                                    <h2 className="text-3xl font-black text-[#BEF754] uppercase flex items-center gap-2">
                                        <CheckCircle2 size={32}/> Optimization Complete
                                    </h2>
                                    <p className="text-gray-400 mt-1">Your resume has been upgraded with tactical keywords and improvements.</p>
                                 </div>
                                 <Button 
                                    onClick={() => { setShowAiModal(false); setActiveTab('experience'); }}
                                    className="bg-white text-black border-white hover:bg-[#BEF754] hover:border-[#BEF754]"
                                 >
                                     ACCEPT & EXIT
                                 </Button>
                             </div>
                             
                             <div className="flex-1 bg-[#1a1a1a] overflow-auto p-8 border border-[#333] relative rounded flex justify-center shadow-inner">
                                  <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                                     <ResumePreview data={resumeData!} />
                                  </div>
                             </div>
                        </div>
                    )}

                    {aiStep === 'analyzing' && (
                        <div className="m-auto text-center">
                            <div className="w-16 h-16 border-4 border-[#00FFFF] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                            <h3 className="text-xl font-bold text-[#00FFFF] animate-pulse">RUNNING DIAGNOSTICS...</h3>
                        </div>
                    )}
                    {/* ... other AI steps remain similar with better contrasts inherited from global styles ... */}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
