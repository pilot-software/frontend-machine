'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Settings2 } from 'lucide-react';

export interface DashboardWidget {
  id: string;
  label: string;
  enabled: boolean;
  category: 'stats' | 'actions' | 'info';
}

interface DashboardCustomizerProps {
  widgets: DashboardWidget[];
  onUpdate: (widgets: DashboardWidget[]) => void;
}

export function DashboardCustomizer({ widgets, onUpdate }: DashboardCustomizerProps) {
  const t = useTranslations('common');
  const [localWidgets, setLocalWidgets] = useState(widgets);

  const toggleWidget = (id: string) => {
    const updated = localWidgets.map(w => 
      w.id === id ? { ...w, enabled: !w.enabled } : w
    );
    setLocalWidgets(updated);
    onUpdate(updated);
  };

  const categories = {
    stats: localWidgets.filter(w => w.category === 'stats'),
    actions: localWidgets.filter(w => w.category === 'actions'),
    info: localWidgets.filter(w => w.category === 'info'),
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          {t('customize')}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('customizeDashboard')}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-medium mb-3 capitalize">{t(category)}</h3>
              <div className="space-y-3">
                {items.map(widget => (
                  <div key={widget.id} className="flex items-center justify-between">
                    <span className="text-sm">{t(widget.label)}</span>
                    <Switch
                      checked={widget.enabled}
                      onCheckedChange={() => toggleWidget(widget.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
