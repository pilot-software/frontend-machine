import React, {useState} from 'react';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from './ui/dialog';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {Label} from './ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './ui/select';
import {Textarea} from './ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from './ui/card';
import {Badge} from './ui/badge';
import {Tabs, TabsContent, TabsList, TabsTrigger} from './ui/tabs';
import {Separator} from './ui/separator';
import {Avatar, AvatarFallback, AvatarImage} from './ui/avatar';
import {Calendar, Heart, Mail, MapPin, Phone, PillBottle, Plus, Save, User, X} from 'lucide-react';
import {useAuth} from './AuthContext';
import { GenderType, BloodType, ConditionSeverity, ConditionStatus, PrescriptionStatus } from '../lib/types';
import { patientService } from '../lib/services/patient';
import { userService } from '../lib/services/user';
import { useAppData } from '../lib/hooks/useAppData';
import { useAppSelector, useAppDispatch } from '../lib/store';
import { fetchPatientById, clearSelectedPatient, updatePatient } from '../lib/store/slices/patientSlice';

interface PatientFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | '';
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelationship: string;
    bloodType: 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE' | '';
    allergies: string;
    chronicConditions: string;
    currentMedications: string;
    assignedDoctor: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
}

interface MedicalConditionForm {
    id: string;
    conditionName: string;
    severity: ConditionSeverity;
    diagnosisDate: string;
    status: ConditionStatus;
    notes: string;
}

interface PrescriptionForm {
    id: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    prescribedBy: string;
    instructions: string;
    status: PrescriptionStatus;
}

interface PatientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientId?: string;
    mode: 'add' | 'edit' | 'view';
}

export function PatientFormModal({isOpen, onClose, patientId, mode}: PatientFormModalProps) {
    const {user} = useAuth();
    const { refetch } = useAppData();
    const dispatch = useAppDispatch();
    const { selectedPatient, loading, error } = useAppSelector(state => state.patient);
    const [activeTab, setActiveTab] = useState('basic');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [patientData, setPatientData] = useState<PatientFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: '',
        bloodType: '',
        allergies: '',
        chronicConditions: '',
        currentMedications: '',
        assignedDoctor: '',
        insuranceProvider: '',
        insurancePolicyNumber: ''
    });

    const [doctors, setDoctors] = useState<any[]>([]);

    // Load doctors and patient data when modal opens
    React.useEffect(() => {
        const loadData = async () => {
            if (isOpen) {
                try {
                    const doctorUsers = await userService.getUsersByRole('DOCTOR');
                    setDoctors(doctorUsers);
                } catch (error) {
                    console.error('Failed to load doctors:', error);
                }

                // Fetch patient data by ID if in edit or view mode
                if (patientId && (mode === 'edit' || mode === 'view')) {
                    dispatch(fetchPatientById(patientId));
                }
            }
        };
        loadData();
    }, [isOpen, patientId, mode, dispatch]);

    // Update form data when selectedPatient changes
    React.useEffect(() => {
        if (selectedPatient) {
            setPatientData({
                firstName: selectedPatient.firstName || '',
                lastName: selectedPatient.lastName || '',
                email: selectedPatient.email || '',
                phone: selectedPatient.phone || '',
                dateOfBirth: selectedPatient.dateOfBirth || '',
                gender: selectedPatient.gender || '',
                address: selectedPatient.address || '',
                city: selectedPatient.city || '',
                state: selectedPatient.state || '',
                zipCode: selectedPatient.zipCode || '',
                country: selectedPatient.country || 'USA',
                emergencyContactName: selectedPatient.emergencyContactName || '',
                emergencyContactPhone: selectedPatient.emergencyContactPhone || '',
                emergencyContactRelationship: selectedPatient.emergencyContactRelationship || '',
                bloodType: selectedPatient.bloodType || '',
                allergies: selectedPatient.allergies || '',
                chronicConditions: selectedPatient.chronicConditions || '',
                currentMedications: selectedPatient.currentMedications || '',
                assignedDoctor: '',
                insuranceProvider: selectedPatient.insuranceProvider || '',
                insurancePolicyNumber: selectedPatient.insurancePolicyNumber || ''
            });
        }
    }, [selectedPatient]);

    // Reset form when modal closes
    React.useEffect(() => {
        if (!isOpen) {
            dispatch(clearSelectedPatient());
            setPatientData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                dateOfBirth: '',
                gender: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'USA',
                emergencyContactName: '',
                emergencyContactPhone: '',
                emergencyContactRelationship: '',
                bloodType: '',
                allergies: '',
                chronicConditions: '',
                currentMedications: '',
                assignedDoctor: '',
                insuranceProvider: '',
                insurancePolicyNumber: ''
            });
        }
    }, [isOpen, dispatch]);

    const [conditions, setConditions] = useState<MedicalConditionForm[]>([]);
    const [prescriptions, setPrescriptions] = useState<PrescriptionForm[]>([]);
    const [newCondition, setNewCondition] = useState<Partial<MedicalConditionForm>>({});
    const [newPrescription, setNewPrescription] = useState<Partial<PrescriptionForm>>({});



    const departmentOptions = [
        {value: 'emergency', label: 'Emergency'},
        {value: 'cardiology', label: 'Cardiology'},
        {value: 'orthopedics', label: 'Orthopedics'},
        {value: 'neurology', label: 'Neurology'},
        {value: 'oncology', label: 'Oncology'}
    ];

    const insuranceOptions = [
        {value: 'blue-cross', label: 'Blue Cross Blue Shield'},
        {value: 'aetna', label: 'Aetna'},
        {value: 'kaiser', label: 'Kaiser Permanente'},
        {value: 'cigna', label: 'Cigna'},
        {value: 'united', label: 'United Healthcare'},
        {value: 'medicare', label: 'Medicare'},
        {value: 'medicaid', label: 'Medicaid'},
        {value: 'self-pay', label: 'Self Pay'}
    ];

    const handleInputChange = (field: keyof PatientFormData, value: string) => {
        setPatientData(prev => ({...prev, [field]: value}));
    };

    const handleAddCondition = () => {
        if (newCondition.conditionName && newCondition.severity && newCondition.diagnosisDate) {
            const condition: MedicalConditionForm = {
                id: Date.now().toString(),
                conditionName: newCondition.conditionName,
                severity: newCondition.severity,
                diagnosisDate: newCondition.diagnosisDate,
                status: newCondition.status || 'active',
                notes: newCondition.notes || ''
            };
            setConditions(prev => [...prev, condition]);
            setNewCondition({});
        }
    };

    const handleAddPrescription = () => {
        if (newPrescription.medicationName && newPrescription.dosage && newPrescription.frequency) {
            const prescription: PrescriptionForm = {
                id: Date.now().toString(),
                medicationName: newPrescription.medicationName,
                dosage: newPrescription.dosage,
                frequency: newPrescription.frequency,
                startDate: newPrescription.startDate || new Date().toISOString().split('T')[0],
                endDate: newPrescription.endDate,
                prescribedBy: user?.name || 'Unknown',
                instructions: newPrescription.instructions || '',
                status: 'active'
            };
            setPrescriptions(prev => [...prev, prescription]);
            setNewPrescription({});
        }
    };

    const handleRemoveCondition = (id: string) => {
        setConditions(prev => prev.filter(c => c.id !== id));
    };

    const handleRemovePrescription = (id: string) => {
        setPrescriptions(prev => prev.filter(p => p.id !== id));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Validate required fields
            if (!patientData.firstName || !patientData.lastName || !patientData.email) {
                alert('Please fill in all required fields (First Name, Last Name, Email)');
                return;
            }

            const apiData = {
                firstName: patientData.firstName.trim(),
                lastName: patientData.lastName.trim(),
                dateOfBirth: patientData.dateOfBirth,
                gender: patientData.gender as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY',
                phone: patientData.phone || undefined,
                email: patientData.email.trim(),
                address: patientData.address || undefined,
                city: patientData.city || undefined,
                state: patientData.state || undefined,
                zipCode: patientData.zipCode || undefined,
                country: patientData.country || 'USA',
                emergencyContactName: patientData.emergencyContactName || undefined,
                emergencyContactPhone: patientData.emergencyContactPhone || undefined,
                emergencyContactRelationship: patientData.emergencyContactRelationship || undefined,
                bloodType: patientData.bloodType || undefined,
                allergies: patientData.allergies || undefined,
                chronicConditions: patientData.chronicConditions || undefined,
                currentMedications: patientData.currentMedications || undefined,
                insuranceProvider: patientData.insuranceProvider || undefined,
                insurancePolicyNumber: patientData.insurancePolicyNumber || undefined
            };

            console.log('Submitting patient data:', apiData);

            if (mode === 'add') {
                await patientService.createPatient(apiData);
                refetch.patients();
            } else if (mode === 'edit' && patientId) {
                await patientService.updatePatient(patientId, apiData);
                refetch.patients();
            }

            onClose();
        } catch (error) {
            console.error('Failed to save patient:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert(`Failed to save patient: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'mild':
                return 'bg-green-100 text-green-800';
            case 'moderate':
                return 'bg-yellow-100 text-yellow-800';
            case 'severe':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-blue-100 text-blue-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'chronic':
                return 'bg-purple-100 text-purple-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'discontinued':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    const isReadOnly = mode === 'view';
    const isEditing = mode === 'edit';
    const isAdding = mode === 'add';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[800px] max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-blue-600" />
                        <span>
                            {isAdding ? 'Add New Patient' :
                             isEditing ? 'Edit Patient Information' :
                             'Patient Information'}
                        </span>
                    </DialogTitle>
                    <DialogDescription>
                        {isAdding ? 'Enter patient details and medical information' :
                            isEditing ? 'Update patient information and medical records' :
                                'Complete patient information and medical history'}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-6">
                    {isReadOnly && patientData.firstName && (
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage 
                                            src={`https://images.unsplash.com/photo-${patientData.gender === 'MALE' ? '1472099645785-5658abf4ff4e' : '1494790108755-2616b612b590'}?w=200&h=200&fit=crop&crop=face`} 
                                            alt={`${patientData.firstName} ${patientData.lastName}`} 
                                        />
                                        <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-800">
                                            {patientData.firstName?.[0]}{patientData.lastName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900">{patientData.firstName} {patientData.lastName}</h3>
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                Active
                                            </Badge>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>DOB: {patientData.dateOfBirth}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <User className="h-4 w-4" />
                                                <span>ID: {patientId?.substring(0, 8).toUpperCase() || 'NEW'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="basic" className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>Basic Info</span>
                            </TabsTrigger>
                            <TabsTrigger value="conditions" className="flex items-center space-x-2">
                                <Heart className="h-4 w-4" />
                                <span>Medical</span>
                            </TabsTrigger>
                            <TabsTrigger value="prescriptions" className="flex items-center space-x-2">
                                <PillBottle className="h-4 w-4" />
                                <span>Prescriptions</span>
                            </TabsTrigger>
                        </TabsList>

                        <div className="mt-4 space-y-4">
                            {loading.selectedPatient ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <span className="ml-2">Loading patient data...</span>
                                </div>
                            ) : error.selectedPatient ? (
                                <div className="flex items-center justify-center py-8 text-red-600">
                                    <span>Error: {error.selectedPatient}</span>
                                </div>
                            ) : (
                            <>
                                <TabsContent value="basic" className="space-y-4 mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Personal Information</CardTitle>
                                            <CardDescription>
                                                Basic patient demographics and contact information
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor="firstName">First Name *</Label>
                                                    <Input
                                                        id="firstName"
                                                        value={patientData.firstName}
                                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                        placeholder="Enter first name"
                                                        disabled={isReadOnly}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="lastName">Last Name *</Label>
                                                    <Input
                                                        id="lastName"
                                                        value={patientData.lastName}
                                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                        placeholder="Enter last name"
                                                        disabled={isReadOnly}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="gender">Gender *</Label>
                                                    <Select
                                                        value={patientData.gender}
                                                        onValueChange={(value) => handleInputChange('gender', value)}
                                                        disabled={isReadOnly}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select gender"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="MALE">Male</SelectItem>
                                                            <SelectItem value="FEMALE">Female</SelectItem>
                                                            <SelectItem value="OTHER">Other</SelectItem>
                                                            <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor="email">Email Address *</Label>
                                                    <div className="relative">
                                                        <Mail
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={patientData.email}
                                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                                            placeholder="patient@example.com"
                                                            className="pl-10"
                                                            disabled={isReadOnly}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="phone">Phone Number *</Label>
                                                    <div className="relative">
                                                        <Phone
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                                        <Input
                                                            id="phone"
                                                            value={patientData.phone}
                                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                                            placeholder="+1-555-0123"
                                                            className="pl-10"
                                                            disabled={isReadOnly}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                                    <div className="relative">
                                                        <Calendar
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                                        <Input
                                                            id="dateOfBirth"
                                                            type="date"
                                                            value={patientData.dateOfBirth}
                                                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                            className="pl-10"
                                                            disabled={isReadOnly}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="address">Address</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                                                    <Textarea
                                                        id="address"
                                                        value={patientData.address}
                                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                                        placeholder="Enter full address"
                                                        className="pl-10"
                                                        disabled={isReadOnly}
                                                    />
                                                </div>
                                            </div>

                                            <Separator/>

                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                                                    <Input
                                                        id="emergencyContactName"
                                                        value={patientData.emergencyContactName}
                                                        onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                                                        placeholder="Contact person name"
                                                        disabled={isReadOnly}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="emergencyContact">Emergency Contact Phone</Label>
                                                    <div className="relative">
                                                        <Phone
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                                        <Input
                                                            id="emergencyContact"
                                                            value={patientData.emergencyContactPhone}
                                                            onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                                                            placeholder="+1-555-0124"
                                                            className="pl-10"
                                                            disabled={isReadOnly}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                                                    <Input
                                                        id="emergencyRelationship"
                                                        value={patientData.emergencyContactRelationship}
                                                        onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                                                        placeholder="Spouse, Parent, etc."
                                                        disabled={isReadOnly}
                                                    />
                                                </div>
                                            </div>

                                            <Separator/>

                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor="bloodType">Blood Type</Label>
                                                    <Select
                                                        value={patientData.bloodType}
                                                        onValueChange={(value) => handleInputChange('bloodType', value)}
                                                        disabled={isReadOnly}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select blood type"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="O_POSITIVE">O+</SelectItem>
                                                            <SelectItem value="O_NEGATIVE">O-</SelectItem>
                                                            <SelectItem value="A_POSITIVE">A+</SelectItem>
                                                            <SelectItem value="A_NEGATIVE">A-</SelectItem>
                                                            <SelectItem value="B_POSITIVE">B+</SelectItem>
                                                            <SelectItem value="B_NEGATIVE">B-</SelectItem>
                                                            <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                                                            <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                                                    <Select
                                                        value={patientData.insuranceProvider}
                                                        onValueChange={(value) => handleInputChange('insuranceProvider', value)}
                                                        disabled={isReadOnly}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select insurance"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {insuranceOptions.map((insurance) => (
                                                                <SelectItem key={insurance.value} value={insurance.value}>
                                                                    {insurance.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                                                    <Input
                                                        id="insurancePolicyNumber"
                                                        value={patientData.insurancePolicyNumber}
                                                        onChange={(e) => handleInputChange('insurancePolicyNumber', e.target.value)}
                                                        placeholder="Policy number"
                                                        disabled={isReadOnly}
                                                    />
                                                </div>
                                            </div>

                                            <Separator/>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="assignedDoctor">Assigned Doctor</Label>
                                                    <Select
                                                        value={patientData.assignedDoctor}
                                                        onValueChange={(value) => handleInputChange('assignedDoctor', value)}
                                                        disabled={isReadOnly}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select doctor"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.isArray(doctors) && doctors.map((doctor) => (
                                                                <SelectItem key={doctor.id} value={doctor.id}>
                                                                    {doctor.name} - {doctor.specialization || doctor.department}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label htmlFor="allergies">Allergies</Label>
                                                    <Textarea
                                                        id="allergies"
                                                        value={patientData.allergies}
                                                        onChange={(e) => handleInputChange('allergies', e.target.value)}
                                                        placeholder="List any known allergies"
                                                        disabled={isReadOnly}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                                                    <Textarea
                                                        id="chronicConditions"
                                                        value={patientData.chronicConditions}
                                                        onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
                                                        placeholder="List chronic conditions"
                                                        disabled={isReadOnly}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="currentMedications">Current Medications</Label>
                                                    <Textarea
                                                        id="currentMedications"
                                                        value={patientData.currentMedications}
                                                        onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                                                        placeholder="List current medications"
                                                        disabled={isReadOnly}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="conditions" className="space-y-4">
                                    {!isReadOnly && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Add Medical Condition</CardTitle>
                                                <CardDescription>Add a new medical condition to the patient&apos;s
                                                    record</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Condition *</Label>
                                                        <Input
                                                            value={newCondition.conditionName || ''}
                                                            onChange={(e) => setNewCondition(prev => ({
                                                                ...prev,
                                                                conditionName: e.target.value
                                                            }))}
                                                            placeholder="e.g., Hypertension, Diabetes Type 2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Severity *</Label>
                                                        <Select
                                                            value={newCondition.severity || ''}
                                                            onValueChange={(value) => setNewCondition(prev => ({
                                                                ...prev,
                                                                severity: value as ConditionSeverity
                                                            }))}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select severity"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="mild">Mild</SelectItem>
                                                                <SelectItem value="moderate">Moderate</SelectItem>
                                                                <SelectItem value="severe">Severe</SelectItem>
                                                                <SelectItem value="critical">Critical</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Diagnosed Date *</Label>
                                                        <Input
                                                            type="date"
                                                            value={newCondition.diagnosisDate || ''}
                                                            onChange={(e) => setNewCondition(prev => ({
                                                                ...prev,
                                                                diagnosisDate: e.target.value
                                                            }))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Status</Label>
                                                        <Select
                                                            value={newCondition.status || 'active'}
                                                            onValueChange={(value) => setNewCondition(prev => ({
                                                                ...prev,
                                                                status: value as ConditionStatus
                                                            }))}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="active">Active</SelectItem>
                                                                <SelectItem value="chronic">Chronic</SelectItem>
                                                                <SelectItem value="resolved">Resolved</SelectItem>
                                                                <SelectItem value="in_remission">In Remission</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label>Notes</Label>
                                                    <Textarea
                                                        value={newCondition.notes || ''}
                                                        onChange={(e) => setNewCondition(prev => ({
                                                            ...prev,
                                                            notes: e.target.value
                                                        }))}
                                                        placeholder="Additional notes about the condition"
                                                    />
                                                </div>

                                                <Button onClick={handleAddCondition} className="w-full">
                                                    <Plus className="h-4 w-4 mr-2"/>
                                                    Add Condition
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )}

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Medical Conditions</CardTitle>
                                            <CardDescription>Current and past medical conditions</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {conditions.length === 0 ? (
                                                <div className="text-center py-8 text-gray-500">
                                                    <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300"/>
                                                    <p>No medical conditions recorded</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {conditions.map((condition) => (
                                                        <div key={condition.id}
                                                             className="border border-gray-200 rounded-lg p-4">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <h4 className="font-medium">{condition.conditionName}</h4>
                                                                    <div className="flex items-center space-x-2 mt-2">
                                                                        <Badge className={getSeverityColor(condition.severity)}>
                                                                            {condition.severity}
                                                                        </Badge>
                                                                        <Badge className={getStatusColor(condition.status)}>
                                                                            {condition.status}
                                                                        </Badge>
                                                                        <span className="text-sm text-gray-500">
                                          Diagnosed: {condition.diagnosisDate}
                                        </span>
                                                                    </div>
                                                                    {condition.notes && (
                                                                        <p className="text-sm text-gray-600 mt-2">{condition.notes}</p>
                                                                    )}
                                                                </div>
                                                                {!isReadOnly && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveCondition(condition.id)}
                                                                        className="text-red-600 hover:text-red-800"
                                                                    >
                                                                        <X className="h-4 w-4"/>
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="prescriptions" className="space-y-4">
                                    {!isReadOnly && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Add Prescription</CardTitle>
                                                <CardDescription>Prescribe new medication for the patient</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Medication *</Label>
                                                        <Input
                                                            value={newPrescription.medicationName || ''}
                                                            onChange={(e) => setNewPrescription(prev => ({
                                                                ...prev,
                                                                medicationName: e.target.value
                                                            }))}
                                                            placeholder="e.g., Lisinopril, Metformin"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Dosage *</Label>
                                                        <Input
                                                            value={newPrescription.dosage || ''}
                                                            onChange={(e) => setNewPrescription(prev => ({
                                                                ...prev,
                                                                dosage: e.target.value
                                                            }))}
                                                            placeholder="e.g., 10mg, 500mg"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label>Frequency *</Label>
                                                    <Select
                                                        value={newPrescription.frequency || ''}
                                                        onValueChange={(value) => setNewPrescription(prev => ({
                                                            ...prev,
                                                            frequency: value
                                                        }))}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select frequency"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="once-daily">Once daily</SelectItem>
                                                            <SelectItem value="twice-daily">Twice daily</SelectItem>
                                                            <SelectItem value="three-times-daily">Three times
                                                                daily</SelectItem>
                                                            <SelectItem value="four-times-daily">Four times
                                                                daily</SelectItem>
                                                            <SelectItem value="as-needed">As needed</SelectItem>
                                                            <SelectItem value="weekly">Weekly</SelectItem>
                                                            <SelectItem value="monthly">Monthly</SelectItem>
                                                            <SelectItem value="every-other-day">Every Other Day</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Start Date</Label>
                                                        <Input
                                                            type="date"
                                                            value={newPrescription.startDate || new Date().toISOString().split('T')[0]}
                                                            onChange={(e) => setNewPrescription(prev => ({
                                                                ...prev,
                                                                startDate: e.target.value
                                                            }))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>End Date (Optional)</Label>
                                                        <Input
                                                            type="date"
                                                            value={newPrescription.endDate || ''}
                                                            onChange={(e) => setNewPrescription(prev => ({
                                                                ...prev,
                                                                endDate: e.target.value
                                                            }))}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label>Instructions</Label>
                                                    <Textarea
                                                        value={newPrescription.instructions || ''}
                                                        onChange={(e) => setNewPrescription(prev => ({
                                                            ...prev,
                                                            instructions: e.target.value
                                                        }))}
                                                        placeholder="Special instructions for the patient"
                                                    />
                                                </div>

                                                <Button onClick={handleAddPrescription} className="w-full">
                                                    <Plus className="h-4 w-4 mr-2"/>
                                                    Add Prescription
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )}

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Current Prescriptions</CardTitle>
                                            <CardDescription>Active and recent prescriptions</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {prescriptions.length === 0 ? (
                                                <div className="text-center py-8 text-gray-500">
                                                    <PillBottle className="h-12 w-12 mx-auto mb-4 text-gray-300"/>
                                                    <p>No prescriptions recorded</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {prescriptions.map((prescription) => (
                                                        <div key={prescription.id}
                                                             className="border border-gray-200 rounded-lg p-4">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center space-x-2">
                                                                        <h4 className="font-medium">{prescription.medicationName}</h4>
                                                                        <Badge className={getStatusColor(prescription.status)}>
                                                                            {prescription.status}
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="mt-2 space-y-1">
                                                                        <p className="text-sm text-gray-600">
                                                                            <strong>Dosage:</strong> {prescription.dosage} - {prescription.frequency}
                                                                        </p>
                                                                        <p className="text-sm text-gray-600">
                                                                            <strong>Duration:</strong> {prescription.startDate}
                                                                            {prescription.endDate && ` to ${prescription.endDate}`}
                                                                        </p>
                                                                        <p className="text-sm text-gray-600">
                                                                            <strong>Prescribed
                                                                                by:</strong> {prescription.prescribedBy}
                                                                        </p>
                                                                        {prescription.instructions && (
                                                                            <p className="text-sm text-gray-600">
                                                                                <strong>Instructions:</strong> {prescription.instructions}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {!isReadOnly && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleRemovePrescription(prescription.id)}
                                                                        className="text-red-600 hover:text-red-800"
                                                                    >
                                                                        <X className="h-4 w-4"/>
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </>
                        )}
                        </div>
                    </Tabs>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30 -mx-6 px-6 pb-6 mt-6 rounded-b-xl">
                    <Button variant="outline" onClick={onClose} className="bg-white/80 backdrop-blur-sm border-gray-300 hover:bg-gray-50">
                        Cancel
                    </Button>
                    {!isReadOnly && (
                        <Button onClick={handleSubmit} disabled={isSubmitting || loading.updating} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                            {(isSubmitting || loading.updating) ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    {isAdding ? 'Creating...' : 'Saving...'}
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    {isAdding ? 'Create Patient' : 'Save Changes'}
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}