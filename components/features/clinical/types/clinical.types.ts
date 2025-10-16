export interface VitalSigns {
  id: string;
  patientId: string;
  patientName: string;
  recordedBy: string;
  recordedAt: string;
  temperature: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight?: number;
  height?: number;
  bmi?: number;
  painLevel?: number;
  notes?: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  testType: "Blood Work" | "Urine Analysis" | "Imaging" | "Biopsy" | "Culture" | "Other";
  orderedBy: string;
  orderedDate: string;
  completedDate?: string;
  status: "Ordered" | "In Progress" | "Completed" | "Cancelled";
  results?: string;
  normalRange?: string;
  flagged: boolean;
  priority: "Routine" | "Urgent" | "STAT";
  notes?: string;
}

export interface Diagnosis {
  id: string;
  patientId: string;
  patientName: string;
  diagnosisCode: string;
  diagnosisName: string;
  type: "Primary" | "Secondary" | "Provisional" | "Rule Out";
  status: "Active" | "Resolved" | "Chronic" | "Inactive";
  diagnosedBy: string;
  diagnosedDate: string;
  severity: "Mild" | "Moderate" | "Severe" | "Critical";
  notes?: string;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  patientName: string;
  planName: string;
  createdBy: string;
  createdDate: string;
  startDate: string;
  endDate?: string;
  status: "Active" | "Completed" | "Discontinued" | "On Hold";
  goals: string[];
  interventions: string[];
  medications: string[];
  followUpInstructions: string;
  nextReviewDate?: string;
}

export type ClinicalModalType = "vitals" | "lab" | "diagnosis" | "treatment" | null;

export interface ClinicalModalState {
  isOpen: boolean;
  type: ClinicalModalType;
  data: VitalSigns | LabResult | Diagnosis | TreatmentPlan | null;
}
