
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Layout, CreditCard, LogOut, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './ui/Button';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
     logout();
     navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-[#333] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 overflow-hidden border border-[#00FFFF] shadow-[0_0_10px_rgba(0,0,255,0.5)]">
            <img 
              src="/hydra-logo.png" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent loop
                target.src = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=100&auto=format&fit=crop"; // Abstract Cyberpunk Fallback
              }}
              alt="Hydra Logo" 
              className="w-full h-full object-cover" 
            />
        </div>
        <Link to="/" className="text-2xl font-black tracking-tighter text-white hover:text-[#00FFFF] transition-colors">
          HYDRA<span className="text-[#0000FF]">HUNT</span>
        </Link>
      </div>

      <div className="hidden md:flex gap-6">
        <NavLink to="/dashboard" icon={<Layout size={18} />} label={t('nav.dashboard')} active={isActive('/dashboard')} />
        <NavLink to="/templates" icon={<Zap size={18} />} label={t('nav.templates')} active={isActive('/templates')} />
        <NavLink to="/pricing" icon={<CreditCard size={18} />} label={t('nav.pro')} active={isActive('/pricing')} />
      </div>

      <div className="flex items-center gap-4">
         <button 
           onClick={toggleLanguage}
           className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-white transition-colors border border-[#333] px-2 py-1 rounded bg-[#111]"
         >
           <Globe size={14} />
           {language.toUpperCase()}
         </button>

         {user ? (
           <>
             <div className="hidden md:flex flex-col items-end leading-tight">
                <span className="text-xs font-bold text-[#00FFFF]">{t('nav.operator')}</span>
                <span className="font-bold text-white">{user.name}</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-[#111] overflow-hidden border-2 border-[#BEF754]">
                 <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" />
             </div>
             <button onClick={handleLogout} className="p-2 border border-[#333] bg-[#111] text-gray-400 hover:text-white hover:border-[#FF00FF] transition-colors" title={t('nav.logout')}>
                <LogOut size={18} />
             </button>
           </>
         ) : (
           <Link to="/login">
              <Button variant="primary" className="text-sm bg-[#0000FF] border-[#00FFFF] text-white">
                {t('nav.login')}
              </Button>
           </Link>
         )}
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean }> = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 px-4 py-2 font-bold border transition-all ${
      active 
        ? 'bg-[#0000FF]/20 border-[#00FFFF] text-[#00FFFF] shadow-[0_0_15px_rgba(0,255,255,0.2)]' 
        : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    {label}
  </Link>
);

export default Navbar;
