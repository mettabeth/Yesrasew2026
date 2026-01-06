
export enum ListingCategory {
  JOB = 'JOB',
  TENDER = 'TENDER',
  PROPERTY = 'PROPERTY',
  VEHICLE = 'VEHICLE'
}

export enum Language {
  EN = 'en',
  AM = 'am'
}

export enum UserRole {
  INDIVIDUAL = 'individual',
  EMPLOYER = 'employer',
  DEALER = 'dealer',
  ADMIN = 'admin'
}

export enum PlanCategory {
  JOBS = 'jobs',
  TENDERS = 'tenders',
  ADS = 'ads'
}

export interface Subscription {
  category: PlanCategory;
  planName: string;
  expiryDate: string;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phoneNumber?: string;
  isVerified?: boolean;
  subscriptions: Subscription[];
}

export interface Listing {
  id: string;
  user_id: string;
  category: ListingCategory;
  title: string;
  description: string;
  price?: number;
  location: string;
  images: string[];
  status: string;
  is_approved: boolean;
  metadata: Record<string, any>;
  created_at: string;
  isPremium?: boolean;
}

export interface CategoryItem {
  name: string;
  amName: string;
  slug: string;
  type: ListingCategory;
  icon: string;
}
