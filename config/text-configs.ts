import { TextConfig } from './features';

// Default hospital text configuration
export const hospitalText: TextConfig = {
  systemName: "HealthCare System",
  systemDescription: "Patient Management Platform",
  roles: {
    admin: "Administrator",
    doctor: "Doctor",
    nurse: "Nurse", 
    patient: "Patient",
    finance: "Finance"
  },
  navigation: {
    dashboard: "Dashboard",
    patients: "My Patients",
    appointments: "Appointments",
    records: "Medical Records",
    prescriptions: "Prescriptions",
    security: "Security Activity",
    analytics: "Analytics",
    reports: "Reports",
    billing: "Billing",
    settings: "Settings"
  },
  features: {
    patientManagement: "Patient Management",
    appointmentSystem: "Appointment System",
    clinicalInterface: "Clinical Interface",
    prescriptionSystem: "Prescription System",
    financialManagement: "Financial Management"
  },
  buttons: {
    login: "Sign In",
    logout: "Sign Out",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    add: "Add New"
  },
  messages: {
    welcome: "Welcome to the Healthcare System",
    loginSuccess: "Login successful",
    loginError: "Invalid credentials"
  }
};

// Small clinic text configuration
export const clinicText: TextConfig = {
  systemName: "Clinic Manager",
  systemDescription: "Simple Patient Care System",
  roles: {
    admin: "Clinic Admin",
    doctor: "Physician",
    nurse: "Nurse",
    patient: "Patient", 
    finance: "Billing"
  },
  navigation: {
    dashboard: "Home",
    patients: "Patients",
    appointments: "Appointments",
    records: "Patient Records",
    prescriptions: "Prescriptions",
    security: "Activity Log",
    analytics: "Reports",
    reports: "Reports",
    billing: "Billing",
    settings: "Settings"
  },
  features: {
    patientManagement: "Patient Care",
    appointmentSystem: "Scheduling",
    clinicalInterface: "Clinical Notes",
    prescriptionSystem: "Medications",
    financialManagement: "Billing"
  },
  buttons: {
    login: "Login",
    logout: "Logout", 
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Remove",
    add: "Add"
  },
  messages: {
    welcome: "Welcome to Clinic Manager",
    loginSuccess: "Welcome back",
    loginError: "Please check your credentials"
  }
};

// Big hospital text configuration
export const bigHospitalText: TextConfig = {
  systemName: "Enterprise Health System",
  systemDescription: "Comprehensive Healthcare Management Platform",
  roles: {
    admin: "System Administrator",
    doctor: "Attending Physician",
    nurse: "Registered Nurse",
    patient: "Patient",
    finance: "Financial Services"
  },
  navigation: {
    dashboard: "Executive Dashboard",
    patients: "Patient Registry",
    appointments: "Scheduling Center",
    records: "Electronic Health Records",
    prescriptions: "Medication Management",
    security: "Security & Compliance",
    analytics: "Business Intelligence",
    reports: "Clinical Reports",
    billing: "Revenue Cycle Management",
    settings: "System Configuration"
  },
  features: {
    patientManagement: "Patient Registry Management",
    appointmentSystem: "Advanced Scheduling System",
    clinicalInterface: "Clinical Decision Support",
    prescriptionSystem: "Pharmacy Management System",
    financialManagement: "Revenue Cycle Management"
  },
  buttons: {
    login: "Secure Login",
    logout: "Secure Logout",
    save: "Save Changes",
    cancel: "Cancel Operation",
    edit: "Modify",
    delete: "Archive",
    add: "Create New"
  },
  messages: {
    welcome: "Welcome to Enterprise Health System",
    loginSuccess: "Authentication successful",
    loginError: "Authentication failed - please verify credentials"
  }
};