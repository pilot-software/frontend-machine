import React from 'react';
import { useTranslations } from "next-intl";
import {Badge} from './badge';
import {getStatusColor} from '../../lib/constants/status';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export function StatusBadge({status, className = ''}: StatusBadgeProps) {
  const t = useTranslations('common');
    return (
        <Badge className={`${getStatusColor(status)} ${className}`}>
            {status}
        </Badge>
    );
}
