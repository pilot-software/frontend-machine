'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, Heart, FileText, Printer } from 'lucide-react';
import { useAppData } from '@/lib/hooks/useAppData';
import { Patient, Doctor } from '@/lib/types';

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [assignedDoctor, setAssignedDoctor] = useState<Doctor | null>(null);
  const { patients: patientsData, doctors: doctorsData } = useAppData();

  useEffect(() => {
    if (patientsData && doctorsData) {
      const foundPatient = patientsData.find((p: Patient) => p.id === patientId);
      if (foundPatient) {
        setPatient(foundPatient);
        const doctor = doctorsData.find((d: Doctor) => d.id === foundPatient.assignedDoctor);
        setAssignedDoctor(doctor || null);
      }
    }
  }, [patientId, patientsData, doctorsData]);

  const handlePrint = () => {
    window.print();
  };

  if (!patient) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Patient not found</h1>
          <p className="text-muted-foreground mt-2">The requested patient could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => window.close()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Close
          </Button>
          <h1 className="text-3xl font-bold">Patient Details</h1>
        </div>
        <Button onClick={handlePrint} className="print:hidden">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`} 
                alt={patient.firstName} 
              />
              <AvatarFallback className="text-lg">
                {patient.firstName[0]}{patient.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{patient.firstName} {patient.lastName}</h2>
              <p className="text-muted-foreground">Case #{patient.id}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">DOB:</span>
                  <span className="ml-2">{patient.dateOfBirth}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Gender:</span>
                  <span className="ml-2 capitalize">{patient.gender}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge className="ml-2 bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Contact Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{patient.email || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{patient.phone || 'N/A'}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                  <span className="text-sm">{patient.address || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Medical Information
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Assigned Doctor:</span>
                  <p className="font-medium">{assignedDoctor?.name || 'Not assigned'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Department:</span>
                  <p className="font-medium">{assignedDoctor?.department || 'General'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Insurance Provider:</span>
                  <p className="font-medium">{patient.insuranceProvider || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Emergency Contact:</span>
                  <p className="font-medium">{patient.emergencyContactPhone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}