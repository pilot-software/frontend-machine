'use client';

import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Activity, ArrowLeft, Building2, MapPin, Phone, Printer, Users} from 'lucide-react';

interface Department {
    id: string;
    name: string;
    head: string;
    totalPatients: number;
    activeStaff: number;
    location: string;
    phone: string;
    status: string;
}

export default function DepartmentDetailPage() {
    const params = useParams();
    const departmentId = params.id as string;
    const [department, setDepartment] = useState<Department | null>(null);

    useEffect(() => {
        // Mock departments data since API endpoint not available
        const mockDepartments = [
            {
                id: "1",
                name: "Cardiology",
                head: "Dr. John Smith",
                totalPatients: 45,
                activeStaff: 12,
                location: "Building A, Floor 2",
                phone: "+1-555-0201",
                status: "operational",
            },
            {
                id: "2",
                name: "Emergency",
                head: "Dr. Sarah Wilson",
                totalPatients: 23,
                activeStaff: 18,
                location: "Building B, Ground Floor",
                phone: "+1-555-0202",
                status: "operational",
            },
        ];

        const foundDepartment = mockDepartments.find(d => d.id === departmentId);
        setDepartment(foundDepartment || null);
    }, [departmentId]);

    const handlePrint = () => {
        window.print();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "operational":
                return "bg-green-100 text-green-800";
            case "maintenance":
                return "bg-yellow-100 text-yellow-800";
            case "emergency":
                return "bg-red-100 text-red-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    if (!department) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Department not found</h1>
                    <p className="text-muted-foreground mt-2">The requested department could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-3xl font-bold">Department Details</h1>
                </div>
                <Button onClick={handlePrint} className="print:hidden">
                    <Printer className="h-4 w-4 mr-2"/>
                    Print
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                        <Building2 className="h-16 w-16 text-blue-600"/>
                        <div>
                            <h2 className="text-2xl font-semibold">{department.name} Department</h2>
                            <p className="text-muted-foreground">Department Head: {department.head}</p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center">
                                <Building2 className="h-5 w-5 mr-2"/>
                                Department Information
                            </h3>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-sm text-muted-foreground">Department Name:</span>
                                    <p className="font-medium">{department.name}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">Department Head:</span>
                                    <p className="font-medium">{department.head}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">Status:</span>
                                    <Badge className={`ml-2 ${getStatusColor(department.status)}`}>
                                        {department.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center">
                                <MapPin className="h-5 w-5 mr-2"/>
                                Location & Contact
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-start">
                                    <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground"/>
                                    <span className="text-sm">{department.location}</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-4 w-4 mr-2 text-muted-foreground"/>
                                    <span className="text-sm">{department.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center">
                                <Activity className="h-5 w-5 mr-2"/>
                                Statistics
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-2 text-muted-foreground"/>
                                    <span className="text-sm text-muted-foreground">Total Patients:</span>
                                    <span className="ml-2 font-medium">{department.totalPatients}</span>
                                </div>
                                <div className="flex items-center">
                                    <Activity className="h-4 w-4 mr-2 text-muted-foreground"/>
                                    <span className="text-sm text-muted-foreground">Active Staff:</span>
                                    <span className="ml-2 font-medium">{department.activeStaff}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Department Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {department.name === 'Cardiology' ? (
                                <>
                                    <p>• Cardiac catheterization</p>
                                    <p>• Echocardiography</p>
                                    <p>• Stress testing</p>
                                    <p>• Heart rhythm monitoring</p>
                                    <p>• Preventive cardiology</p>
                                </>
                            ) : department.name === 'Emergency' ? (
                                <>
                                    <p>• 24/7 emergency care</p>
                                    <p>• Trauma treatment</p>
                                    <p>• Critical care</p>
                                    <p>• Emergency surgery</p>
                                    <p>• Ambulance services</p>
                                </>
                            ) : (
                                <p>Services information not available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Operating Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {department.name === 'Emergency' ? (
                                <p className="font-medium text-green-600">24/7 Emergency Services</p>
                            ) : (
                                <>
                                    <div className="flex justify-between">
                                        <span>Monday - Friday:</span>
                                        <span>8:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday:</span>
                                        <span>9:00 AM - 2:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday:</span>
                                        <span>Closed</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
