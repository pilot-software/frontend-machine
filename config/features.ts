export interface FeatureConfig {
    // Core Features
    patientManagement: boolean;
    appointmentSystem: boolean;
    clinicalInterface: boolean;
    prescriptionSystem: boolean;
    financialManagement: boolean;

    // Advanced Features
    labResults: boolean;
    vitalsTracking: boolean;
    wardManagement: boolean;
    insuranceManagement: boolean;
    billingSystem: boolean;
    securityLogs: boolean;
    analytics: boolean;
    reports: boolean;

    // User Roles
    roles: {
        admin: boolean;
        doctor: boolean;
        nurse: boolean;
        patient: boolean;
        finance: boolean;
        receptionist: boolean;
        technician: boolean;
    };

    // UI Features
    notifications: boolean;
    twoFactorAuth: boolean;
    darkMode: boolean;
    mobileApp: boolean;
}

export interface TextConfig {
    systemName: string;
    systemDescription: string;
    roles: Record<string, string>;
    navigation: Record<string, string>;
    features: Record<string, string>;
    buttons: Record<string, string>;
    messages: Record<string, string>;
}

// Default configuration for hospitals
export const hospitalConfig: FeatureConfig = {
    patientManagement: true,
    appointmentSystem: true,
    clinicalInterface: true,
    prescriptionSystem: true,
    financialManagement: true,
    labResults: true,
    vitalsTracking: true,
    wardManagement: true,
    insuranceManagement: true,
    billingSystem: true,
    securityLogs: true,
    analytics: true,
    reports: true,
    roles: {
        admin: true,
        doctor: true,
        nurse: true,
        patient: true,
        finance: true,
        receptionist: true,
        technician: true,
    },
    notifications: true,
    twoFactorAuth: true,
    darkMode: true,
    mobileApp: true,
};

// Configuration for small clinics
export const clinicConfig: FeatureConfig = {
    patientManagement: true,
    appointmentSystem: true,
    clinicalInterface: true,
    prescriptionSystem: true,
    financialManagement: false,
    labResults: false,
    vitalsTracking: true,
    wardManagement: false,
    insuranceManagement: false,
    billingSystem: false,
    securityLogs: false,
    analytics: false,
    reports: false,
    roles: {
        admin: true,
        doctor: true,
        nurse: false,
        patient: true,
        finance: false,
        receptionist: true,
        technician: false,
    },
    notifications: false,
    twoFactorAuth: false,
    darkMode: false,
    mobileApp: false,
};

// Configuration for big hospitals
export const bigHospitalConfig: FeatureConfig = {
    ...hospitalConfig,
    // All features enabled for big hospitals
};
