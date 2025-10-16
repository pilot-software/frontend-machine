import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ROLES } from "@/lib/constants";
import { PatientFormModal } from "@/components/features/patients/PatientFormModal";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppData } from "@/lib/hooks/useAppData";
import { useAuth } from "@/components/providers/AuthContext";
import { useModal } from "@/lib/hooks/useModal";
import { transformPatientToDisplay } from "@/lib/utils/data-transformers";
import { PatientStats } from "./PatientStats";
import { PatientDataTable } from "./PatientDataTable";
import { AnimatedAddPrompt } from "@/components/ui/animated-add-prompt";
import { Activity, Plus, Stethoscope, Thermometer } from "lucide-react";
import { Patient } from "@/lib/types";

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
  const router = useRouter();
  const { isOpen, mode, selectedId, openModal, closeModal } = useModal();
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const { patients, stats } = useAppData();

  const patientsList = patients || [];
  const { user } = useAuth();

  // If current user is a doctor, only include patients assigned to them
  const basePatients = (Array.isArray(patientsList) ? patientsList : []).filter(
    (patient: Patient) => {
      if (user?.role === ROLES.DOCTOR) {
        // patient.assignedDoctorId is canonical when available
        if (
          (patient as any).assignedDoctorId &&
          (patient as any).assignedDoctorId === user.id
        )
          return true;
        // patient.assignedDoctor might be an id string or an object { id }
        const rawAssigned = (patient as any).assignedDoctor;
        if (!rawAssigned) return false;
        if (typeof rawAssigned === "string") return rawAssigned === user.id;
        if (typeof rawAssigned === "object" && rawAssigned.id)
          return rawAssigned.id === user.id;
        return false;
      }
      return true;
    }
  );

  const allPatients = basePatients.map((patient: Patient) =>
    transformPatientToDisplay(patient)
  );

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

  const _getPatientVisits = (patientId: string) => {
    return patientVisits[patientId as keyof typeof patientVisits] || [];
  };

  // Visit helper functions (currently unused but kept for future features)
  // const getRecentVisits = (patientId: string) => {
  //   const visits = getPatientVisits(patientId);
  //   return visits.filter((visit) => {
  //     const visitDate = new Date(visit.date);
  //     const threeMonthsAgo = new Date();
  //     threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  //     return visitDate >= threeMonthsAgo;
  //   });
  // };

  // const getPastVisits = (patientId: string) => {
  //   const visits = getPatientVisits(patientId);
  //   return visits.filter((visit) => {
  //     const visitDate = new Date(visit.date);
  //     const threeMonthsAgo = new Date();
  //     threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  //     return visitDate < threeMonthsAgo;
  //   });
  // };

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
        <AnimatedAddPrompt
          text="Add New Patient"
          onClick={() => router.push("/en/patients/add")}
        />
      </div>

      <PatientStats stats={stats || {}} />

      {/* Patient List */}
      <Card>
        <CardContent className="p-0">
          <PatientDataTable
            patients={allPatients.map((p) => ({
              id: p.id,
              firstName: p.name.split(" ")[0] || "",
              lastName: p.name.split(" ").slice(1).join(" ") || "",
              email: p.email,
              phone: p.phone,
              dateOfBirth: p.dateOfBirth || "N/A",
              gender: p.gender || "N/A",
              status: p.status,
              caseNumber: p.caseNumber,
              assignedDoctor: p.assignedDoctor,
              department: p.department,
              lastVisit: p.lastVisit,
              avatar: p.avatar,
            }))}
            onViewPatient={(patient, origin) => {
              const locale = window.location.pathname.split('/')[1] || 'en';
              window.open(`/${locale}/patient/${patient.id}`, '_blank');
            }}
            onEditPatient={(id) => openModal("edit", id)}
          />
        </CardContent>
      </Card>

      <PatientFormModal
        isOpen={isOpen}
        onClose={closeModal}
        patientId={selectedId}
        mode={mode as any}
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
