'use client';

import {Badge} from './ui/badge';
import {useBranch} from './BranchContext';

interface BranchBadgeProps {
    branchId: string;
    className?: string;
}

export function BranchBadge({branchId, className}: BranchBadgeProps) {
    const {branches, hasBranches} = useBranch();

    // Don't show badge for orgs without branches
    if (!hasBranches || !branchId) return null;

    const branch = branches.find(b => b.id === branchId);
    if (!branch) return null;

    return (
        <Badge
            variant={branch.isMain ? "default" : "secondary"}
            className={className}
        >
            {branch.code}
        </Badge>
    );
}
