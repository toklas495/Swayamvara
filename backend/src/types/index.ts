export type Gender = 'male' | 'female';
export type MaritalStatus = 'never_married' | 'divorced' | 'widowed';
export type ProfileStatus = 'active' | 'engaged' | 'inactive';
export type InterestStatus = 'pending' | 'accepted' | 'rejected';
export type ConnectionStatus = 'active' | 'family_approved' | 'engaged' | 'broken';
export type UserRole = 'user' | 'admin';
export type ReportCategory = 'fake_profile' | 'inappropriate_behavior' | 'harassment' | 'other';
export type PhotoStatus = 'pending' | 'approved' | 'rejected';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}