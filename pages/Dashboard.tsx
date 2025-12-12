
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Download, Copy, Trash2, Folder, FolderPlus, Grid, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import { getResumes, deleteResume, duplicateResume, getFolders, createResume } from '../services/storage';
import { ResumeData } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [fetchedResumes, fetchedFolders] = await Promise.all([
        getResumes(),
        getFolders()
    ]);
    setResumes(fetchedResumes);
    setFolders(['All', ...fetchedFolders]);
    setIsLoading(false);
  };

  const handleCreateResume = async () => {
    const folderToUse = selectedFolder === 'All' ? 'General' : selectedFolder;
    const newResume = await createResume(folderToUse);
    navigate(`/editor/${newResume.id}`);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this resume?')) {
      await deleteResume(id);
      loadData();
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    await duplicateResume(id);
    loadData();
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      setFolders(prev => Array.from(new Set([...prev, newFolderName])));
      setSelectedFolder(newFolderName);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const filteredResumes = resumes.filter(r => {
    const matchesFolder = selectedFolder === 'All' || (r.folder || 'General') === selectedFolder;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-80px)]">
      
      {/* SIDEBAR - FOLDERS */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-[#111] border border-[#333] p-4 mb-6">
           <Button variant="success" fullWidth onClick={handleCreateResume} className="flex items-center justify-center gap-2 mb-6 py-3 bg-[#BEF754] text-black hover:bg-[#BEF754]/90">
              <Plus size={20} /> NEW RESUME
           </Button>

           <h3 className="font-bold text-[#00FFFF] text-sm mb-3 px-2 flex justify-between items-center tracking-widest">
             DATA BANKS
             <button onClick={() => setIsCreatingFolder(true)} className="hover:text-white transition-colors"><FolderPlus size={16}/></button>
           </h3>
           
           {isCreatingFolder && (
             <div className="mb-2 px-2 flex gap-1">
               <input 
                 autoFocus
                 className="w-full border-b border-[#00FFFF] outline-none text-sm py-1 bg-transparent text-white placeholder-gray-600"
                 placeholder="Folder Name"
                 value={newFolderName}
                 onChange={e => setNewFolderName(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                 onBlur={() => setTimeout(() => setIsCreatingFolder(false), 200)}
               />
             </div>
           )}

           <ul className="space-y-1">
             {folders.map(folder => (
               <li key={folder}>
                 <button 
                   onClick={() => setSelectedFolder(folder)}
                   className={`w-full text-left px-3 py-2 font-bold flex items-center gap-2 border-l-2 transition-all ${
                     selectedFolder === folder 
                     ? 'border-[#00FFFF] bg-[#00FFFF]/10 text-[#00FFFF]' 
                     : 'border-transparent hover:bg-[#222] text-gray-400 hover:text-white'
                   }`}
                 >
                   <Folder size={16} className={selectedFolder === folder ? "text-[#00FFFF]" : ""} />
                   {folder}
                   {folder !== 'All' && <span className="ml-auto text-xs bg-[#333] px-1.5 rounded text-gray-400">
                     {resumes.filter(r => (r.folder || 'General') === folder).length}
                   </span>}
                 </button>
               </li>
             ))}
           </ul>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
             <h1 className="text-4xl font-black mb-1 flex items-center gap-2 text-white">
               {selectedFolder === 'All' ? 'ALL FILES' : selectedFolder.toUpperCase()}
             </h1>
             <p className="text-gray-500 font-mono text-sm">
               {isLoading ? 'SCANNING SECTOR...' : `${filteredResumes.length} RECORDS FOUND // SYSTEM READY`}
             </p>
          </div>
          
          <div className="relative w-full sm:w-64">
             <input 
               className="w-full bg-[#111] border border-[#333] text-white py-2 pl-10 pr-4 font-bold focus:outline-none focus:border-[#00FFFF] focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all"
               placeholder="Search database..."
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
             />
             <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          </div>
        </div>

        {isLoading ? (
            <div className="text-center py-20">
                <div className="animate-spin w-10 h-10 border-4 border-[#00FFFF] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500 animate-pulse">ESTABLISHING CONNECTION...</p>
            </div>
        ) : filteredResumes.length === 0 ? (
          <div className="text-center py-20 bg-[#111] border border-dashed border-[#333]">
             <div className="w-20 h-20 bg-[#222] rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                <Folder size={32} />
             </div>
             <h3 className="text-xl font-bold text-gray-400 mb-2">SECTOR EMPTY</h3>
             <p className="text-gray-600 mb-6 font-mono">No resume data found in this sector.</p>
             <Button variant="primary" onClick={handleCreateResume}>INITIATE NEW FILE</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <div key={resume.id} className="group relative bg-[#111] border border-[#333] p-4 hover:border-[#00FFFF] transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] flex flex-col">
                {/* Visual Preview Stub */}
                <Link to={`/editor/${resume.id}`} className="block h-40 bg-black mb-4 border border-[#333] flex items-center justify-center overflow-hidden relative group-hover:border-[#00FFFF] transition-colors">
                  <div className="absolute inset-0 bg-[#0000FF] opacity-5"></div>
                  <div className="z-10 text-center">
                     <span className="font-bold text-2xl tracking-widest text-[#333] group-hover:text-[#00FFFF] font-mono">ACCESS</span>
                  </div>
                </Link>

                <div className="mb-4 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-2 text-white group-hover:text-[#00FFFF] transition-colors">{resume.title}</h3>
                    <div className="w-2 h-2 rounded-full bg-[#BEF754] flex-shrink-0 mt-2 shadow-[0_0_5px_#BEF754]"></div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                     <span className="text-xs font-mono text-[#00FFFF] bg-[#00FFFF]/10 px-2 py-0.5 border border-[#00FFFF]/20">
                       {resume.folder || 'General'}
                     </span>
                     <span className="text-xs text-gray-500">
                       {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'Just now'}
                     </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <Link to={`/editor/${resume.id}`} className="w-full">
                    <Button variant="primary" fullWidth className="text-sm py-1 bg-[#0000FF] border-[#0000FF] text-white">
                      <Edit2 size={14} className="inline mr-1" /> EDIT
                    </Button>
                  </Link>
                  <Button variant="secondary" fullWidth className="text-sm py-1 bg-black border-[#333] text-gray-400 hover:text-white hover:border-white" onClick={(e) => handleDuplicate(resume.id, e)}>
                      <Copy size={14} className="inline mr-1" /> COPY
                  </Button>
                </div>
                
                <button 
                  onClick={(e) => handleDelete(resume.id, e)}
                  className="absolute top-2 right-2 p-1.5 bg-black border border-[#333] text-gray-500 hover:border-[#FF00FF] hover:text-[#FF00FF] opacity-0 group-hover:opacity-100 transition-all z-10"
                  title="Delete Resume"
                >
                   <Trash2 size={14}/>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
