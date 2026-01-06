
import React from 'react';
import { useTranslation } from './LanguageContext';
import { Language } from '../types';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  whiteText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', whiteText = true }) => {
  const { language } = useTranslation();
  
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Geometric 'Y/S' Icon from image */}
      <div className={`${iconSizes[size]} relative mb-1`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <path d="M50 5L85 35L50 65L15 35L50 5Z" fill="url(#gold_grad)" />
          <path d="M50 35L85 65L50 95L15 65L50 35Z" fill="url(#gold_grad)" />
          <path d="M50 35L70 50L50 65L30 50L50 35Z" fill="#001b3a" />
          <defs>
            <linearGradient id="gold_grad" x1="15" y1="5" x2="85" y2="95" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d4af37" />
              <stop offset="0.5" stopColor="#f4e3b1" />
              <stop offset="1" stopColor="#b8860b" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Brand Text */}
      <div className="flex flex-col items-center leading-tight">
        <span className={`${textSizes[size]} font-black tracking-wider ${whiteText ? 'text-white' : 'text-primary'}`}>
          {language === Language.AM ? 'የስራ ሰው' : 'YESRASEW'}
        </span>
        <span className="text-[0.4em] font-bold tracking-[0.3em] uppercase opacity-80 text-accent">
          {language === Language.AM ? 'የነጠረ ወርቅ' : 'PURE GOLD'}
        </span>
      </div>
    </div>
  );
};

export default Logo;