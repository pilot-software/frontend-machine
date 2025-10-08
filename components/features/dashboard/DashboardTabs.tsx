import React from "react";
import { useTranslations } from "next-intl";
import {Tabs} from '@/components/ui/tabs';

interface DashboardTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    children: React.ReactNode;
}

export function DashboardTabs({
                                  activeTab,
                                  onTabChange,
                                  children,
                              }: DashboardTabsProps) {
  const t = useTranslations('common');
    return (
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            {children}
        </Tabs>
    );
}
