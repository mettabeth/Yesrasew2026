import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Listing, ListingCategory } from '../types';
import { MapPin, Clock, Briefcase, FileText, Home, Car, Calendar, Phone, Mail, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import PremiumGater from './PremiumGater';

interface ListingCardProps {
  listing: Listing;
  onClick?: () => void;
  hideContact?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick, hideContact = false }) => {
  const navigate = useNavigate();
  // For demo purposes, we treat the user as not subscribed.
  const isSubscribed = false;

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/listing/${listing.id}`);
    }
  };

  const getCategoryIcon = () => {
    switch (listing.category) {
      case ListingCategory.JOB: return <Briefcase className="w-3 h-3" />;
      case ListingCategory.TENDER: return <FileText className="w-3 h-3" />;
      case ListingCategory.PROPERTY: return <Home className="w-3 h-3" />;
      case ListingCategory.VEHICLE: return <Car className="w-3 h-3" />;
      default: return null;
    }
  };

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

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-accent/60 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full group border-b-2 border-b-transparent hover:border-b-accent"
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={listing.images[0] || 'https://picsum.photos/400/300'} 
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur-md px-2 py-1 rounded-md text-[8px] font-black text-accent flex items-center gap-1 shadow-md uppercase tracking-widest">
          {getCategoryIcon()}
          {listing.category}
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-sm font-black text-primary-dark line-clamp-1 mb-0.5 group-hover:text-accent transition-colors leading-tight">
          {listing.title}
        </h3>
        
        {listing.category === ListingCategory.JOB && (
          <p className="text-[8px] text-accent mb-1.5 font-black uppercase tracking-widest flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-accent"></div>
            {listing.metadata.company}
          </p>
        )}

        <p className="text-[10px] text-gray-500 line-clamp-2 mb-3 font-medium leading-normal">
          {listing.description}
        </p>

        {/* Contact Section wrapped in PremiumGater - Conditionally Hidden */}
        {!hideContact && (
          <div className="mb-4">
            <PremiumGater 
              isSubscribed={isSubscribed} 
              category={listing.category === ListingCategory.JOB ? 'jobs' : listing.category === ListingCategory.TENDER ? 'tenders' : 'ads'}
            >
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300 shadow-inner">
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-tight">
                  <div className="w-6 h-6 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 text-accent" />
                  </div>
                  {listing.metadata.phone || '+251 911 000 000'}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-primary lowercase tracking-tight">
                  <div className="w-6 h-6 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5 text-accent" />
                  </div>
                  {listing.metadata.email || 'contact@yesrasew.com'}
                </div>
              </div>
            </PremiumGater>
          </div>
        )}

        {/* Apply Now Button for Jobs */}
        {listing.category === ListingCategory.JOB && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/apply/${listing.id}`);
            }}
            className="w-full mb-3 bg-primary text-accent py-2.5 rounded-lg font-black uppercase text-[9px] tracking-[0.1em] flex items-center justify-center gap-1.5 hover:brightness-110 transition-all shadow-sm active:scale-95 group/btn"
          >
            <Send className="w-3.5 h-3.5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            Apply Now
          </button>
        )}

        <div className="mt-auto">
          <div className="text-lg font-black text-primary mb-2 group-hover:text-accent transition-colors tracking-tight">
            {getPriceLabel()}
          </div>

          <div className="flex items-center justify-between text-[9px] text-gray-400 font-bold border-t border-gray-50 pt-2">
            <div className="flex items-center gap-1 truncate pr-1">
              <MapPin className="w-2.5 h-2.5 text-accent flex-shrink-0" />
              <span className="truncate">{listing.location}</span>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <Clock className="w-2.5 h-2.5 text-accent flex-shrink-0" />
              <span>{formatDistanceToNow(new Date(listing.created_at))}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50/50 px-4 py-2 flex gap-3 overflow-x-auto text-[7px] font-black text-primary/60 border-t border-gray-50 uppercase tracking-widest no-scrollbar">
        {listing.category === ListingCategory.PROPERTY && (
          <>
            <span className="whitespace-nowrap flex items-center gap-1"><Home className="w-2.5 h-2.5 text-accent"/> {listing.metadata.bedrooms} Bed</span>
            <span className="whitespace-nowrap"> {listing.metadata.area}</span>
          </>
        )}
        {listing.category === ListingCategory.VEHICLE && (
          <>
            <span className="whitespace-nowrap flex items-center gap-1"><Calendar className="w-2.5 h-2.5 text-accent"/> {listing.metadata.year}</span>
            <span className="whitespace-nowrap"> {listing.metadata.fuel}</span>
          </>
        )}
        {listing.category === ListingCategory.JOB && (
          <span className="whitespace-nowrap flex items-center gap-1"><Briefcase className="w-2.5 h-2.5 text-accent"/> {listing.metadata.type}</span>
        )}
        {listing.category === ListingCategory.TENDER && (
          <span className="whitespace-nowrap flex items-center gap-1 text-red-600">
            <Clock className="w-2.5 h-2.5" />
            Ends: {listing.metadata.deadline}
          </span>
        )}
      </div>
    </div>
  );
};

export default ListingCard;