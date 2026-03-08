'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  onClick: () => void;
}

interface DraggableQuickActionsProps {
  actions: QuickAction[];
  onReorder?: (reorderedActions: QuickAction[]) => void;
}

export function DraggableQuickActions({
  actions,
}: DraggableQuickActionsProps) {
  const t = useTranslations('common');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          {t('quickActions')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className={`flex-1 min-w-[90px] h-14 flex flex-col items-center justify-center gap-1 ${action.hoverColor} transition-all`}
              onClick={action.onClick}
            >
              <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                {action.icon}
              </div>
              <span className="text-xs font-medium text-center">
                {action.label}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
