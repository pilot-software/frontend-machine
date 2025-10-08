import React, {useState} from 'react';
import { useTranslations } from "next-intl";
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';
import {Filter, X} from 'lucide-react';

interface FilterOption {
    key: string;
    label: string;
    options: { value: string; label: string }[];
}

interface FilterDropdownProps {
    filters: FilterOption[];
    activeFilters: Record<string, string>;
    onFilterChange: (filters: Record<string, string>) => void;
    onClearFilters: () => void;
}

export function FilterDropdown({filters, activeFilters, onFilterChange, onClearFilters}: FilterDropdownProps) {
  const t = useTranslations('common');
    const [isOpen, setIsOpen] = useState(false);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = {...activeFilters};
        if (value === 'all' || value === '') {
            delete newFilters[key];
        } else {
            newFilters[key] = value;
        }
        onFilterChange(newFilters);
    };

    const activeFilterCount = Object.keys(activeFilters).length;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                    <Filter className="h-4 w-4 mr-2"/>
                    Filter
                    {activeFilterCount > 0 && (
                        <Badge variant="secondary"
                               className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">Filters</h4>
                        {activeFilterCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    onClearFilters();
                                    setIsOpen(false);
                                }}
                                className="h-auto p-1 text-xs"
                            >
                                Clear all
                            </Button>
                        )}
                    </div>

                    <Separator/>

                    <div className="space-y-3">
                        {filters.map((filter) => (
                            <div key={filter.key}>
                                <Label className="text-sm font-medium">{filter.label}</Label>
                                <Select
                                    value={activeFilters[filter.key] || 'all'}
                                    onValueChange={(value) => handleFilterChange(filter.key, value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All {filter.label}</SelectItem>
                                        {filter.options.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>

                    {activeFilterCount > 0 && (
                        <>
                            <Separator/>
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Active Filters</Label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(activeFilters).map(([key, value]) => {
                                        const filter = filters.find(f => f.key === key);
                                        const option = filter?.options.find(o => o.value === value);
                                        return (
                                            <Badge key={key} variant="secondary" className="flex items-center gap-1">
                                                {filter?.label}: {option?.label}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-auto w-auto p-0 ml-1"
                                                    onClick={() => handleFilterChange(key, 'all')}
                                                >
                                                    <X className="h-3 w-3"/>
                                                </Button>
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
