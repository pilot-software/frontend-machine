// Main component
export { ClinicalInterfaceEnhanced } from './ClinicalInterfaceEnhanced';

// Types
export * from './types/clinical.types';

// Components
export { ClinicalStats } from './components/ClinicalStats';
export { VitalSignsTab } from './components/VitalSignsTab';
export { VitalSignCard } from './components/VitalSignCard';
export { LabResultsTab } from './components/LabResultsTab';
export { DiagnosesTab } from './components/DiagnosesTab';
export { TreatmentPlansTab } from './components/TreatmentPlansTab';
export { ClinicalDetailModal } from './components/ClinicalDetailModal';

// Hooks
export { useClinicalData } from './hooks/useClinicalData';
export { useClinicalStats } from './hooks/useClinicalStats';
export { useClinicalModal } from './hooks/useClinicalModal';

// Utils
export * from './utils/clinicalHelpers';

// Data
export * from './data/mockClinicalData';
