
import React, { useState, useRef } from 'react';
import { Upload, FileText, ArrowRight, Download, Loader2, RefreshCw, FileJson, FileType, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { extractTextFromFile } from '../services/fileExtraction';
import { parseResumeFromText } from '../services/gemini';
import { downloadDocx } from '../services/docxGenerator';
import { ResumeData, TemplateId } from '../types';
import { MOCK_RESUME, TEMPLATES } from '../constants';
import ResumePreview from '../components/ResumePreview';
import saveAs from 'file-saver';

const Converter: React.FC = () => {
    const [step, setStep] = useState<'upload' | 'processing' | 'convert'>('upload');
    const [parsedData, setParsedData] = useState<ResumeData | null>(null);
    const [fileName, setFileName] = useState('');
    const [previewTemplate, setPreviewTemplate] = useState<TemplateId>(TemplateId.CYBER);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setStep('processing');

        try {
            let resumeData: ResumeData;

            // Direct JSON import
            if (file.name.endsWith('.json')) {
                const text = await extractTextFromFile(file);
                resumeData = JSON.parse(text);
            } else {
                // AI Extraction for PDF/DOCX/TXT
                const text = await extractTextFromFile(file);
                if (!text || text.length < 10) throw new Error("File empty or unreadable.");
                
                const parsed = await parseResumeFromText(text);
                if (!parsed) throw new Error("AI Parsing failed.");
                
                // Merge with mock structure to ensure valid ResumeData
                resumeData = { 
                    ...MOCK_RESUME, 
                    ...parsed, 
                    id: crypto.randomUUID(),
                    templateId: TemplateId.CYBER // Default template
                };
            }

            setParsedData(resumeData);
            setStep('convert');
        } catch (error) {
            console.error(error);
            alert("Conversion failed. Please ensure the file is readable.");
            setStep('upload');
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('converter-preview');
        if (!element) return;
        
        // @ts-ignore
        if (window.html2pdf) {
            const opt = {
                margin: 0,
                filename: `${fileName.split('.')[0]}_converted.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            // @ts-ignore
            window.html2pdf().set(opt).from(element).save();
        }
    };

    const handleDownloadDOCX = async () => {
        if (!parsedData) return;
        await downloadDocx(parsedData);
    };

    const handleDownloadJSON = () => {
        if (!parsedData) return;
        const blob = new Blob([JSON.stringify(parsedData, null, 2)], { type: 'application/json' });
        saveAs(blob, `${fileName.split('.')[0]}_data.json`);
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter">
                        FILE <span className="text-[#00FFFF]">CONVERTER</span>
                    </h1>
                    <p className="text-gray-400 max-w-3xl mx-auto">
                        Upload your existing files <strong>(PDF, DOCX, TXT, JSON)</strong> and convert them into professional, structured formats ready for download <strong>(PDF, DOCX, JSON)</strong>.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT PANEL: CONTROLS */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* 1. UPLOAD ZONE */}
                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${step === 'upload' ? 'border-[#00FFFF] bg-[#00FFFF]/5' : 'border-[#333] opacity-50'}`}>
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                                accept=".pdf,.docx,.txt,.json"
                            />
                            
                            {step === 'processing' ? (
                                <div className="py-8">
                                    <Loader2 size={48} className="animate-spin text-[#BEF754] mx-auto mb-4"/>
                                    <h3 className="text-xl font-bold text-[#BEF754] animate-pulse">CONVERTING FILE...</h3>
                                    <p className="text-xs text-gray-500 mt-2">Extracting • Formatting • Generating</p>
                                </div>
                            ) : step === 'convert' ? (
                                <div className="py-4">
                                    <div className="w-16 h-16 bg-[#BEF754] rounded-full flex items-center justify-center mx-auto mb-4 text-black">
                                        <CheckCircle2 size={32}/>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">FILE PROCESSED</h3>
                                    <p className="text-[#BEF754] font-mono text-sm mb-4">{fileName}</p>
                                    <Button variant="ghost" onClick={() => { setStep('upload'); setParsedData(null); }} className="text-xs border-dashed">
                                        CONVERT ANOTHER FILE
                                    </Button>
                                </div>
                            ) : (
                                <div className="py-8 cursor-pointer hover:scale-105 transition-transform" onClick={() => fileInputRef.current?.click()}>
                                    <Upload size={48} className="text-[#00FFFF] mx-auto mb-4"/>
                                    <h3 className="text-xl font-bold text-white mb-2">UPLOAD FILE</h3>
                                    <div className="bg-[#111] inline-block px-4 py-2 rounded border border-[#333] text-xs text-gray-300 font-mono">
                                        SUPPORTS: PDF • DOCX • TXT • JSON
                                    </div>
                                    <Button variant="secondary" className="mt-6 pointer-events-none">SELECT FILE</Button>
                                </div>
                            )}
                        </div>

                        {/* 2. OUTPUT ACTIONS */}
                        {step === 'convert' && parsedData && (
                            <div className="bg-[#111] border border-[#333] p-6 rounded-xl animate-fadeIn">
                                <h3 className="text-gray-400 font-bold text-sm uppercase mb-4 flex items-center gap-2">
                                    <ArrowRight size={16}/> Download Converted File
                                </h3>
                                
                                <div className="grid gap-3">
                                    <button 
                                        onClick={handleDownloadPDF}
                                        className="flex items-center justify-between p-4 bg-black border border-[#333] hover:border-[#FF00FF] hover:text-[#FF00FF] hover:bg-[#FF00FF]/5 transition-all group text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText size={24} className="text-gray-500 group-hover:text-[#FF00FF]"/>
                                            <div>
                                                <div className="font-bold text-white">Download as PDF</div>
                                                <div className="text-xs text-gray-500">Portable Document Format. Best for sharing.</div>
                                            </div>
                                        </div>
                                        <Download size={20} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                                    </button>

                                    <button 
                                        onClick={handleDownloadDOCX}
                                        className="flex items-center justify-between p-4 bg-black border border-[#333] hover:border-[#00FFFF] hover:text-[#00FFFF] hover:bg-[#00FFFF]/5 transition-all group text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileType size={24} className="text-gray-500 group-hover:text-[#00FFFF]"/>
                                            <div>
                                                <div className="font-bold text-white">Download as DOCX</div>
                                                <div className="text-xs text-gray-500">Microsoft Word. Best for further editing.</div>
                                            </div>
                                        </div>
                                        <Download size={20} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                                    </button>

                                    <button 
                                        onClick={handleDownloadJSON}
                                        className="flex items-center justify-between p-4 bg-black border border-[#333] hover:border-[#BEF754] hover:text-[#BEF754] hover:bg-[#BEF754]/5 transition-all group text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileJson size={24} className="text-gray-500 group-hover:text-[#BEF754]"/>
                                            <div>
                                                <div className="font-bold text-white">Download as JSON</div>
                                                <div className="text-xs text-gray-500">Raw Data. Best for data transfer/backup.</div>
                                            </div>
                                        </div>
                                        <Download size={20} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT PANEL: PREVIEW */}
                    <div className="lg:col-span-7 bg-[#1a1a1a] rounded-xl border border-[#333] p-8 flex flex-col h-[800px]">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#333]">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <RefreshCw size={18} className={step === 'processing' ? 'animate-spin' : ''}/>
                                PREVIEW
                            </h3>
                            {step === 'convert' && (
                                <select 
                                    className="bg-black border border-[#333] text-sm text-white px-3 py-1 rounded outline-none focus:border-[#00FFFF]"
                                    value={previewTemplate}
                                    onChange={(e) => setPreviewTemplate(e.target.value as TemplateId)}
                                >
                                    {TEMPLATES.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="flex-1 overflow-auto bg-[#0a0a0a] rounded border border-[#222] relative flex justify-center p-8">
                            {parsedData ? (
                                <div id="converter-preview" className="shadow-2xl" style={{ transform: 'scale(0.65)', transformOrigin: 'top center' }}>
                                    <ResumePreview data={{...parsedData, templateId: previewTemplate}} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-600">
                                    <FileText size={64} className="mb-4 opacity-20"/>
                                    <p className="font-mono text-sm">WAITING FOR FILE...</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Converter;
