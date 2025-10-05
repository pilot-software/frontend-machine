// Medical-specific constants
export const MEDICAL = {
  DEPARTMENTS: [
    'General',
    'Cardiology',
    'Emergency',
    'Orthopedics',
    'Pediatrics',
    'Neurology',
  ] as const,
  
  APPOINTMENT_TYPES: [
    'direct',
    'phone',
    'video',
  ] as const,
  
  APPOINTMENT_STATUS: [
    'scheduled',
    'confirmed',
    'in-progress',
    'completed',
    'cancelled',
    'no-show',
  ] as const,
  
  PRIORITY_LEVELS: [
    'low',
    'medium',
    'high',
    'urgent',
  ] as const,
  
  BLOOD_TYPES: [
    'A+', 'A-',
    'B+', 'B-',
    'AB+', 'AB-',
    'O+', 'O-',
  ] as const,
} as const;

export type Department = typeof MEDICAL.DEPARTMENTS[number];
export type AppointmentType = typeof MEDICAL.APPOINTMENT_TYPES[number];
export type AppointmentStatus = typeof MEDICAL.APPOINTMENT_STATUS[number];
export type PriorityLevel = typeof MEDICAL.PRIORITY_LEVELS[number];
