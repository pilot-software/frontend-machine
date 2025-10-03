import {UserRole} from '../types';
import {FeatureConfig, TextConfig} from '@/config';
import {
    Activity,
    BarChart3,
    BedDouble,
    Calendar,
    ClipboardList,
    FileText,
    FlaskConical,
    Heart,
    Lock,
    PillBottle,
    Shield,
    Stethoscope,
    User,
    UserCheck,
    Users
} from 'lucide-react';

export interface MenuItem {
    icon: any;
    label: string;
    path: string;
}

export interface RoleConfig {
    color: string;
    icon: any;
    menuItems: MenuItem[];
}

export interface IRoleStrategy {
    getConfig(features: FeatureConfig, text: TextConfig): RoleConfig;
}

export class AdminRoleStrategy implements IRoleStrategy {
    getConfig(features: FeatureConfig, text: TextConfig): RoleConfig {
        const menuItems: MenuItem[] = [
            {icon: Users, label: "User Management", path: "/users"}
        ];

        if (features.analytics) {
            menuItems.push({icon: BarChart3, label: text.navigation.analytics, path: "/analytics"});
        }
        if (features.securityLogs) {
            menuItems.push({icon: Lock, label: text.navigation.security, path: "/security"});
        }
        if (features.reports) {
            menuItems.push({icon: FileText, label: text.navigation.reports, path: "/reports"});
        }

        return {
            color: "bg-red-100 text-red-800",
            icon: Shield,
            menuItems
        };
    }
}

export class DoctorRoleStrategy implements IRoleStrategy {
    getConfig(features: FeatureConfig, text: TextConfig): RoleConfig {
        const menuItems: MenuItem[] = [];

        if (features.patientManagement) {
            menuItems.push({icon: Users, label: text.navigation.patients, path: "/patients"});
        }
        if (features.appointmentSystem) {
            menuItems.push({icon: Calendar, label: text.navigation.appointments, path: "/appointments"});
        }
        if (features.clinicalInterface) {
            menuItems.push({icon: ClipboardList, label: text.navigation.records, path: "/clinical"});
        }
        if (features.prescriptionSystem) {
            menuItems.push({icon: PillBottle, label: text.navigation.prescriptions, path: "/prescriptions"});
        }
        if (features.securityLogs) {
            menuItems.push({icon: Lock, label: text.navigation.security, path: "/security"});
        }

        return {
            color: "bg-blue-100 text-blue-800",
            icon: Stethoscope,
            menuItems
        };
    }
}

export class NurseRoleStrategy implements IRoleStrategy {
    getConfig(features: FeatureConfig, _text: TextConfig): RoleConfig {
        const menuItems: MenuItem[] = [];

        if (features.patientManagement) {
            menuItems.push({icon: Users, label: "Patient Care", path: "/patients"});
        }
        if (features.vitalsTracking) {
            menuItems.push({icon: Activity, label: "Vital Signs", path: "/clinical"});
        }
        if (features.wardManagement) {
            menuItems.push({icon: BedDouble, label: "Ward Management", path: "/wards"});
        }
        menuItems.push({icon: Calendar, label: "Shift Schedule", path: "/schedule"});

        return {
            color: "bg-green-100 text-green-800",
            icon: Heart,
            menuItems
        };
    }
}

export class PatientRoleStrategy implements IRoleStrategy {
    getConfig(features: FeatureConfig, text: TextConfig): RoleConfig {
        const menuItems: MenuItem[] = [];

        if (features.appointmentSystem) {
            menuItems.push({icon: Calendar, label: "My Appointments", path: "/appointments"});
        }
        if (features.clinicalInterface) {
            menuItems.push({icon: FileText, label: "Medical Records", path: "/clinical"});
        }
        if (features.prescriptionSystem) {
            menuItems.push({icon: PillBottle, label: text.navigation.prescriptions, path: "/prescriptions"});
        }
        menuItems.push({icon: User, label: "Profile", path: "/profile"});

        return {
            color: "bg-purple-100 text-purple-800",
            icon: User,
            menuItems
        };
    }
}

export class FinanceRoleStrategy implements IRoleStrategy {
    getConfig(features: FeatureConfig, text: TextConfig): RoleConfig {
        const menuItems: MenuItem[] = [];

        if (features.analytics) {
            menuItems.push({icon: BarChart3, label: "Financial Reports", path: "/financial"});
        }
        if (features.billingSystem) {
            menuItems.push({icon: FileText, label: text.navigation.billing, path: "/financial"});
        }
        menuItems.push({icon: Users, label: "Patient Accounts", path: "/financial"});

        return {
            color: "bg-yellow-100 text-yellow-800",
            icon: BarChart3,
            menuItems
        };
    }
}

export class ReceptionistRoleStrategy implements IRoleStrategy {
    getConfig(features: FeatureConfig, text: TextConfig): RoleConfig {
        const menuItems: MenuItem[] = [];

        if (features.patientManagement) {
            menuItems.push({icon: Users, label: "Patients", path: "/patients"});
        }
        if (features.appointmentSystem) {
            menuItems.push({icon: Calendar, label: text.navigation.appointments, path: "/appointments"});
        }
        if (features.financialManagement) {
            menuItems.push({icon: FileText, label: "Billing", path: "/financial"});
        }

        return {
            color: "bg-teal-100 text-teal-800",
            icon: UserCheck,
            menuItems
        };
    }
}

export class TechnicianRoleStrategy implements IRoleStrategy {
    getConfig(features: FeatureConfig, _text: TextConfig): RoleConfig {
        const menuItems: MenuItem[] = [];

        if (features.patientManagement) {
            menuItems.push({icon: Users, label: "Patients", path: "/patients"});
        }
        if (features.appointmentSystem) {
            menuItems.push({icon: Calendar, label: "Appointments", path: "/appointments"});
        }
        if (features.clinicalInterface) {
            menuItems.push({icon: ClipboardList, label: "Lab Records", path: "/clinical"});
        }

        return {
            color: "bg-indigo-100 text-indigo-800",
            icon: FlaskConical,
            menuItems
        };
    }
}

export class RoleStrategyFactory {
    private static strategies: Record<UserRole, IRoleStrategy> = {
        admin: new AdminRoleStrategy(),
        doctor: new DoctorRoleStrategy(),
        nurse: new NurseRoleStrategy(),
        patient: new PatientRoleStrategy(),
        finance: new FinanceRoleStrategy(),
        receptionist: new ReceptionistRoleStrategy(),
        technician: new TechnicianRoleStrategy()
    };

    static getStrategy(role: UserRole): IRoleStrategy {
        return this.strategies[role];
    }
}
