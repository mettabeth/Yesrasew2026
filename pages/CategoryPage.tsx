import React, { useState, useMemo, useEffect } from 'react';
import { ListingCategory } from '../types';
import { MOCK_LISTINGS, CATEGORIES } from '../constants';
import ListingCard from '../components/ListingCard';
import SidebarFilter from '../components/SidebarFilter';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronRight, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryPageProps {
  categoryType: ListingCategory;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryType }) => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);

  const categoryInfo = CATEGORIES.find(c => c.type === categoryType);

  // Monitor scroll to show/hide floating filter button on mobile
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingBtn(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearAll = () => {
    setFilters({});
    setSearchQuery('');
  };

  // Count active filters (excluding search)
  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).reduce((acc, [key, value]) => {
      if (['minPrice', 'maxPrice'].includes(key)) {
        return value ? acc + 1 : acc;
      }
      return Array.isArray(value) && value.length > 0 ? acc + 1 : acc;
    }, 0);
  }, [filters]);

  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter(listing => {
      if (listing.category !== categoryType) return false;
      
      // Search
      if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      // Price Filter
      if (filters.minPrice && (listing.price || 0) < Number(filters.minPrice)) return false;
      if (filters.maxPrice && (listing.price || 0) > Number(filters.maxPrice)) return false;

      // Dynamic Metadata Filters
      for (const [key, value] of Object.entries(filters)) {
        if (['minPrice', 'maxPrice'].includes(key)) continue;
        const activeValues = value as string[];
        if (activeValues.length === 0) continue;
        
        const listingValue = listing.metadata[key];
        if (!activeValues.includes(String(listingValue))) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [categoryType, filters, searchQuery, sortBy]);

  return (
    <div className="bg-gray-50/50 min-h-screen pb-10 relative">
      {/* Mobile Floating Filter Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[45] bg-primary text-accent px-6 py-3.5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-2 transition-all duration-300 border border-accent/20 active:scale-95 ${
          showFloatingBtn ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <Filter className="w-3.5 h-3.5" />
        Filter Search
        {activeFilterCount > 0 && (
          <span className="bg-accent text-primary w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black ml-1">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Page Header */}
      <div className="bg-primary pt-4 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
           <div className="absolute top-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-1 text-gray-400 text-[8px] font-bold uppercase tracking-widest mb-2">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-2.5 h-2.5" />
            <span className="text-accent">{categoryInfo?.name}</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-white">{categoryInfo?.name} Market</h1>
          <p className="text-gray-400 mt-0.5 text-xs max-w-xl opacity-80">
            {filteredListings.length} premium listings available in {categoryInfo?.name}.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        <div className="flex flex-col lg:flex-row gap-5">
          
          {/* Sidebar Filter */}
          <div className="lg:w-1/4">
            <SidebarFilter 
              category={categoryType}
              activeFilters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-2.5 mb-5 sticky top-[56px] lg:static z-40">
              <div className="relative w-full md:w-72 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-accent" />
                <input 
                  type="text" 
                  placeholder={`Search in ${categoryInfo?.name}...`}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-transparent rounded-lg focus:border-accent focus:bg-white outline-none text-[11px] font-bold transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="flex-grow md:flex-initial flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  <select 
                    className="bg-transparent text-[10px] font-bold outline-none cursor-pointer py-0.5 uppercase tracking-wider text-primary"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Lowest</option>
                    <option value="price_desc">Price: Highest</option>
                  </select>
                </div>
                
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden flex-grow flex items-center justify-center gap-1.5 bg-accent text-primary px-4 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg border border-primary/5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="bg-primary text-accent w-4 h-4 rounded-full flex items-center justify-center text-[8px] ml-0.5 font-black">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Active Filters Summary (Mobile only, quick dismiss) */}
            {activeFilterCount > 0 && (
               <div className="lg:hidden flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                 <button 
                   onClick={handleClearAll}
                   className="flex-shrink-0 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1"
                 >
                   <X className="w-2.5 h-2.5" /> Clear All
                 </button>
                 {Object.entries(filters).map(([key, value]) => {
                   if (Array.isArray(value) && value.length > 0) {
                     return value.map(v => (
                       <div key={`${key}-${v}`} className="flex-shrink-0 bg-white border border-gray-100 px-3 py-1.5 rounded-lg text-[8px] font-bold text-primary whitespace-nowrap">
                         {v}
                       </div>
                     ));
                   }
                   return null;
                 })}
               </div>
            )}

            {/* Grid */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 animate-in fade-in duration-500">
                {filteredListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border border-gray-100 shadow-sm">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-primary mb-2 uppercase tracking-tight">No results matched</h3>
                <p className="text-gray-400 text-xs mb-8 max-w-xs mx-auto font-medium">Try adjusting your filters or clearing them to see more results.</p>
                <button 
                  onClick={handleClearAll}
                  className="bg-primary text-accent px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/10 transition-all active:scale-95"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;