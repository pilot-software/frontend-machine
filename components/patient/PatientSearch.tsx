import React from 'react';
import {Card, CardContent} from '../ui/card';
import {Input} from '../ui/input';
import {FilterDropdown} from '../FilterDropdown';
import {Search} from 'lucide-react';

interface PatientSearchProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    activeFilters: Record<string, string>;
    onFilterChange: (filters: Record<string, string>) => void;
    onClearFilters: () => void;
}

export function PatientSearch({
                                  searchTerm,
                                  onSearchChange,
                                  activeFilters,
                                  onFilterChange,
                                  onClearFilters
                              }: PatientSearchProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="Search patients by name, case number, or condition..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex justify-end">
                        <FilterDropdown
                            filters={[
                                {
                                    key: 'status',
                                    label: 'Status',
                                    options: [
                                        {value: 'Active', label: 'Active'},
                                        {value: 'Critical', label: 'Critical'},
                                        {value: 'Recovering', label: 'Recovering'},
                                        {value: 'Discharged', label: 'Discharged'},
                                    ]
                                },
                                {
                                    key: 'department',
                                    label: 'Department',
                                    options: [
                                        {value: 'Cardiology', label: 'Cardiology'},
                                        {value: 'Emergency', label: 'Emergency'},
                                        {value: 'Orthopedics', label: 'Orthopedics'},
                                        {value: 'Pediatrics', label: 'Pediatrics'},
                                    ]
                                }
                            ]}
                            activeFilters={activeFilters}
                            onFilterChange={onFilterChange}
                            onClearFilters={onClearFilters}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
