
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Download, 
  Sparkles, 
  Layout, 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  ChevronLeft, 
  Plus,
  FileType,
  FileUp,
  FileText,
  Bot,
  ArrowRight,
  MessageSquare,
  Search,
  Send,
  Compass,
  FolderOpen,
  GitBranch,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Globe,
  Database,
  Play
} from 'lucide-react';
// @ts-ignore
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
// @ts-ignore
import * as FileSaver from 'file-saver';
import { Chat } from "@google/genai";

import { MOCK_RESUME, TEMPLATES } from '../constants';
import { ResumeData, TemplateId } from '../types';
import ResumePreview from '../components/ResumePreview';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getResume, saveResume, getFolders } from '../services/storage';
import { 
  analyzeResume, 
  parseResumeFromText, 
  analyzeResumeForJob, 
  optimizeResumeForJob, 
  suggestBestRoles,
  analyzeCareerTransition,
  createChatSession,
  findJobsWithSearch,
  DetailedAnalysis,
  TransitionAnalysis,
  JobListing
} from '../services/gemini';

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

type AiStep = 
  | 'input' 
  | 'analyzing' 
  | 'report' 
  | 'fixing' 
  | 'suggesting_roles' 
  | 'roles_result' 
  | 'transition_input'
  | 'transition_analyzing'
  | 'transition_report'
  | 'job_hunt_input'
  | 'job_hunt_scanning'
  | 'job_hunt_results'
  | 'chat';

const Editor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.65);
  const [availableFolders, setAvailableFolders] = useState<string[]>([]);
  
  // AI Analyzer State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiStep, setAiStep] = useState<AiStep>('input');
  const [targetJob, setTargetJob] = useState('');
  const [analysisReport, setAnalysisReport] = useState<DetailedAnalysis | null>(null);
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
    if (id) {
      const data = getResume(id);
      if (data) {
        setResumeData(data);
      } else {
        // Fallback or redirect if not found
        navigate('/dashboard');
      }
    }
    setAvailableFolders(getFolders());
  }, [id, navigate]);

  // Auto-save effect
  useEffect(() => {
    if (resumeData) {
      const timer = setTimeout(() => {
        saveResume(resumeData);
      }, 1000); // Debounce save
      return () => clearTimeout(timer);
    }
  }, [resumeData]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, aiStep]);

  if (!resumeData) return <div className="p-10 flex justify-center text-white">Loading Mainframe...</div>;

  const handleInputChange = (field: keyof ResumeData, value: any) => {
    setResumeData(prev => prev ? ({ ...prev, [field]: value }) : null);
  };
  
  const handleExperienceChange = (id: string, field: string, value: string) => {
      setResumeData(prev => prev ? ({
          ...prev,
          experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
      }) : null);
  };

  const startAnalysis = () => {
    setShowAiModal(true);
    setAiStep('input');
    setTargetJob('');
    setTransitionTarget('');
    setJobLocation('');
    setJobPreferences('');
    setAnalysisReport(null);
    setTransitionReport(null);
    setJobListings([]);
    setSuggestedRoles([]);
    setChatSession(null); 
    setChatMessages([]);
  };

  const openRoleDiscovery = () => {
    setShowAiModal(true);
    handleSuggestRoles();
  };

  const handleRunAnalysis = async () => {
    if (!targetJob.trim()) return;
    setAiStep('analyzing');
    const report = await analyzeResumeForJob(resumeData, targetJob);
    if (report) {
      setAnalysisReport(report);
      setAiStep('report');
    } else {
      setAiStep('input');
      alert("Analysis failed. Please try again.");
    }
  };

  const handleSuggestRoles = async () => {
    setAiStep('suggesting_roles');
    const roles = await suggestBestRoles(resumeData);
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
     // @ts-ignore
     FileSaver.saveAs(blob, 'vibe_job_intel.csv');
  };

  const handleAutoApply = (jobIndex: number) => {
     setApplyingJobId(String(jobIndex));
     setApplyProgress(0);
     
     // Simulated apply process
     let progress = 0;
     const interval = setInterval(() => {
         progress += 5;
         setApplyProgress(progress);
         if (progress >= 100) {
             clearInterval(interval);
             setApplyingJobId(null);
             alert(`Application Protocol Complete for ${jobListings[jobIndex].company}. (Simulation Mode)`);
         }
     }, 100);
  };

  const initChat = (initialMessage?: string) => {
    let context = "";
    if (analysisReport) {
        context = `
        CONTEXT: The user recently ran an analysis for the job role: "${targetJob}".
        SCORE: ${analysisReport.score}/100
        CRITIQUE: ${analysisReport.critique}
        SUGGESTED IMPROVEMENTS:
        ${analysisReport.improvements.map((imp, i) => `${i+1}. ${imp}`).join('\n')}
        `;
    } else if (suggestedRoles.length > 0) {
        context = `
        CONTEXT: The user recently asked for role suggestions based on their resume.
        YOU SUGGESTED:
        ${suggestedRoles.join('\n')}
        `;
    } else if (transitionReport) {
        context = `
        CONTEXT: The user is planning a career transition from ${transitionReport.currentRole} to ${transitionReport.targetRole}.
        TRANSFERABLE SKILLS: ${transitionReport.transferableSkills.join(', ')}
        MISSING SKILLS: ${transitionReport.missingSkills.join(', ')}
        RECOMMENDED RESOURCES: ${transitionReport.resources.map(r => r.name).join(', ')}
        `;
    }

    const session = createChatSession(resumeData!, context);
    setChatSession(session);
    setChatMessages([{ role: 'model', text: initialMessage || "Hello! I've analyzed your resume. What would you like to discuss? I can help you rewrite sections or give career advice." }]);
    setAiStep('chat');
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !chatSession) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: userMsg });
      setChatMessages(prev => [...prev, { role: 'model', text: result.text || "I'm having trouble thinking right now." }]);
    } catch (e) {
      console.error(e);
      setChatMessages(prev => [...prev, { role: 'model', text: "Connection error. Please try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleAutoFix = async () => {
    if (!analysisReport || !targetJob) return;
    setAiStep('fixing');
    const optimizedData = await optimizeResumeForJob(resumeData!, targetJob, analysisReport.improvements);
    
    if (optimizedData) {
      setResumeData(prev => prev ? ({
        ...prev,
        title: optimizedData.title || prev.title,
        summary: optimizedData.summary,
        experience: optimizedData.experience.map((exp, i) => ({ ...exp, id: prev.experience[i]?.id || `new-exp-${i}` })),
        skills: optimizedData.skills.map((skill, i) => ({ ...skill, id: prev.skills[i]?.id || `new-skill-${i}` })),
      }) : null);
      setShowAiModal(false);
      alert("Resume optimized! Review the changes.");
    } else {
      setAiStep('report');
      alert("Optimization failed. Please try again.");
    }
  };

  // ... File upload and download functions (kept same as before)
  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      if (file.type === 'application/pdf') {
        reader.onload = async (e) => {
          try {
            const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
            // @ts-ignore
            const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              // @ts-ignore
              const pageText = textContent.items.map(item => item.str).join(' ');
              fullText += pageText + ' ';
            }
            resolve(fullText);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        reader.onload = (e) => {
          // @ts-ignore
          window.mammoth.extractRawText({ arrayBuffer: e.target?.result })
            // @ts-ignore
            .then(result => resolve(result.value))
            .catch(reject);
        };
        reader.readAsArrayBuffer(file);
      } else {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsText(file);
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await extractTextFromFile(file);
      const parsedData = await parseResumeFromText(text);
      if (parsedData) {
        setResumeData(prev => prev ? ({
          ...prev,
          ...parsedData,
          experience: parsedData.experience?.map((exp: any, i: number) => ({
            ...exp,
            id: `imported-exp-${Date.now()}-${i}`
          })) || [],
          education: parsedData.education?.map((edu: any, i: number) => ({
            ...edu,
            id: `imported-edu-${Date.now()}-${i}`
          })) || [],
          skills: parsedData.skills?.map((skill: any, i: number) => ({
            ...skill,
            id: `imported-skill-${Date.now()}-${i}`
          })) || [],
        }) : null);
      } else {
        alert("Could not parse resume data.");
      }
    } catch (error) {
      console.error("Import failed:", error);
      alert("Import failed. Please try a different file.");
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
      const opt = {
        margin: 0,
        filename: `${resumeData!.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // @ts-ignore
      if (window.html2pdf) {
        // @ts-ignore
        window.html2pdf().set(opt).from(element).save().then(() => {
           setPreviewScale(originalScale);
           setIsDownloading(false);
        }).catch((err: any) => {
           console.error("PDF generation failed", err);
           setPreviewScale(originalScale);
           setIsDownloading(false);
        });
      } else {
        setPreviewScale(originalScale);
        setIsDownloading(false);
        alert("PDF generator loading...");
      }
    }, 500);
  };

  const handleDownloadDOCX = () => {
    if (!resumeData) return;
     try {
       const doc = new Document({
         sections: [{
           properties: {},
           children: [
             new Paragraph({
               text: resumeData.fullName,
               heading: HeadingLevel.TITLE,
             }),
             new Paragraph({
               text: `${resumeData.email} | ${resumeData.phone} | ${resumeData.location}`,
             }),
             new Paragraph({ text: "" }),
             new Paragraph({
               text: "Summary",
               heading: HeadingLevel.HEADING_1,
             }),
             new Paragraph({
               text: resumeData.summary,
             }),
             new Paragraph({ text: "" }),
             new Paragraph({
               text: "Experience",
               heading: HeadingLevel.HEADING_1,
             }),
             ...resumeData.experience.flatMap(exp => [
               new Paragraph({
                 text: `${exp.role} at ${exp.company}`,
                 heading: HeadingLevel.HEADING_2,
               }),
               new Paragraph({
                 text: `${exp.startDate} - ${exp.endDate}`,
                 style: "Heading3"
               }),
               new Paragraph({
                 text: exp.description,
               }),
               new Paragraph({ text: "" }),
             ]),
             new Paragraph({
               text: "Skills",
               heading: HeadingLevel.HEADING_1,
             }),
             new Paragraph({
               text: resumeData.skills.map(s => s.name).join(", "),
             }),
           ],
         }],
       });

       Packer.toBlob(doc).then((blob: Blob) => {
         // @ts-ignore
         const save = FileSaver.default?.saveAs || FileSaver.saveAs || FileSaver.default || FileSaver;
         if (typeof save === 'function') {
            save(blob, `${resumeData.fullName.replace(/\s+/g, '_')}_Resume.docx`);
         } else {
            console.error("FileSaver is not a function", FileSaver);
            alert("Download failed due to library error.");
         }
       });
     } catch (e) {
       console.error("DOCX generation failed", e);
       alert("DOCX generation failed. Please try PDF.");
     }
  };

  const tabs = [
    { id: 'personal', label: 'Identity', icon: <User size={18} /> },
    { id: 'experience', label: 'Work', icon: <Briefcase size={18} /> },
    { id: 'education', label: 'Edu', icon: <GraduationCap size={18} /> },
    { id: 'skills', label: 'Skills', icon: <Wrench size={18} /> },
  ];

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
        <div className="p-4 border-b border-[#333] bg-black flex justify-between items-center">
          <div className="flex gap-2">
            <LinkButton to="/dashboard" icon={<ChevronLeft size={20}/>} />
            <span className="font-bold text-xl self-center ml-2 hidden sm:block text-[#00FFFF]">EDITOR_V1.0</span>
          </div>
          <div className="flex gap-2">
             <Button 
              variant="secondary" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isImporting} 
              className="text-sm px-2 bg-black border-[#333] text-white hover:border-white"
              title="Import Resume"
            >
              {isImporting ? '...' : <FileUp size={16}/>}
            </Button>
            
            <Button variant="secondary" onClick={openRoleDiscovery} className="text-sm px-2 border-[#FF00FF] bg-black text-white hover:bg-[#FF00FF]/20" title="Find Matching Roles">
               <Compass size={16} className="inline mr-1 text-[#FF00FF]"/> CAREER PATH
            </Button>

            <Button variant="secondary" onClick={startAnalysis} className="text-sm px-2 animate-pulse border-[#00FFFF] bg-black text-[#00FFFF]">
              <Sparkles size={16} className="inline mr-1"/> AI COACH
            </Button>
            
            <div className="flex gap-1">
                <Button variant="primary" onClick={handleDownloadDOCX} className="text-sm px-2 bg-[#FFBF00] text-black hover:bg-[#FFBF00]/80">
                  DOCX
                </Button>
                <Button variant="primary" onClick={handleDownloadPDF} disabled={isDownloading} className="text-sm px-2 bg-[#0000FF] text-white border-[#00FFFF]">
                  {isDownloading ? '...' : 'PDF'}
                </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#333] bg-[#0a0a0a] text-white">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id 
                  ? 'bg-[#222] text-[#00FFFF] border-t-2 border-[#00FFFF]' 
                  : 'hover:bg-[#1a1a1a] text-gray-500'
              }`}
            >
              {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0a0a0a] custom-scrollbar">
          
          <div className="mb-6 flex gap-2 items-center">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1"><FolderOpen size={12}/> FOLDER:</label>
              <select 
                value={resumeData.folder || 'General'} 
                onChange={(e) => handleInputChange('folder', e.target.value)}
                className="bg-transparent border-b border-[#333] outline-none font-bold text-sm text-white"
              >
                  {availableFolders.length === 0 && <option>General</option>}
                  {availableFolders.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
          </div>

          {activeTab === 'personal' && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-2xl font-black mb-6 text-[#FF00FF]">IDENTITY MATRIX</h2>
              
              <Input label="RESUME NAME (INTERNAL)" value={resumeData.title} onChange={(e) => handleInputChange('title', e.target.value)} />
              
              <Input label="FULL NAME" value={resumeData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} />
              <Input label="JOB TITLE" value={resumeData.title} onChange={(e) => handleInputChange('title', e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                 <Input label="EMAIL" value={resumeData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                 <Input label="PHONE" value={resumeData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
              </div>
              <Input label="LOCATION" value={resumeData.location} onChange={(e) => handleInputChange('location', e.target.value)} />
              <Input label="WEBSITE" value={resumeData.website} onChange={(e) => handleInputChange('website', e.target.value)} />
              
              <div className="mt-4">
                <label className="block text-sm font-bold mb-1 text-[#00FFFF] bg-black inline-block px-2 py-0.5 transform -skew-x-12 border border-[#00FFFF]/30">
                   <span className="transform skew-x-12 inline-block">PROFESSIONAL SUMMARY</span>
                </label>
                <textarea 
                  className="w-full h-32 bg-[#111] text-white border-2 border-[#333] p-3 focus:outline-none focus:border-[#FF00FF] focus:shadow-[0_0_10px_#FF00FF] transition-all"
                  value={resumeData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6 animate-fadeIn">
               <h2 className="text-2xl font-black mb-4 text-[#0000FF]">WORK LOGS</h2>
               {resumeData.experience.map((exp, index) => (
                   <div key={exp.id} className="bg-[#111] border border-[#333] p-4 shadow-lg">
                       <div className="flex justify-between items-center mb-4">
                           <span className="font-bold bg-[#BEF754] text-black px-2 border border-black text-xs">#{index + 1}</span>
                           <button 
                             onClick={() => setResumeData(prev => prev ? ({...prev, experience: prev.experience.filter(e => e.id !== exp.id)}) : null)}
                             className="text-red-500 font-bold text-xs hover:underline"
                           >
                             DELETE
                           </button>
                       </div>
                       <Input label="COMPANY" value={exp.company} onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)} />
                       <Input label="ROLE" value={exp.role} onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)} />
                       <div className="grid grid-cols-2 gap-4">
                           <Input label="START" value={exp.startDate} onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)} />
                           <Input label="END" value={exp.endDate} onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)} />
                       </div>
                       <textarea 
                         className="w-full h-24 bg-[#000] text-gray-300 border border-[#333] p-2 mt-2 text-sm focus:border-[#BEF754] outline-none"
                         value={exp.description}
                         onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                       />
                   </div>
               ))}
               <Button 
                  variant="success" 
                  fullWidth 
                  className="border-dashed bg-transparent border-[#BEF754] text-[#BEF754] hover:bg-[#BEF754] hover:text-black"
                  onClick={() => setResumeData(prev => prev ? ({...prev, experience: [...prev.experience, { id: `exp-${Date.now()}`, company: '', role: '', startDate: '', endDate: '', description: '' }]}) : null)}
               >
                   <Plus size={16} className="inline"/> ADD POSITION
               </Button>
            </div>
          )}

          {activeTab === 'education' && (
             <div className="animate-fadeIn">
                 <h2 className="text-2xl font-black mb-4 text-[#FFBF00]">KNOWLEDGE UPLOAD</h2>
                 {resumeData.education.map((edu, index) => (
                     <div key={edu.id} className="bg-[#111] border border-[#333] p-4 mb-4 relative">
                        <button 
                             onClick={() => setResumeData(prev => prev ? ({...prev, education: prev.education.filter(e => e.id !== edu.id)}) : null)}
                             className="absolute top-2 right-2 text-red-500 font-bold text-xs hover:underline"
                           >
                             DELETE
                        </button>
                         <Input label="SCHOOL" value={edu.school} onChange={(e) => {
                            if(!resumeData) return;
                            const newEdu = [...resumeData.education];
                            newEdu[index].school = e.target.value;
                            setResumeData({...resumeData, education: newEdu});
                         }} />
                         <Input label="DEGREE" value={edu.degree} onChange={(e) => {
                            if(!resumeData) return;
                            const newEdu = [...resumeData.education];
                            newEdu[index].degree = e.target.value;
                            setResumeData({...resumeData, education: newEdu});
                         }}/>
                         <Input label="YEAR" value={edu.year} onChange={(e) => {
                            if(!resumeData) return;
                            const newEdu = [...resumeData.education];
                            newEdu[index].year = e.target.value;
                            setResumeData({...resumeData, education: newEdu});
                         }}/>
                     </div>
                 ))}
                 <Button 
                  variant="secondary" 
                  fullWidth 
                  className="border-dashed bg-transparent border-[#FFBF00] text-[#FFBF00] hover:bg-[#FFBF00] hover:text-black"
                  onClick={() => setResumeData(prev => prev ? ({...prev, education: [...prev.education, { id: `edu-${Date.now()}`, school: '', degree: '', year: '' }]}) : null)}
               >
                   <Plus size={16} className="inline"/> ADD EDUCATION
               </Button>
             </div>
          )}

          {activeTab === 'skills' && (
              <div className="animate-fadeIn">
                  <h2 className="text-2xl font-black mb-4 text-[#FF00FF]">TECH STACK</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                      {resumeData.skills.map(skill => (
                          <div key={skill.id} className="bg-[#111] text-white px-3 py-1 font-bold flex items-center gap-2 group border border-[#333]">
                              {skill.name}
                              <button 
                                onClick={() => setResumeData(prev => prev ? ({...prev, skills: prev.skills.filter(s => s.id !== skill.id)}) : null)}
                                className="text-[#FF00FF] hover:text-white"
                              >
                                x
                              </button>
                          </div>
                      ))}
                  </div>
                  <div className="flex gap-2">
                      <Input 
                        placeholder="Add a skill..." 
                        className="mb-0" 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const target = e.target as HTMLInputElement;
                            if (target.value.trim() && resumeData) {
                                setResumeData(prev => prev ? ({...prev, skills: [...prev.skills, { id: `s-${Date.now()}`, name: target.value, level: 3 }]}) : null);
                                target.value = '';
                            }
                          }
                        }}
                      />
                      <Button variant="secondary" onClick={() => {
                          const input = document.querySelector('input[placeholder="Add a skill..."]') as HTMLInputElement;
                          if (input && input.value.trim() && resumeData) {
                              setResumeData(prev => prev ? ({...prev, skills: [...prev.skills, { id: `s-${Date.now()}`, name: input.value, level: 3 }]}) : null);
                              input.value = '';
                          }
                      }}>ADD</Button>
                  </div>
              </div>
          )}

        </div>
      </div>

      {/* RIGHT PANEL: PREVIEW */}
      <div className="hidden md:flex flex-1 bg-[#050505] relative overflow-hidden flex-col items-center justify-center">
        
        {/* Background Grid Animation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>

        {/* Template Switcher Overlay */}
        <div className="absolute top-4 right-4 z-20 flex gap-2 flex-wrap justify-end max-w-[250px]">
             {TEMPLATES.map(t => (
               <button 
                 key={t.id}
                 onClick={() => setResumeData(p => p ? ({...p, templateId: t.id}) : null)} 
                 className={`w-10 h-10 rounded border-2 transition-all hover:scale-110 flex items-center justify-center shadow-lg ${
                    resumeData.templateId === t.id 
                    ? 'border-[#00FFFF] scale-110 z-10 shadow-[0_0_10px_#00FFFF]' 
                    : 'border-gray-700 opacity-60 hover:opacity-100 hover:border-gray-500'
                 }`}
                 style={{ backgroundColor: t.colors[0] }}
                 title={t.name}
               >
                 {resumeData.templateId === t.id && <div className="w-2 h-2 bg-[#00FFFF] rounded-full"></div>}
               </button>
             ))}
        </div>
        
        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 z-20 bg-[#111] text-white p-2 flex gap-4 rounded border border-[#333]">
             <button onClick={() => setPreviewScale(s => Math.max(0.3, s - 0.1))} className="hover:text-[#00FFFF]">-</button>
             <span className="text-xs self-center font-mono">{Math.round(previewScale * 100)}%</span>
             <button onClick={() => setPreviewScale(s => Math.min(1.5, s + 0.1))} className="hover:text-[#00FFFF]">+</button>
        </div>

        <div className="overflow-auto w-full h-full flex items-center justify-center p-8 custom-scrollbar">
           <div className={`shadow-2xl transition-all duration-300 ease-in-out ${isDownloading ? 'opacity-50 pointer-events-none' : ''}`}>
              <ResumePreview id="resume-preview" data={resumeData} scale={previewScale} />
           </div>
        </div>

        {isDownloading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-[#111] p-6 border-2 border-[#0000FF] shadow-[0_0_50px_#0000FF] animate-pulse">
                    <h3 className="text-2xl font-black mb-2 flex items-center gap-2 text-white">
                        <FileType className="text-[#0000FF]" /> GENERATING PDF...
                    </h3>
                    <p className="font-mono text-sm text-gray-400">Hold tight while we render your masterpiece.</p>
                </div>
            </div>
        )}

        {isImporting && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                <div className="bg-[#111] p-8 border-2 border-[#BEF754] shadow-[0_0_50px_#BEF754] animate-bounce-in text-center max-w-md">
                    <h3 className="text-3xl font-black mb-4 animate-pulse text-[#BEF754] bg-black inline-block px-2">
                        IMPORTING DATA
                    </h3>
                    <p className="font-bold text-lg mb-4 text-white">Parsing your files with AI...</p>
                    <div className="w-full bg-[#333] h-4 border border-black overflow-hidden relative">
                         <div className="absolute top-0 left-0 h-full bg-[#BEF754] animate-loading-bar w-full"></div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* AI ANALYZER MODAL - DARK MODE */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#111] max-w-2xl w-full border-2 border-[#00FFFF] shadow-[0_0_50px_rgba(0,255,255,0.2)] relative flex flex-col max-h-[90vh] h-full text-white">
             {/* Modal Header */}
             <div className="p-6 bg-[#00FFFF]/5 border-b border-[#333] flex justify-between items-center shrink-0">
               <h3 className="text-3xl font-black flex items-center gap-2 text-white">
                  <Bot size={32} className="text-[#00FFFF]"/> AI CAREER COACH
               </h3>
               <button onClick={() => setShowAiModal(false)} className="w-8 h-8 flex items-center justify-center border border-[#333] hover:bg-[#00FFFF] hover:text-black font-bold transition-colors">X</button>
             </div>

             {/* Modal Body */}
             <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                
                {/* Step 1: Input */}
                {aiStep === 'input' && (
                   <div className="text-center py-8">
                      <h4 className="text-2xl font-bold mb-4">How can I help you today?</h4>
                      <p className="text-gray-400 mb-8">Analyze your resume against a specific role or let me discover what fits you best.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                         {/* Option 1: Job Fit */}
                         <div className="bg-[#1a1a1a] p-4 border border-[#333] hover:border-[#0000FF] transition-colors cursor-pointer group" onClick={() => {}}>
                            <h5 className="font-bold text-lg mb-2 text-[#0000FF] flex items-center gap-2"><Search size={20}/> Target a Job</h5>
                            <p className="text-sm text-gray-500 mb-4">Enter a job title to see how well you match.</p>
                            <Input 
                              placeholder="E.g. Product Manager" 
                              value={targetJob} 
                              onChange={(e) => setTargetJob(e.target.value)}
                              className="text-center font-bold"
                            />
                            <Button variant="primary" fullWidth onClick={handleRunAnalysis} className="bg-[#0000FF] border-[#0000FF] text-white">
                              ANALYZE FIT <ArrowRight className="inline ml-2" size={16}/>
                            </Button>
                         </div>

                         {/* Option 2: Roles */}
                         <div className="bg-[#1a1a1a] p-4 border border-[#333] hover:border-[#FF00FF] transition-colors flex flex-col justify-between">
                            <div>
                                <h5 className="font-bold text-lg mb-2 text-[#FF00FF] flex items-center gap-2"><Sparkles size={20}/> Discover Roles</h5>
                                <p className="text-sm text-gray-500 mb-4">Not sure what to apply for? I'll analyze your skills and suggest the best roles.</p>
                            </div>
                            <Button variant="secondary" fullWidth className="bg-[#FF00FF] text-white hover:bg-[#FF00FF]/80 border-[#FF00FF]" onClick={handleSuggestRoles}>
                              SUGGEST ROLES <ArrowRight className="inline ml-2" size={16}/>
                            </Button>
                         </div>

                         {/* Option 3: Career Transition */}
                         <div className="bg-[#1a1a1a] p-4 border border-[#333] hover:border-[#BEF754] transition-colors cursor-pointer group">
                             <div>
                                <h5 className="font-bold text-lg mb-2 text-[#BEF754] flex items-center gap-2"><GitBranch size={20}/> CAREER TRANSITION</h5>
                                <p className="text-sm text-gray-500 mb-2">Planning a big move? I'll identify your transferrable skills and tell you exactly what you need to learn.</p>
                             </div>
                             <div className="mt-4">
                                <Input 
                                  placeholder="Target Career" 
                                  value={transitionTarget} 
                                  onChange={(e) => setTransitionTarget(e.target.value)}
                                  className="text-center font-bold mb-2"
                                />
                                <Button variant="success" fullWidth onClick={() => {
                                    if(transitionTarget) handleTransitionAnalysis();
                                    else setAiStep('transition_input');
                                }} className="bg-[#BEF754] text-black">
                                  BUILD TRANSITION PLAN
                                </Button>
                             </div>
                         </div>
                         
                         {/* Option 4: Job Hunter */}
                         <div className="bg-[#1a1a1a] p-4 border border-[#333] hover:border-[#00FFFF] transition-colors cursor-pointer group flex flex-col">
                             <div className="flex-1">
                                <h5 className="font-bold text-lg mb-2 text-[#00FFFF] flex items-center gap-2"><Globe size={20}/> JOB HUNTER</h5>
                                <p className="text-sm text-gray-500 mb-2">I'll scrape the web for listings, compile a spreadsheet, and auto-apply for you.</p>
                             </div>
                             <Button variant="secondary" fullWidth onClick={() => setAiStep('job_hunt_input')} className="mt-4 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black">
                                LAUNCH PROTOCOL <ArrowRight className="inline ml-2" size={16}/>
                             </Button>
                         </div>
                      </div>
                   </div>
                )}
                
                {/* ... (Other steps would follow similar dark mode pattern, simplified for brevity here, applying bg-[#111] text-white patterns) ... */}
                {/* Job Hunter Results */}
                {aiStep === 'job_hunt_results' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-2xl font-black text-white">SCAN COMPLETE: {jobListings.length} TARGETS FOUND</h4>
                            <Button variant="success" onClick={handleExportJobs} className="text-sm bg-[#BEF754] text-black">
                                <Database className="mr-2" size={16}/> EXPORT INTEL (CSV)
                            </Button>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                            {jobListings.map((job, index) => (
                                <div key={index} className="bg-[#1a1a1a] border border-[#333] p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h5 className="font-bold text-lg text-[#0000FF]">{job.title}</h5>
                                            <span className="text-xs font-bold bg-[#BEF754] text-black px-1 border border-black">{job.matchScore}% MATCH</span>
                                        </div>
                                        <div className="text-sm font-bold text-gray-400">{job.company} • {job.location}</div>
                                        <a href={job.url} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-[#00FFFF] underline truncate block max-w-xs">{job.url}</a>
                                    </div>
                                    <Button variant="secondary" onClick={() => handleAutoApply(index)} className="text-xs w-full md:w-auto border-[#333] text-gray-400 hover:text-white">
                                        <Play size={12} className="mr-1"/> AUTO-APPLY
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4">
                            <Button variant="ghost" onClick={startAnalysis} className="text-gray-400 border-[#333]">BACK</Button>
                        </div>
                    </div>
                )}
                
                {/* Fallback for other states to use basic text-white/bg-black */}
                {(aiStep === 'analyzing' || aiStep === 'fixing' || aiStep === 'suggesting_roles' || aiStep === 'transition_analyzing' || aiStep === 'job_hunt_scanning') && (
                   <div className="text-center py-12 h-full flex flex-col justify-center items-center text-white">
                      <div className="inline-block animate-spin mb-4 text-[#00FFFF]">
                         <Sparkles size={48} />
                      </div>
                      <h4 className="text-2xl font-bold mb-2 animate-pulse">PROCESSING...</h4>
                   </div>
                )}
                
                {/* Chat Interface */}
                {aiStep === 'chat' && (
                    <div className="flex flex-col h-full h-[500px]">
                        <div className="flex-1 overflow-y-auto mb-4 border border-[#333] bg-[#0a0a0a] p-4 space-y-4">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 border border-[#333] ${
                                        msg.role === 'user' 
                                        ? 'bg-[#0000FF] text-white rounded-tl-lg rounded-bl-lg rounded-tr-lg' 
                                        : 'bg-[#222] text-gray-300 rounded-tr-lg rounded-br-lg rounded-tl-lg'
                                    }`}>
                                        <p className="text-sm font-medium whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Ask me anything..." 
                                value={chatInput} 
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="mb-0"
                            />
                            <Button variant="primary" onClick={handleSendMessage} disabled={isChatLoading}>
                                <Send size={20} />
                            </Button>
                        </div>
                        <div className="mt-2 text-center">
                             <button onClick={startAnalysis} className="text-xs text-gray-500 hover:text-white underline">Back to Analysis</button>
                        </div>
                    </div>
                )}

             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Editor;