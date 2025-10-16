import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReactNode } from 'react';

interface ViewToggleProps {
  gridView: ReactNode;
  listView: ReactNode;
  defaultView?: 'grid' | 'list';
}

export function ViewToggle({ gridView, listView, defaultView = 'grid' }: ViewToggleProps) {
  return (
    <Tabs defaultValue={defaultView} className="space-y-4">
      <TabsList className="hidden lg:inline-flex">
        <TabsTrigger value="grid">Grid View</TabsTrigger>
        <TabsTrigger value="list">List View</TabsTrigger>
      </TabsList>

      <TabsContent value="grid" className="space-y-4">
        {gridView}
      </TabsContent>

      <TabsContent value="list" className="space-y-4 hidden lg:block">
        {listView}
      </TabsContent>
    </Tabs>
  );
}
