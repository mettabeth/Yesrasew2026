
import React, { useState } from 'react';
import { useTranslation } from '../components/LanguageContext';
import PricingTable from '../components/PricingTable';
import { PlanCategory } from '../types';
import { CheckCircle2, Zap, ShieldCheck, Clock, Sparkles } from 'lucide-react';

const PricingPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<PlanCategory>(PlanCategory.JOBS);

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <div className="bg-primary pt-24 pb-48 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Zap className="w-[600px] h-[600px] text-accent -rotate-12 translate-x-1/4 -translate-y-1/4" />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50/50 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-accent/20">
            <Sparkles className="w-4 h-4" />
            Premium Marketplace
          </div>
          <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tight leading-none">
            {t('pricing_title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium opacity-80 leading-relaxed">
            {t('pricing_subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-20">
        {/* Category Toggle */}
        <div className="max-w-2xl mx-auto mb-20 p-2.5 bg-white/95 backdrop-blur-md rounded-[3rem] shadow-2xl border border-white/20 flex gap-2">
          {[
            { id: PlanCategory.JOBS, label: t('jobs') },
            { id: PlanCategory.TENDERS, label: t('tenders') },
            { id: PlanCategory.ADS, label: t('property') + ' & ' + t('vehicles') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-grow py-5 px-3 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-primary text-accent shadow-xl shadow-primary/20 scale-105' 
                  : 'text-gray-400 hover:text-primary hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <PricingTable category={activeTab} />

        {/* Benefits Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto border-t border-gray-200 pt-24">
          <div className="text-center group">
            <div className="w-20 h-20 bg-primary/5 text-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 transition-all group-hover:bg-primary group-hover:text-accent group-hover:-translate-y-2 shadow-sm">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-primary-dark mb-4">Verified Listings</h4>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">All premium accounts go through a rigorous verification process to ensure market safety and trust.</p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 bg-accent/10 text-accent rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 transition-all group-hover:bg-accent group-hover:text-primary group-hover:-translate-y-2 shadow-sm">
              <Zap className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-primary-dark mb-4">Instant Alerts</h4>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">Get real-time SMS and Email alerts the moment a new matching tender or job is posted in Ethiopia.</p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 transition-all group-hover:bg-green-600 group-hover:text-white group-hover:-translate-y-2 shadow-sm">
              <Clock className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-primary-dark mb-4">Priority Support</h4>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">Dedicated account manager for our enterprise and business tier subscribers to help you succeed.</p>
          </div>
        </div>

        <div className="mt-24 bg-primary rounded-[4rem] p-12 lg:p-20 border border-white/5 shadow-2xl max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
          
          <div className="flex-shrink-0 relative z-10">
            <div className="p-6 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-6">
                <div className="w-24 h-12 bg-[#2c52ed] rounded-xl flex items-center justify-center text-white font-black text-[10px] uppercase tracking-widest shadow-lg">Chapa</div>
                <div className="w-24 h-12 bg-[#ffcc00] rounded-xl flex items-center justify-center text-primary font-black text-[10px] uppercase tracking-widest shadow-lg">Telebirr</div>
              </div>
            </div>
          </div>
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-3xl lg:text-4xl font-black text-white mb-4">Secure Local Payments</h3>
            <p className="text-gray-400 text-lg mb-8 font-medium">We support all major Ethiopian payment gateways for instant, safe subscription activation.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-8">
              <span className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-accent">
                <CheckCircle2 className="w-5 h-5" /> Secure Processing
              </span>
              <span className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-accent">
                <CheckCircle2 className="w-5 h-5" /> Instant Activation
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;