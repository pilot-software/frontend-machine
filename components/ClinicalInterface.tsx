import React, {useEffect, useRef, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "./ui/card";
import {Button} from "./ui/button";
import {Label} from "./ui/label";
import {Textarea} from "./ui/textarea";
import {Badge} from "./ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "./ui/tabs";
import {Progress} from "./ui/progress";
import {PatientSearch} from "./ui/patient-search";
import {
    Activity,
    AlertTriangle,
    Droplets,
    Eye,
    Heart,
    Plus,
    Stethoscope,
    TestTube,
    Thermometer,
    TrendingUp,
} from "lucide-react";
import {useAuth} from "./AuthContext";
import {usePatientData} from "../lib/hooks/usePatientData";
import {useApi} from "../lib/hooks/useApi";
import {api} from "../lib/api";

interface VitalSigns {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    respiratoryRate: string;
    oxygenSaturation: string;
    bloodSugar: string;
    weight: string;
    height: string;
    timestamp: string;
}

interface LabResult {
    id: string;
    testName: string;
    result: string;
    normalRange: string;
    status: "normal" | "abnormal" | "critical";
    date: string;
}

const mockVitals: VitalSigns = {
    temperature: "98.6°F",
    bloodPressure: "120/80 mmHg",
    heartRate: "72 bpm",
    respiratoryRate: "16/min",
    oxygenSaturation: "98%",
    bloodSugar: "95 mg/dL",
    weight: "154 lbs",
    height: "5'8\"",
    timestamp: "2024-07-26 08:30 AM",
};

const mockLabResults: LabResult[] = [
    {
        id: "1",
        testName: "Complete Blood Count (CBC)",
        result: "Normal",
        normalRange: "WBC: 4.5-11.0, RBC: 4.2-5.4",
        status: "normal",
        date: "2024-07-25",
    },
    {
        id: "2",
        testName: "Cholesterol Panel",
        result: "Total: 195 mg/dL",
        normalRange: "<200 mg/dL",
        status: "normal",
        date: "2024-07-24",
    },
    {
        id: "3",
        testName: "Hemoglobin A1c",
        result: "7.2%",
        normalRange: "<5.7%",
        status: "abnormal",
        date: "2024-07-23",
    },
];

export function ClinicalInterface() {
    const {user} = useAuth();
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [medicalData, setMedicalData] = useState<any>(null);

    const {execute: fetchMedicalData, loading} = useApi();
    const hasFetched = useRef(false);

    useEffect(() => {
        if (selectedPatient?.id && !hasFetched.current) {
            hasFetched.current = true;
            fetchMedicalData(async () => {
                const data = await api.get(`/api/medical/patients/${selectedPatient.id}/medical-data`);
                setMedicalData(data);
                return data;
            });
        }
    }, [selectedPatient, fetchMedicalData]);

    const handlePatientSelect = (patient: any) => {
        setSelectedPatient(patient);
        hasFetched.current = false;
        // TODO: Implement getPatientMedicalData method
        setMedicalData(null);
    };

    // derive patient list from global app patients
    const appPatients = usePatientData();

    // Different stats based on user role
    const getClinicalStats = () => {
        if (user?.role === "doctor") {
            const myPatientsCount = appPatients.filter(
                (p) => String(p.assignedDoctorId) === String(user.id)
            ).length;
            return [
                {
                    label: "My Patients",
                    value: String(myPatientsCount || 0),
                    icon: Activity,
                    color: "text-blue-600",
                },
                {
                    label: "Critical Cases",
                    value: "1",
                    icon: AlertTriangle,
                    color: "text-red-600",
                },
                {
                    label: "Pending Lab Results",
                    value: "3",
                    icon: TestTube,
                    color: "text-purple-600",
                },
                {
                    label: "Procedures Today",
                    value: "2",
                    icon: Stethoscope,
                    color: "text-green-600",
                },
            ];
        }

        // Admin/Nurse stats
        return [
            {
                label: "Active Patients",
                value: "156",
                icon: Activity,
                color: "text-blue-600",
            },
            {
                label: "Critical Cases",
                value: "8",
                icon: AlertTriangle,
                color: "text-red-600",
            },
            {
                label: "Pending Lab Results",
                value: "23",
                icon: TestTube,
                color: "text-purple-600",
            },
            {
                label: "Procedures Today",
                value: "12",
                icon: Stethoscope,
                color: "text-green-600",
            },
        ];
    };

    const clinicalStats = getClinicalStats();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "normal":
                return "bg-green-100 text-green-800";
            case "abnormal":
                return "bg-yellow-100 text-yellow-800";
            case "critical":
                return "bg-red-100 text-red-800";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    // Get patients based on user role
    const getPatients = () => {
        if (user?.role === "doctor") {
            return appPatients.filter((p) => String(p.assignedDoctorId) === String(user.id));
        }
        return appPatients;
    };

    const availablePatients = getPatients();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">
                        {user?.role === "patient"
                            ? "My Health Records"
                            : user?.role === "doctor"
                                ? "My Patients - Clinical Interface"
                                : "Clinical Interface"}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        {user?.role === "patient"
                            ? "Your personal health data, vitals, and medical history"
                            : user?.role === "doctor"
                                ? "Clinical data for your assigned patients"
                                : "Patient clinical data, vitals, and medical records"}
                    </p>
                </div>
                {user?.role !== "patient" && (
                    <div className="flex space-x-2">
                        <Button variant="outline">
                            <TestTube className="h-4 w-4 mr-2"/>
                            Order Lab Tests
                        </Button>
                        <Button>
                            <Plus className="h-4 w-4 mr-2"/>
                            New Assessment
                        </Button>
                    </div>
                )}
            </div>

            {/* Clinical Stats - Only show for non-patient users */}
            {user?.role !== "patient" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                    {clinicalStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                {stat.label}
                                            </p>
                                            <p className="text-2xl font-semibold text-foreground mt-1">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <Icon className={`h-8 w-8 ${stat.color}`}/>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Patient Selection - Only show for non-patient users */}
            {user?.role !== "patient" && (
                <Card>
                    <CardContent className="p-6">
                        <PatientSearch
                            patients={availablePatients}
                            onSelect={handlePatientSelect}
                            placeholder={
                                user?.role === "doctor"
                                    ? "Search your patients by name or case number..."
                                    : "Search patients by name or case number..."
                            }
                            selectedPatientId={selectedPatient?.id}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Clinical Data Tabs */}
            <Tabs defaultValue="vitals" className="w-full">
                <TabsList>
                    <TabsTrigger value="vitals">
                        {user?.role === "patient" ? "My Vital Signs" : "Vital Signs"}
                    </TabsTrigger>
                    <TabsTrigger value="labs">
                        {user?.role === "patient" ? "My Lab Results" : "Lab Results"}
                    </TabsTrigger>
                    {user?.role !== "patient" && (
                        <TabsTrigger value="assessment">Assessment</TabsTrigger>
                    )}
                    <TabsTrigger value="procedures">
                        {user?.role === "patient" ? "My Procedures" : "Procedures"}
                    </TabsTrigger>
                    <TabsTrigger value="imaging">
                        {user?.role === "patient" ? "My Imaging" : "Imaging"}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="vitals" className="space-y-6">
                    {/* Current Vitals */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>
                                        {user?.role === "patient"
                                            ? "My Current Vital Signs"
                                            : "Current Vital Signs"}
                                    </CardTitle>
                                    <CardDescription>
                                        Latest measurements - {mockVitals.timestamp}
                                    </CardDescription>
                                </div>
                                {user?.role !== "patient" && (
                                    <Button variant="outline">
                                        <Plus className="h-4 w-4 mr-2"/>
                                        Record New Vitals
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {medicalData?.vitals?.[0] ? (
                                    <>
                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-red-100 rounded-full">
                                                <Thermometer className="h-6 w-6 text-red-600"/>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Temperature
                                                </p>
                                                <p className="text-xl font-semibold">
                                                    {medicalData.vitals[0].temperature}°F
                                                </p>
                                                <Badge className="bg-green-100 text-green-800">
                                                    Normal
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-blue-100 rounded-full">
                                                <Heart className="h-6 w-6 text-blue-600"/>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Heart Rate
                                                </p>
                                                <p className="text-xl font-semibold">
                                                    {medicalData.vitals[0].heartRate} bpm
                                                </p>
                                                <Badge className="bg-green-100 text-green-800">
                                                    Normal
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-purple-100 rounded-full">
                                                <Activity className="h-6 w-6 text-purple-600"/>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Blood Pressure
                                                </p>
                                                <p className="text-xl font-semibold">
                                                    {medicalData.vitals[0].bloodPressure}
                                                </p>
                                                <Badge className="bg-green-100 text-green-800">
                                                    Normal
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-green-100 rounded-full">
                                                <Droplets className="h-6 w-6 text-green-600"/>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Oxygen Sat
                                                </p>
                                                <p className="text-xl font-semibold">
                                                    {medicalData.vitals[0].oxygenSaturation}%
                                                </p>
                                                <Badge className="bg-green-100 text-green-800">
                                                    Normal
                                                </Badge>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="col-span-4 text-center text-muted-foreground">
                                        {loading
                                            ? "Loading vitals..."
                                            : selectedPatient ? "No vital signs data available" : "Select a patient to view vitals"}
                                    </div>
                                )}
                            </div>

                            {/* Additional Measurements */}
                            {medicalData?.vitals?.[0] && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t">
                                    <div>
                                        <Label>Weight</Label>
                                        <p className="text-lg font-medium">
                                            {medicalData.vitals[0].weight} kg
                                        </p>
                                    </div>
                                    <div>
                                        <Label>Height</Label>
                                        <p className="text-lg font-medium">
                                            {medicalData.vitals[0].height} cm
                                        </p>
                                    </div>
                                    <div>
                                        <Label>Recorded At</Label>
                                        <p className="text-lg font-medium">
                                            {new Date(medicalData.vitals[0].recordedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Vitals Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Vital Signs Trends</CardTitle>
                            <CardDescription>
                                Tracking changes over the last 7 days
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>Blood Pressure Trend</Label>
                                        <TrendingUp className="h-4 w-4 text-green-600"/>
                                    </div>
                                    <Progress value={75} className="h-2"/>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Stable within normal range
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>Heart Rate Variability</Label>
                                        <TrendingUp className="h-4 w-4 text-blue-600"/>
                                    </div>
                                    <Progress value={82} className="h-2"/>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Good cardiovascular health
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="labs" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>
                                        {user?.role === "patient"
                                            ? "My Laboratory Results"
                                            : "Laboratory Results"}
                                    </CardTitle>
                                    <CardDescription>
                                        Recent lab tests and results
                                    </CardDescription>
                                </div>
                                {user?.role !== "patient" && (
                                    <Button variant="outline">
                                        <TestTube className="h-4 w-4 mr-2"/>
                                        Order New Tests
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {medicalData?.labResults?.length > 0 ? (
                                    medicalData.labResults.map((result: any) => (
                                        <div
                                            key={result.id}
                                            className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-purple-100 rounded-full">
                                                    <TestTube className="h-5 w-5 text-purple-600"/>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{result.testName}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Result: {result.testResults}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Date: {result.testDate}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge
                                                    className={
                                                        result.abnormalFlag === "true"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-green-100 text-green-800"
                                                    }
                                                >
                                                    {result.abnormalFlag === "true"
                                                        ? "abnormal"
                                                        : "normal"}
                                                </Badge>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        {loading
                                            ? "Loading lab results..."
                                            : "No lab results available"}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {user?.role !== "patient" && (
                    <TabsContent value="assessment">
                        <Card>
                            <CardHeader>
                                <CardTitle>Clinical Assessment</CardTitle>
                                <CardDescription>
                                    Patient evaluation and clinical notes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="chief-complaint">Chief Complaint</Label>
                                        <Textarea
                                            id="chief-complaint"
                                            placeholder="Patient's primary concern..."
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="physical-exam">Physical Examination</Label>
                                        <Textarea
                                            id="physical-exam"
                                            placeholder="Physical examination findings..."
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="assessment">Assessment & Plan</Label>
                                        <Textarea
                                            id="assessment"
                                            placeholder="Clinical assessment and treatment plan..."
                                        />
                                    </div>
                                    <Button>Save Assessment</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}

                <TabsContent value="procedures">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {user?.role === "patient"
                                    ? "My Procedures & Treatments"
                                    : "Procedures & Treatments"}
                            </CardTitle>
                            <CardDescription>
                                {user?.role === "patient"
                                    ? "Your medical procedures and treatment history"
                                    : "Medical procedures and treatment history"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {user?.role === "patient"
                                    ? "Your procedures and treatments will be displayed here."
                                    : "Procedures interface will be displayed here."}
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="imaging">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {user?.role === "patient"
                                    ? "My Medical Imaging"
                                    : "Medical Imaging"}
                            </CardTitle>
                            <CardDescription>
                                {user?.role === "patient"
                                    ? "Your X-rays, CT scans, MRI, and other imaging studies"
                                    : "X-rays, CT scans, MRI, and other imaging studies"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {user?.role === "patient"
                                    ? "Your medical imaging results will be displayed here."
                                    : "Medical imaging interface will be displayed here."}
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
