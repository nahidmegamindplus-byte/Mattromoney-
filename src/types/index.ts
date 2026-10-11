export type UserRole = 'USER' | 'MODERATOR' | 'FINANCE_ADMIN' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export type BiodataStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'HIDDEN'
  | 'DELETED';

export type PaymentReviewStatus =
  | 'PENDING_PAYMENT'
  | 'SUBMITTED_FOR_VERIFICATION'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'INFO_REQUIRED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUNDED';

export type PaymentProvider = 'BKASH' | 'NAGAD' | 'ROCKET';

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
}

export interface CompatibilityScore {
  score: number;
  factors: {
    religion: boolean;
    ageMatch: boolean;
    educationMatch: boolean;
    locationMatch: boolean;
    lifestyleMatch: boolean;
  };
}

export interface SearchFilters {
  gender?: string;
  minAge?: number;
  maxAge?: number;
  minHeightCm?: number;
  maxHeightCm?: number;
  religion?: string;
  maritalStatus?: string;
  educationLevel?: string;
  occupationCategory?: string;
  division?: string;
  district?: string;
  searchTerm?: string;
  sortBy?: 'newest' | 'compatibility' | 'age_asc' | 'age_desc' | 'views';
  page?: number;
  limit?: number;
}
