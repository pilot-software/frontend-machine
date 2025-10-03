'use client';

import React from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {Building, FileText, Settings, Shield, Users} from 'lucide-react';

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Check if we're in a sub-route that should show minimal layout
  const isSubRoute = pathname.includes('/users/') && pathname !== '/users' &&
                    !pathname.includes('/create');

  // Show full layout for permissions routes and main user management routes
  const showFullLayout = pathname === '/users' || pathname.startsWith('/permissions') ||
                        pathname === '/users/create';

  // If it's a sub-route, show minimal layout
  if (isSubRoute) {
    return (
      <div className="p-6">
        {children}
      </div>
    );
  }

  // If not a user management route, don't show this layout
  if (!showFullLayout) {
    return children;
  }

  const tabs = [
    { label: 'Users', icon: Users, path: '/users' },
    { label: 'Role Permissions', icon: Shield, path: '/permissions/roles' },
    { label: 'Permission Groups', icon: Settings, path: '/permissions/groups' },
    { label: 'Audit Log', icon: FileText, path: '/permissions/audit' },
    { label: 'Create User', icon: Building, path: '/users/create' }
  ];

  const getActivePath = () => {
    if (pathname.startsWith('/permissions/roles')) return '/permissions/roles';
    if (pathname.startsWith('/permissions/groups')) return '/permissions/groups';
    if (pathname.startsWith('/permissions/audit')) return '/permissions/audit';
    if (pathname.startsWith('/permissions/branches')) return '/permissions/branches';
    return pathname;
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border">
        <div className="p-6 pb-0">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mb-6">Manage users, permissions, and access control</p>
        </div>

        <div className="px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = getActivePath() === tab.path;
              return (
                <button
                  key={tab.path}
                  onClick={() => router.push(tab.path)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                    isActive
                      ? 'text-primary border-primary bg-background'
                      : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        {children}
      </div>
    </div>
  );
}
