import {UserRole} from './api-router';

export interface MenuItem {
    label: string;
    path: string;
    icon?: string;
}

export const getMenuItems = (userRole: UserRole): MenuItem[] => {
    const baseItems: MenuItem[] = [
        {label: 'Patients', path: '/patients'},
        {label: 'Appointments', path: '/appointments'}
    ];

    if (['ADMIN', 'DOCTOR', 'NURSE', 'FINANCE'].includes(userRole)) {
        baseItems.push({label: 'Dashboard', path: '/dashboard'});
    }

    if (['ADMIN', 'DOCTOR', 'NURSE'].includes(userRole)) {
        baseItems.push({label: 'Queues', path: '/queues'});
    }

    if (['ADMIN', 'FINANCE'].includes(userRole)) {
        baseItems.push({label: 'Financial Reports', path: '/financial'});
    }

    if (userRole === 'ADMIN') {
        baseItems.push(
            {label: 'System Settings', path: '/settings'},
            {label: 'User Management', path: '/users'}
        );
    }

    return baseItems;
};
