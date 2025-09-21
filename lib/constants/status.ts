export const STATUS_COLORS = {
  // User/Patient Status
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  critical: 'bg-red-100 text-red-800',
  recovering: 'bg-yellow-100 text-yellow-800',
  discharged: 'bg-blue-100 text-blue-800',
  suspended: 'bg-red-100 text-red-800',
  
  // Appointment Status
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
  'no-show': 'bg-gray-100 text-gray-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  
  // Visit Types
  emergency: 'bg-red-100 text-red-800',
  routine: 'bg-blue-100 text-blue-800',
  'follow-up': 'bg-green-100 text-green-800',
  consultation: 'bg-purple-100 text-purple-800',
  
  // Default
  default: 'bg-slate-100 text-slate-800'
} as const;

export const ROLE_COLORS = {
  admin: 'bg-red-100 text-red-800',
  doctor: 'bg-blue-100 text-blue-800',
  nurse: 'bg-green-100 text-green-800',
  patient: 'bg-purple-100 text-purple-800',
  finance: 'bg-yellow-100 text-yellow-800'
} as const;

export const getStatusColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase().replace('_', '-');
  return STATUS_COLORS[normalizedStatus as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;
};

export const getRoleColor = (role: string): string => {
  return ROLE_COLORS[role as keyof typeof ROLE_COLORS] || STATUS_COLORS.default;
};