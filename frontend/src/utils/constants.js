export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const RISK_COLORS = {
  [RISK_LEVELS.LOW]: 'green',
  [RISK_LEVELS.MEDIUM]: 'yellow',
  [RISK_LEVELS.HIGH]: 'orange',
  [RISK_LEVELS.CRITICAL]: 'red'
};

export const PERSON_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived'
};

export const RECOGNITION_STATUS = {
  MATCHED: 'matched',
  UNMATCHED: 'unmatched',
  UNCERTAIN: 'uncertain'
};

export const SOURCE_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  WEBCAM: 'webcam'
};

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  OPERATOR: 'operator'
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_TIME: 'MMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  ISO_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
};

export const FILE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 100 * 1024 * 1024 // 100MB
};

export const ALLOWED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/jpg'],
  VIDEO: ['video/mp4', 'video/avi', 'video/quicktime']
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 20,
  PER_PAGE_OPTIONS: [10, 20, 50, 100]
};