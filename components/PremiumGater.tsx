import React, { useState } from 'react';
import { Lock, Sparkles, CreditCard, PhoneCall } from 'lucide-react';
import { useTranslation } from './LanguageContext';
import { useNavigate } from 'react-router-dom';

interface PremiumGaterProps {
  isSubscribed: boolean;
  children: React.ReactNode;
  category: 'jobs' | 'tenders' | 'ads';
}

const PremiumGater: React.FC<PremiumGaterProps> = ({ isSubscribed, children, category }) => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);

  if (isSubscribed) return <>{children}</>;

  if (!showPrompt) {
    return (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setShowPrompt(true);
        }}
        className="w-full py-3.5 border-2 border-dashed border-accent/30 rounded-2xl flex items-center justify-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-accent bg-accent/5 hover:bg-accent/10 hover:border-accent/50 transition-all active:scale-95 group"
      >
        <PhoneCall className="w-4 h-4 transition-transform group-hover:scale-110 group-hover:-rotate-12" />
        {language === 'am' ? 'ስልክ ቁጥር አሳይ' : 'Show Contact'}
      </button>
    );
  }

  return (
    <div className="bg-white border border-accent/20 rounded-2xl p-5 text-center animate-in fade-in zoom-in duration-300 shadow-xl shadow-primary/5">
      <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-3">
        <Sparkles className="w-5 h-5" />
      </div>
      <p className="text-[10px] font-black text-primary/80 mb-4 uppercase tracking-widest leading-relaxed px-2">
        {language === 'am' ? 'ይህንን መረጃ ለማግኘት ደንበኛ መሆን ያስፈልጋል' : 'Subscription required to view contact details'}
      </p>
      <div className="flex flex-col gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/pricing');
          }}
          className="w-full bg-primary text-accent py-3.5 rounded-xl font-black uppercase text-[9px] tracking-[0.15em] shadow-lg shadow-primary/10 flex items-center justify-center gap-2 hover:brightness-110 transition-all"
        >
          <CreditCard className="w-3.5 h-3.5" />
          {t('select_plan')}
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowPrompt(false);
          }}
          className="py-2 text-[8px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors"
        >
          {t('back')}
        </button>
      </div>
    </div>
  );
};

export default PremiumGater;