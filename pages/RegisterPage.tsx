
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  User, 
  Briefcase, 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Upload,
  Globe,
  LogIn,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from '../components/LanguageContext';
import { UserRole } from '../types';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: 'yesrasew2@gmail.com', // Pre-filled default admin email
    phone: '',
    password: '661140',           // Pre-filled default admin password
    companyName: '',
    license: '',
    website: '',
    agencyName: '',
    region: '',
  });

  useEffect(() => {
    const isLoginPage = location.pathname === '/login';
    setIsLogin(isLoginPage);
    setStep(1);
    setError('');
  }, [location.pathname]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Simulate API call and Admin Authentication
    setTimeout(() => {
      if (isLogin) {
        if (formData.email === 'yesrasew2@gmail.com' && formData.password === '661140') {
          navigate('/admin/dashboard');
        } else {
          // Regular user login mock or error
          if (formData.email && formData.password) {
             navigate('/');
          } else {
             setError('Invalid email or password');
          }
        }
      } else {
        // Registration mock
        navigate('/');
      }
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-accent p-2 rounded-xl">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <span className="text-3xl font-black tracking-tighter italic text-primary">YESRASEW</span>
        </Link>
        <h2 className="text-3xl font-black text-primary">
          {isLogin ? t('login') : t('create_account')}
        </h2>
        {!isLogin && <p className="mt-2 text-gray-500">{t('step')} {step} / 2</p>}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl shadow-blue-900/5 rounded-[3rem] border border-gray-100 sm:px-10">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('email')}</label>
                <input 
                  required 
                  type="email" 
                  placeholder="admin@yesrasew.com"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('password')}</label>
                <div className="relative">
                  <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    required 
                    type="password" 
                    placeholder="••••••"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-5 rounded-2xl font-black shadow-lg hover:bg-blue-900 transition-all active:scale-95 disabled:opacity-50"
              >
                <LogIn className="w-5 h-5" />
                {isSubmitting ? 'Authenticating...' : t('login')}
              </button>
              <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest mt-6">
                Don't have an account? {' '}
                <Link to="/register" className="text-accent hover:underline">Register Now</Link>
              </p>
            </form>
          ) : (
            <>
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">{t('select_category')}</h3>
                  <div className="grid grid-cols-1 gap-4 mb-8">
                    {[
                      { id: UserRole.INDIVIDUAL, name: t('individual'), desc: 'Job seeker, buyer or general user', icon: <User /> },
                      { id: UserRole.EMPLOYER, name: t('employer'), desc: 'Post jobs and hire talent', icon: <Briefcase /> },
                      { id: UserRole.DEALER, name: t('dealer'), desc: 'Car or Property agent', icon: <Building2 /> },
                    ].map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all text-left ${
                          role === r.id 
                            ? 'border-accent bg-orange-50 ring-4 ring-orange-50' 
                            : 'border-gray-50 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <div className={`p-3 rounded-2xl ${role === r.id ? 'bg-accent text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {r.icon}
                        </div>
                        <div>
                          <h4 className={`font-bold ${role === r.id ? 'text-primary' : 'text-gray-700'}`}>{r.name}</h4>
                          <p className="text-xs text-gray-400 mt-1">{r.desc}</p>
                        </div>
                        {role === r.id && <CheckCircle2 className="ml-auto text-accent w-6 h-6" />}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={!role}
                    onClick={handleNext}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white py-5 rounded-2xl font-black shadow-lg disabled:opacity-50 transition-all hover:bg-blue-900 active:scale-95"
                  >
                    {t('next')}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest mt-8">
                    Already have an account? {' '}
                    <Link to="/login" className="text-accent hover:underline">Sign In</Link>
                  </p>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('full_name')}</label>
                      <input 
                        required 
                        type="text" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('email')}</label>
                      <input 
                        required 
                        type="email" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('phone')}</label>
                      <input 
                        required 
                        type="tel" 
                        placeholder="+251..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>

                    {role === UserRole.EMPLOYER && (
                      <>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">{t('company_name')}</label>
                          <input 
                            required 
                            type="text" 
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                            onChange={e => setFormData({...formData, companyName: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">{t('license_number')}</label>
                          <input 
                            required 
                            type="text" 
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                            onChange={e => setFormData({...formData, license: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">{t('website')}</label>
                          <input 
                            type="url" 
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                            onChange={e => setFormData({...formData, website: e.target.value})}
                          />
                        </div>
                      </>
                    )}

                    {role === UserRole.DEALER && (
                      <>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">{t('agency_name')}</label>
                          <input 
                            required 
                            type="text" 
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                            onChange={e => setFormData({...formData, agencyName: e.target.value})}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">{t('id_upload')}</label>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-100 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-xs text-gray-400">PDF, JPG or PNG (Max. 5MB)</p>
                              </div>
                              <input type="file" className="hidden" />
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('password')}</label>
                      <input 
                        required 
                        type="password" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center justify-center gap-2 px-6 py-5 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      {t('back')}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-grow flex items-center justify-center gap-2 bg-accent text-white py-5 rounded-2xl font-black shadow-lg shadow-orange-900/10 hover:bg-orange-600 transition-all disabled:opacity-50 active:scale-95"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      {isSubmitting ? 'Creating Account...' : t('register')}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
