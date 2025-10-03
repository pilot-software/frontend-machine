import React, {useEffect, useRef, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from './ui/card';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {Label} from './ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './ui/select';
import {Textarea} from './ui/textarea';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from './ui/dialog';
import {Badge} from './ui/badge';
import {Tabs, TabsContent, TabsList, TabsTrigger} from './ui/tabs';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from './ui/table';
import {
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Clock,
    Edit,
    Eye,
    Filter,
    PillBottle,
    Plus,
    Printer,
    Search,
    Send,
    Stethoscope
} from 'lucide-react';
import {useApi} from '../lib/hooks/useApi';
import {useAuth} from './AuthContext';

interface Prescription {
    id: string;
    patientName: string;
    patientId: string;
    doctorName: string;
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    refills: number;
    status: 'active' | 'completed' | 'cancelled' | 'pending';
    dateIssued: string;
    instructions: string;
    pharmacy?: string;
}

interface Medication {
    id: string;
    name: string;
    genericName: string;
    category: string;
    strength: string[];
    form: string;
    contraindications: string[];
    sideEffects: string[];
}

// Real API data will replace mock prescriptions

const mockMedications: Medication[] = [
    {
        id: '1',
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        category: 'ACE Inhibitor',
        strength: ['2.5mg', '5mg', '10mg', '20mg'],
        form: 'Tablet',
        contraindications: ['Pregnancy', 'Angioedema history'],
        sideEffects: ['Dry cough', 'Dizziness', 'Hyperkalemia']
    },
    {
        id: '2',
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        category: 'Antibiotic',
        strength: ['250mg', '500mg', '875mg'],
        form: 'Capsule',
        contraindications: ['Penicillin allergy'],
        sideEffects: ['Nausea', 'Diarrhea', 'Rash']
    },
    {
        id: '3',
        name: 'Metformin',
        genericName: 'Metformin Hydrochloride',
        category: 'Antidiabetic',
        strength: ['500mg', '850mg', '1000mg'],
        form: 'Tablet',
        contraindications: ['Kidney disease', 'Heart failure'],
        sideEffects: ['GI upset', 'Lactic acidosis', 'Vitamin B12 deficiency']
    }
];

export function PrescriptionSystem() {
    const {user} = useAuth();
    const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMedication, setSelectedMedication] = useState('');
    const [selectedPatient, setSelectedPatient] = useState('patient_2');
    const [medicalData, setMedicalData] = useState<any>(null);

    const {loading} = useApi();
    const {execute: fetchMedicalData, loading: medicalLoading} = useApi();

    const hasFetchedMedical = useRef(false);

    // Remove prescription service call - using medical data instead

    useEffect(() => {
        if (selectedPatient && !hasFetchedMedical.current) {
            hasFetchedMedical.current = true;
            // TODO: Implement getPatientMedicalData method
            setMedicalData(null);
        }
    }, [selectedPatient, fetchMedicalData]);

    const handlePatientChange = (patientId: string) => {
        setSelectedPatient(patientId);
        hasFetchedMedical.current = false;
        // TODO: Implement getPatientMedicalData method
        setMedicalData(null);
    };

    const prescriptionsList = medicalData?.prescriptions || [];
    const mockPrescriptions = (Array.isArray(prescriptionsList) ? prescriptionsList : []).map((rx: any) => ({
        id: rx.id,
        patientName: medicalData?.patient ? `${medicalData.patient.firstName} ${medicalData.patient.lastName}` : 'Patient Name',
        patientId: rx.patientId,
        doctorName: 'Doctor Name',
        medication: rx.medicationName,
        dosage: rx.dosage,
        frequency: rx.frequency,
        duration: rx.duration,
        quantity: 0,
        refills: rx.refillsRemaining,
        status: rx.status.toLowerCase(),
        dateIssued: rx.createdAt,
        instructions: rx.instructions || 'No instructions',
        pharmacy: 'Pharmacy Name'
    }));

    const prescriptionStats = [
        {label: 'Active Prescriptions', value: '1,234', icon: PillBottle, color: 'text-blue-600'},
        {label: 'Pending Approval', value: '23', icon: Clock, color: 'text-orange-600'},
        {label: 'Filled Today', value: '89', icon: CheckCircle2, color: 'text-green-600'},
        {label: 'Refill Requests', value: '45', icon: AlertTriangle, color: 'text-purple-600'}
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return CheckCircle2;
            case 'completed':
                return CheckCircle2;
            case 'cancelled':
                return AlertTriangle;
            case 'pending':
                return Clock;
            default:
                return Clock;
        }
    };

    const filteredPrescriptions = mockPrescriptions.filter((prescription: any) =>
        prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">Prescription System</h2>
                    <p className="text-muted-foreground mt-1">Manage prescriptions, medications, and pharmacy orders</p>
                </div>
                <Dialog open={isNewPrescriptionOpen} onOpenChange={setIsNewPrescriptionOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2"/>
                            New Prescription
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Prescription</DialogTitle>
                            <DialogDescription>
                                Write a new prescription for a patient
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="patient">Patient</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select patient"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="john-smith">John Smith (HC001234)</SelectItem>
                                            <SelectItem value="emma-davis">Emma Davis (HC001235)</SelectItem>
                                            <SelectItem value="michael-johnson">Michael Johnson (HC001236)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="prescribing-doctor">Prescribing Doctor</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select doctor"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dr-johnson">Dr. Sarah Johnson</SelectItem>
                                            <SelectItem value="dr-chen">Dr. Michael Chen</SelectItem>
                                            <SelectItem value="dr-rodriguez">Dr. Emily Rodriguez</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="medication">Medication</Label>
                                    <Select value={selectedMedication} onValueChange={setSelectedMedication}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select medication"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockMedications.map((med) => (
                                                <SelectItem key={med.id} value={med.name}>
                                                    {med.name} ({med.genericName})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="strength">Strength/Dosage</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select strength"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10mg">10mg</SelectItem>
                                            <SelectItem value="20mg">20mg</SelectItem>
                                            <SelectItem value="50mg">50mg</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="frequency">Frequency</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select frequency"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="once-daily">Once daily</SelectItem>
                                            <SelectItem value="twice-daily">Twice daily</SelectItem>
                                            <SelectItem value="three-times-daily">Three times daily</SelectItem>
                                            <SelectItem value="four-times-daily">Four times daily</SelectItem>
                                            <SelectItem value="as-needed">As needed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select duration"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="7-days">7 days</SelectItem>
                                            <SelectItem value="14-days">14 days</SelectItem>
                                            <SelectItem value="30-days">30 days</SelectItem>
                                            <SelectItem value="90-days">90 days</SelectItem>
                                            <SelectItem value="ongoing">Ongoing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input id="quantity" type="number" placeholder="30"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="refills">Refills</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select refills"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">0 refills</SelectItem>
                                            <SelectItem value="1">1 refill</SelectItem>
                                            <SelectItem value="2">2 refills</SelectItem>
                                            <SelectItem value="3">3 refills</SelectItem>
                                            <SelectItem value="5">5 refills</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pharmacy">Preferred Pharmacy</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select pharmacy"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cvs">CVS Pharmacy</SelectItem>
                                        <SelectItem value="walgreens">Walgreens</SelectItem>
                                        <SelectItem value="rite-aid">Rite Aid</SelectItem>
                                        <SelectItem value="kroger">Kroger Pharmacy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="instructions">Special Instructions</Label>
                                <Textarea
                                    id="instructions"
                                    placeholder="Take with food, avoid alcohol, etc..."
                                />
                            </div>

                            {selectedMedication && (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <AlertTriangle className="h-5 w-5 text-yellow-600"/>
                                        <p className="font-medium text-yellow-900">Medication Information</p>
                                    </div>
                                    {mockMedications.find(med => med.name === selectedMedication) && (
                                        <div className="text-sm text-yellow-800">
                                            <p>
                                                <strong>Contraindications:</strong> {mockMedications.find(med => med.name === selectedMedication)?.contraindications.join(', ')}
                                            </p>
                                            <p><strong>Common Side
                                                Effects:</strong> {mockMedications.find(med => med.name === selectedMedication)?.sideEffects.join(', ')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setIsNewPrescriptionOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="outline">
                                    <Printer className="h-4 w-4 mr-2"/>
                                    Print Preview
                                </Button>
                                <Button onClick={() => setIsNewPrescriptionOpen(false)}>
                                    <Send className="h-4 w-4 mr-2"/>
                                    Send to Pharmacy
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Prescription Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                {prescriptionStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardContent className="p-3 md:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                                        <p className="text-lg md:text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
                                    </div>
                                    <Icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`}/>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Prescription Management Tabs */}
            <Tabs defaultValue="active" className="w-full">
                <TabsList>
                    <TabsTrigger value="active">Active Prescriptions</TabsTrigger>
                    <TabsTrigger value="pending">Pending Approval</TabsTrigger>
                    <TabsTrigger value="medications">Medication Database</TabsTrigger>
                    <TabsTrigger value="interactions">Drug Interactions</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-6">
                    {/* Patient Selection and Search */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="relative flex-1">
                                        <Search
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                        <Input
                                            placeholder="Search prescriptions by patient, medication, or doctor..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Select value={selectedPatient} onValueChange={handlePatientChange}>
                                        <SelectTrigger className="w-64">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="patient_2">Bob Wilson (patient_2)</SelectItem>
                                            <SelectItem value="patient_4">David Miller (patient_4)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                        <Filter className="h-4 w-4 mr-2"/>
                                        All Status
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Calendar className="h-4 w-4 mr-2"/>
                                        This Month
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Stethoscope className="h-4 w-4 mr-2"/>
                                        By Doctor
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Prescriptions Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Prescriptions</CardTitle>
                            <CardDescription>
                                Current prescriptions and their status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {medicalLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-sm text-muted-foreground">Loading prescriptions...</div>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Patient</TableHead>
                                            <TableHead>Medication</TableHead>
                                            <TableHead>Dosage & Frequency</TableHead>
                                            <TableHead>Doctor</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Refills</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Pharmacy</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPrescriptions.map((prescription: any) => {
                                            const StatusIcon = getStatusIcon(prescription.status);
                                            return (
                                                <TableRow key={prescription.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{prescription.patientName}</p>
                                                            <p className="text-sm text-muted-foreground">{prescription.patientId}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{prescription.medication}</p>
                                                            <p className="text-sm text-muted-foreground">{prescription.dosage}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p>{prescription.frequency}</p>
                                                            <p className="text-sm text-muted-foreground">for {prescription.duration}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{prescription.doctorName}</TableCell>
                                                    <TableCell>{prescription.quantity}</TableCell>
                                                    <TableCell>{prescription.refills}</TableCell>
                                                    <TableCell>
                                                        <Badge className={getStatusColor(prescription.status)}>
                                                            <StatusIcon className="h-3 w-3 mr-1"/>
                                                            {prescription.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{prescription.pharmacy}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4"/>
                                                            </Button>
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="h-4 w-4"/>
                                                            </Button>
                                                            <Button variant="ghost" size="sm">
                                                                <Printer className="h-4 w-4"/>
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                            {mockPrescriptions.length === 0 && !medicalLoading && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No prescriptions found
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pending">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Approval</CardTitle>
                            <CardDescription>
                                Prescriptions requiring approval or verification
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Pending prescriptions will be displayed here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="medications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Medication Database</CardTitle>
                            <CardDescription>
                                Search and browse available medications
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockMedications.map((medication) => (
                                    <div key={medication.id} className="p-4 border border-border rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">{medication.name}</h3>
                                                <p className="text-sm text-muted-foreground">Generic: {medication.genericName}</p>
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <Badge variant="outline">{medication.category}</Badge>
                                                    <span
                                                        className="text-sm text-muted-foreground">{medication.form}</span>
                                                    <span className="text-sm text-muted-foreground">
                            Strengths: {medication.strength.join(', ')}
                          </span>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="interactions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Drug Interaction Checker</CardTitle>
                            <CardDescription>
                                Check for potential drug interactions and contraindications
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Drug interaction checker will be displayed here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
