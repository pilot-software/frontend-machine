import {Permission} from '../services/permission';
import {
    Activity,
    BarChart3,
    Bed,
    Calendar,
    ClipboardList,
    Heart,
    Lock,
    Settings,
    Shield,
    Stethoscope,
    User,
    Users,
    Pill
} from 'lucide-react';

export interface MenuItem {
    icon: any;
    label: string;
    path: string;
    permission: string;
}

export interface PermissionConfig {
    menuItems: MenuItem[];
}

// Permission to menu item mapping - Updated to match API permissions
const PERMISSION_MENU_MAP: Record<string, MenuItem> = {
    // User Management
    'USERS_VIEW': {icon: Users, label: "User Management", path: "/users", permission: 'USERS_VIEW'},
    'USERS_CREATE_STAFF': {icon: Users, label: "User Management", path: "/users", permission: 'USERS_CREATE_STAFF'},
    'USERS_UPDATE': {icon: Users, label: "User Management", path: "/users", permission: 'USERS_UPDATE'},
    'USERS_DELETE': {icon: Users, label: "User Management", path: "/users", permission: 'USERS_DELETE'},

    // Patient Management
    'PATIENTS_VIEW': {icon: User, label: "Patients", path: "/patients", permission: 'PATIENTS_VIEW'},
    'PATIENTS_CREATE': {icon: User, label: "Patients", path: "/patients", permission: 'PATIENTS_CREATE'},
    'PATIENTS_UPDATE': {icon: User, label: "Patients", path: "/patients", permission: 'PATIENTS_UPDATE'},
    'PATIENTS_DELETE': {icon: User, label: "Patients", path: "/patients", permission: 'PATIENTS_DELETE'},

    // Appointments
    'APPOINTMENTS_VIEW': {
        icon: Calendar,
        label: "Appointments",
        path: "/appointments",
        permission: 'APPOINTMENTS_VIEW'
    },
    'APPOINTMENTS_CREATE': {
        icon: Calendar,
        label: "Appointments",
        path: "/appointments",
        permission: 'APPOINTMENTS_CREATE'
    },
    'APPOINTMENTS_UPDATE': {
        icon: Calendar,
        label: "Appointments",
        path: "/appointments",
        permission: 'APPOINTMENTS_UPDATE'
    },
    'APPOINTMENTS_CANCEL': {
        icon: Calendar,
        label: "Appointments",
        path: "/appointments",
        permission: 'APPOINTMENTS_CANCEL'
    },

    // Medical Records
    'MEDICAL_RECORDS_READ': {
        icon: ClipboardList,
        label: "Clinical Records",
        path: "/clinical",
        permission: 'MEDICAL_RECORDS_READ'
    },
    'MEDICAL_RECORDS_CREATE': {
        icon: ClipboardList,
        label: "Clinical Records",
        path: "/clinical",
        permission: 'MEDICAL_RECORDS_CREATE'
    },
    'MEDICAL_RECORDS_UPDATE': {
        icon: ClipboardList,
        label: "Clinical Records",
        path: "/clinical",
        permission: 'MEDICAL_RECORDS_UPDATE'
    },
    'MEDICAL_RECORDS_DELETE': {
        icon: ClipboardList,
        label: "Clinical Records",
        path: "/clinical",
        permission: 'MEDICAL_RECORDS_DELETE'
    },

    // Billing
    'BILLING_VIEW_INVOICES': {
        icon: BarChart3,
        label: "Financial",
        path: "/financial",
        permission: 'BILLING_VIEW_INVOICES'
    },
    'BILLING_CREATE_INVOICES': {
        icon: BarChart3,
        label: "Financial",
        path: "/financial",
        permission: 'BILLING_CREATE_INVOICES'
    },
    'BILLING_PROCESS_PAYMENTS': {
        icon: BarChart3,
        label: "Financial",
        path: "/financial",
        permission: 'BILLING_PROCESS_PAYMENTS'
    },

    // System Management
    'SYSTEM_MANAGE_ROLES': {icon: Lock, label: "Security", path: "/security", permission: 'SYSTEM_MANAGE_ROLES'},
    'SYSTEM_HOSPITAL_SETTINGS': {
        icon: Settings,
        label: "Settings",
        path: "/settings",
        permission: 'SYSTEM_HOSPITAL_SETTINGS'
    },
    'USERS_MANAGE_PERMISSIONS': {
        icon: Shield,
        label: "Permissions",
        path: "/permissions",
        permission: 'USERS_MANAGE_PERMISSIONS'
    },

    // Queue Management
    'QUEUES_ADMIN_ALL': {icon: Activity, label: "Analytics", path: "/analytics", permission: 'QUEUES_ADMIN_ALL'},
    'QUEUES_NURSING': {icon: Heart, label: "Nursing Queue", path: "/wards", permission: 'QUEUES_NURSING'},
    'QUEUES_MEDICAL': {icon: Stethoscope, label: "Medical Queue", path: "/clinical", permission: 'QUEUES_MEDICAL'},

    // Profile
    'PROFILE_VIEW': {icon: User, label: "Profile", path: "/profile", permission: 'PROFILE_VIEW'}
};

export class PermissionStrategy {
    static getMenuItems(userPermissions: Permission[]): MenuItem[] {
        // Handle case where userPermissions might not be an array
        if (!Array.isArray(userPermissions)) {
            return [{icon: Activity, label: "dashboard", path: "/dashboard", permission: 'DASHBOARD_VIEW'}];
        }

        const permissionNames = userPermissions.map(p => p.name).filter(Boolean);
        const menuItems: MenuItem[] = [];

        // Main routes without dashboard prefix
        menuItems.push({icon: Activity, label: "dashboard", path: "/dashboard", permission: 'DASHBOARD_VIEW'});

        if (permissionNames.some(p => p.startsWith('PATIENTS_'))) {
            menuItems.push({icon: User, label: "patients", path: "/patients", permission: 'PATIENTS_VIEW'});
        }

        if (permissionNames.some(p => p.startsWith('APPOINTMENTS_'))) {
            menuItems.push({
                icon: Calendar,
                label: "appointments",
                path: "/appointments",
                permission: 'APPOINTMENTS_VIEW'
            });
        }

        if (permissionNames.some(p => p.startsWith('MEDICAL_RECORDS_'))) {
            menuItems.push({
                icon: ClipboardList,
                label: "clinical",
                path: "/clinical",
                permission: 'MEDICAL_RECORDS_READ'
            });
        }

        if (permissionNames.some(p => p.startsWith('MEDICAL_RECORDS_') || p.startsWith('APPOINTMENTS_'))) {
            menuItems.push({
                icon: Pill,
                label: "prescriptions",
                path: "/prescriptions",
                permission: 'MEDICAL_RECORDS_READ'
            });
        }

        if (permissionNames.some(p => p.startsWith('BILLING_'))) {
            menuItems.push({
                icon: BarChart3,
                label: "financial",
                path: "/financial",
                permission: 'BILLING_VIEW_INVOICES'
            });
        }

        if (permissionNames.some(p => p.startsWith('USERS_'))) {
            menuItems.push({icon: Users, label: "userManagement", path: "/users", permission: 'USERS_VIEW'});
        }

        // Show bed management for admins or users with bed permissions
        if (permissionNames.some(p => p.includes('BED') || p.includes('BEDS')) || 
            permissionNames.includes('SYSTEM_HOSPITAL_SETTINGS') ||
            permissionNames.includes('USERS_MANAGE_PERMISSIONS')) {
            menuItems.push({icon: Bed, label: "bedManagement", path: "/beds", permission: 'BEDS_VIEW'});
        }

        if (permissionNames.includes('QUEUES_ADMIN_ALL')) {
            menuItems.push({icon: Activity, label: "analytics", path: "/analytics", permission: 'QUEUES_ADMIN_ALL'});
        }

        if (permissionNames.includes('SYSTEM_MANAGE_ROLES')) {
            menuItems.push({icon: Lock, label: "security", path: "/security", permission: 'SYSTEM_MANAGE_ROLES'});
        }

        if (permissionNames.includes('USERS_MANAGE_PERMISSIONS')) {
            menuItems.push({
                icon: Shield,
                label: "permissions",
                path: "/permissions",
                permission: 'USERS_MANAGE_PERMISSIONS'
            });
        }

        if (permissionNames.includes('SYSTEM_HOSPITAL_SETTINGS')) {
            menuItems.push({
                icon: Settings,
                label: "settings",
                path: "/settings",
                permission: 'SYSTEM_HOSPITAL_SETTINGS'
            });
        }

        return menuItems;
    }

    static hasPermission(userPermissions: Permission[], requiredPermission: string): boolean {
        if (!Array.isArray(userPermissions)) return false;
        return userPermissions.some(p => p.name === requiredPermission);
    }

    static hasAnyPermission(userPermissions: Permission[], requiredPermissions: string[]): boolean {
        if (!Array.isArray(userPermissions)) return false;
        return requiredPermissions.some(permission =>
            userPermissions.some(p => p.name === permission)
        );
    }
}
