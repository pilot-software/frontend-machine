import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Heart,
  Pill,
  Plus,
  Search,
  TestTube,
  Thermometer,
  User,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { usePatientData } from "../../lib/hooks/usePatientData";

interface VitalSigns {
  id: string;
  patientId: string;
  patientName: string;
  recordedBy: string;
  recordedAt: string;
  temperature: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight?: number;
  height?: number;
  bmi?: number;
  painLevel?: number;
  notes?: string;
}

interface LabResult {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  testType:
    | "Blood Work"
    | "Urine Analysis"
    | "Imaging"
    | "Biopsy"
    | "Culture"
    | "Other";
  orderedBy: string;
  orderedDate: string;
  completedDate?: string;
  status: "Ordered" | "In Progress" | "Completed" | "Cancelled";
  results?: string;
  normalRange?: string;
  flagged: boolean;
  priority: "Routine" | "Urgent" | "STAT";
  notes?: string;
}

interface Diagnosis {
  id: string;
  patientId: string;
  patientName: string;
  diagnosisCode: string;
  diagnosisName: string;
  type: "Primary" | "Secondary" | "Provisional" | "Rule Out";
  status: "Active" | "Resolved" | "Chronic" | "Inactive";
  diagnosedBy: string;
  diagnosedDate: string;
  severity: "Mild" | "Moderate" | "Severe" | "Critical";
  notes?: string;
}

interface TreatmentPlan {
  id: string;
  patientId: string;
  patientName: string;
  planName: string;
  createdBy: string;
  createdDate: string;
  startDate: string;
  endDate?: string;
  status: "Active" | "Completed" | "Discontinued" | "On Hold";
  goals: string[];
  interventions: string[];
  medications: string[];
  followUpInstructions: string;
  nextReviewDate?: string;
}

const mockVitalSigns: VitalSigns[] = [
  {
    id: "1",
    patientId: "p1",
    patientName: "John Smith",
    recordedBy: "Nurse Sarah Williams",
    recordedAt: "2024-08-01T09:30:00Z",
    temperature: "98.6°F (37°C)",
    bloodPressureSystolic: 128,
    bloodPressureDiastolic: 82,
    heartRate: 72,
    respiratoryRate: 16,
    oxygenSaturation: 99,
    weight: 185,
    height: 72,
    bmi: 25.1,
    painLevel: 2,
    notes: "Patient reports feeling well. Vitals within normal ranges.",
  },
  {
    id: "2",
    patientId: "p2",
    patientName: "Emma Davis",
    recordedBy: "Nurse Michael Johnson",
    recordedAt: "2024-08-01T14:15:00Z",
    temperature: "99.2°F (37.3°C)",
    bloodPressureSystolic: 145,
    bloodPressureDiastolic: 95,
    heartRate: 88,
    respiratoryRate: 20,
    oxygenSaturation: 96,
    weight: 165,
    height: 65,
    bmi: 27.4,
    painLevel: 6,
    notes:
      "Elevated blood pressure and temperature. Patient reports chest discomfort.",
  },
];

const mockLabResults: LabResult[] = [
  {
    id: "1",
    patientId: "p1",
    patientName: "John Smith",
    testName: "Complete Blood Count (CBC)",
    testType: "Blood Work",
    orderedBy: "Dr. Sarah Johnson",
    orderedDate: "2024-07-28",
    completedDate: "2024-07-29",
    status: "Completed",
    results:
      "WBC: 7.2 k/uL, RBC: 4.5 M/uL, Hemoglobin: 14.2 g/dL, Hematocrit: 42.1%",
    normalRange: "WBC: 4.0-11.0, RBC: 4.2-5.4, Hgb: 12.0-15.5, Hct: 36.0-46.0",
    flagged: false,
    priority: "Routine",
    notes: "All values within normal limits",
  },
  {
    id: "2",
    patientId: "p2",
    patientName: "Emma Davis",
    testName: "Troponin I",
    testType: "Blood Work",
    orderedBy: "Dr. Michael Chen",
    orderedDate: "2024-08-01",
    status: "In Progress",
    flagged: true,
    priority: "STAT",
    notes: "Ordered due to chest pain. Results pending.",
  },
  {
    id: "3",
    patientId: "p3",
    patientName: "Michael Johnson",
    testName: "Knee X-Ray",
    testType: "Imaging",
    orderedBy: "Dr. Emily Rodriguez",
    orderedDate: "2024-07-30",
    completedDate: "2024-07-30",
    status: "Completed",
    results:
      "Post-surgical changes consistent with total knee replacement. Hardware intact.",
    flagged: false,
    priority: "Routine",
    notes: "Follow-up imaging shows good healing progress",
  },
];

const mockDiagnoses: Diagnosis[] = [
  {
    id: "1",
    patientId: "p1",
    patientName: "John Smith",
    diagnosisCode: "I10",
    diagnosisName: "Essential Hypertension",
    type: "Primary",
    status: "Active",
    diagnosedBy: "Dr. Sarah Johnson",
    diagnosedDate: "2024-01-15",
    severity: "Moderate",
    notes: "Well-controlled with medication. Regular monitoring required.",
  },
  {
    id: "2",
    patientId: "p2",
    patientName: "Emma Davis",
    diagnosisCode: "I21.9",
    diagnosisName: "Acute Myocardial Infarction, unspecified",
    type: "Primary",
    status: "Active",
    diagnosedBy: "Dr. Michael Chen",
    diagnosedDate: "2024-07-22",
    severity: "Severe",
    notes: "STEMI treated with primary PCI. Currently in CCU for monitoring.",
  },
];

const mockTreatmentPlans: TreatmentPlan[] = [
  {
    id: "1",
    patientId: "p1",
    patientName: "John Smith",
    planName: "Hypertension Management Plan",
    createdBy: "Dr. Sarah Johnson",
    createdDate: "2024-01-15",
    startDate: "2024-01-15",
    status: "Active",
    goals: [
      "Maintain blood pressure <130/80 mmHg",
      "Achieve target weight of 175 lbs",
      "Improve cardiovascular fitness",
    ],
    interventions: [
      "Lifestyle modifications (diet and exercise)",
      "Regular blood pressure monitoring",
      "Medication compliance education",
    ],
    medications: ["Lisinopril 10mg daily", "Hydrochlorothiazide 25mg daily"],
    followUpInstructions:
      "Return in 3 months for blood pressure check and medication review",
    nextReviewDate: "2024-11-15",
  },
  {
    id: "2",
    patientId: "p2",
    patientName: "Emma Davis",
    planName: "Post-MI Cardiac Rehabilitation",
    createdBy: "Dr. Michael Chen",
    createdDate: "2024-07-23",
    startDate: "2024-07-25",
    status: "Active",
    goals: [
      "Prevent future cardiac events",
      "Restore functional capacity",
      "Improve quality of life",
    ],
    interventions: [
      "Cardiac rehabilitation program",
      "Dietary counseling",
      "Stress management therapy",
    ],
    medications: [
      "Aspirin 81mg daily",
      "Clopidogrel 75mg daily",
      "Atorvastatin 80mg daily",
      "Metoprolol 50mg twice daily",
    ],
    followUpInstructions:
      "Weekly cardiology follow-up for 4 weeks, then monthly",
    nextReviewDate: "2024-08-08",
  },
];

export function ClinicalInterfaceEnhanced() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string>("all");
  const [selectedModal, setSelectedModal] = useState<{
    isOpen: boolean;
    type: "vitals" | "lab" | "diagnosis" | "treatment" | null;
    data: VitalSigns | LabResult | Diagnosis | TreatmentPlan | null;
  }>({
    isOpen: false,
    type: null,
    data: null,
  });

  const appPatients = usePatientData();

  // Role-based data filtering
  const getFilteredData = <
    T extends { patientId: string; patientName: string }
  >(
    data: T[]
  ) => {
    let filtered = data;

    if (user?.role === "doctor") {
      // Filter to only show data for patients assigned to this doctor (by assignedDoctorId)
      const myPatientIds = new Set(
        appPatients
          .filter((p) => String(p.assignedDoctorId) === String(user.id))
          .map((p) => p.id)
      );
      filtered = filtered.filter((item) => myPatientIds.has(item.patientId));
    } else if (user?.role === "patient") {
      // Filter to only show patient's own data
      filtered = filtered.filter((item) =>
        item.patientName.includes(user.name || "")
      );
    }

    if (selectedPatient !== "all") {
      filtered = filtered.filter((item) => item.patientId === selectedPatient);
    }

    if (searchTerm) {
      filtered = filtered.filter((item) => {
        const itemName = item.patientName.toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        if (itemName.includes(searchLower)) return true;

        if (
          "testName" in item &&
          typeof (item as unknown as LabResult).testName === "string" &&
          (item as unknown as LabResult).testName
            .toLowerCase()
            .includes(searchLower)
        )
          return true;
        if (
          "diagnosisName" in item &&
          typeof (item as unknown as Diagnosis).diagnosisName === "string" &&
          (item as unknown as Diagnosis).diagnosisName
            .toLowerCase()
            .includes(searchLower)
        )
          return true;
        if (
          "planName" in item &&
          typeof (item as unknown as TreatmentPlan).planName === "string" &&
          (item as unknown as TreatmentPlan).planName
            .toLowerCase()
            .includes(searchLower)
        )
          return true;

        return false;
      });
    }

    return filtered;
  };

  const clinicalStats = [
    {
      label: "Active Patients",
      value: getFilteredData(mockVitalSigns).length.toString(),
      icon: User,
      color: "text-blue-600",
      change: "+3",
    },
    {
      label: "Pending Labs",
      value: mockLabResults
        .filter(
          (lab) => lab.status === "In Progress" || lab.status === "Ordered"
        )
        .length.toString(),
      icon: TestTube,
      color: "text-orange-600",
      change: "+2",
    },
    {
      label: "Critical Results",
      value: mockLabResults.filter((lab) => lab.flagged).length.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
      change: "0",
    },
    {
      label: "Treatment Plans",
      value: mockTreatmentPlans
        .filter((plan) => plan.status === "Active")
        .length.toString(),
      icon: FileText,
      color: "text-green-600",
      change: "+1",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "active":
        return "bg-green-100 text-green-800";
      case "in progress":
      case "on hold":
        return "bg-yellow-100 text-yellow-800";
      case "ordered":
      case "provisional":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
      case "discontinued":
      case "inactive":
        return "bg-red-100 text-red-800";
      case "resolved":
        return "bg-emerald-100 text-emerald-800";
      case "chronic":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "stat":
        return "bg-red-100 text-red-800 border-red-200";
      case "urgent":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "routine":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "severe":
        return "bg-red-100 text-red-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "mild":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canAddClinicalData = user?.role === "doctor" || user?.role === "nurse";
  const canViewAllPatients =
    user?.role === "admin" || user?.role === "doctor" || user?.role === "nurse";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Clinical Interface</h2>
          <p>
            {user?.role === "patient"
              ? "View your medical records and test results"
              : "Comprehensive clinical data management and patient care"}
          </p>
        </div>
        {canAddClinicalData && (
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Record Vitals
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Order Lab Test
            </Button>
          </div>
        )}
      </div>

      {/* Clinical Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clinicalStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p
                      className={`text-sm mt-1 ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : stat.change === "0"
                          ? "text-slate-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change !== "0" &&
                        stat.change.startsWith("+") &&
                        "+"}
                      {stat.change} today
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Clinical Management Tabs */}
      <Tabs defaultValue="vitals" className="w-full">
        <TabsList className="grid w-full lg:w-auto lg:inline-flex lg:h-10 grid-cols-5">
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
          <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
          <TabsTrigger value="treatments">Treatment Plans</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder={
                      user?.role === "patient"
                        ? "Search your vital signs records..."
                        : "Search patients or vital signs..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {canViewAllPatients && (
                  <div className="flex space-x-2">
                    <Select
                      value={selectedPatient}
                      onValueChange={setSelectedPatient}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Patients</SelectItem>
                        <SelectItem value="p1">John Smith</SelectItem>
                        <SelectItem value="p2">Emma Davis</SelectItem>
                        <SelectItem value="p3">Michael Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Time Range
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vital Signs Records */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Vital Signs</CardTitle>
              <CardDescription>
                Latest vital signs measurements (
                {getFilteredData(mockVitalSigns).length} records)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredData(mockVitalSigns).map((vital) => (
                  <div
                    key={vital.id}
                    className="p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Thermometer className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h3>{vital.patientName}</h3>
                          <p className="text-sm text-slate-500">
                            {new Date(vital.recordedAt).toLocaleString()} by{" "}
                            {vital.recordedBy}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedModal({
                              isOpen: true,
                              type: "vitals",
                              data: vital,
                            })
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {canAddClinicalData && (
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      <div className="bg-slate-50 p-3 rounded">
                        <div className="flex items-center space-x-2">
                          <Thermometer className="h-4 w-4 text-red-500" />
                          <span className="text-xs text-slate-600">
                            Temperature
                          </span>
                        </div>
                        <p className="mt-1">{vital.temperature}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-xs text-slate-600">
                            Blood Pressure
                          </span>
                        </div>
                        <p className="mt-1">
                          {vital.bloodPressureSystolic}/
                          {vital.bloodPressureDiastolic}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-slate-600">
                            Heart Rate
                          </span>
                        </div>
                        <p className="mt-1">{vital.heartRate} bpm</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <span className="text-xs text-slate-600">
                            Respiratory
                          </span>
                        </div>
                        <p className="mt-1">{vital.respiratoryRate}/min</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-purple-500" />
                          <span className="text-xs text-slate-600">
                            O2 Saturation
                          </span>
                        </div>
                        <p className="mt-1">{vital.oxygenSaturation}%</p>
                      </div>
                      {vital.painLevel !== undefined && (
                        <div className="bg-slate-50 p-3 rounded">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <span className="text-xs text-slate-600">
                              Pain Level
                            </span>
                          </div>
                          <p className="mt-1">{vital.painLevel}/10</p>
                        </div>
                      )}
                    </div>

                    {vital.notes && (
                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm">
                          <span className="font-medium">Notes:</span>{" "}
                          {vital.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                {getFilteredData(mockVitalSigns).length === 0 && (
                  <div className="text-center py-8">
                    <Thermometer className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p>No vital signs recorded</p>
                    <p>Vital signs will appear here once recorded</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Results</CardTitle>
              <CardDescription>
                Lab tests and results ({mockLabResults.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Ordered By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredData(mockLabResults).map((lab) => (
                    <TableRow key={lab.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {lab.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{lab.patientName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{lab.testName}</p>
                          {lab.flagged && (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200 mt-1"
                            >
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Flagged
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{lab.testType}</TableCell>
                      <TableCell>{lab.orderedBy}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(lab.status)}>
                          {lab.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(lab.priority)}
                        >
                          {lab.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>
                            Ordered:{" "}
                            {new Date(lab.orderedDate).toLocaleDateString()}
                          </p>
                          {lab.completedDate && (
                            <p className="text-sm text-slate-500">
                              Completed:{" "}
                              {new Date(lab.completedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setSelectedModal({
                                isOpen: true,
                                type: "lab",
                                data: lab,
                              })
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnoses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Diagnoses</CardTitle>
              <CardDescription>
                Current and historical diagnoses ({mockDiagnoses.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredData(mockDiagnoses).map((diagnosis) => (
                  <div
                    key={diagnosis.id}
                    className="p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Clipboard className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h3>{diagnosis.patientName}</h3>
                          <p className="text-sm text-slate-500">
                            Diagnosed by {diagnosis.diagnosedBy} on{" "}
                            {new Date(
                              diagnosis.diagnosedDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(diagnosis.status)}>
                          {diagnosis.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getSeverityColor(diagnosis.severity)}
                        >
                          {diagnosis.severity}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <Label className="text-sm font-medium text-slate-700">
                          Diagnosis
                        </Label>
                        <p className="mt-1">
                          <code className="bg-slate-100 px-2 py-1 rounded text-sm mr-2">
                            {diagnosis.diagnosisCode}
                          </code>
                          {diagnosis.diagnosisName}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-700">
                          Type
                        </Label>
                        <p className="mt-1">
                          <Badge variant="outline">{diagnosis.type}</Badge>
                        </p>
                      </div>
                    </div>

                    {diagnosis.notes && (
                      <div className="p-3 bg-slate-50 rounded">
                        <Label className="text-sm font-medium text-slate-700">
                          Clinical Notes
                        </Label>
                        <p className="text-sm mt-1">{diagnosis.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
                {getFilteredData(mockDiagnoses).length === 0 && (
                  <div className="text-center py-8">
                    <Clipboard className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p>No diagnoses recorded</p>
                    <p>Patient diagnoses will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Plans</CardTitle>
              <CardDescription>
                Active and completed treatment plans (
                {mockTreatmentPlans.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {getFilteredData(mockTreatmentPlans).map((plan) => (
                  <div
                    key={plan.id}
                    className="p-6 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <FileText className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h3>{plan.planName}</h3>
                          <p className="text-sm text-slate-500">
                            {plan.patientName} • Created by {plan.createdBy}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status}
                        </Badge>
                        {plan.nextReviewDate && (
                          <Badge variant="outline">
                            Next Review:{" "}
                            {new Date(plan.nextReviewDate).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-slate-700 mb-2 block">
                          Treatment Goals
                        </Label>
                        <ul className="space-y-2">
                          {plan.goals.map((goal, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                              <span className="text-sm">{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-700 mb-2 block">
                          Interventions
                        </Label>
                        <ul className="space-y-2">
                          {plan.interventions.map((intervention, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                              <span className="text-sm">{intervention}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-slate-700 mb-2 block">
                          Medications
                        </Label>
                        <ul className="space-y-2">
                          {plan.medications.map((medication, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <Pill className="h-4 w-4 text-orange-500 mt-0.5" />
                              <span className="text-sm">{medication}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-700 mb-2 block">
                          Timeline
                        </Label>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Start Date:</span>
                            <span>
                              {new Date(plan.startDate).toLocaleDateString()}
                            </span>
                          </div>
                          {plan.endDate && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">End Date:</span>
                              <span>
                                {new Date(plan.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 rounded">
                      <Label className="text-sm font-medium text-slate-700">
                        Follow-up Instructions
                      </Label>
                      <p className="text-sm mt-1">
                        {plan.followUpInstructions}
                      </p>
                    </div>
                  </div>
                ))}
                {getFilteredData(mockTreatmentPlans).length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p>No treatment plans</p>
                    <p>Treatment plans will appear here when created</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imaging">
          <Card>
            <CardHeader>
              <CardTitle>Imaging Studies</CardTitle>
              <CardDescription>
                X-rays, CT scans, MRIs, and other imaging studies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TestTube className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p>Imaging studies interface</p>
                <p>DICOM viewer and imaging results will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog
        open={selectedModal.isOpen}
        onOpenChange={() =>
          setSelectedModal({ isOpen: false, type: null, data: null })
        }
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedModal.type === "vitals" && "Vital Signs Details"}
              {selectedModal.type === "lab" && "Lab Result Details"}
              {selectedModal.type === "diagnosis" && "Diagnosis Details"}
              {selectedModal.type === "treatment" && "Treatment Plan Details"}
            </DialogTitle>
            <DialogDescription>
              Detailed view of {selectedModal.type} record
            </DialogDescription>
          </DialogHeader>

          {selectedModal.data &&
            selectedModal.type === "vitals" &&
            (() => {
              const vital = selectedModal.data as VitalSigns;
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Patient</Label>
                      <p>{vital.patientName}</p>
                    </div>
                    <div>
                      <Label>Recorded By</Label>
                      <p>{vital.recordedBy}</p>
                    </div>
                    <div>
                      <Label>Date & Time</Label>
                      <p>{new Date(vital.recordedAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded">
                      <Label>Temperature</Label>
                      <p className="text-lg">{vital.temperature}</p>
                    </div>
                    <div className="p-4 border rounded">
                      <Label>Blood Pressure</Label>
                      <p className="text-lg">
                        {vital.bloodPressureSystolic}/
                        {vital.bloodPressureDiastolic} mmHg
                      </p>
                    </div>
                    <div className="p-4 border rounded">
                      <Label>Heart Rate</Label>
                      <p className="text-lg">{vital.heartRate} bpm</p>
                    </div>
                    <div className="p-4 border rounded">
                      <Label>Respiratory Rate</Label>
                      <p className="text-lg">{vital.respiratoryRate}/min</p>
                    </div>
                    <div className="p-4 border rounded">
                      <Label>O2 Saturation</Label>
                      <p className="text-lg">{vital.oxygenSaturation}%</p>
                    </div>
                    {vital.painLevel !== undefined && (
                      <div className="p-4 border rounded">
                        <Label>Pain Level</Label>
                        <p className="text-lg">{vital.painLevel}/10</p>
                      </div>
                    )}
                  </div>

                  {vital.notes && (
                    <div>
                      <Label>Clinical Notes</Label>
                      <p className="mt-1 p-3 bg-slate-50 rounded">
                        {vital.notes}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

          {selectedModal.data &&
            selectedModal.type === "lab" &&
            (() => {
              const lab = selectedModal.data as LabResult;
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Patient</Label>
                      <p>{lab.patientName}</p>
                    </div>
                    <div>
                      <Label>Test Name</Label>
                      <p>{lab.testName}</p>
                    </div>
                    <div>
                      <Label>Test Type</Label>
                      <p>{lab.testType}</p>
                    </div>
                    <div>
                      <Label>Ordered By</Label>
                      <p>{lab.orderedBy}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={getStatusColor(lab.status)}>
                        {lab.status}
                      </Badge>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Badge
                        variant="outline"
                        className={getPriorityColor(lab.priority)}
                      >
                        {lab.priority}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {lab.results && (
                    <div>
                      <Label>Results</Label>
                      <p className="mt-1 p-3 bg-slate-50 rounded">
                        {lab.results}
                      </p>
                    </div>
                  )}

                  {lab.normalRange && (
                    <div>
                      <Label>Normal Range</Label>
                      <p className="mt-1 p-3 bg-green-50 rounded">
                        {lab.normalRange}
                      </p>
                    </div>
                  )}

                  {lab.notes && (
                    <div>
                      <Label>Notes</Label>
                      <p className="mt-1 p-3 bg-slate-50 rounded">
                        {lab.notes}
                      </p>
                    </div>
                  )}

                  {lab.flagged && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded">
                      <div className="flex items-center space-x-2 text-red-800">
                        <AlertTriangle className="h-5 w-5" />
                        <span>This result has been flagged for attention</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          {selectedModal.data &&
            selectedModal.type === "diagnosis" &&
            (() => {
              const diagnosis = selectedModal.data as Diagnosis;
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Patient</Label>
                      <p>{diagnosis.patientName}</p>
                    </div>
                    <div>
                      <Label>Diagnosis Code</Label>
                      <p>{diagnosis.diagnosisCode}</p>
                    </div>
                    <div>
                      <Label>Diagnosis Name</Label>
                      <p>{diagnosis.diagnosisName}</p>
                    </div>
                    <div>
                      <Label>Type</Label>
                      <p>{diagnosis.type}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={getStatusColor(diagnosis.status)}>
                        {diagnosis.status}
                      </Badge>
                    </div>
                    <div>
                      <Label>Severity</Label>
                      <Badge
                        variant="outline"
                        className={getSeverityColor(diagnosis.severity)}
                      >
                        {diagnosis.severity}
                      </Badge>
                    </div>
                    <div>
                      <Label>Diagnosed By</Label>
                      <p>{diagnosis.diagnosedBy}</p>
                    </div>
                    <div>
                      <Label>Date</Label>
                      <p>
                        {new Date(diagnosis.diagnosedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {diagnosis.notes && (
                    <div>
                      <Label>Clinical Notes</Label>
                      <p className="mt-1 p-3 bg-slate-50 rounded">
                        {diagnosis.notes}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

          {selectedModal.data &&
            selectedModal.type === "treatment" &&
            (() => {
              const treatment = selectedModal.data as TreatmentPlan;
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Patient</Label>
                      <p>{treatment.patientName}</p>
                    </div>
                    <div>
                      <Label>Plan Name</Label>
                      <p>{treatment.planName}</p>
                    </div>
                    <div>
                      <Label>Created By</Label>
                      <p>{treatment.createdBy}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={getStatusColor(treatment.status)}>
                        {treatment.status}
                      </Badge>
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <p>
                        {new Date(treatment.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    {treatment.endDate && (
                      <div>
                        <Label>End Date</Label>
                        <p>
                          {new Date(treatment.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">
                        Goals
                      </Label>
                      <ul className="space-y-2">
                        {treatment.goals.map((goal, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                            <span className="text-sm">{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">
                        Interventions
                      </Label>
                      <ul className="space-y-2">
                        {treatment.interventions.map((intervention, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                            <span className="text-sm">{intervention}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                      Medications
                    </Label>
                    <ul className="space-y-2">
                      {treatment.medications.map((medication, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Pill className="h-4 w-4 text-orange-500 mt-0.5" />
                          <span className="text-sm">{medication}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <Label>Follow-up Instructions</Label>
                    <p className="mt-1 p-3 bg-slate-50 rounded">
                      {treatment.followUpInstructions}
                    </p>
                  </div>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
