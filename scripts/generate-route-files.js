#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const dashboardBase = path.join(__dirname, '../app/[locale]/(dashboard)');

// Map route → skeleton component
const skeletonMap = {
    dashboard: 'DashboardSkeleton',
    analytics: 'AnalyticsPageSkeleton',
    appointments: 'AppointmentListSkeleton',
    financial: 'FinancialStatsSkeleton',
    patients: 'DashboardSkeleton',
    'medical-records': 'DashboardSkeleton',
    clinical: 'DashboardSkeleton',
    prescriptions: 'DashboardSkeleton',
    users: 'DashboardSkeleton',
    settings: 'DashboardSkeleton',
    notifications: 'NotificationSkeleton',
    reports: 'AnalyticsPageSkeleton',
    'system-logs': 'DashboardSkeleton',
    permissions: 'DashboardSkeleton',
    profile: 'DashboardSkeleton',
    department: 'DashboardSkeleton',
    doctor: 'DashboardSkeleton',
    beds: 'DashboardSkeleton',
    wards: 'DashboardSkeleton',
    queue: 'DashboardSkeleton',
    schedule: 'DashboardSkeleton',
    availability: 'DashboardSkeleton',
    'vital-signs': 'DashboardSkeleton',
    'qr-demo': 'DashboardSkeleton',
    customize: 'DashboardSkeleton',
    help: 'DashboardSkeleton',
    patient: 'DashboardSkeleton',
};

const skeletonImports = {
    DashboardSkeleton: `import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';`,
    AnalyticsPageSkeleton: `import { AnalyticsPageSkeleton } from '@/components/skeletons/AnalyticsSkeleton';`,
    AppointmentListSkeleton: `import { AppointmentListSkeleton } from '@/components/skeletons/AppointmentSkeleton';`,
    FinancialStatsSkeleton: `import { FinancialStatsSkeleton } from '@/components/skeletons/FinancialSkeleton';`,
    NotificationSkeleton: `import { NotificationSkeleton } from '@/components/skeletons/NotificationSkeleton';`,
};

const routes = fs.readdirSync(dashboardBase).filter(f => {
    const full = path.join(dashboardBase, f);
    return fs.statSync(full).isDirectory();
});

let created = 0;

for (const route of routes) {
    const routeDir = path.join(dashboardBase, route);
    const skeleton = skeletonMap[route] || 'DashboardSkeleton';
    const importLine = skeletonImports[skeleton] || skeletonImports['DashboardSkeleton'];

    // loading.tsx
    const loadingPath = path.join(routeDir, 'loading.tsx');
    if (!fs.existsSync(loadingPath)) {
        fs.writeFileSync(loadingPath, `${importLine}\n\nexport default function Loading() {\n    return (\n        <div className="p-6">\n            <${skeleton} />\n        </div>\n    );\n}\n`);
        console.log(`✓ Created loading.tsx → ${route}`);
        created++;
    }

    // error.tsx
    const errorPath = path.join(routeDir, 'error.tsx');
    if (!fs.existsSync(errorPath)) {
        fs.writeFileSync(errorPath, `'use client';\n\nimport { RouteError } from '@/components/shared/RouteError';\n\nexport default function Error({\n    error,\n    reset,\n}: {\n    error: Error & { digest?: string };\n    reset: () => void;\n}) {\n    return <RouteError error={error} reset={reset} />;\n}\n`);
        console.log(`✓ Created error.tsx → ${route}`);
        created++;
    }
}

// Also add to [locale] level
const localeDir = path.join(__dirname, '../app/[locale]');
const localeError = path.join(localeDir, 'error.tsx');
if (!fs.existsSync(localeError)) {
    fs.writeFileSync(localeError, `'use client';\n\nimport { RouteError } from '@/components/shared/RouteError';\n\nexport default function Error({\n    error,\n    reset,\n}: {\n    error: Error & { digest?: string };\n    reset: () => void;\n}) {\n    return <RouteError error={error} reset={reset} />;\n}\n`);
    console.log('✓ Created error.tsx → [locale]');
    created++;
}

console.log(`\nDone! Created ${created} files.`);
