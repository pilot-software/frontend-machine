import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Healthcare-specific utility functions
export function formatMedicalDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatMedicalTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
    case "completed":
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
    case "inactive":
      return "bg-red-100 text-red-800";
    case "critical":
    case "urgent":
      return "bg-red-100 text-red-800";
    case "in-progress":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case "urgent":
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | "";
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  bloodType?:
    | "A_POSITIVE"
    | "A_NEGATIVE"
    | "B_POSITIVE"
    | "B_NEGATIVE"
    | "AB_POSITIVE"
    | "AB_NEGATIVE"
    | "O_POSITIVE"
    | "O_NEGATIVE"
    | "";
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  assignedDoctor?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
}

export function validatePersonalInfo(
  patientData: PatientFormData,
  t: (key: string, options?: Record<string, string>) => string
): Record<string, string> {
  const newErrors: Record<string, string> = {};
  const requiredFields = [
    "firstName",
    "lastName",
    "phone",
    "dateOfBirth",
    "gender",
  ];

  requiredFields.forEach((field) => {
    if (!patientData[field as keyof PatientFormData]?.trim?.()) {
      newErrors[field] = t("isRequired", { field: t(field) });
    }
  });

  if (
    patientData.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientData.email)
  ) {
    newErrors.email = t("invalidEmailFormat");
  }

  return newErrors;
}
