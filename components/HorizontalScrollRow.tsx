import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ListingCard from './ListingCard';
import { useTranslation } from './LanguageContext';

interface ScrollRowProps {
  title: string;
  items: any[];
  icon: React.ReactNode;
  viewAllLink: string;
  hideContact?: boolean;
}

const HorizontalScrollRow: React.FC<ScrollRowProps> = ({ title, items, icon, viewAllLink, hideContact = false }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="container mx-auto px-4 py-4 group/row">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm lg:text-base font-black text-primary flex items-center gap-2 uppercase tracking-tight">
          <span className="text-accent">{icon}</span>
          {title}
        </h2>
        <Link to={viewAllLink} className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-accent transition-all">
          {t('view_all')} <ChevronRight className="w-2.5 h-2.5" />
        </Link>
      </div>

      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-[-10px] top-1/2 -translate-y-1/2 z-20 bg-primary text-accent p-1.5 rounded-full shadow-lg opacity-0 group-hover/row:opacity-100 transition-opacity hover:scale-110 active:scale-95 hidden md:block border border-white/10"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="absolute right-[-10px] top-1/2 -translate-y-1/2 z-20 bg-primary text-accent p-1.5 rounded-full shadow-lg opacity-0 group-hover/row:opacity-100 transition-opacity hover:scale-110 active:scale-95 hidden md:block border border-white/10"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory"
        >
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-[200px] lg:w-[240px] snap-start">
              <ListingCard listing={item} hideContact={hideContact} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontalScrollRow;