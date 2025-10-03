import React from 'react';
import {Badge} from './badge';
import {getStatusColor} from '../../lib/constants/status';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export function StatusBadge({status, className = ''}: StatusBadgeProps) {
    return (
        <Badge className={`${getStatusColor(status)} ${className}`}>
            {status}
        </Badge>
    );
}
