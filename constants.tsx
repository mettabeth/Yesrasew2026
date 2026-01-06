
import React from 'react';
import { Briefcase, FileText, Home, Car } from 'lucide-react';
import { ListingCategory, CategoryItem, Listing } from './types';
import { EXPANDED_MOCK_LISTINGS } from './mockData';

export const CATEGORIES: CategoryItem[] = [
  { name: 'Jobs', amName: 'ስራዎች', slug: 'jobs', type: ListingCategory.JOB, icon: 'Briefcase' },
  { name: 'Tenders', amName: 'ጨረታዎች', slug: 'tenders', type: ListingCategory.TENDER, icon: 'FileText' },
  { name: 'Property', amName: 'ቤቶች', slug: 'property', type: ListingCategory.PROPERTY, icon: 'Home' },
  { name: 'Vehicles', amName: 'ተሽከርካሪዎች', slug: 'vehicles', type: ListingCategory.VEHICLE, icon: 'Car' },
];

export const FILTER_OPTIONS = {
  [ListingCategory.JOB]: {
    types: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
    industries: ['Technology', 'Healthcare', 'Education', 'Finance', 'Engineering'],
    salary_ranges: ['0 - 10k', '10k - 30k', '30k - 60k', '60k+']
  },
  [ListingCategory.PROPERTY]: {
    types: ['Apartment', 'House', 'Villa', 'Studio', 'Office', 'Land'],
    listing_types: ['Sale', 'Rent'],
    bedrooms: ['Studio', '1', '2', '3', '4+'],
    locations: ['Bole', 'Kazanchis', 'Summit', 'Lebu', 'Old Airport']
  },
  [ListingCategory.VEHICLE]: {
    makes: ['Toyota', 'Hyundai', 'Suzuki', 'Mercedes', 'Tesla'],
    fuel_types: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    body_types: ['Sedan', 'SUV', 'Pickup', 'Hatchback'],
    years: ['2024', '2023', '2022', '2021', '2020 & Older']
  },
  [ListingCategory.TENDER]: {
    sectors: ['Construction', 'Supply', 'Consultancy', 'IT Services', 'Agriculture'],
    status: ['Open', 'Closing Soon', 'Under Review']
  }
};

export const MOCK_LISTINGS: Listing[] = EXPANDED_MOCK_LISTINGS;
