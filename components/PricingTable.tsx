
import React from 'react';
import { Check, Sparkles, Briefcase, FileText, Camera } from 'lucide-react';
import { useTranslation } from './LanguageContext';
import { PlanCategory } from '../types';

interface Plan {
  id: string;
  name: string;
  duration: number;
  price: number;
  isRecommended?: boolean;
}

const PRICING_DATA: Record<PlanCategory, Plan[]> = {
  [PlanCategory.JOBS]: [
    { id: 'j3', name: 'Standard', duration: 3, price: 500 },
    { id: 'j6', name: 'Professional', duration: 6, price: 999, isRecommended: true },
    { id: 'j12', name: 'Executive', duration: 12, price: 1450 },
  ],
  [PlanCategory.TENDERS]: [
    { id: 't3', name: 'Basic', duration: 3, price: 750 },
    { id: 't6', name: 'Business', duration: 6, price: 1450, isRecommended: true },
    { id: 't12', name: 'Enterprise', duration: 12, price: 2000 },
  ],
  [PlanCategory.ADS]: [
    { id: 'a1', name: 'Single Ad', duration: 1, price: 150 },
    { id: 'a10', name: 'Dealer Monthly', duration: 1, price: 2500, isRecommended: true },
    { id: 'a12m', name: 'Unlimited Yearly', duration: 12, price: 15000 },
  ],
};

const PricingTable: React.FC<{ category: PlanCategory }> = ({ category }) => {
  const { t } = useTranslation();
  const plans = PRICING_DATA[category];

  const getIcon = () => {
    switch (category) {
      case PlanCategory.JOBS: return <Briefcase className="w-6 h-6" />;
      case PlanCategory.TENDERS: return <FileText className="w-6 h-6" />;
      case PlanCategory.ADS: return <Camera className="w-6 h-6" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto px-4">
      {plans.map((plan) => (
        <div 
          key={plan.id}
          className={`relative rounded-[3rem] p-10 transition-all duration-500 flex flex-col h-full border-4 ${
            plan.isRecommended 
              ? 'bg-white shadow-[0_32px_64px_-16px_rgba(212,175,55,0.15)] border-accent scale-105 z-10' 
              : 'bg-white border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200'
          }`}
        >
          {plan.isRecommended && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg">
              <Sparkles className="w-3 h-3" />
              {t('recommended')}
            </div>
          )}

          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${plan.isRecommended ? 'bg-accent text-primary' : 'bg-primary/5 text-primary'}`}>
            {getIcon()}
          </div>

          <h3 className="text-2xl font-black text-primary-dark mb-2">{plan.name}</h3>
          <div className="flex items-baseline gap-1 mb-10">
            <span className="text-5xl font-black text-primary-dark tracking-tighter">{plan.price}</span>
            <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest ml-2">{t('etb')} / {plan.duration} {t('months')}</span>
          </div>

          <ul className="space-y-5 mb-12 flex-grow">
            {[
              'Unlimited Premium Access',
              'Advanced Filters & History',
              'Email/SMS Notifications',
              'Verified Gold Badge',
              'Direct VIP Support'
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start gap-4 text-sm font-medium text-gray-600">
                <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.isRecommended ? 'text-accent' : 'text-primary'}`} />
                {feature}
              </li>
            ))}
          </ul>

          <button
            className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all active:scale-95 shadow-lg ${
              plan.isRecommended 
                ? 'bg-primary text-accent hover:brightness-125 shadow-primary/10' 
                : 'bg-gray-100 text-primary-dark hover:bg-primary hover:text-white'
            }`}
          >
            {t('select_plan')}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PricingTable;