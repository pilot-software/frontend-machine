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

export class PermissionStrategy {
    static getMenuItems(userPermissions: Permission[]): MenuItem[] {
        if (!Array.isArray(userPermissions)) {
            return [{icon: Activity, label: "dashboard", path: "/dashboard", permission: 'DASHBOARD_VIEW'}];
        }

        const permissionNames = userPermissions.map(p => p.name).filter(Boolean);
        const menuItems: MenuItem[] = [];

        menuItems.push({icon: Activity, label: "dashboard", path: "/dashboard", permission: 'DASHBOARD_VIEW'});

        if (permissionNames.some(p => p.includes('_PATIENT'))) {
            menuItems.push({icon: User, label: "patients", path: "/patients", permission: 'VIEW_PATIENT'});
        }

        if (permissionNames.some(p => p.includes('_APPOINTMENT'))) {
            menuItems.push({
                icon: Calendar,
                label: "appointments",
                path: "/appointments",
                permission: 'VIEW_APPOINTMENT'
            });
        }

        if (permissionNames.some(p => p.includes('_MEDICAL_RECORD'))) {
            menuItems.push({
                icon: ClipboardList,
                label: "clinical",
                path: "/clinical",
                permission: 'VIEW_MEDICAL_RECORD'
            });
        }

        if (permissionNames.some(p => p.includes('_PRESCRIPTION'))) {
            menuItems.push({
                icon: Pill,
                label: "prescriptions",
                path: "/prescriptions",
                permission: 'VIEW_PRESCRIPTION'
            });
        }

        if (permissionNames.some(p => p.includes('_BILLING') || p.includes('_INVOICE') || p.includes('_PAYMENT'))) {
            menuItems.push({
                icon: BarChart3,
                label: "financial",
                path: "/financial",
                permission: 'VIEW_BILLING'
            });
        }

        if (permissionNames.some(p => p.includes('_USER'))) {
            menuItems.push({icon: Users, label: "userManagement", path: "/users", permission: 'VIEW_USER'});
        }

        if (permissionNames.some(p => p.includes('_LAB'))) {
            menuItems.push({icon: Bed, label: "bedManagement", path: "/beds", permission: 'VIEW_LAB_RESULTS'});
        }

        // Admin-specific menu items
        if (permissionNames.includes('VIEW_ANALYTICS')) {
            menuItems.push({icon: Activity, label: "analytics", path: "/analytics", permission: 'VIEW_ANALYTICS'});
        }

        if (permissionNames.includes('VIEW_SECURITY_LOGS')) {
            menuItems.push({icon: Lock, label: "security", path: "/security", permission: 'VIEW_SECURITY_LOGS'});
        }

        if (permissionNames.includes('MANAGE_PERMISSIONS')) {
            menuItems.push({icon: Shield, label: "permissions", path: "/permissions", permission: 'MANAGE_PERMISSIONS'});
        }

        if (permissionNames.includes('MANAGE_SETTINGS')) {
            menuItems.push({icon: Settings, label: "settings", path: "/settings", permission: 'MANAGE_SETTINGS'});
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
