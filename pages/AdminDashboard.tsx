
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { 
  TrendingUp, 
  Users as UsersIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  Eye,
  Search,
  DollarSign,
  Settings,
  Layers,
  Plus,
  Edit3,
  Trash2,
  ChevronRight,
  Briefcase,
  FileText,
  Home,
  Car,
  Tag,
  ArrowLeft,
  Settings2,
  MoreVertical,
  GripVertical
} from 'lucide-react';
import { MOCK_LISTINGS, CATEGORIES } from '../constants';
import { ListingCategory, CategoryItem } from '../types';

interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'boolean';
  required: boolean;
  options?: string[];
}

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'moderation' | 'pricing' | 'categories' | 'users'>('moderation');
  const [pendingAds, setPendingAds] = useState(MOCK_LISTINGS.slice(0, 5));
  
  // Fields Management State
  const [selectedCategoryForFields, setSelectedCategoryForFields] = useState<CategoryItem | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  
  const [categoryFields, setCategoryFields] = useState<Record<ListingCategory, CustomField[]>>({
    [ListingCategory.JOB]: [
      { id: '1', name: 'job_type', label: 'Job Type', type: 'select', required: true, options: ['Full-time', 'Part-time', 'Contract'] },
      { id: '2', name: 'experience', label: 'Years of Experience', type: 'number', required: true }
    ],
    [ListingCategory.TENDER]: [
      { id: '3', name: 'deadline', label: 'Closing Date', type: 'date', required: true },
      { id: '4', name: 'sector', label: 'Industrial Sector', type: 'select', required: true, options: ['Construction', 'IT', 'Supply'] }
    ],
    [ListingCategory.PROPERTY]: [
      { id: '5', name: 'bedrooms', label: 'Bedrooms', type: 'number', required: true },
      { id: '6', name: 'area', label: 'Square Meters', type: 'number', required: false }
    ],
    [ListingCategory.VEHICLE]: [
      { id: '7', name: 'year', label: 'Manufacturing Year', type: 'number', required: true },
      { id: '8', name: 'fuel_type', label: 'Fuel Type', type: 'select', required: true, options: ['Petrol', 'Diesel', 'Electric'] }
    ]
  });

  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<CustomField['type']>('text');

  useEffect(() => {
    if (location.pathname.includes('categories')) setActiveTab('categories');
    else if (location.pathname.includes('settings')) setActiveTab('pricing');
    else if (location.pathname.includes('moderation')) setActiveTab('moderation');
  }, [location]);

  const stats = [
    { label: 'Total Revenue', value: '482,000 ETB', icon: DollarSign, color: 'text-green-500' },
    { label: 'Active Users', value: '12,402', icon: UsersIcon, color: 'text-blue-500' },
    { label: 'Pending Approval', value: '42', icon: Clock, color: 'text-orange-500' },
    { label: 'Completion Rate', value: '98.2%', icon: TrendingUp, color: 'text-accent' },
  ];

  const approveAd = (id: string) => {
    setPendingAds(prev => prev.filter(ad => ad.id !== id));
  };

  const getCategoryIcon = (type: ListingCategory) => {
    switch (type) {
      case ListingCategory.JOB: return <Briefcase className="w-5 h-5" />;
      case ListingCategory.TENDER: return <FileText className="w-5 h-5" />;
      case ListingCategory.PROPERTY: return <Home className="w-5 h-5" />;
      case ListingCategory.VEHICLE: return <Car className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  const handleAddField = () => {
    if (!selectedCategoryForFields || !newFieldName) return;
    const newField: CustomField = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFieldName.toLowerCase().replace(/\s+/g, '_'),
      label: newFieldName,
      type: newFieldType,
      required: true
    };
    setCategoryFields(prev => ({
      ...prev,
      [selectedCategoryForFields.type]: [...prev[selectedCategoryForFields.type], newField]
    }));
    setNewFieldName('');
  };

  const removeField = (fieldId: string) => {
    if (!selectedCategoryForFields) return;
    setCategoryFields(prev => ({
      ...prev,
      [selectedCategoryForFields.type]: prev[selectedCategoryForFields.type].filter(f => f.id !== fieldId)
    }));
  };

  // Drag and Drop Handlers
  const onDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (index: number) => {
    if (!selectedCategoryForFields || draggedItemIndex === null) return;
    
    const fields = [...categoryFields[selectedCategoryForFields.type]];
    const draggedItem = fields[draggedItemIndex];
    fields.splice(draggedItemIndex, 1);
    fields.splice(index, 0, draggedItem);

    setCategoryFields(prev => ({
      ...prev,
      [selectedCategoryForFields.type]: fields
    }));
    setDraggedItemIndex(null);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-6 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-primary uppercase tracking-tight">System Management</h1>
            <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest mt-0.5">
              Admin Portal | {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-accent transition-all w-48"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Content Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="flex border-b border-gray-50 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => { setActiveTab('moderation'); setSelectedCategoryForFields(null); }}
              className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'moderation' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-primary'}`}
            >
              Moderation
            </button>
            <button 
              onClick={() => { setActiveTab('categories'); setSelectedCategoryForFields(null); }}
              className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'categories' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-primary'}`}
            >
              Categories
            </button>
            <button 
              onClick={() => { setActiveTab('pricing'); setSelectedCategoryForFields(null); }}
              className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'pricing' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-primary'}`}
            >
              Pricing
            </button>
          </div>

          <div className="p-6 lg:p-8">
            {activeTab === 'moderation' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black text-primary flex items-center gap-2 uppercase tracking-widest">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    Pending Approvals
                  </h3>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{pendingAds.length} Items</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-50">
                        <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Listing</th>
                        <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Category</th>
                        <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Price</th>
                        <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pendingAds.map((ad) => (
                        <tr key={ad.id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative group/thumb overflow-visible">
                                <img 
                                  src={ad.images[0]} 
                                  className="w-10 h-10 rounded-lg object-cover shadow-sm border border-gray-100 group-hover/thumb:scale-110 transition-transform duration-300 relative z-20 cursor-zoom-in" 
                                  alt="" 
                                />
                                <div className="absolute inset-0 bg-accent/20 rounded-lg opacity-0 group-hover/thumb:opacity-100 transition-opacity blur-md z-10 scale-105"></div>
                              </div>
                              <div>
                                <p className="text-xs font-black text-primary group-hover:text-accent transition-colors">{ad.title}</p>
                                <p className="text-[10px] text-gray-400 font-bold">{ad.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-[9px] font-black text-primary uppercase tracking-widest">
                              {ad.category}
                            </span>
                          </td>
                          <td className="py-4 text-xs font-black text-primary">
                            {ad.price?.toLocaleString()}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button className="p-1.5 bg-gray-100 hover:bg-primary hover:text-white rounded-lg transition-all">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => approveAd(ad.id)}
                                className="p-1.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'categories' && !selectedCategoryForFields && (
              <div className="animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xs font-black text-primary flex items-center gap-2 uppercase tracking-widest">
                      <Layers className="w-4 h-4 text-accent" />
                      Categories
                    </h3>
                  </div>
                  <button className="bg-primary text-accent px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 hover:scale-105 transition-all">
                    <Plus className="w-3.5 h-3.5" />
                    New
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.type} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all group">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-accent transition-all">
                            {getCategoryIcon(cat.type)}
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-primary leading-none mb-0.5">{cat.name}</h4>
                            <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{cat.amName}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button className="p-1.5 bg-white text-gray-400 hover:text-primary rounded-lg shadow-sm">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-medium">Slug Path</span>
                          <span className="font-bold text-primary">/{cat.slug}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-medium">Fields</span>
                          <span className="px-2 py-0.5 bg-accent/10 text-accent rounded-[6px] text-[8px] font-black">
                            {categoryFields[cat.type].length} Active
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedCategoryForFields(cat)}
                        className="w-full mt-2 py-3 bg-primary text-accent rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                        Manage Fields
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'categories' && selectedCategoryForFields && (
              <div className="animate-in slide-in-from-right duration-500">
                <button 
                  onClick={() => setSelectedCategoryForFields(null)}
                  className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors mb-6"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="w-full md:w-1/3">
                    <div className="bg-primary rounded-2xl p-6 text-white shadow-xl">
                      <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary mb-4">
                        {getCategoryIcon(selectedCategoryForFields.type)}
                      </div>
                      <h3 className="text-xl font-black mb-1">{selectedCategoryForFields.name} Fields</h3>
                      <p className="text-[11px] text-gray-400 font-medium mb-6">Define requirements for this category.</p>
                      
                      <div className="space-y-4 pt-4 border-t border-white/10">
                        <div>
                          <label className="block text-[8px] font-black uppercase tracking-widest text-accent mb-1.5">Label</label>
                          <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-accent outline-none"
                            value={newFieldName}
                            onChange={e => setNewFieldName(e.target.value)}
                          />
                        </div>
                        <button 
                          onClick={handleAddField}
                          className="w-full bg-accent text-primary py-3 rounded-lg font-black uppercase text-[9px] tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-2/3 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Field Structure</h4>
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[8px] font-black text-primary uppercase">Sortable</span>
                    </div>
                    
                    <div className="divide-y divide-gray-50">
                      {categoryFields[selectedCategoryForFields.type].map((field, idx) => (
                        <div 
                          key={field.id} 
                          className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors"
                        >
                          <GripVertical className="w-4 h-4 text-gray-300" />
                          <div className="flex-grow">
                            <p className="text-xs font-black text-primary">{field.label}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Type: {field.type}</p>
                          </div>
                          <div className="flex gap-1">
                            <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="max-w-3xl animate-in fade-in duration-500">
                <h3 className="text-xs font-black text-primary mb-6 flex items-center gap-2 uppercase tracking-widest">
                  Pricing Configuration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['jobs', 'tenders', 'ads'].map((cat) => (
                    <div key={cat} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center justify-between">
                        {cat} Rates
                      </h4>
                      <div className="space-y-4">
                        {[3, 6, 12].map((months) => (
                          <div key={months}>
                            <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">
                              {months} Mo (ETB)
                            </label>
                            <input 
                              type="number" 
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-accent"
                              defaultValue={months * 250}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className={`p-2.5 rounded-lg bg-gray-50 inline-block mb-4 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{stat.label}</p>
              <h4 className="text-lg font-black text-primary">{stat.value}</h4>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
