
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { 
  Camera, 
  X, 
  Upload, 
  ChevronRight, 
  CheckCircle2, 
  Info,
  MapPin,
  Tag,
  Type,
  Briefcase,
  Home,
  Car,
  FileText,
  AlertCircle,
  Loader2,
  Trash2,
  Plus
} from 'lucide-react';
import { ListingCategory } from '../types';
import { CATEGORIES, FILTER_OPTIONS } from '../constants';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
}

const PostAdPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<ListingCategory | ''>('');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    metadata: {} as Record<string, any>
  });

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    const availableSlots = 8 - images.length;
    const filesToUpload = newFiles.slice(0, availableSlots);

    const newImages: ImageFile[] = filesToUpload.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      progress: 0
    }));

    setImages(prev => [...prev, ...newImages]);

    // Simulate upload progress for each image
    newImages.forEach(img => {
      let prog = 0;
      const interval = setInterval(() => {
        prog += Math.random() * 30;
        if (prog >= 100) {
          prog = 100;
          clearInterval(interval);
        }
        setImages(current => current.map(item => 
          item.id === img.id ? { ...item, progress: Math.round(prog) } : item
        ));
      }, 300);
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== id);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleMetadataChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [key]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.some(img => img.progress < 100)) {
      alert("Please wait for all images to finish uploading.");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    }, 2000);
  };

  const getCategoryIcon = (type: ListingCategory) => {
    switch (type) {
      case ListingCategory.JOB: return <Briefcase className="w-5 h-5" />;
      case ListingCategory.TENDER: return <FileText className="w-5 h-5" />;
      case ListingCategory.PROPERTY: return <Home className="w-5 h-5" />;
      case ListingCategory.VEHICLE: return <Car className="w-5 h-5" />;
    }
  };

  const isFormValid = () => {
    if (step === 1) return !!category;
    // For rich text, check if there's actual content (not just empty tags)
    const hasDescription = formData.description.replace(/<(.|\n)*?>/g, '').trim().length > 0;
    if (step === 2) return formData.title && hasDescription && formData.location;
    return true;
  };

  const quillModules = {
    toolbar: [
      ['bold', 'italic'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-32 text-center animate-in fade-in zoom-in duration-500">
        <div className="max-w-md mx-auto bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100">
          <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black text-primary mb-4">Ad Published!</h1>
          <p className="text-gray-500 mb-10 leading-relaxed font-medium">
            Your listing "{formData.title}" is now being reviewed by our moderation team. It will be live within 2 hours.
          </p>
          <div className="flex flex-col gap-3">
             <button onClick={() => navigate('/')} className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Return Home</button>
             <button onClick={() => window.location.reload()} className="w-full bg-gray-50 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Post Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24">
      {/* Header with Progress Steps */}
      <div className="bg-primary pt-16 pb-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h1 className="text-4xl lg:text-5xl font-black mb-10 tracking-tight text-center">Post an Ad</h1>
            
            {/* Step Indicator */}
            <div className="flex items-center w-full max-w-2xl justify-between relative mb-8">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2"></div>
              {[1, 2, 3].map((s) => (
                <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${
                    step >= s ? 'bg-accent text-primary scale-110 shadow-lg' : 'bg-primary-dark text-gray-500 border border-white/10'
                  }`}>
                    {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s ? 'text-accent' : 'text-gray-500'}`}>
                    {s === 1 ? 'Category' : s === 2 ? 'Details' : 'Media'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          
          {/* Step 1: Category Selection */}
          {step === 1 && (
            <div className="bg-white rounded-[3rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 lg:p-12 animate-in slide-in-from-bottom-8 duration-500">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-black text-primary mb-2">What are you listing today?</h2>
                <p className="text-gray-400 font-medium">Select a category to unlock specialized posting tools.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.type}
                    type="button"
                    onClick={() => setCategory(cat.type)}
                    className={`flex flex-col items-center justify-center p-10 rounded-[2.5rem] border-4 transition-all group ${
                      category === cat.type 
                        ? 'border-accent bg-orange-50/50 shadow-2xl shadow-accent/10 ring-8 ring-accent/5' 
                        : 'border-gray-50 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className={`p-5 rounded-3xl mb-6 transition-all ${
                      category === cat.type ? 'bg-accent text-primary' : 'bg-gray-50 text-gray-400 group-hover:bg-primary/5 group-hover:text-primary'
                    }`}>
                      {getCategoryIcon(cat.type)}
                    </div>
                    <span className={`font-black uppercase tracking-widest text-xs ${
                      category === cat.type ? 'text-primary' : 'text-gray-400'
                    }`}>{cat.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-16 flex justify-center">
                <button
                  type="button"
                  disabled={!category}
                  onClick={() => setStep(2)}
                  className="bg-primary text-accent px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                >
                  Continue to Details
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Content Details */}
          {step === 2 && (
            <div className="bg-white rounded-[3rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 lg:p-12 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                <div className="p-3 bg-accent/10 text-accent rounded-2xl">
                  {getCategoryIcon(category as ListingCategory)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary leading-none uppercase tracking-tight">{category} Information</h2>
                  <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Step 2 of 3</p>
                </div>
              </div>

              <div className="space-y-10">
                {/* General Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Listing Title</label>
                    <div className="relative group">
                      <Type className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-accent" />
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Senior Marketing Manager position"
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none font-bold text-primary transition-all"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Detailed Description</label>
                    <div className="quill-wrapper bg-gray-50 border border-gray-100 rounded-[1.5rem] overflow-hidden">
                      <ReactQuill 
                        theme="snow"
                        placeholder="Be specific! Mention key features, requirements, or unique selling points..."
                        modules={quillModules}
                        value={formData.description}
                        onChange={value => setFormData({...formData, description: value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Price / Salary (ETB)</label>
                    <div className="relative group">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-300 group-focus-within:text-accent">Br.</span>
                      <input 
                        required
                        type="number" 
                        placeholder="0.00"
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none font-bold text-primary transition-all"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Exact Location</label>
                    <div className="relative group">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-accent" />
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Bole Atlas, Addis Ababa"
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none font-bold text-primary transition-all"
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Category Metadata */}
                <div className="pt-10 border-t border-gray-50">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-accent mb-6">Specific Details for {category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category === ListingCategory.JOB && (
                      <>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Job Type</label>
                          <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" onChange={e => handleMetadataChange('type', e.target.value)}>
                            <option value="">Select Type</option>
                            {FILTER_OPTIONS[ListingCategory.JOB].types.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Company Name</label>
                          <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" onChange={e => handleMetadataChange('company', e.target.value)} placeholder="e.g. EthioTelecom" />
                        </div>
                      </>
                    )}
                    {category === ListingCategory.VEHICLE && (
                      <>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Make</label>
                          <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" onChange={e => handleMetadataChange('make', e.target.value)}>
                            <option value="">Select Make</option>
                            {FILTER_OPTIONS[ListingCategory.VEHICLE].makes.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Year</label>
                          <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" onChange={e => handleMetadataChange('year', e.target.value)}>
                            <option value="">Select Year</option>
                            {FILTER_OPTIONS[ListingCategory.VEHICLE].years.map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fuel</label>
                          <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" onChange={e => handleMetadataChange('fuel', e.target.value)}>
                            <option value="">Select Fuel</option>
                            {FILTER_OPTIONS[ListingCategory.VEHICLE].fuel_types.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                      </>
                    )}
                    {category === ListingCategory.PROPERTY && (
                      <>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Listing Type</label>
                          <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" onChange={e => handleMetadataChange('listing_type', e.target.value)}>
                            <option value="">Select</option>
                            {FILTER_OPTIONS[ListingCategory.PROPERTY].listing_types.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Bedrooms</label>
                          <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" onChange={e => handleMetadataChange('bedrooms', e.target.value)}>
                            <option value="">Select</option>
                            {FILTER_OPTIONS[ListingCategory.PROPERTY].bedrooms.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Area (sqm)</label>
                          <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" onChange={e => handleMetadataChange('area', e.target.value)} placeholder="e.g. 150sqm" />
                        </div>
                      </>
                    )}
                    {category === ListingCategory.TENDER && (
                      <>
                         <div className="sm:col-span-2">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Organization</label>
                          <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" onChange={e => handleMetadataChange('organization', e.target.value)} placeholder="e.g. Commercial Bank of Ethiopia" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Deadline</label>
                          <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" onChange={e => handleMetadataChange('deadline', e.target.value)} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-16 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-400 font-black uppercase tracking-widest text-xs hover:text-primary transition-colors px-6 py-4"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  disabled={!isFormValid()}
                  onClick={() => setStep(3)}
                  className="bg-primary text-accent px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                >
                  Add Media
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Media Upload */}
          {step === 3 && (
            <div className="bg-white rounded-[3rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 lg:p-12 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                <div className="p-3 bg-accent/10 text-accent rounded-2xl">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary leading-none uppercase tracking-tight">Visual Content</h2>
                  <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Final Step</p>
                </div>
              </div>

              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-4 border-dashed rounded-[3rem] p-12 lg:p-20 transition-all text-center mb-12 ${
                  isDragging ? 'border-accent bg-orange-50/50 scale-[0.98]' : 'border-gray-100 hover:border-gray-200 bg-gray-50/30'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  multiple 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
                
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-accent text-primary rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl shadow-accent/20">
                    <Upload className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-primary mb-2">Drag & Drop Photos Here</h3>
                  <p className="text-sm text-gray-500 font-medium mb-8">High quality images sell 5x faster. Add up to 8 photos.</p>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-primary text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg shadow-primary/10"
                  >
                    Browse Files
                  </button>
                </div>

                <div className="absolute top-6 right-8 text-[10px] font-black uppercase tracking-widest text-gray-300">
                  {images.length} / 8 Images
                </div>
              </div>

              {/* Preview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {images.map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-[2rem] overflow-hidden group border border-gray-100 shadow-sm bg-gray-50">
                    <img src={img.preview} alt="Upload preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    
                    {/* Progress Overlay */}
                    {img.progress < 100 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-12 h-12 relative flex items-center justify-center">
                           <Loader2 className="w-8 h-8 text-white animate-spin absolute" />
                           <span className="text-[10px] text-white font-black relative">{img.progress}%</span>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <button 
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 text-[8px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                      {Math.round(img.file.size / 1024)} KB
                    </div>
                  </div>
                ))}
                
                {images.length > 0 && images.length < 8 && (
                   <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-300 hover:border-accent hover:text-accent hover:bg-orange-50 transition-all group"
                   >
                     <Plus className="w-8 h-8" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Add More</span>
                   </button>
                )}
              </div>

              {images.length === 0 && (
                <div className="mt-8 flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                  <Info className="w-5 h-5 text-primary" />
                  <p className="text-xs text-primary font-medium">Listings with images get 400% more engagement in Ethiopia.</p>
                </div>
              )}

              <div className="mt-20 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-gray-400 font-black uppercase tracking-widest text-xs hover:text-primary transition-colors px-6 py-4"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || images.length === 0}
                  className="bg-accent text-primary px-16 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-accent/20 hover:scale-105 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      Finish & Publish Ad
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostAdPage;
