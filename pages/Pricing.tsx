
import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession } from '../services/stripe';

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async (plan: 'hunter' | 'hydra') => {
    // 1. Check Authentication
    if (!user) {
      // Redirect to Login, passing the plan as a query param so we can resume later
      navigate(`/login?plan=${plan}`);
      return;
    }

    // 2. Initiate Stripe Checkout
    const priceId = plan === 'hunter' ? 'price_hunter_id' : 'price_hydra_id';
    await createCheckoutSession(priceId, user.email);
  };

  return (
    <div className="py-20 px-4 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4">CHOOSE YOUR <span className="text-[#0000FF]">WEAPON</span></h1>
          <p className="text-xl text-gray-400">No contracts. No nonsense. Just results.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Free Plan */}
          <div className="bg-[#111] border border-[#333] p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2 font-mono text-gray-400">SCOUT MODE</h3>
            <div className="text-4xl font-black mb-6 text-white">$0</div>
            <p className="text-sm text-gray-500 mb-6 font-bold">For the curious hunters</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 items-center text-gray-300"><Check size={18} className="text-[#00FFFF]" /> 1 Resume Forged</li>
              <li className="flex gap-3 items-center text-gray-300"><Check size={18} className="text-[#00FFFF]" /> Basic Templates</li>
              <li className="flex gap-3 items-center text-gray-600 line-through"><Check size={18} /> Auto-Hunt Protocol</li>
            </ul>
            <Button variant="ghost" fullWidth className="border border-white text-white hover:bg-white hover:text-black" onClick={() => navigate('/dashboard')}>START SCOUTING</Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#111] border-2 border-[#00FFFF] p-8 relative flex flex-col shadow-[0_0_30px_rgba(0,255,255,0.1)] z-10">
            <div className="absolute top-0 right-0 bg-[#00FFFF] text-black font-bold px-3 py-1 text-xs">
               MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-2 font-mono text-white">HUNTER MODE</h3>
            <div className="text-5xl font-black mb-6 flex items-baseline gap-2 text-white">
              $29 <span className="text-lg text-gray-500 font-medium">/mo</span>
            </div>
            <p className="text-sm text-[#00FFFF] mb-6 font-bold">Serious firepower</p>
            <ul className="space-y-4 mb-8 flex-1 font-medium">
              <li className="flex gap-3 items-center text-white"><Check size={18} className="text-[#00FFFF]" /> Unlimited Resumes</li>
              <li className="flex gap-3 items-center text-white"><Check size={18} className="text-[#00FFFF]" /> Full Strike Analysis</li>
              <li className="flex gap-3 items-center text-white"><Check size={18} className="text-[#00FFFF]" /> AI-Fueled Editing</li>
              <li className="flex gap-3 items-center text-white"><Check size={18} className="text-[#00FFFF]" /> 30 Auto-Strikes/Day</li>
            </ul>
            <Button 
                variant="primary" 
                fullWidth 
                className="bg-[#00FFFF] border-[#00FFFF] text-black font-black hover:bg-white hover:text-black"
                onClick={() => handleSubscribe('hunter')}
            >
                ACTIVATE HUNTER
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-[#111] border border-[#BEF754] p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2 font-mono text-white">HYDRA MODE</h3>
            <div className="text-4xl font-black mb-6 text-white">$69 <span className="text-lg text-gray-500 font-medium">/mo</span></div>
             <p className="text-sm text-[#BEF754] mb-6 font-bold">For the unstoppable</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 items-center text-gray-300"><Check size={18} className="text-[#BEF754]" /> Everything in Hunter</li>
              <li className="flex gap-3 items-center text-gray-300"><Check size={18} className="text-[#BEF754]" /> Unlimited Auto-Strikes</li>
              <li className="flex gap-3 items-center text-gray-300"><Check size={18} className="text-[#BEF754]" /> Career Territory Mapping</li>
              <li className="flex gap-3 items-center text-gray-300"><Check size={18} className="text-[#BEF754]" /> Priority Queue</li>
            </ul>
            <Button 
                variant="ghost" 
                fullWidth 
                className="border border-[#BEF754] text-[#BEF754] hover:bg-[#BEF754] hover:text-black"
                onClick={() => handleSubscribe('hydra')}
            >
                UNLEASH HYDRA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
