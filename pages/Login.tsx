
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, ArrowRight, Github, Chrome } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email);
    navigate('/dashboard');
  };

  const handleGoogle = async () => {
    await loginWithGoogle();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0000FF] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF00FF] rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-[#111] border-2 border-[#00FFFF] shadow-[0_0_40px_rgba(0,255,255,0.2)] relative z-10 p-8">
         <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-4 border border-[#BEF754] shadow-[0_0_15px_#BEF754]">
               <Zap className="text-[#BEF754]" size={32} />
            </div>
            <h2 className="text-3xl font-black text-white">{isLogin ? 'ACCESS MAINFRAME' : 'INITIATE SEQUENCE'}</h2>
            <p className="text-gray-500 font-mono text-sm mt-2">Identify yourself to proceed.</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="EMAIL ADDRESS" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@hydrahunt.com"
            />
            <Input 
              label="PASSWORD" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            
            <Button variant="primary" fullWidth className="py-3 text-lg mt-4 bg-[#0000FF] border-[#00FFFF] hover:bg-white hover:text-black hover:shadow-[0_0_20px_#fff]">
               {isLogin ? 'ENTER SYSTEM' : 'CREATE ID'} <ArrowRight className="inline ml-2" size={18} />
            </Button>
         </form>

         <div className="my-6 flex items-center gap-4">
            <div className="h-[1px] bg-[#333] flex-1"></div>
            <span className="text-xs font-bold text-gray-500">OR AUTH WITH</span>
            <div className="h-[1px] bg-[#333] flex-1"></div>
         </div>

         <div className="space-y-2">
            <Button variant="ghost" fullWidth className="border border-[#333] text-gray-300 hover:border-white hover:bg-white hover:text-black flex items-center justify-center gap-2" onClick={handleGoogle}>
               <Chrome size={18} /> Google Account
            </Button>
         </div>

         <div className="mt-8 text-center text-sm text-gray-400">
            {isLogin ? "Don't have an ID? " : "Already verified? "}
            <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-[#00FFFF] hover:underline hover:text-white transition-colors">
               {isLogin ? 'Initialize Sign Up' : 'Access Login'}
            </button>
         </div>
      </div>
    </div>
  );
};

export default Login;