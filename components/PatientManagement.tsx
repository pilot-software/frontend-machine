import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { calculateAge, safeDateToString } from '@/lib/utils/dateUtils';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { PatientFormModal } from "./PatientFormModal";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useAppData } from "../lib/hooks/useAppData";
import { FilterDropdown } from "./FilterDropdown";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  FileText,
  Plus,
  Search,
  Stethoscope,
  Thermometer,
  UserPlus,
} from "lucide-react";
import { Doctor, Patient } from "@/lib/types";

interface Visit {
  id: string;
  date: string;
  time: string;
  type: "Emergency" | "Routine" | "Follow-up" | "Consultation";
  doctor: string;
  department: string;
  chiefComplaint: string;
  diagnosis: string;
  treatment: string;
  vitalSigns: {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    respiratoryRate: string;
    oxygenSaturation: string;
  };
  notes: string;
  status: "Completed" | "In Progress" | "Cancelled";
  duration: string;
}

interface VisitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit | null;
}

function VisitDetailsModal({ isOpen, onClose, visit }: VisitDetailsModalProps) {
  if (!visit) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Emergency":
        return "bg-red-100 text-red-800";
      case "Routine":
        return "bg-blue-100 text-blue-800";
      case "Follow-up":
        return "bg-green-100 text-green-800";
      case "Consultation":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[800px] h-[600px] max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Visit Details - {visit.date}</span>
          </DialogTitle>
          <DialogDescription>
            Complete visit information and medical records
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Visit Overview */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Visit Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <Badge className={getTypeColor(visit.type)}>
                    {visit.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className={getStatusColor(visit.status)}>
                    {visit.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Date & Time:</span>
                  <span className="text-sm">
                    {visit.date} at {visit.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm">{visit.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Doctor:</span>
                  <span className="text-sm">{visit.doctor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Department:</span>
                  <span className="text-sm">{visit.department}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Thermometer className="h-4 w-4" />
                  <span>Vital Signs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Temperature:</span>
                  <span className="text-sm">
                    {visit.vitalSigns.temperature}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Blood Pressure:</span>
                  <span className="text-sm">
                    {visit.vitalSigns.bloodPressure}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Heart Rate:</span>
                  <span className="text-sm">{visit.vitalSigns.heartRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Respiratory Rate:
                  </span>
                  <span className="text-sm">
                    {visit.vitalSigns.respiratoryRate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">O2 Saturation:</span>
                  <span className="text-sm">
                    {visit.vitalSigns.oxygenSaturation}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Medical Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Stethoscope className="h-4 w-4" />
                <span>Medical Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Chief Complaint
                </Label>
                <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded">
                  {visit.chiefComplaint}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Diagnosis
                </Label>
                <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded">
                  {visit.diagnosis}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Treatment
                </Label>
                <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded">
                  {visit.treatment}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Additional Notes
                </Label>
                <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded">
                  {visit.notes}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PatientManagement() {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedPatientId, setSelectedPatientId] = useState<
    string | undefined
  >();
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const { patients, stats, loading } = useAppData();

  const quickStats = [
    {
      label: "Total Patients",
      value: stats?.totalPatients?.toString() || "0",
      change: "+12%",
      icon: UserPlus,
      color: "text-blue-600",
    },
    {
      label: "New This Month",
      value: stats?.newPatientsThisMonth?.toString() || "0",
      change: "+23%",
      icon: Plus,
      color: "text-green-600",
    },
    {
      label: "Critical Cases",
      value: stats?.criticalCases?.toString() || "0",
      change: "-8%",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      label: "Discharged Today",
      value: stats?.dischargedToday?.toString() || "0",
      change: "+2%",
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
  ];

  const handleSearch = async (term: string) => {
    // Search functionality can be implemented with Redux actions if needed
    console.log("Search term:", term);
  };

  // Transform API patients to display format
  const patientsList = patients || [];
  const allPatients = (Array.isArray(patientsList) ? patientsList : []).map(
    (patient: Patient) => {
      //   const assignedDoctorDetails = [].find(
      //     (doctor: Doctor) => doctor.id === patient.assignedDoctor
      //   );
      return {
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        age: calculateAge(patient.dateOfBirth),
        caseNumber: patient.id.substring(0, 8).toUpperCase(),
        status: "Active",
        lastVisit: safeDateToString(patient.updatedAt, new Date().toISOString().split("T")[0]),
        doctor: "Dr. Assigned",
        condition: patient.chronicConditions || "General Care",
        department: "Cardiology", // Default department
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
      };
    }
  );

  // Apply filters and search
  const recentPatients = allPatients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = Object.entries(activeFilters).every(([key, value]) => {
      switch (key) {
        case 'status':
          return patient.status === value;
        case 'department':
          return patient.department === value;
        default:
          return true;
      }
    });

    return matchesSearch && matchesFilters;
  });

  // Sample visit data for patients
  const patientVisits = {
    "1": [
      {
        id: "v1",
        date: "2024-07-22",
        time: "10:30 AM",
        type: "Routine" as const,
        doctor: "Dr. Sarah Johnson",
        department: "Cardiology",
        chiefComplaint:
          "Follow-up for hypertension management and medication adjustment",
        diagnosis: "Essential Hypertension - Well controlled",
        treatment:
          "Continued current medication regimen. Lifestyle counseling provided.",
        vitalSigns: {
          temperature: "98.6°F (37°C)",
          bloodPressure: "128/82 mmHg",
          heartRate: "72 bpm",
          respiratoryRate: "16/min",
          oxygenSaturation: "99%",
        },
        notes:
          "Patient reports good compliance with medications. Blood pressure within target range. Continue current treatment plan and follow up in 3 months.",
        status: "Completed" as const,
        duration: "30 minutes",
      },
      {
        id: "v2",
        date: "2024-04-15",
        time: "2:15 PM",
        type: "Follow-up" as const,
        doctor: "Dr. Sarah Johnson",
        department: "Cardiology",
        chiefComplaint:
          "Hypertension follow-up, experiencing occasional headaches",
        diagnosis: "Essential Hypertension with suboptimal control",
        treatment:
          "Increased dosage of ACE inhibitor. Added low-dose diuretic.",
        vitalSigns: {
          temperature: "98.4°F (36.9°C)",
          bloodPressure: "142/88 mmHg",
          heartRate: "76 bpm",
          respiratoryRate: "18/min",
          oxygenSaturation: "98%",
        },
        notes:
          "Blood pressure elevated. Medication adjustment made. Patient counseled on diet and exercise. Follow-up in 6 weeks.",
        status: "Completed" as const,
        duration: "25 minutes",
      },
      {
        id: "v3",
        date: "2024-01-10",
        time: "11:00 AM",
        type: "Routine" as const,
        doctor: "Dr. Sarah Johnson",
        department: "Cardiology",
        chiefComplaint: "Annual cardiovascular risk assessment",
        diagnosis: "Essential Hypertension - Newly diagnosed",
        treatment:
          "Started on ACE inhibitor. Lifestyle modifications discussed.",
        vitalSigns: {
          temperature: "98.8°F (37.1°C)",
          bloodPressure: "146/92 mmHg",
          heartRate: "78 bpm",
          respiratoryRate: "16/min",
          oxygenSaturation: "99%",
        },
        notes:
          "Initial diagnosis of hypertension. Patient educated on condition and treatment plan. Laboratory tests ordered.",
        status: "Completed" as const,
        duration: "45 minutes",
      },
    ],
    "2": [
      {
        id: "v4",
        date: "2024-07-22",
        time: "8:45 AM",
        type: "Emergency" as const,
        doctor: "Dr. Michael Chen",
        department: "Emergency Medicine",
        chiefComplaint: "Severe chest pain, shortness of breath, nausea",
        diagnosis: "Acute ST-Elevation Myocardial Infarction (STEMI)",
        treatment:
          "Emergency PCI performed. Stent placement. Started on dual antiplatelet therapy.",
        vitalSigns: {
          temperature: "99.2°F (37.3°C)",
          bloodPressure: "90/60 mmHg",
          heartRate: "110 bpm",
          respiratoryRate: "22/min",
          oxygenSaturation: "94%",
        },
        notes:
          "Patient presented with acute STEMI. Successful primary PCI with stent placement. Currently in CCU for monitoring.",
        status: "Completed" as const,
        duration: "2 hours 30 minutes",
      },
    ],
    "3": [
      {
        id: "v5",
        date: "2024-07-21",
        time: "1:00 PM",
        type: "Follow-up" as const,
        doctor: "Dr. Emily Rodriguez",
        department: "Orthopedics",
        chiefComplaint: "Post-operative follow-up for knee replacement surgery",
        diagnosis: "Status post total knee arthroplasty - healing well",
        treatment: "Continued physical therapy. Pain management adjusted.",
        vitalSigns: {
          temperature: "98.2°F (36.8°C)",
          bloodPressure: "135/85 mmHg",
          heartRate: "68 bpm",
          respiratoryRate: "16/min",
          oxygenSaturation: "99%",
        },
        notes:
          "Surgical site healing well. Range of motion improving. Patient progressing as expected with rehabilitation.",
        status: "Completed" as const,
        duration: "20 minutes",
      },
      {
        id: "v6",
        date: "2024-06-10",
        time: "9:30 AM",
        type: "Routine" as const,
        doctor: "Dr. Emily Rodriguez",
        department: "Orthopedics",
        chiefComplaint: "Severe knee pain, difficulty walking",
        diagnosis: "Severe osteoarthritis of the right knee",
        treatment:
          "Total knee replacement surgery scheduled. Pre-operative workup completed.",
        vitalSigns: {
          temperature: "98.6°F (37°C)",
          bloodPressure: "140/88 mmHg",
          heartRate: "70 bpm",
          respiratoryRate: "16/min",
          oxygenSaturation: "99%",
        },
        notes:
          "Patient candidate for total knee replacement. Surgery scheduled for next week. Pre-operative instructions provided.",
        status: "Completed" as const,
        duration: "35 minutes",
      },
    ],
  };

  const getPatientVisits = (patientId: string) => {
    return patientVisits[patientId as keyof typeof patientVisits] || [];
  };

  const getRecentVisits = (patientId: string) => {
    const visits = getPatientVisits(patientId);
    return visits.filter((visit) => {
      const visitDate = new Date(visit.date);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return visitDate >= threeMonthsAgo;
    });
  };

  const getPastVisits = (patientId: string) => {
    const visits = getPatientVisits(patientId);
    return visits.filter((visit) => {
      const visitDate = new Date(visit.date);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return visitDate < threeMonthsAgo;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "critical":
        return "bg-red-100 text-red-800";
      case "recovering":
        return "bg-yellow-100 text-yellow-800";
      case "discharged":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Patient Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Comprehensive patient care and record management
          </p>
        </div>
        <Button
          onClick={() => {
            setModalMode("add");
            setSelectedPatientId(undefined);
            setIsPatientModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-3 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-lg md:text-2xl font-semibold text-foreground mt-1">
                      {stat.value}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <Icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Patient Management Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Patient Overview</TabsTrigger>
          <TabsTrigger value="admissions">Admissions</TabsTrigger>
          <TabsTrigger value="discharge">Discharge Planning</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients by name, case number, or condition..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    className="pl-10"
                  />
                </div>
                <div className="flex justify-end">
                  <FilterDropdown
                    filters={[
                      {
                        key: 'status',
                        label: 'Status',
                        options: [
                          { value: 'Active', label: 'Active' },
                          { value: 'Critical', label: 'Critical' },
                          { value: 'Recovering', label: 'Recovering' },
                          { value: 'Discharged', label: 'Discharged' },
                        ]
                      },
                      {
                        key: 'department',
                        label: 'Department',
                        options: [
                          { value: 'Cardiology', label: 'Cardiology' },
                          { value: 'Emergency', label: 'Emergency' },
                          { value: 'Orthopedics', label: 'Orthopedics' },
                          { value: 'Pediatrics', label: 'Pediatrics' },
                        ]
                      }
                    ]}
                    activeFilters={activeFilters}
                    onFilterChange={setActiveFilters}
                    onClearFilters={() => setActiveFilters({})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>
                Latest patient admissions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading.patients || loading.stats ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-sm text-muted-foreground">
                    Loading patients...
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentPatients.map((patient) => (
                    <div key={patient.id} className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={patient.avatar}
                              alt={patient.name}
                            />
                            <AvatarFallback>
                              {patient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{patient.name}</h3>
                              <Badge className={getStatusColor(patient.status)}>
                                {patient.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Case: {patient.caseNumber} • Age: {patient.age} •{" "}
                              {patient.condition}
                            </p>
                            <p className="text-sm text-muted-foreground opacity-70">
                              Dr. {patient.doctor} • Last visit:{" "}
                              {patient.lastVisit}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setModalMode("view");
                              setSelectedPatientId(patient.id);
                              setIsPatientModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setModalMode("edit");
                              setSelectedPatientId(patient.id);
                              setIsPatientModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Visit History */}
                      <div className="ml-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Recent Visits */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Recent Visits (
                              {getRecentVisits(patient.id).length})
                            </h4>
                            <div className="space-y-2">
                              {getRecentVisits(patient.id)
                                .slice(0, 2)
                                .map((visit) => (
                                  <div
                                    key={visit.id}
                                    className="bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => {
                                      setSelectedVisit(visit);
                                      setIsVisitModalOpen(true);
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium">
                                        {visit.date}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {visit.type}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {visit.chiefComplaint}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {visit.doctor}
                                    </p>
                                  </div>
                                ))}
                              {getRecentVisits(patient.id).length === 0 && (
                                <p className="text-xs text-gray-500">
                                  No recent visits
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Past Visits */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Past Visits ({getPastVisits(patient.id).length})
                            </h4>
                            <div className="space-y-2">
                              {getPastVisits(patient.id)
                                .slice(0, 2)
                                .map((visit) => (
                                  <div
                                    key={visit.id}
                                    className="bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => {
                                      setSelectedVisit(visit);
                                      setIsVisitModalOpen(true);
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium">
                                        {visit.date}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {visit.type}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {visit.chiefComplaint}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {visit.doctor}
                                    </p>
                                  </div>
                                ))}
                              {getPastVisits(patient.id).length === 0 && (
                                <p className="text-xs text-gray-500">
                                  No past visits
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentPatients.length === 0 && !loading.patients && (
                    <div className="text-center py-8 text-muted-foreground">
                      No patients found
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admissions">
          <Card>
            <CardHeader>
              <CardTitle>Patient Admissions</CardTitle>
              <CardDescription>
                Manage patient admissions and bed assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Admissions management interface will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discharge">
          <Card>
            <CardHeader>
              <CardTitle>Discharge Planning</CardTitle>
              <CardDescription>
                Plan and coordinate patient discharges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Discharge planning interface will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>
                Access and manage patient medical records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Medical records interface will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Patient Form Modal */}
      <PatientFormModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        patientId={selectedPatientId}
        mode={modalMode}
      />

      {/* Visit Details Modal */}
      <VisitDetailsModal
        isOpen={isVisitModalOpen}
        onClose={() => {
          setIsVisitModalOpen(false);
          setSelectedVisit(null);
        }}
        visit={selectedVisit}
      />
    </div>
  );
}
