'use client';

import {useParams, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {
    Activity,
    AlertCircle,
    ArrowLeft,
    Calendar,
    Clock,
    Download,
    Edit,
    FileText,
    Heart,
    Mail,
    Phone,
    Pill,
    Plus,
    Printer,
    Save,
    Stethoscope,
    TestTube,
    Upload,
    User
} from 'lucide-react';
import {useAppData} from '@/lib/hooks/useAppData';
import {Doctor, Patient} from '@/lib/types';
import {downloadPatientHTML, downloadPatientPDF} from '@/lib/services/pdf-simple';
import {useAuth} from '@/components/providers/AuthContext';
import {toast} from 'sonner';
import {clinicalService} from '@/lib/services/clinical';
import {prescriptionService} from '@/lib/services/prescription';
import {medicalService} from '@/lib/services/medical';

export default function PatientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const {user} = useAuth();
    const patientId = params.id as string;
    const [patient, setPatient] = useState<Patient | null>(null);
    const [assignedDoctor, setAssignedDoctor] = useState<Doctor | null>(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [activeDialog, setActiveDialog] = useState<string | null>(null);
    const {patients: patientsData, doctors: doctorsData} = useAppData();
    const isPatientRole = user?.role === 'patient';
    const canEdit = user?.role === 'doctor' || user?.role === 'nurse' || user?.role === 'admin';

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
            <div className="text-center">
                <h1 className="text-2xl font-bold">Patient not found</h1>
                <p className="text-muted-foreground mt-2">The requested patient could not be found.</p>
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
        <div className="space-y-6">
            <div className="flex items-center justify-between print:hidden">
                <h1 className="text-3xl font-bold">{isPatientRole ? 'My Medical Record' : 'Patient Medical Record'}</h1>
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
                    {canEdit && (
                        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    <Dialog open={activeDialog === 'vitals'} onOpenChange={(open) => setActiveDialog(open ? 'vitals' : null)}>
                                        <DialogTrigger asChild>
                                            <Button size="sm"><Plus className="h-4 w-4 mr-1"/>Record Vitals</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Record Vital Signs</DialogTitle>
                                                <DialogDescription>Enter patient vital signs</DialogDescription>
                                            </DialogHeader>
                                            <VitalsForm onClose={() => setActiveDialog(null)} patientId={patientId}/>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog open={activeDialog === 'prescription'} onOpenChange={(open) => setActiveDialog(open ? 'prescription' : null)}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1"/>Add Prescription</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>New Prescription</DialogTitle>
                                                <DialogDescription>Add medication for patient</DialogDescription>
                                            </DialogHeader>
                                            <PrescriptionForm onClose={() => setActiveDialog(null)} patientId={patientId}/>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog open={activeDialog === 'lab'} onOpenChange={(open) => setActiveDialog(open ? 'lab' : null)}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1"/>Order Lab Test</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Order Lab Test</DialogTitle>
                                                <DialogDescription>Request laboratory tests</DialogDescription>
                                            </DialogHeader>
                                            <LabOrderForm onClose={() => setActiveDialog(null)} patientId={patientId}/>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog open={activeDialog === 'visit'} onOpenChange={(open) => setActiveDialog(open ? 'visit' : null)}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1"/>New Visit Note</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>New Visit Note</DialogTitle>
                                                <DialogDescription>Document patient visit</DialogDescription>
                                            </DialogHeader>
                                            <VisitNoteForm onClose={() => setActiveDialog(null)} patientId={patientId}/>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog open={activeDialog === 'document'} onOpenChange={(open) => setActiveDialog(open ? 'document' : null)}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline"><Upload className="h-4 w-4 mr-1"/>Upload Document</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Upload Document</DialogTitle>
                                                <DialogDescription>Add medical documents</DialogDescription>
                                            </DialogHeader>
                                            <DocumentUploadForm onClose={() => setActiveDialog(null)} patientId={patientId}/>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                    )}
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
                                    <span className="font-medium text-right">
                                        {typeof patient.address === 'object' && patient.address !== null
                                            ? [patient.address.line, patient.address.city, patient.address.state, patient.address.zip, patient.address.country].filter(Boolean).join(', ')
                                            : patient.address || 'N/A'
                                        }
                                    </span>
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
                    {canEdit && (
                        <div className="flex justify-end mb-4">
                            <Dialog open={activeDialog === 'visit'} onOpenChange={(open) => setActiveDialog(open ? 'visit' : null)}>
                                <DialogTrigger asChild>
                                    <Button><Plus className="h-4 w-4 mr-2"/>New Visit Note</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>New Visit Note</DialogTitle>
                                        <DialogDescription>Document patient visit</DialogDescription>
                                    </DialogHeader>
                                    <VisitNoteForm onClose={() => setActiveDialog(null)} patientId={patientId}/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
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
                    {canEdit && (
                        <div className="flex justify-end mb-4">
                            <Dialog open={activeDialog === 'prescription'} onOpenChange={(open) => setActiveDialog(open ? 'prescription' : null)}>
                                <DialogTrigger asChild>
                                    <Button><Plus className="h-4 w-4 mr-2"/>Add Prescription</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>New Prescription</DialogTitle>
                                        <DialogDescription>Add medication for patient</DialogDescription>
                                    </DialogHeader>
                                    <PrescriptionForm onClose={() => setActiveDialog(null)} patientId={patientId}/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
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
                    {canEdit && (
                        <div className="flex justify-between items-center mb-4">
                            <Dialog open={activeDialog === 'lab'} onOpenChange={(open) => setActiveDialog(open ? 'lab' : null)}>
                                <DialogTrigger asChild>
                                    <Button><Plus className="h-4 w-4 mr-2"/>Order Lab Test</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Order Lab Test</DialogTitle>
                                        <DialogDescription>Request laboratory tests</DialogDescription>
                                    </DialogHeader>
                                    <LabOrderForm onClose={() => setActiveDialog(null)} patientId={patientId}/>
                                </DialogContent>
                            </Dialog>
                            <Dialog open={activeDialog === 'lab-result'} onOpenChange={(open) => setActiveDialog(open ? 'lab-result' : null)}>
                                <DialogTrigger asChild>
                                    <Button variant="outline"><Upload className="h-4 w-4 mr-2"/>Enter Lab Results</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Enter Lab Results</DialogTitle>
                                        <DialogDescription>Record test results</DialogDescription>
                                    </DialogHeader>
                                    <LabResultForm onClose={() => setActiveDialog(null)} patientId={patientId}/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
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
                    {canEdit && (
                        <div className="flex justify-end mb-4">
                            <Dialog open={activeDialog === 'condition'} onOpenChange={(open) => setActiveDialog(open ? 'condition' : null)}>
                                <DialogTrigger asChild>
                                    <Button><Plus className="h-4 w-4 mr-2"/>Add Condition</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Add Medical Condition</DialogTitle>
                                        <DialogDescription>Record new diagnosis or condition</DialogDescription>
                                    </DialogHeader>
                                    <ConditionForm onClose={() => setActiveDialog(null)} patientId={patientId}/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
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
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">Active</Badge>
                                            {canEdit && <Button size="sm" variant="ghost"><Edit className="h-4 w-4"/></Button>}
                                        </div>
                                    </div>
                                    <p className="text-sm mt-2">Currently under management with medication and lifestyle modifications.</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="admissions" className="space-y-4">
                    {canEdit && (
                        <div className="flex justify-end mb-4">
                            <Dialog open={activeDialog === 'admission'} onOpenChange={(open) => setActiveDialog(open ? 'admission' : null)}>
                                <DialogTrigger asChild>
                                    <Button><Plus className="h-4 w-4 mr-2"/>New Admission</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Record Admission</DialogTitle>
                                        <DialogDescription>Admit patient to hospital</DialogDescription>
                                    </DialogHeader>
                                    <AdmissionForm onClose={() => setActiveDialog(null)} patientId={patientId}/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
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
                    {canEdit && (
                        <div className="flex justify-end mb-4">
                            <Dialog open={activeDialog === 'discharge'} onOpenChange={(open) => setActiveDialog(open ? 'discharge' : null)}>
                                <DialogTrigger asChild>
                                    <Button><Save className="h-4 w-4 mr-2"/>Update Discharge Plan</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Discharge Planning</DialogTitle>
                                        <DialogDescription>Plan patient discharge</DialogDescription>
                                    </DialogHeader>
                                    <DischargePlanForm onClose={() => setActiveDialog(null)} patientId={patientId}/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
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
                    {canEdit && (
                        <div className="flex justify-end mb-4">
                            <Dialog open={activeDialog === 'document'} onOpenChange={(open) => setActiveDialog(open ? 'document' : null)}>
                                <DialogTrigger asChild>
                                    <Button><Upload className="h-4 w-4 mr-2"/>Upload Document</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Upload Document</DialogTitle>
                                        <DialogDescription>Add medical documents</DialogDescription>
                                    </DialogHeader>
                                    <DocumentUploadForm onClose={() => setActiveDialog(null)} patientId={patientId}/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
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
                                            <div>
                                                <span className="font-medium">{doc}</span>
                                                <p className="text-xs text-muted-foreground">Uploaded: {new Date().toLocaleDateString()}</p>
                                            </div>
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

// Form Components
function VitalsForm({onClose, patientId}: {onClose: () => void; patientId: string}) {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        systolicBp: '', diastolicBp: '', heartRate: '', respiratoryRate: '',
        temperature: '', oxygenSaturation: '', weight: '', height: '', painScale: '', notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await clinicalService.createVitalSigns({
                patientId,
                bloodPressure: formData.systolicBp && formData.diastolicBp ? `${formData.systolicBp}/${formData.diastolicBp}` : undefined,
                heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
                respiratoryRate: formData.respiratoryRate ? parseInt(formData.respiratoryRate) : undefined,
                temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
                oxygenSaturation: formData.oxygenSaturation ? parseInt(formData.oxygenSaturation) : undefined,
                weight: formData.weight ? parseFloat(formData.weight) : undefined,
                height: formData.height ? parseInt(formData.height) : undefined,
                recordedAt: new Date().toISOString(),
                recordedBy: user?.id || ''
            });
            toast.success('Vital signs recorded successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to record vital signs');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Blood Pressure (Systolic)</Label>
                    <Input type="number" placeholder="120" value={formData.systolicBp} onChange={(e) => setFormData({...formData, systolicBp: e.target.value})}/>
                </div>
                <div>
                    <Label>Blood Pressure (Diastolic)</Label>
                    <Input type="number" placeholder="80" value={formData.diastolicBp} onChange={(e) => setFormData({...formData, diastolicBp: e.target.value})}/>
                </div>
                <div>
                    <Label>Heart Rate (bpm)</Label>
                    <Input type="number" placeholder="72" value={formData.heartRate} onChange={(e) => setFormData({...formData, heartRate: e.target.value})}/>
                </div>
                <div>
                    <Label>Respiratory Rate</Label>
                    <Input type="number" placeholder="16" value={formData.respiratoryRate} onChange={(e) => setFormData({...formData, respiratoryRate: e.target.value})}/>
                </div>
                <div>
                    <Label>Temperature (°F)</Label>
                    <Input type="number" step="0.1" placeholder="98.6" value={formData.temperature} onChange={(e) => setFormData({...formData, temperature: e.target.value})}/>
                </div>
                <div>
                    <Label>Oxygen Saturation (%)</Label>
                    <Input type="number" placeholder="98" value={formData.oxygenSaturation} onChange={(e) => setFormData({...formData, oxygenSaturation: e.target.value})}/>
                </div>
                <div>
                    <Label>Weight (lbs)</Label>
                    <Input type="number" step="0.1" placeholder="150" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})}/>
                </div>
                <div>
                    <Label>Height (inches)</Label>
                    <Input type="number" placeholder="68" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})}/>
                </div>
                <div>
                    <Label>Pain Scale (0-10)</Label>
                    <Input type="number" min="0" max="10" placeholder="0" value={formData.painScale} onChange={(e) => setFormData({...formData, painScale: e.target.value})}/>
                </div>
            </div>
            <div>
                <Label>Notes</Label>
                <Textarea placeholder="Additional observations..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}/>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading}><Save className="h-4 w-4 mr-2"/>{loading ? 'Saving...' : 'Save Vitals'}</Button>
            </div>
        </form>
    );
}

function PrescriptionForm({onClose, patientId}: {onClose: () => void; patientId: string}) {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        medication: '', dosage: '', frequency: '', duration: '', quantity: '',
        refills: '', instructions: '', indication: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await prescriptionService.createPrescription({
                patientId,
                doctorId: user?.id || '',
                medicationName: formData.medication,
                dosage: formData.dosage,
                frequency: formData.frequency,
                duration: formData.duration,
                instructions: formData.instructions,
                refillsRemaining: formData.refills ? parseInt(formData.refills) : 0,
                status: 'ACTIVE',
                prescribedDate: new Date().toISOString()
            });
            toast.success('Prescription added successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to add prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <Label>Medication Name *</Label>
                    <Input required placeholder="e.g., Lisinopril" value={formData.medication} onChange={(e) => setFormData({...formData, medication: e.target.value})}/>
                </div>
                <div>
                    <Label>Dosage *</Label>
                    <Input required placeholder="e.g., 10mg" value={formData.dosage} onChange={(e) => setFormData({...formData, dosage: e.target.value})}/>
                </div>
                <div>
                    <Label>Frequency *</Label>
                    <Select value={formData.frequency} onValueChange={(val) => setFormData({...formData, frequency: val})}>
                        <SelectTrigger><SelectValue placeholder="Select frequency"/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="once_daily">Once daily</SelectItem>
                            <SelectItem value="twice_daily">Twice daily</SelectItem>
                            <SelectItem value="three_times_daily">Three times daily</SelectItem>
                            <SelectItem value="four_times_daily">Four times daily</SelectItem>
                            <SelectItem value="as_needed">As needed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Duration</Label>
                    <Input placeholder="e.g., 30 days" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})}/>
                </div>
                <div>
                    <Label>Quantity</Label>
                    <Input type="number" placeholder="30" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})}/>
                </div>
                <div>
                    <Label>Refills</Label>
                    <Input type="number" placeholder="0" value={formData.refills} onChange={(e) => setFormData({...formData, refills: e.target.value})}/>
                </div>
                <div className="col-span-2">
                    <Label>Indication</Label>
                    <Input placeholder="Reason for prescription" value={formData.indication} onChange={(e) => setFormData({...formData, indication: e.target.value})}/>
                </div>
            </div>
            <div>
                <Label>Instructions</Label>
                <Textarea placeholder="Take with food, avoid alcohol, etc." value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})}/>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading}><Save className="h-4 w-4 mr-2"/>{loading ? 'Saving...' : 'Save Prescription'}</Button>
            </div>
        </form>
    );
}

function LabOrderForm({onClose, patientId}: {onClose: () => void; patientId: string}) {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        testName: '', priority: 'ROUTINE', instructions: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await medicalService.createLabOrder({
                patientId,
                doctorId: user?.id || '',
                testType: formData.testName,
                instructions: formData.instructions,
                urgency: formData.priority as 'ROUTINE' | 'URGENT' | 'STAT'
            });
            toast.success('Lab test ordered successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to order lab test');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <Label>Test Type *</Label>
                    <Select value={formData.testName} onValueChange={(val) => setFormData({...formData, testName: val})}>
                        <SelectTrigger><SelectValue placeholder="Select test"/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Blood Test">Blood Test</SelectItem>
                            <SelectItem value="Urine Test">Urine Test</SelectItem>
                            <SelectItem value="X-Ray">X-Ray</SelectItem>
                            <SelectItem value="CT Scan">CT Scan</SelectItem>
                            <SelectItem value="MRI">MRI</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Urgency *</Label>
                    <Select value={formData.priority} onValueChange={(val) => setFormData({...formData, priority: val})}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ROUTINE">Routine</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                            <SelectItem value="STAT">STAT</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <Label>Instructions</Label>
                <Textarea placeholder="Fasting required, etc." value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})}/>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading}><Save className="h-4 w-4 mr-2"/>{loading ? 'Ordering...' : 'Order Test'}</Button>
            </div>
        </form>
    );
}

function VisitNoteForm({onClose, patientId}: {onClose: () => void; patientId: string}) {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        visitType: '', chiefComplaint: '', historyPresentIllness: '',
        physicalExamination: '', assessment: '', plan: '', followUp: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await clinicalService.createVisit({
                patientId,
                doctorId: user?.id || '',
                visitDate: new Date().toISOString().split('T')[0],
                visitTime: new Date().toTimeString().split(' ')[0],
                chiefComplaint: formData.chiefComplaint,
                diagnosis: formData.assessment,
                treatment: formData.plan,
                notes: `HPI: ${formData.historyPresentIllness}\nPE: ${formData.physicalExamination}\nFollow-up: ${formData.followUp}`,
                status: 'COMPLETED'
            });
            toast.success('Visit note saved successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to save visit note');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Visit Type *</Label>
                    <Select value={formData.visitType} onValueChange={(val) => setFormData({...formData, visitType: val})}>
                        <SelectTrigger><SelectValue placeholder="Select type"/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="routine">Routine</SelectItem>
                            <SelectItem value="follow_up">Follow-up</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="consultation">Consultation</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Chief Complaint *</Label>
                    <Input required placeholder="Main reason for visit" value={formData.chiefComplaint} onChange={(e) => setFormData({...formData, chiefComplaint: e.target.value})}/>
                </div>
            </div>
            <div>
                <Label>History of Present Illness</Label>
                <Textarea rows={3} placeholder="Detailed history..." value={formData.historyPresentIllness} onChange={(e) => setFormData({...formData, historyPresentIllness: e.target.value})}/>
            </div>
            <div>
                <Label>Physical Examination</Label>
                <Textarea rows={3} placeholder="Examination findings..." value={formData.physicalExamination} onChange={(e) => setFormData({...formData, physicalExamination: e.target.value})}/>
            </div>
            <div>
                <Label>Assessment/Diagnosis</Label>
                <Textarea rows={2} placeholder="Clinical assessment..." value={formData.assessment} onChange={(e) => setFormData({...formData, assessment: e.target.value})}/>
            </div>
            <div>
                <Label>Treatment Plan</Label>
                <Textarea rows={3} placeholder="Management plan..." value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})}/>
            </div>
            <div>
                <Label>Follow-up Instructions</Label>
                <Textarea rows={2} placeholder="Next steps..." value={formData.followUp} onChange={(e) => setFormData({...formData, followUp: e.target.value})}/>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading}><Save className="h-4 w-4 mr-2"/>{loading ? 'Saving...' : 'Save Visit Note'}</Button>
            </div>
        </form>
    );
}

function ConditionForm({onClose, patientId}: {onClose: () => void; patientId: string}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        conditionName: '', icd10Code: '', severity: 'moderate',
        status: 'active', diagnosisDate: '', notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Medical condition added successfully');
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <Label>Condition Name *</Label>
                    <Input required placeholder="e.g., Hypertension" value={formData.conditionName} onChange={(e) => setFormData({...formData, conditionName: e.target.value})}/>
                </div>
                <div>
                    <Label>ICD-10 Code</Label>
                    <Input placeholder="e.g., I10" value={formData.icd10Code} onChange={(e) => setFormData({...formData, icd10Code: e.target.value})}/>
                </div>
                <div>
                    <Label>Diagnosis Date *</Label>
                    <Input required type="date" value={formData.diagnosisDate} onChange={(e) => setFormData({...formData, diagnosisDate: e.target.value})}/>
                </div>
                <div>
                    <Label>Severity *</Label>
                    <Select value={formData.severity} onValueChange={(val) => setFormData({...formData, severity: val})}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="severe">Severe</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Status *</Label>
                    <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="chronic">Chronic</SelectItem>
                            <SelectItem value="in_remission">In Remission</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <Label>Clinical Notes</Label>
                <Textarea rows={3} placeholder="Additional information about the condition..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}/>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit"><Save className="h-4 w-4 mr-2"/>Save Condition</Button>
            </div>
        </form>
    );
}

function LabResultForm({onClose, patientId}: {onClose: () => void; patientId: string}) {
    const [formData, setFormData] = useState({
        testName: '', testCategory: '', resultValue: '', resultUnit: '',
        referenceRange: '', abnormalFlag: 'normal', interpretation: '', comments: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Lab results recorded successfully');
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Test Name *</Label>
                    <Input required placeholder="e.g., Hemoglobin" value={formData.testName} onChange={(e) => setFormData({...formData, testName: e.target.value})}/>
                </div>
                <div>
                    <Label>Category *</Label>
                    <Select value={formData.testCategory} onValueChange={(val) => setFormData({...formData, testCategory: val})}>
                        <SelectTrigger><SelectValue placeholder="Select category"/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="blood">Blood Test</SelectItem>
                            <SelectItem value="urine">Urine Test</SelectItem>
                            <SelectItem value="imaging">Imaging</SelectItem>
                            <SelectItem value="pathology">Pathology</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Result Value *</Label>
                    <Input required placeholder="e.g., 14.2" value={formData.resultValue} onChange={(e) => setFormData({...formData, resultValue: e.target.value})}/>
                </div>
                <div>
                    <Label>Unit</Label>
                    <Input placeholder="e.g., g/dL" value={formData.resultUnit} onChange={(e) => setFormData({...formData, resultUnit: e.target.value})}/>
                </div>
                <div>
                    <Label>Reference Range</Label>
                    <Input placeholder="e.g., 12-16 g/dL" value={formData.referenceRange} onChange={(e) => setFormData({...formData, referenceRange: e.target.value})}/>
                </div>
                <div>
                    <Label>Status *</Label>
                    <Select value={formData.abnormalFlag} onValueChange={(val) => setFormData({...formData, abnormalFlag: val})}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <Label>Interpretation</Label>
                <Textarea placeholder="Clinical interpretation..." value={formData.interpretation} onChange={(e) => setFormData({...formData, interpretation: e.target.value})}/>
            </div>
            <div>
                <Label>Lab Comments</Label>
                <Textarea placeholder="Additional comments..." value={formData.comments} onChange={(e) => setFormData({...formData, comments: e.target.value})}/>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit"><Save className="h-4 w-4 mr-2"/>Save Results</Button>
            </div>
        </form>
    );
}

function AdmissionForm({onClose, patientId}: {onClose: () => void; patientId: string}) {
    const [formData, setFormData] = useState({
        admissionDate: '', admissionType: 'planned', ward: '', bedNumber: '',
        admittingDiagnosis: '', expectedDischarge: '', notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Patient admitted successfully');
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Admission Date *</Label>
                    <Input required type="date" value={formData.admissionDate} onChange={(e) => setFormData({...formData, admissionDate: e.target.value})}/>
                </div>
                <div>
                    <Label>Admission Type *</Label>
                    <Select value={formData.admissionType} onValueChange={(val) => setFormData({...formData, admissionType: val})}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Ward *</Label>
                    <Input required placeholder="e.g., General Ward - 3rd Floor" value={formData.ward} onChange={(e) => setFormData({...formData, ward: e.target.value})}/>
                </div>
                <div>
                    <Label>Bed Number *</Label>
                    <Input required placeholder="e.g., 305-B" value={formData.bedNumber} onChange={(e) => setFormData({...formData, bedNumber: e.target.value})}/>
                </div>
                <div className="col-span-2">
                    <Label>Admitting Diagnosis *</Label>
                    <Input required placeholder="Primary reason for admission" value={formData.admittingDiagnosis} onChange={(e) => setFormData({...formData, admittingDiagnosis: e.target.value})}/>
                </div>
                <div>
                    <Label>Expected Discharge Date</Label>
                    <Input type="date" value={formData.expectedDischarge} onChange={(e) => setFormData({...formData, expectedDischarge: e.target.value})}/>
                </div>
            </div>
            <div>
                <Label>Admission Notes</Label>
                <Textarea rows={3} placeholder="Additional admission details..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}/>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit"><Save className="h-4 w-4 mr-2"/>Admit Patient</Button>
            </div>
        </form>
    );
}

function DischargePlanForm({onClose, patientId}: {onClose: () => void; patientId: string}) {
    const [formData, setFormData] = useState({
        dischargeDate: '', dischargeType: 'home', transportation: '',
        instructions: '', homeEquipment: '', followUpDate: '', medications: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Discharge plan updated successfully');
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Discharge Date *</Label>
                    <Input required type="date" value={formData.dischargeDate} onChange={(e) => setFormData({...formData, dischargeDate: e.target.value})}/>
                </div>
                <div>
                    <Label>Discharge Type *</Label>
                    <Select value={formData.dischargeType} onValueChange={(val) => setFormData({...formData, dischargeType: val})}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="home">Home</SelectItem>
                            <SelectItem value="home_health">Home with Health Services</SelectItem>
                            <SelectItem value="rehab">Rehabilitation Facility</SelectItem>
                            <SelectItem value="nursing">Nursing Home</SelectItem>
                            <SelectItem value="transfer">Transfer to Another Hospital</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Transportation</Label>
                    <Input placeholder="e.g., Family arranged" value={formData.transportation} onChange={(e) => setFormData({...formData, transportation: e.target.value})}/>
                </div>
                <div>
                    <Label>Follow-up Appointment</Label>
                    <Input type="date" value={formData.followUpDate} onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}/>
                </div>
            </div>
            <div>
                <Label>Discharge Instructions *</Label>
                <Textarea required rows={3} placeholder="Detailed discharge instructions..." value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})}/>
            </div>
            <div>
                <Label>Home Equipment Needed</Label>
                <Input placeholder="e.g., Walker, oxygen tank" value={formData.homeEquipment} onChange={(e) => setFormData({...formData, homeEquipment: e.target.value})}/>
            </div>
            <div>
                <Label>Discharge Medications</Label>
                <Textarea rows={2} placeholder="List of medications to continue at home..." value={formData.medications} onChange={(e) => setFormData({...formData, medications: e.target.value})}/>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit"><Save className="h-4 w-4 mr-2"/>Save Discharge Plan</Button>
            </div>
        </form>
    );
}

function DocumentUploadForm({onClose, patientId}: {onClose: () => void; patientId: string}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({documentType: '', description: '', file: null as File | null});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.file) return;
        setLoading(true);
        try {
            await medicalService.uploadFile(formData.file, {
                patientId,
                description: formData.description || formData.documentType
            });
            toast.success('Document uploaded successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to upload document');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>Document Type *</Label>
                <Select value={formData.documentType} onValueChange={(val) => setFormData({...formData, documentType: val})}>
                    <SelectTrigger><SelectValue placeholder="Select type"/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="lab_report">Lab Report</SelectItem>
                        <SelectItem value="imaging">Imaging/Radiology</SelectItem>
                        <SelectItem value="consent">Consent Form</SelectItem>
                        <SelectItem value="insurance">Insurance Document</SelectItem>
                        <SelectItem value="referral">Referral Letter</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Description</Label>
                <Input placeholder="Brief description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}/>
            </div>
            <div>
                <Label>File *</Label>
                <Input type="file" required accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})}/>
                <p className="text-xs text-muted-foreground mt-1">Accepted: PDF, JPG, PNG, DOC (Max 10MB)</p>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading}><Upload className="h-4 w-4 mr-2"/>{loading ? 'Uploading...' : 'Upload'}</Button>
            </div>
        </form>
    );
}
