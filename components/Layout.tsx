
import React, { useState } from 'react';
import { Search, PlusCircle, User, Bell, Menu, X, Globe, LogIn, ShieldAlert } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from './LanguageContext';
import { Language } from '../types';
import Logo from './Logo';
import AIAssistant from './AIAssistant';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === Language.EN ? Language.AM : Language.EN);
  };

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('jobs'), path: '/jobs' },
    { name: t('tenders'), path: '/tenders' },
    { name: t('property'), path: '/property' },
    { name: t('vehicles'), path: '/vehicles' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar - Space Minimized */}
      <header className="bg-primary text-white sticky top-0 z-50 shadow-md border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center transition-transform hover:scale-105">
              <Logo size="sm" className="items-start" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`text-[9px] font-black uppercase tracking-widest hover:text-accent transition-all ${
                    location.pathname === link.path ? 'text-accent border-b border-accent pb-0.5' : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={toggleLanguage}
                className="p-1 text-gray-300 hover:text-accent rounded-full hover:bg-white/5 flex items-center gap-1 text-[8px] font-black transition-colors"
              >
                <Globe className="w-2.5 h-2.5" />
                {language === Language.EN ? 'AM' : 'EN'}
              </button>
              
              <button 
                onClick={() => navigate('/post')}
                className="hidden sm:flex items-center gap-1 bg-accent hover:brightness-110 text-primary-dark px-3 py-1.5 rounded-md text-[8px] font-black uppercase tracking-widest transition-all shadow-md"
              >
                <PlusCircle className="w-3 h-3" />
                {t('post_ad')}
              </button>

              <div className="hidden lg:flex items-center gap-1.5 border-l border-white/10 pl-1.5 ml-1">
                <button 
                  onClick={() => navigate('/login')}
                  className="p-1 text-gray-300 hover:text-accent transition-colors"
                >
                  <LogIn className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-white/5 hover:bg-white/10 text-white px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all"
                >
                  {t('register')}
                </button>
              </div>
              
              <button 
                className="md:hidden p-1 text-accent"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-primary-dark border-t border-white/5 px-4 py-2 space-y-1 animate-in slide-in-from-top duration-300">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-sm font-bold py-1.5 border-b border-white/5 text-gray-200"
              >
                {t(link.name.toLowerCase())}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* AI Assistant */}
      <AIAssistant />

      {/* Footer - Space Minimized */}
      <footer className="bg-primary-dark text-gray-300 pt-8 pb-4 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="col-span-1">
              <Logo size="sm" className="items-start mb-2" />
              <p className="text-[9px] leading-relaxed text-gray-400 max-w-xs">
                {t('hero_subtitle')}
              </p>
            </div>
            <div>
              <h4 className="text-accent font-black uppercase tracking-widest text-[8px] mb-2">Market</h4>
              <ul className="space-y-1 text-[10px] font-medium">
                <li><Link to="/jobs" className="hover:text-accent transition-colors">{t('jobs')}</Link></li>
                <li><Link to="/tenders" className="hover:text-accent transition-colors">{t('tenders')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-accent font-black uppercase tracking-widest text-[8px] mb-2">Company</h4>
              <ul className="space-y-1 text-[10px] font-medium">
                <li><Link to="/pricing" className="hover:text-accent transition-colors">{t('pricing_title')}</Link></li>
                <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-accent font-black uppercase tracking-widest text-[8px] mb-2">Join Us</h4>
              <div className="flex gap-1">
                <input 
                  type="email" 
                  placeholder="Email"
                  className="bg-white/5 border border-white/10 rounded-md px-2 py-1 text-[10px] focus:ring-1 focus:ring-accent w-full outline-none"
                />
                <button className="bg-accent text-primary px-2 py-1 rounded-md font-black uppercase text-[8px] tracking-widest">
                  OK
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-4 flex flex-col md:flex-row justify-between items-center gap-2 text-[7px] font-black uppercase tracking-[0.2em] text-gray-500">
            <p className="normal-case">2026 የስራ ሰው Yesra Sew</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/login" className="flex items-center gap-1 hover:text-accent transition-colors text-accent/80">
                <ShieldAlert className="w-2.5 h-2.5" />
                Admin
              </Link>
              <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
