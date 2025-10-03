'use client';

import React, {useEffect, useRef, useState} from 'react';
import {Search, User} from 'lucide-react';
import {Input} from './input';
import {Card} from './card';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    caseNumber: string;
    age?: number;
    gender?: string;
    assignedDoctorId?: string;
}

interface PatientSearchProps {
    patients: Patient[];
    onSelect: (patient: Patient) => void;
    placeholder?: string;
    selectedPatientId?: string;
}

export function PatientSearch({
                                  patients,
                                  onSelect,
                                  placeholder = "Search patients by name or case number...",
                                  selectedPatientId
                              }: PatientSearchProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (searchTerm.trim()) {
            const filtered = patients.filter(patient =>
                `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPatients(filtered);
            setIsOpen(true);
        } else {
            setFilteredPatients([]);
            setIsOpen(false);
        }
    }, [searchTerm, patients]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePatientSelect = (patient: Patient) => {
        setSearchTerm(`${patient.firstName} ${patient.lastName} (${patient.caseNumber})`);
        setIsOpen(false);
        onSelect(patient);
    };

    const selectedPatient = patients.find(p => p.id === selectedPatientId);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input
                    ref={inputRef}
                    placeholder={placeholder}
                    value={searchTerm || (selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName} (${selectedPatient.caseNumber})` : '')}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => {
                        if (searchTerm.trim()) setIsOpen(true);
                    }}
                    className="pl-10"
                />
            </div>

            {isOpen && filteredPatients.length > 0 && (
                <div
                    className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredPatients.map((patient) => (
                        <Card
                            key={patient.id}
                            className="m-2 p-3 cursor-pointer hover:bg-muted/50 transition-colors border-0 shadow-sm"
                            onClick={() => handlePatientSelect(patient)}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <User className="h-4 w-4 text-blue-600"/>
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-sm">
                                        {patient.firstName} {patient.lastName}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Case: {patient.caseNumber}
                                        {patient.age && ` • Age: ${patient.age}`}
                                        {patient.gender && ` • ${patient.gender}`}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
