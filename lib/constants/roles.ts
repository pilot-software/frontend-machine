// User roles
export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  PATIENT: 'patient',
  FINANCE: 'finance',
  RECEPTIONIST: 'receptionist',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// Role display names
export const ROLE_LABELS: Record<UserRole, string> = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.DOCTOR]: 'Doctor',
  [ROLES.NURSE]: 'Nurse',
  [ROLES.PATIENT]: 'Patient',
  [ROLES.FINANCE]: 'Finance',
  [ROLES.RECEPTIONIST]: 'Receptionist',
};
