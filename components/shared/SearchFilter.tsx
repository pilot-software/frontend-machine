import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { ReactNode } from 'react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filters?: ReactNode;
  showViewToggle?: boolean;
  onViewChange?: (view: 'grid' | 'list') => void;
  currentView?: 'grid' | 'list';
}

export function SearchFilter({ 
  searchTerm, 
  onSearchChange, 
  placeholder = 'Search...', 
  filters,
  showViewToggle = false,
  onViewChange,
  currentView = 'grid'
}: SearchFilterProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            {filters}
          </div>
          {showViewToggle && onViewChange && (
            <div className="hidden lg:flex gap-2">
              <button
                onClick={() => onViewChange('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                List View
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
