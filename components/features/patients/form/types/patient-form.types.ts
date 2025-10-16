export interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | "";
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  bloodType: "A_POSITIVE" | "A_NEGATIVE" | "B_POSITIVE" | "B_NEGATIVE" | "AB_POSITIVE" | "AB_NEGATIVE" | "O_POSITIVE" | "O_NEGATIVE" | "";
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  assignedDoctor: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
}

export interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
  mode: "add" | "edit" | "view";
}

export const INSURANCE_OPTIONS = [
  { value: "blue-cross", label: "Blue Cross Blue Shield" },
  { value: "aetna", label: "Aetna" },
  { value: "kaiser", label: "Kaiser Permanente" },
  { value: "cigna", label: "Cigna" },
  { value: "united", label: "United Healthcare" },
  { value: "medicare", label: "Medicare" },
  { value: "medicaid", label: "Medicaid" },
  { value: "self-pay", label: "Self Pay" },
];

export const INITIAL_FORM_DATA: PatientFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "USA",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",
  bloodType: "",
  allergies: "",
  chronicConditions: "",
  currentMedications: "",
  assignedDoctor: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
};
