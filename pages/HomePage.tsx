import React, { useState, useMemo } from 'react';
import { Search, MapPin, Sparkles, Briefcase, FileText, Home, Car } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES, MOCK_LISTINGS } from '../constants';
import HorizontalScrollRow from '../components/HorizontalScrollRow';
import { useTranslation } from '../components/LanguageContext';
import { Language, ListingCategory } from '../types';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  // Calculate counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_LISTINGS.forEach(listing => {
      counts[listing.category] = (counts[listing.category] || 0) + 1;
    });
    return counts;
  }, []);

  const getCategoryTheme = (type: string) => {
    switch (type) {
      case 'JOB': 
        return {
          image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400',
          icon: <Briefcase className="w-3.5 h-3.5" />
        };
      case 'TENDER': 
        return {
          image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
          icon: <FileText className="w-3.5 h-3.5" />
        };
      case 'PROPERTY': 
        return {
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
          icon: <Home className="w-3.5 h-3.5" />
        };
      case 'VEHICLE': 
        return {
          image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400',
          icon: <Car className="w-3.5 h-3.5" />
        };
      default: return { image: '', icon: null };
    }
  };

  // Filter listings for specific rows
  const recentListings = MOCK_LISTINGS.slice(0, 10);
  const tenderListings = MOCK_LISTINGS.filter(l => l.category === ListingCategory.TENDER).slice(0, 10);
  const propertyListings = MOCK_LISTINGS.filter(l => l.category === ListingCategory.PROPERTY).slice(0, 10);
  const vehicleListings = MOCK_LISTINGS.filter(l => l.category === ListingCategory.VEHICLE).slice(0, 10);

  return (
    <div className="pb-8">
      {/* Hero Section */}
      <section className="relative bg-primary py-6 lg:py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-accent rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <p className="text-[9px] lg:text-[10px] text-accent font-black uppercase tracking-[0.4em] mb-3 opacity-90">
            {t('hero_subtitle')}
          </p>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-1 rounded-xl shadow-2xl flex flex-col md:flex-row gap-1 border border-white/10">
              <div className="flex-grow flex items-center px-4 gap-2 bg-gray-50/50 rounded-lg border border-gray-100 focus-within:border-accent group transition-all">
                <Search className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-accent" />
                <input 
                  type="text" 
                  placeholder={t('search_placeholder')}
                  className="w-full bg-transparent py-2 text-gray-800 font-bold focus:outline-none text-[11px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="md:w-32 flex items-center px-3 gap-2 bg-gray-50/50 rounded-lg border border-gray-100 focus-within:border-accent group transition-all">
                <MapPin className="w-2.5 h-2.5 text-gray-400 group-focus-within:text-accent" />
                <select className="w-full bg-transparent py-2 text-gray-800 font-bold focus:outline-none cursor-pointer text-[10px]">
                  <option>{t('all_locations')}</option>
                  <option>Addis Ababa</option>
                </select>
              </div>
              <button className="bg-accent hover:brightness-110 text-primary px-5 py-2 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all shadow-md active:scale-95">
                {t('find_now')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid - Full Width */}
      <section className="container mx-auto px-4 -mt-4 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {CATEGORIES.map((cat) => {
            const theme = getCategoryTheme(cat.type);
            const count = categoryCounts[cat.type] || 0;
            return (
              <Link 
                key={cat.slug} 
                to={`/${cat.slug}`}
                className="group relative h-20 lg:h-24 rounded-xl overflow-hidden bg-primary border border-white/5 hover:border-accent transition-all duration-300 flex flex-col items-start justify-end p-3 shadow-lg"
              >
                <div className="absolute inset-0">
                  <img 
                    src={theme.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover opacity-10 group-hover:scale-110 group-hover:opacity-15 transition-all duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent"></div>
                </div>

                <div className="relative z-10 w-full">
                  <div className="flex items-center justify-between mb-1">
                      <div className="bg-accent/10 p-1.5 rounded-lg text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-300 shadow-sm">
                      {theme.icon}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-accent group-hover:text-white transition-colors">{count}</span>
                      <span className="text-[5px] text-gray-400 uppercase tracking-widest font-black leading-none">{t('recent_listings')}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[11px] lg:text-xs font-black text-white group-hover:text-accent transition-colors leading-tight uppercase tracking-tight">
                      {language === Language.EN ? cat.name : cat.amName}
                    </h3>
                    <p className="text-[6px] text-gray-500 uppercase tracking-[0.3em] font-black mt-0.5 group-hover:text-gray-300 transition-colors">
                      {t('browse_listings')}
                    </p>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden rounded-tr-xl">
                    <div className="absolute top-1 right-[-20px] rotate-45 gold-gradient w-[60px] py-[0.5px] flex items-center justify-center shadow-sm">
                      <span className="text-[3px] font-black text-primary-dark uppercase tracking-[0.2em]">GOLD</span>
                    </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Vertical Rows of Category Specific Listings */}
      <div className="space-y-6">
        <HorizontalScrollRow 
          title={t('recent_listings')} 
          items={recentListings} 
          icon={<Sparkles className="w-3.5 h-3.5" />} 
          viewAllLink="/search"
          hideContact={true}
        />

        <HorizontalScrollRow 
          title={language === Language.AM ? 'የቅርብ ጊዜ ጨረታዎች' : 'Latest Tenders'} 
          items={tenderListings} 
          icon={<FileText className="w-3.5 h-3.5" />} 
          viewAllLink="/tenders"
          hideContact={true}
        />

        <HorizontalScrollRow 
          title={language === Language.AM ? 'ተለይተው የቀረቡ ቤቶች' : 'Featured Properties'} 
          items={propertyListings} 
          icon={<Home className="w-3.5 h-3.5" />} 
          viewAllLink="/property"
          hideContact={true}
        />

        <HorizontalScrollRow 
          title={language === Language.AM ? 'አዲስ ተሽከርካሪዎች' : 'New Vehicles'} 
          items={vehicleListings} 
          icon={<Car className="w-3.5 h-3.5" />} 
          viewAllLink="/vehicles"
          hideContact={true}
        />
      </div>

      {/* Minimized CTA Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-primary rounded-2xl p-6 lg:p-8 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xl border border-white/5">
            <div className="relative z-10 text-center lg:text-left">
              <h2 className="text-base lg:text-xl font-black text-white mb-0.5 uppercase tracking-tight">
                {t('sell_faster')}
              </h2>
              <p className="text-blue-200/40 text-[8px] mb-4 font-bold uppercase tracking-widest">
                {t('sell_faster_subtitle')}
              </p>
              <button 
                onClick={() => navigate('/post')}
                className="bg-accent hover:brightness-110 text-primary px-5 py-2 rounded-lg font-black uppercase tracking-widest text-[8px] transition-all shadow-md active:scale-95"
              >
                {t('create_listing')}
              </button>
            </div>

            <div className="relative z-10 flex gap-2">
              {[
                { label: 'Active', value: '250K+' },
                { label: 'Deals', value: '1.2K' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-center min-w-[70px]">
                  <div className="text-xs font-black text-accent">{stat.value}</div>
                  <div className="text-[5px] text-gray-400 font-black uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;