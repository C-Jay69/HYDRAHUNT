
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { 
  Check, ArrowRight, Zap, Target, Search, Map, Shield, 
  Cpu, Crosshair, TrendingUp, FileText, Database, Terminal,
  Layers, History, PenTool
} from 'lucide-react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Templates from './pages/Templates';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Converter from './pages/Converter';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// --- Sub-components for Landing Page ---

const FeatureCard = ({ icon, title, desc, color, className = "" }: any) => (
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

const ListItem = ({ text, color = "text-[#FF00FF]" }: any) => (
  <li className="flex items-center gap-3 text-lg font-medium text-gray-300">
     <Check className={color} strokeWidth={3} size={20} />
     {text}
  </li>
);

const PricingCard = ({ title, price, desc, features, cta, highlight = false, color = "border-[#333]" }: any) => (
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
     <Link to="/login" className={`block w-full text-center py-3 font-bold border-2 transition-all ${highlight ? 'bg-[#00FFFF] text-black border-[#00FFFF] hover:bg-transparent hover:text-[#00FFFF]' : 'bg-transparent text-white border-white hover:bg-white hover:text-black'}`}>
        {cta}
     </Link>
  </div>
);

// --- Main Landing Component ---

const Landing = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-black text-white font-sans selection:bg-[#FF00FF] selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden border-b border-[#333]">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-[#0000FF] opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          <div className="flex justify-center mb-8">
             <div className="relative group cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <img 
                  src="/hydra-logo.png" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop"; // Cyberpunk Abstract Fallback
                  }}
                  alt="Hydra Hunt" 
                  className="relative w-64 md:w-80 rounded-lg shadow-2xl border border-[#333] object-cover transition-transform group-hover:scale-[1.02]" 
                />
             </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none tracking-tighter uppercase">
            HYDRA<span className="text-[#FF00FF]">HUNT</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF]">
              {t('hero.title1')}
            </span>
          </h1>
          <h2 className="text-4xl md:text-5xl font-black mb-8 text-white">{t('hero.title2')}</h2>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            {t('hero.desc')}
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link to="/dashboard" className="group relative px-8 py-5 bg-[#00FFFF] text-black font-black text-xl hover:bg-[#00FFFF]/90 transition-all clip-path-polygon w-full md:w-auto">
              <span className="relative z-10 flex items-center justify-center gap-2">{t('hero.cta_main')} <ArrowRight className="group-hover:translate-x-1 transition-transform"/></span>
              <div className="absolute inset-0 border-2 border-white translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform bg-transparent pointer-events-none"></div>
            </Link>
             <Link to="/pricing" className="px-8 py-5 border-2 border-[#BEF754] text-[#BEF754] font-bold text-xl hover:bg-[#BEF754]/10 transition-all w-full md:w-auto">
              {t('hero.cta_sec')}
            </Link>
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
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-[#FF00FF]">AUTO-HUNT ENGINE: <span className="text-white">YOUR 24/7 JOB-SEEKING MACHINE</span></h2>
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
            <p className="mt-8 text-lg font-medium text-gray-400">
               Multiple heads. Multiple targets. Relentless execution. While competitors manually apply to 5 jobs per day, you're striking <span className="text-[#FF00FF] font-bold">30+ with zero effort</span>.
            </p>
         </div>
      </section>

      {/* Deep Dive 3: Career Territory Mapping */}
      <section className="py-24 px-4 bg-black border-y border-[#333]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              CAREER TERRITORY MAPPING: <br />
              <span className="text-[#FF00FF]">CLAIM NEW GROUND</span>
            </h2>
            <p className="text-[#FF00FF] font-bold text-xl mb-4">Want to switch from accounting to cybersecurity?</p>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Hydra plots your complete transition path. See exactly which skills you need, which courses will get you there, and how long the journey takes. No guesswork. No wasted time. Just a clear roadmap from where you are to where you want to be.
              <br/><br/>
              Every career pivot becomes a calculated strike instead of a blind leap. Hydra analyzes thousands of successful transitions to show you the fastest, most effective route to your new domain.
            </p>
            
            <div className="space-y-4">
              {[
                "01 Current state analysis",
                "02 Skill gap identification",
                "03 Course recommendations",
                "04 Certification roadmap",
                "05 Target achievement"
              ].map(step => (
                <div key={step} className="border-b border-[#333] py-2 text-lg font-mono text-gray-300 hover:text-[#00FFFF] hover:border-[#00FFFF] transition-colors cursor-default">
                  {step}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 relative">
             {/* Abstract Map Visual */}
             <div className="w-full h-[500px] bg-[#111] border-2 border-[#333] relative overflow-hidden rounded-lg flex items-center justify-center">
                <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(#555 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                <div className="text-center relative z-10">
                   <Map size={120} className="text-[#BEF754] mx-auto mb-4 opacity-50" />
                   <div className="font-mono text-[#BEF754] animate-pulse">PLOTTING TRAJECTORY...</div>
                </div>
                {/* Nodes */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#FF00FF] rounded-full shadow-[0_0_10px_#FF00FF] animate-ping"></div>
                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-[#00FFFF] rounded-full shadow-[0_0_10px_#00FFFF] animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"></div>
             </div>
          </div>
        </div>
      </section>

      {/* Deep Dive 4: Version Vault */}
      <section className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-16 text-[#FF00FF]">VERSION VAULT & AI STRIKE EDITING</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div>
              <History size={40} className="text-[#00FFFF] mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-[#FF00FF]">Never Lose a Version</h3>
              <p className="text-gray-400">Every iteration saved automatically. Access any previous resume version instantly. Perfect for targeting different roles or industries.</p>
            </div>
            <div>
              <Zap size={40} className="text-[#00FFFF] mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-[#FF00FF]">AI-Powered Rewrites</h3>
              <p className="text-gray-400">Hydra continuously optimizes your resume for each hunt. Industry-specific language. Role-specific keywords. Target-specific impact statements.</p>
            </div>
            <div>
              <PenTool size={40} className="text-[#00FFFF] mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-[#FF00FF]">Smart Cover Letters</h3>
              <p className="text-gray-400">Generate customized, compelling cover letters for every application. Each one tailored to the specific role and company culture.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 bg-black">
         <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-center text-[#0000FF]">CHOOSE YOUR HUNTING STYLE</h2>
            <p className="text-center text-gray-500 mb-16 text-xl">No contracts. No nonsense. Just results.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {/* Scout */}
               <PricingCard 
                 title="SCOUT MODE" 
                 price="FREE" 
                 desc="For the curious hunters"
                 features={[
                   '1 resume forged', 
                   'Basic analysis', 
                   'Light templates',
                   'No auto-hunt, multi-target strike, or career mapping'
                 ]}
                 cta="START AS A SCOUT"
               />
               
               {/* Hunter */}
               <PricingCard 
                 title="HUNTER MODE" 
                 price="$29/mo" 
                 desc="MOST POPULAR"
                 highlight
                 features={[
                   'Unlimited resume forging', 
                   'Full strike analysis', 
                   'AI-fueled editing', 
                   '30 auto-strikes/day', 
                   'Smart target matching',
                   'Version vault',
                   'AI cover letters'
                 ]}
                 cta="ACTIVATE HUNTER"
               />

               {/* Hydra */}
               <PricingCard 
                 title="HYDRA MODE" 
                 price="$69/mo" 
                 desc="For the unstoppable"
                 features={[
                   'Everything in Hunter', 
                   'Unlimited auto-strikes', 
                   'Career territory mapping', 
                   'Skill/qualification roadmap', 
                   'Course recommendations', 
                   'Priority strike queue', 
                   'Premium templates',
                   'Interview prep + AI drills'
                 ]}
                 cta="UNLEASH HYDRA"
                 color="border-[#BEF754]"
               />

               {/* Enterprise */}
               <PricingCard 
                 title="ENTERPRISE" 
                 price="CUSTOM" 
                 desc="For teams"
                 features={[
                   'Multi-seat hunting', 
                   'Whitelabel dashboards', 
                   'Bulk resume forging', 
                   'Bulk auto-strike campaigns', 
                   'API access', 
                   'Priority support'
                 ]}
                 cta="CONTACT COMMAND"
                 color="border-white"
               />
            </div>
            
            <p className="text-center mt-12 text-gray-400 font-medium">
               Not sure if you're ready? <span className="text-[#00FFFF]">Start as a Scout</span> — upgrade when you're done pretending you don't need a Hydra in your corner. Cancel anytime. Hydra doesn't do chains.
            </p>
         </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-4 text-center relative overflow-hidden bg-black">
         <div className="absolute inset-0 bg-[#0000FF]/10 pointer-events-none"></div>
         <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight text-[#FF00FF] drop-shadow-lg">
              YOU HUNT FOR SUCCESS. <br/>
              <span className="text-[#00FFFF]">HYDRA HUNTS FOR YOU.</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
              Stop wasting hours on job boards. Stop tweaking resumes for every application. Stop wondering if your next career move is the right one. Let Hydra handle the hunt while you focus on preparing for the <span className="text-[#00FFFF] font-bold">interviews that actually matter</span>.
            </p>
            <Link to="/dashboard" className="inline-block px-12 py-6 bg-[#00FFFF] text-black font-black text-2xl border-4 border-white shadow-[0_0_20px_#00FFFF] hover:scale-105 transition-all">
               UNLEASH HUNT MODE
            </Link>
         </div>
      </section>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/editor/:id" element={<Editor />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/converter" element={<Converter />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <footer className="bg-black text-white py-8 text-center border-t-4 border-[#00FFFF]">
               <p className="font-bold font-mono">VIBE CODING © 2024</p>
            </footer>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
