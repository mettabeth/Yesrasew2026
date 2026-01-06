import React from 'react';
import { ListingCategory } from '../types';
import { FILTER_OPTIONS } from '../constants';
import { ChevronDown, Filter, X, Tag, Settings2, MapPin, Briefcase, Home, Car, FileText } from 'lucide-react';

interface FilterSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, icon, children }) => (
  <div className="mb-4 last:mb-0 bg-white/50 border border-gray-100 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-sm">
    <h4 className="text-[10px] font-black text-primary/70 uppercase tracking-widest mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon && <span className="text-accent">{icon}</span>}
        {title}
      </div>
      <ChevronDown className="w-3 h-3 text-gray-300" />
    </h4>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

interface CheckboxProps {
  label: string;
  groupKey: string;
  value: string;
  activeFilters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ 
  label, 
  groupKey, 
  value, 
  activeFilters, 
  onFilterChange 
}) => {
  const isChecked = activeFilters[groupKey]?.includes(value);
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className={`w-4 h-4 rounded-lg border-2 flex items-center justify-center transition-all ${
        isChecked ? 'bg-accent border-accent' : 'border-gray-200 group-hover:border-accent bg-white'
      }`}>
        {isChecked && <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>}
      </div>
      <input 
        type="checkbox" 
        className="hidden" 
        checked={isChecked || false}
        onChange={() => {
          const current = activeFilters[groupKey] || [];
          const next = current.includes(value) 
            ? current.filter((v: string) => v !== value) 
            : [...current, value];
          onFilterChange(groupKey, next);
        }}
      />
      <span className={`text-[11px] font-bold tracking-tight transition-colors ${isChecked ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}`}>{label}</span>
    </label>
  );
};

interface SidebarFilterProps {
  category: ListingCategory;
  activeFilters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({ 
  category, 
  activeFilters, 
  onFilterChange, 
  onClearAll,
  isOpen,
  onClose
}) => {
  const options = FILTER_OPTIONS[category] as any;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-primary/60 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-full sm:w-80 bg-gray-50 shadow-2xl p-6 overflow-y-auto transition-transform duration-300 ease-out lg:static lg:z-0 lg:w-full lg:shadow-none lg:translate-x-0 lg:rounded-3xl lg:border lg:border-gray-100 lg:bg-white/80 lg:backdrop-blur-sm
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-black text-primary uppercase tracking-tight">Filters</h2>
          </div>
          <button 
            onClick={onClose} 
            className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-500 rounded-xl shadow-sm hover:text-red-500 transition-all border border-gray-100 active:scale-95"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs font-black text-primary hidden lg:flex items-center gap-2 uppercase tracking-[0.2em]">
            <Filter className="w-4 h-4 text-accent" />
            Selection
          </h2>
          <button 
            onClick={onClearAll}
            className="text-[9px] font-black text-accent hover:text-primary hover:underline uppercase tracking-widest transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Reset All
          </button>
        </div>

        <div className="space-y-4">
          {/* Price Range */}
          <FilterSection title="Budget / Price" icon={<Tag className="w-3.5 h-3.5" />}>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300">MIN</span>
                <input 
                  type="number" 
                  placeholder="0" 
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-primary focus:ring-2 focus:ring-accent/10 focus:border-accent outline-none transition-all"
                  value={activeFilters.minPrice || ''}
                  onChange={(e) => onFilterChange('minPrice', e.target.value)}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300">MAX</span>
                <input 
                  type="number" 
                  placeholder="Any" 
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-primary focus:ring-2 focus:ring-accent/10 focus:border-accent outline-none transition-all"
                  value={activeFilters.maxPrice || ''}
                  onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </FilterSection>

          {/* Category-Specific Sections */}
          {category === ListingCategory.JOB && (
            <>
              <FilterSection title="Job Type" icon={<Briefcase className="w-3.5 h-3.5" />}>
                {options.types.map((t: string) => (
                  <Checkbox key={t} label={t} groupKey="type" value={t} activeFilters={activeFilters} onFilterChange={onFilterChange} />
                ))}
              </FilterSection>
              <FilterSection title="Market Sector" icon={<Settings2 className="w-3.5 h-3.5" />}>
                {options.industries.map((i: string) => (
                  <Checkbox key={i} label={i} groupKey="industry" value={i} activeFilters={activeFilters} onFilterChange={onFilterChange} />
                ))}
              </FilterSection>
            </>
          )}

          {category === ListingCategory.PROPERTY && (
            <>
              <FilterSection title="Deal Type" icon={<Tag className="w-3.5 h-3.5" />}>
                {options.listing_types.map((t: string) => (
                  <Checkbox key={t} label={t} groupKey="listing_type" value={t} activeFilters={activeFilters} onFilterChange={onFilterChange} />
                ))}
              </FilterSection>
              <FilterSection title="Bedrooms" icon={<Home className="w-3.5 h-3.5" />}>
                {options.bedrooms.map((b: string) => (
                  <Checkbox key={b} label={b} groupKey="bedrooms" value={b} activeFilters={activeFilters} onFilterChange={onFilterChange} />
                ))}
              </FilterSection>
              <FilterSection title="Category" icon={<MapPin className="w-3.5 h-3.5" />}>
                {options.types.map((t: string) => (
                  <Checkbox key={t} label={t} groupKey="type" value={t} activeFilters={activeFilters} onFilterChange={onFilterChange} />
                ))}
              </FilterSection>
            </>
          )}

          {category === ListingCategory.VEHICLE && (
            <>
              <FilterSection title="Brand" icon={<Car className="w-3.5 h-3.5" />}>
                {options.makes.map((m: string) => (
                  <Checkbox key={m} label={m} groupKey="make" value={m} activeFilters={activeFilters} onFilterChange={onFilterChange} />
                ))}
              </FilterSection>
              <FilterSection title="Energy Source" icon={<Settings2 className="w-3.5 h-3.5" />}>
                {options.fuel_types.map((f: string) => (
                  <Checkbox key={f} label={f} groupKey="fuel" value={f} activeFilters={activeFilters} onFilterChange={onFilterChange} />
                ))}
              </FilterSection>
              <FilterSection title="Release Year" icon={<Tag className="w-3.5 h-3.5" />}>
                {options.years.map((y: string) => (
                  <Checkbox key={y} label={y} groupKey="year" value={y} activeFilters={activeFilters} onFilterChange={onFilterChange} />
                ))}
              </FilterSection>
            </>
          )}

          {category === ListingCategory.TENDER && (
            <>
              <FilterSection title="Industry" icon={<FileText className="w-3.5 h-3.5" />}>
                {options.sectors.map((s: string) => (
                  <Checkbox key={s} label={s} groupKey="sector" value={s} activeFilters={activeFilters} onFilterChange={onFilterChange} />
                ))}
              </FilterSection>
              <FilterSection title="Timeline" icon={<Settings2 className="w-3.5 h-3.5" />}>
                {options.status.map((s: string) => (
                  <Checkbox key={s} label={s} groupKey="status" value={s} activeFilters={activeFilters} onFilterChange={onFilterChange} />
                ))}
              </FilterSection>
            </>
          )}
        </div>

        <div className="mt-8 sticky bottom-0 bg-gray-50/80 lg:bg-white/80 backdrop-blur-md pt-4 pb-2">
          <button 
            className="w-full bg-primary text-accent py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 active:scale-95 transition-all hover:brightness-110 flex items-center justify-center gap-2"
            onClick={onClose}
          >
            Apply Selection
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarFilter;