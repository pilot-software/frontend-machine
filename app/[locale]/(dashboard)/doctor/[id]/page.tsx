'use client';

import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {ArrowLeft, Building2, Mail, Phone, Printer, Stethoscope, Users} from 'lucide-react';
import {useAppData} from '@/lib/hooks/useAppData';
import {Doctor} from '@/lib/types';

export default function DoctorDetailPage() {
    const params = useParams();
    const doctorId = params.id as string;
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const {doctors: doctorsData} = useAppData();

    useEffect(() => {
        if (doctorsData) {
            const foundDoctor = doctorsData.find((d: Doctor) => d.id === doctorId);
            setDoctor(foundDoctor || null);
        }
    }, [doctorId, doctorsData]);

    const handlePrint = () => {
        window.print();
    };

    if (!doctor) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Doctor not found</h1>
                    <p className="text-muted-foreground mt-2">The requested doctor could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={() => window.close()}>
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                        Close
                    </Button>
                    <h1 className="text-3xl font-bold">Doctor Details</h1>
                </div>
                <Button onClick={handlePrint} className="print:hidden">
                    <Printer className="h-4 w-4 mr-2"/>
                    Print
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                        <Avatar className="h-16 w-16">
                            <AvatarImage
                                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
                                alt={doctor.name}
                            />
                            <AvatarFallback className="text-lg">
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-semibold">Dr. {doctor.name}</h2>
                            <p className="text-muted-foreground">{doctor.specialization}</p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center">
                                <Stethoscope className="h-5 w-5 mr-2"/>
                                Professional Information
                            </h3>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-sm text-muted-foreground">Specialization:</span>
                                    <p className="font-medium">{doctor.specialization}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">Department:</span>
                                    <p className="font-medium">{doctor.department}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">License Number:</span>
                                    <p className="font-medium">{doctor.licenseNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">Years of Experience:</span>
                                    <p className="font-medium">{'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center">
                                <Mail className="h-5 w-5 mr-2"/>
                                Contact Information
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <Mail className="h-4 w-4 mr-2 text-muted-foreground"/>
                                    <span className="text-sm">{doctor.email}</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-4 w-4 mr-2 text-muted-foreground"/>
                                    <span className="text-sm">{doctor.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center">
                                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground"/>
                                    <span className="text-sm">{'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center">
                                <Users className="h-5 w-5 mr-2"/>
                                Practice Information
                            </h3>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-sm text-muted-foreground">Current Patients:</span>
                                    <p className="font-medium">0</p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">Availability:</span>
                                    <Badge className="ml-2 bg-green-100 text-green-800">Available</Badge>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">Working Hours:</span>
                                    <p className="font-medium">9:00 AM - 5:00 PM</p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">Consultation Fee:</span>
                                    <p className="font-medium">N/A</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Education & Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold">Medical Degree</h4>
                            <p className="text-muted-foreground">Information not available</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Board Certifications</h4>
                            <p className="text-muted-foreground">Information not available</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Additional Training</h4>
                            <p className="text-muted-foreground">Information not available</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
