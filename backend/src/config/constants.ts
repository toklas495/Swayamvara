export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
} as const;

export const MARITAL_STATUS = {
  NEVER_MARRIED: 'never_married',
  DIVORCED: 'divorced',
  WIDOWED: 'widowed',
} as const;

export const PROFILE_STATUS = {
  ACTIVE: 'active',
  ENGAGED: 'engaged',
  INACTIVE: 'inactive',
} as const;

export const INTEREST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

export const CONNECTION_STATUS = {
  ACTIVE: 'active',
  FAMILY_APPROVED: 'family_approved',
  ENGAGED: 'engaged',
  BROKEN: 'broken',
} as const;

export const USER_ROLE = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const REPORT_CATEGORY = {
  FAKE_PROFILE: 'fake_profile',
  INAPPROPRIATE_BEHAVIOR: 'inappropriate_behavior',
  HARASSMENT: 'harassment',
  OTHER: 'other',
} as const;

export const LIMITS = {
  OTP_EXPIRY_MINUTES: 5,
  OTP_MAX_ATTEMPTS: 3,
  OTP_RATE_LIMIT_PER_HOUR: 3,
  INTERESTS_PER_DAY: 5,
  MIN_AGE: 18,
  MAX_AGE: 60,
  INTEREST_MESSAGE_MAX_LENGTH: 200,
  REJECTION_COOLDOWN_DAYS: 30,
} as const;

export const PHOTO_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const CACHE_CONSTANT = {
  TTL:900,
  NAMESPACE:"swayamvara",
  services:[
            "auth",
            "user",
            "secret"
        ]
} as const;