'use client';

import {useParams, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
    Activity,
    AlertCircle,
    ArrowLeft,
    Calendar,
    Clock,
    Download,
    FileText,
    Heart,
    Mail,
    Phone,
    Pill,
    Printer,
    Stethoscope,
    TestTube,
    User
} from 'lucide-react';
import {useAppData} from '@/lib/hooks/useAppData';
import {Doctor, Patient} from '@/lib/types';
import {downloadPatientHTML, downloadPatientPDF} from '@/lib/services/pdf-simple';
import {useAuth} from '@/components/providers/AuthContext';

export default function PatientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const {user} = useAuth();
    const patientId = params.id as string;
    const [patient, setPatient] = useState<Patient | null>(null);
    const [assignedDoctor, setAssignedDoctor] = useState<Doctor | null>(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const {patients: patientsData, doctors: doctorsData} = useAppData();
    const isPatientRole = user?.role === 'patient';

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

    const handlePrint = () => window.print();

    const handleDownloadPDF = async () => {
        if (!patient) return;
        setIsGeneratingPDF(true);
        try {
            await downloadPatientPDF(patient, assignedDoctor);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleDownloadHTML = async () => {
        if (!patient) return;
        setIsGeneratingPDF(true);
        try {
            await downloadPatientHTML(patient, assignedDoctor);
        } catch (error) {
            console.error('Failed to generate HTML report:', error);
            alert('Failed to generate HTML report. Please try again.');
        } finally {
            setIsGeneratingPDF(false);
        }
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

    const mockVisits = [
        {
            id: '1',
            date: '2024-01-15',
            type: 'Follow-up',
            doctor: assignedDoctor?.name || 'Dr. Smith',
            diagnosis: 'Hypertension Management',
            notes: 'Blood pressure controlled. Continue current medication.',
            vitals: {bp: '120/80', hr: 72, temp: 98.6, spo2: 98}
        },
        {
            id: '2',
            date: '2023-12-10',
            type: 'Routine',
            doctor: assignedDoctor?.name || 'Dr. Smith',
            diagnosis: 'Annual Physical',
            notes: 'Overall health good. Recommended lifestyle modifications.',
            vitals: {bp: '125/82', hr: 75, temp: 98.4, spo2: 97}
        },
        {
            id: '3',
            date: '2023-11-05',
            type: 'Urgent',
            doctor: 'Dr. Johnson',
            diagnosis: 'Acute Bronchitis',
            notes: 'Prescribed antibiotics and rest. Follow-up in 1 week.',
            vitals: {bp: '130/85', hr: 88, temp: 100.2, spo2: 95}
        }
    ];

    const mockPrescriptions = [
        {
            id: '1',
            medication: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            startDate: '2023-06-15',
            status: 'Active',
            prescribedBy: assignedDoctor?.name || 'Dr. Smith'
        },
        {
            id: '2',
            medication: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            startDate: '2023-08-20',
            status: 'Active',
            prescribedBy: assignedDoctor?.name || 'Dr. Smith'
        },
        {
            id: '3',
            medication: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'Three times daily',
            startDate: '2023-11-05',
            status: 'Completed',
            prescribedBy: 'Dr. Johnson'
        }
    ];

    const mockLabResults = [
        {
            id: '1',
            test: 'Complete Blood Count',
            date: '2024-01-10',
            status: 'Normal',
            results: {WBC: '7.5', RBC: '4.8', Hemoglobin: '14.2', Platelets: '250'}
        },
        {
            id: '2',
            test: 'Lipid Panel',
            date: '2023-12-15',
            status: 'Borderline',
            results: {Cholesterol: '210', LDL: '135', HDL: '45', Triglycerides: '150'}
        },
        {
            id: '3',
            test: 'HbA1c',
            date: '2023-12-15',
            status: 'Normal',
            results: {HbA1c: '5.8%'}
        }
    ];

    const mockAllergies = patient.allergies?.split(',').map(a => a.trim()) || ['Penicillin', 'Peanuts'];
    const mockConditions = patient.chronicConditions?.split(',').map(c => c.trim()) || ['Hypertension', 'Type 2 Diabetes'];

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between print:hidden">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => {
                        if (isPatientRole) {
                            router.push('/dashboard');
                        } else {
                            window.close();
                        }
                    }}>
                        <ArrowLeft className="h-5 w-5"/>
                    </Button>
                    <h1 className="text-3xl font-bold">{isPatientRole ? 'My Medical Record' : 'Patient Medical Record'}</h1>
                </div>
                <div className="flex space-x-2">
                    <Button onClick={handlePrint} variant="outline">
                        <Printer className="h-4 w-4 mr-2"/>
                        Print
                    </Button>
                    <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
                        <Download className="h-4 w-4 mr-2"/>
                        {isGeneratingPDF ? 'Generating...' : 'PDF'}
                    </Button>
                    {!isPatientRole && (
                        <Button onClick={handleDownloadHTML} variant="secondary" disabled={isGeneratingPDF}>
                            <FileText className="h-4 w-4 mr-2"/>
                            Report
                        </Button>
                    )}
                </div>
            </div>

            <Card className="border-2">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                                <AvatarImage
                                    src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`}
                                    alt={patient.firstName}
                                />
                                <AvatarFallback className="text-2xl">
                                    {patient.firstName[0]}{patient.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-3xl font-bold">{patient.firstName} {patient.lastName}</h2>
                                <p className="text-muted-foreground">Patient ID: {patient.id}</p>
                                <div className="flex gap-2 mt-2">
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                        Active Patient
                                    </Badge>
                                    <Badge variant="outline">{patient.gender}</Badge>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Last Visit</p>
                            <p className="text-lg font-semibold">{patient.lastVisit || 'N/A'}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <Calendar className="h-8 w-8 text-blue-600"/>
                            <div>
                                <p className="text-xs text-muted-foreground">Date of Birth</p>
                                <p className="font-semibold">{patient.dateOfBirth}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                            <Heart className="h-8 w-8 text-purple-600"/>
                            <div>
                                <p className="text-xs text-muted-foreground">Blood Type</p>
                                <p className="font-semibold">{patient.bloodType || 'O+'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                            <Phone className="h-8 w-8 text-green-600"/>
                            <div>
                                <p className="text-xs text-muted-foreground">Phone</p>
                                <p className="font-semibold">{patient.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                            <Mail className="h-8 w-8 text-orange-600"/>
                            <div>
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="font-semibold text-sm">{patient.email || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="space-y-4">
                <div className="w-full overflow-x-auto">
                    <TabsList className="inline-flex w-auto min-w-full bg-muted p-1">
                        <TabsTrigger value="overview" className="whitespace-nowrap">Overview</TabsTrigger>
                        <TabsTrigger value="visits" className="whitespace-nowrap">Visit History</TabsTrigger>
                        <TabsTrigger value="prescriptions" className="whitespace-nowrap">Prescriptions</TabsTrigger>
                        <TabsTrigger value="labs" className="whitespace-nowrap">Lab Results</TabsTrigger>
                        <TabsTrigger value="conditions" className="whitespace-nowrap">Conditions</TabsTrigger>
                        <TabsTrigger value="admissions" className="whitespace-nowrap">Admissions</TabsTrigger>
                        <TabsTrigger value="discharge" className="whitespace-nowrap">Discharge Planning</TabsTrigger>
                        <TabsTrigger value="documents" className="whitespace-nowrap">Documents</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="h-5 w-5 mr-2"/>
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Full Name:</span>
                                    <span className="font-medium">{patient.firstName} {patient.lastName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Gender:</span>
                                    <span className="font-medium capitalize">{patient.gender}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date of Birth:</span>
                                    <span className="font-medium">{patient.dateOfBirth}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Blood Type:</span>
                                    <span className="font-medium">{patient.bloodType || 'O+'}</span>
                                </div>
                                <div className="flex items-start justify-between">
                                    <span className="text-muted-foreground">Address:</span>
                                    <span className="font-medium text-right">{patient.address || 'N/A'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Stethoscope className="h-5 w-5 mr-2"/>
                                    Medical Team
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Primary Doctor:</span>
                                    <span className="font-medium">{assignedDoctor?.name || 'Not assigned'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Department:</span>
                                    <span className="font-medium">{assignedDoctor?.department || 'General'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Specialization:</span>
                                    <span className="font-medium">{assignedDoctor?.specialization || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Insurance:</span>
                                    <span className="font-medium">{patient.insuranceProvider || 'N/A'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <AlertCircle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400"/>
                                    Allergies
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {mockAllergies.map((allergy, idx) => (
                                        <Badge key={idx} variant="destructive">{allergy}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Activity className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400"/>
                                    Chronic Conditions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {mockConditions.map((condition, idx) => (
                                        <Badge key={idx} className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">
                                            {condition}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="visits" className="space-y-4">
                    {mockVisits.map((visit) => (
                        <Card key={visit.id} className="bg-card hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center">
                                        <Calendar className="h-5 w-5 mr-2"/>
                                        {visit.date}
                                    </CardTitle>
                                    <Badge>{visit.type}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                                        <p className="text-xs text-muted-foreground">Blood Pressure</p>
                                        <p className="font-bold text-lg">{visit.vitals.bp}</p>
                                    </div>
                                    <div className="p-3 bg-red-50 dark:bg-red-950 rounded">
                                        <p className="text-xs text-muted-foreground">Heart Rate</p>
                                        <p className="font-bold text-lg">{visit.vitals.hr} bpm</p>
                                    </div>
                                    <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded">
                                        <p className="text-xs text-muted-foreground">Temperature</p>
                                        <p className="font-bold text-lg">{visit.vitals.temp}°F</p>
                                    </div>
                                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                                        <p className="text-xs text-muted-foreground">SpO2</p>
                                        <p className="font-bold text-lg">{visit.vitals.spo2}%</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Doctor</p>
                                    <p className="font-medium">{visit.doctor}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Diagnosis</p>
                                    <p className="font-medium">{visit.diagnosis}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Notes</p>
                                    <p className="text-sm">{visit.notes}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="prescriptions" className="space-y-4">
                    {mockPrescriptions.map((rx) => (
                        <Card key={rx.id} className="bg-card hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                                            <Pill className="h-6 w-6 text-purple-600"/>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold">{rx.medication}</h3>
                                            <div className="flex gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Dosage: </span>
                                                    <span className="font-medium">{rx.dosage}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Frequency: </span>
                                                    <span className="font-medium">{rx.frequency}</span>
                                                </div>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">Prescribed by: </span>
                                                <span className="font-medium">{rx.prescribedBy}</span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">Start Date: </span>
                                                <span className="font-medium">{rx.startDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className={rx.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}>
                                        {rx.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="labs" className="space-y-4">
                    {mockLabResults.map((lab) => (
                        <Card key={lab.id} className="bg-card hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center">
                                        <TestTube className="h-5 w-5 mr-2"/>
                                        {lab.test}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground"/>
                                        <span className="text-sm text-muted-foreground">{lab.date}</span>
                                        <Badge className={
                                            lab.status === 'Normal' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' :
                                                lab.status === 'Borderline' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' :
                                                    'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                                        }>
                                            {lab.status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(lab.results).map(([key, value]) => (
                                        <div key={key} className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                                            <p className="text-xs text-muted-foreground">{key}</p>
                                            <p className="font-bold text-lg">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="conditions" className="space-y-4">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Active Medical Conditions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockConditions.map((condition, idx) => (
                                <div key={idx} className="p-4 border rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg">{condition}</h3>
                                            <p className="text-sm text-muted-foreground">Diagnosed: 2023-06-15</p>
                                        </div>
                                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">Active</Badge>
                                    </div>
                                    <p className="text-sm mt-2">Currently under management with medication and lifestyle modifications.</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="admissions" className="space-y-4">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Admission History</CardTitle>
                            <CardDescription>Patient admission records and bed assignments</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg">Current Admission</h3>
                                        <p className="text-sm text-muted-foreground">Admitted: {new Date().toLocaleDateString()}</p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">Active</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Ward:</span>
                                        <span className="font-medium ml-2">General Ward - 3rd Floor</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Bed Number:</span>
                                        <span className="font-medium ml-2">305-B</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Admission Type:</span>
                                        <span className="font-medium ml-2">Planned</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Expected Discharge:</span>
                                        <span className="font-medium ml-2">{new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold">Previous Admission</h3>
                                        <p className="text-sm text-muted-foreground">June 10, 2024 - June 17, 2024</p>
                                    </div>
                                    <Badge variant="outline">Discharged</Badge>
                                </div>
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Reason:</span>
                                    <span className="font-medium ml-2">Post-operative care - Knee replacement</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="discharge" className="space-y-4">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Discharge Planning</CardTitle>
                            <CardDescription>Coordinate patient discharge and follow-up care</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                <h3 className="font-bold mb-2">Discharge Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Planned Discharge Date:</span>
                                        <span className="font-medium">{new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Discharge Type:</span>
                                        <span className="font-medium">Home with follow-up</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Transportation:</span>
                                        <span className="font-medium">Family arranged</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-bold mb-2">Discharge Instructions</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Continue prescribed medications as directed</li>
                                    <li>Follow-up appointment scheduled for {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</li>
                                    <li>Physical therapy sessions 3 times per week</li>
                                    <li>Wound care instructions provided</li>
                                    <li>Contact doctor if fever, increased pain, or swelling occurs</li>
                                </ul>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-bold mb-2">Home Care Requirements</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Equipment:</span> Walker, raised toilet seat</p>
                                    <p><span className="font-medium">Home Health:</span> Nurse visit scheduled for wound check</p>
                                    <p><span className="font-medium">Medications:</span> Prescriptions sent to pharmacy</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="h-5 w-5 mr-2"/>
                                Medical Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {['Medical History Summary', 'Insurance Card', 'Lab Report - Jan 2024', 'Prescription History'].map((doc, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-900">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="h-5 w-5 text-blue-600"/>
                                            <span className="font-medium">{doc}</span>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <Download className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
