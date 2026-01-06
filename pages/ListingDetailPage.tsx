import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Share2, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  Phone, 
  ShieldCheck,
  Briefcase,
  Home,
  Car,
  FileText,
  User,
  Info,
  Tag,
  Send,
  Sparkles,
  Image as ImageIcon,
  Navigation,
  Map as MapIcon,
  ExternalLink,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { MOCK_LISTINGS } from '../constants';
import { ListingCategory } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from '../components/LanguageContext';
import PremiumGater from '../components/PremiumGater';
import HorizontalScrollRow from '../components/HorizontalScrollRow';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Map states: simulated API loading
  const [mapStatus, setMapStatus] = useState<'loading' | 'success' | 'error'>('loading');

  // For demo, we assume the user is not subscribed
  const isSubscribed = false;

  const listing = MOCK_LISTINGS.find(l => l.id === id);

  const nextImage = useCallback(() => {
    if (!listing) return;
    setActiveImage(prev => (prev + 1) % listing.images.length);
  }, [listing]);

  const prevImage = useCallback(() => {
    if (!listing) return;
    setActiveImage(prev => (prev - 1 + listing.images.length) % listing.images.length);
  }, [listing]);

  // Logic to find related listings
  const relatedListings = useMemo(() => {
    if (!listing) return [];
    const targetCity = listing.location.split(',')[0].toLowerCase().trim();
    
    return MOCK_LISTINGS
      .filter(l => l.id !== listing.id && l.category === listing.category)
      .sort((a, b) => {
        // Prioritize same location
        const aLoc = a.location.toLowerCase().includes(targetCity);
        const bLoc = b.location.toLowerCase().includes(targetCity);
        if (aLoc && !bLoc) return -1;
        if (!aLoc && bLoc) return 1;
        return 0;
      })
      .slice(0, 10);
  }, [listing]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage]);

  // Simulate Map API Load
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate a small chance of API failure for demo purposes
      const success = Math.random() > 0.05; 
      setMapStatus(success ? 'success' : 'error');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-primary mb-4">Listing Not Found</h1>
        <Link to="/" className="text-accent hover:underline">Back to Home</Link>
      </div>
    );
  }

  const getPriceLabel = () => {
    if (!listing.price) return 'Contact Price';
    const formattedPrice = new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      maximumFractionDigits: 0,
    }).format(listing.price);

    switch (listing.category) {
      case ListingCategory.JOB: return `${formattedPrice}/Mo`;
      default: return formattedPrice;
    }
  };

  const getCategoryIcon = () => {
    switch (listing.category) {
      case ListingCategory.JOB: return <Briefcase className="w-4 h-4" />;
      case ListingCategory.TENDER: return <FileText className="w-4 h-4" />;
      case ListingCategory.PROPERTY: return <Home className="w-4 h-4" />;
      case ListingCategory.VEHICLE: return <Car className="w-4 h-4" />;
      default: return null;
    }
  };

  // Mock Map URL using OpenStreetMap Export or similar placeholder logic
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=38.6,8.9,38.9,9.1&layer=mapnik&marker=9.0,38.75`;
  const staticMapFallback = `https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200`;

  return (
    <div className="bg-gray-50/50 min-h-screen pb-10">
      {/* Navigation & Actions Bar */}
      <div className="bg-white border-b border-gray-100 py-2 sticky top-14 z-30 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {t('back')}
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-lg border transition-all ${isFavorite ? 'bg-red-50 border-red-100 text-red-500' : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-primary'}`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 bg-gray-50 border border-gray-100 text-gray-400 rounded-lg hover:text-primary transition-all">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-2">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 mb-2 group/gallery">
                <img 
                  src={listing.images[activeImage] || 'https://picsum.photos/800/600'} 
                  alt={`${listing.title}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                
                {listing.images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      aria-label="Previous Image"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-2xl text-primary hover:text-accent transition-all z-20 border border-gray-100 opacity-0 group-hover/gallery:opacity-100 active:scale-90 scale-90 md:scale-100"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      aria-label="Next Image"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-2xl text-primary hover:text-accent transition-all z-20 border border-gray-100 opacity-0 group-hover/gallery:opacity-100 active:scale-90 scale-90 md:scale-100"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-3 right-3 bg-primary/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[9px] font-black text-white flex items-center gap-1.5 shadow-md uppercase tracking-widest border border-white/10">
                      <ImageIcon className="w-3 h-3 text-accent" />
                      {activeImage + 1} / {listing.images.length}
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar px-1">
                {listing.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-16 aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-accent scale-95' : 'border-transparent opacity-60'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Header Details */}
            <div className="bg-white rounded-2xl p-5 lg:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="bg-primary text-accent px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-1">
                  {getCategoryIcon()}
                  {listing.category}
                </div>
                <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  <Clock className="w-3 h-3 text-accent" />
                  {formatDistanceToNow(new Date(listing.created_at))} {t('ago')}
                </div>
              </div>

              <h1 className="text-xl lg:text-3xl font-black text-primary-dark mb-4 leading-tight tracking-tight">
                {listing.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-gray-50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Location</p>
                    <p className="text-sm font-bold text-primary">{listing.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Tag className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Price</p>
                    <p className="text-sm font-bold text-primary">{getPriceLabel()}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {Object.entries(listing.metadata).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded-xl border border-transparent">
                    <p className="text-[7px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{key.replace('_', ' ')}</p>
                    <p className="text-xs font-bold text-primary-dark line-clamp-1">{String(value)}</p>
                  </div>
                ))}
              </div>

              <div className="prose prose-sm max-w-none">
                <h3 className="text-xs font-black text-primary mb-2 uppercase tracking-widest flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-accent" />
                  Details
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium opacity-90 text-sm whitespace-pre-line mb-8">
                  {listing.description}
                </p>
              </div>

              {/* Map View Integration */}
              <div className="mt-10 pt-8 border-t border-gray-50">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                    <MapIcon className="w-4 h-4 text-accent" />
                    Listing Location
                  </h3>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-black text-accent hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1.5"
                  >
                    Get Directions
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative w-full aspect-[21/9] lg:aspect-[21/7] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-inner group/map">
                  {mapStatus === 'loading' && (
                    <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center animate-pulse">
                      <Loader2 className="w-8 h-8 text-accent animate-spin mb-2" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">Initializing Map API...</span>
                    </div>
                  )}

                  {mapStatus === 'success' && (
                    <iframe 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      scrolling="no" 
                      marginHeight={0} 
                      marginWidth={0} 
                      src={mapUrl}
                      className="grayscale-[0.5] contrast-[1.2] opacity-90 group-hover/map:opacity-100 transition-opacity"
                    />
                  )}

                  {mapStatus === 'error' && (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                       {/* Static Map Image Fallback */}
                       <img 
                        src={staticMapFallback} 
                        alt="Static Map Fallback"
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-20"
                       />
                       <div className="relative z-10 flex flex-col items-center text-center p-8">
                          <AlertTriangle className="w-10 h-10 text-orange-400 mb-3" />
                          <h4 className="text-sm font-black text-primary-dark mb-1 uppercase tracking-tight">Interactive Map Unavailable</h4>
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest max-w-[200px]">
                            {listing.location}
                          </p>
                       </div>
                    </div>
                  )}
                  
                  {/* Map Overlay Badge - Visible if success or error */}
                  {(mapStatus === 'success' || mapStatus === 'error') && (
                    <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-[7px] font-black uppercase tracking-widest text-gray-400">Map Pin</p>
                        <p className="text-[10px] font-black text-primary leading-none mt-0.5">{listing.location.split(',')[0]}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <p className="mt-4 text-[9px] text-gray-400 font-medium italic">
                  Note: The marker indicates the general neighborhood. Precise location will be provided after contact.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-4">
            <div className="bg-primary rounded-2xl p-5 lg:p-6 shadow-lg text-white relative overflow-hidden">
              <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-accent mb-4">Owner Profile</h3>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl border border-white/10 flex items-center justify-center text-accent text-lg font-black">
                  {listing.metadata.company?.[0] || listing.metadata.organization?.[0] || <User className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-base font-bold leading-tight">
                    {listing.metadata.company || listing.metadata.organization || 'Verified User'}
                  </h4>
                  <div className="flex items-center gap-1 text-green-400 text-[7px] font-black uppercase tracking-widest">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Verified
                  </div>
                </div>
              </div>

              <PremiumGater isSubscribed={isSubscribed} category={listing.category === ListingCategory.JOB ? 'jobs' : listing.category === ListingCategory.TENDER ? 'tenders' : 'ads'}>
                <div className="space-y-2">
                  <button className="w-full bg-accent text-primary-dark py-3 rounded-lg font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5">
                    <Phone className="w-3 h-3" />
                    Call Owner
                  </button>
                  <button className="w-full bg-white/5 border border-white/10 py-3 rounded-lg font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5">
                    <MessageSquare className="w-3 h-3" />
                    Message
                  </button>
                </div>
              </PremiumGater>
            </div>

            {listing.category === ListingCategory.JOB && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-accent/20">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Apply Fast</h3>
                <p className="text-[10px] text-gray-500 font-medium mb-4 leading-relaxed">
                  Interested in this position? Connect now.
                </p>
                <button 
                  onClick={() => navigate(`/apply/${listing.id}`)}
                  className="w-full bg-primary text-accent py-3 rounded-lg font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  Apply Now
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-[8px] font-black uppercase tracking-widest text-primary mb-3">Safety Tips</h3>
              <ul className="space-y-2">
                {[
                  'Meet in public places',
                  'Verify before paying',
                  'Report suspicious ads'
                ].map((tip, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                    <ShieldCheck className="w-3 h-3 text-accent" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {relatedListings.length > 0 && (
        <div className="mt-10 border-t border-gray-100 pt-8">
          <HorizontalScrollRow 
            title="Related Ads" 
            items={relatedListings} 
            icon={<Sparkles className="w-5 h-5" />} 
            viewAllLink={`/${listing.category.toLowerCase()}`}
          />
        </div>
      )}
    </div>
  );
};

export default ListingDetailPage;