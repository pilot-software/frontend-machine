import React from "react";
import {Tabs} from "../ui/tabs";

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
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      {children}
    </Tabs>
  );
}
