import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../ui/card';
import {Button} from '../ui/button';
import {Avatar, AvatarFallback, AvatarImage} from '../ui/avatar';
import {StatusBadge} from '../ui/status-badge';
import {LoadingState} from '../ui/loading-state';
import {Edit, Eye, FileText} from 'lucide-react';
import {PatientDisplay} from '../../lib/utils/data-transformers';

interface PatientListProps {
    patients: PatientDisplay[];
    loading: boolean;
    onViewPatient: (id: string) => void;
    onEditPatient: (id: string) => void;
}

export function PatientList({patients, loading, onViewPatient, onEditPatient}: PatientListProps) {
    if (loading) {
        return <LoadingState message="Loading patients..."/>;
    }

    if (patients.length === 0) {
        return <LoadingState message="No patients found" className="text-center"/>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>
                    Latest patient admissions and updates
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {patients.map((patient) => (
                        <div key={patient.id}
                             className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={patient.avatar} alt={patient.name}/>
                                    <AvatarFallback>
                                        {patient.name.split(" ").map((n) => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-medium">{patient.name}</h3>
                                        <StatusBadge status={patient.status}/>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Case: {patient.caseNumber} • Age: {patient.age} • {patient.condition}
                                    </p>
                                    <p className="text-sm text-muted-foreground opacity-70">
                                        {patient.doctor} • Last visit: {patient.lastVisit}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => onViewPatient(patient.id)}>
                                    <Eye className="h-4 w-4"/>
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => onEditPatient(patient.id)}>
                                    <Edit className="h-4 w-4"/>
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <FileText className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
