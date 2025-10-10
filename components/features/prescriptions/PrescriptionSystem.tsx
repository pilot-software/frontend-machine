import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsCard, StatsCardGrid } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Stethoscope,
} from "lucide-react";
import { useApi } from "@/lib/hooks/useApi";
import { useAuth } from "@/components/providers/AuthContext";
import { useRouter } from "next/navigation";

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
  status: "active" | "completed" | "cancelled" | "pending";
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
    id: "1",
    name: "Lisinopril",
    genericName: "Lisinopril",
    category: "ACE Inhibitor",
    strength: ["2.5mg", "5mg", "10mg", "20mg"],
    form: "Tablet",
    contraindications: ["Pregnancy", "Angioedema history"],
    sideEffects: ["Dry cough", "Dizziness", "Hyperkalemia"],
  },
  {
    id: "2",
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    category: "Antibiotic",
    strength: ["250mg", "500mg", "875mg"],
    form: "Capsule",
    contraindications: ["Penicillin allergy"],
    sideEffects: ["Nausea", "Diarrhea", "Rash"],
  },
  {
    id: "3",
    name: "Metformin",
    genericName: "Metformin Hydrochloride",
    category: "Antidiabetic",
    strength: ["500mg", "850mg", "1000mg"],
    form: "Tablet",
    contraindications: ["Kidney disease", "Heart failure"],
    sideEffects: ["GI upset", "Lactic acidosis", "Vitamin B12 deficiency"],
  },
];

export function PrescriptionSystem() {
  const t = useTranslations("common");
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("patient_2");
  const [medicalData, setMedicalData] = useState<any>(null);

  const { loading } = useApi();
  const { execute: fetchMedicalData, loading: medicalLoading } = useApi();

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
  const mockPrescriptions = (
    Array.isArray(prescriptionsList) ? prescriptionsList : []
  ).map((rx: any) => ({
    id: rx.id,
    patientName: medicalData?.patient
      ? `${medicalData.patient.firstName} ${medicalData.patient.lastName}`
      : "Patient Name",
    patientId: rx.patientId,
    doctorName: "Doctor Name",
    medication: rx.medicationName,
    dosage: rx.dosage,
    frequency: rx.frequency,
    duration: rx.duration,
    quantity: 0,
    refills: rx.refillsRemaining,
    status: rx.status.toLowerCase(),
    dateIssued: rx.createdAt,
    instructions: rx.instructions || "No instructions",
    pharmacy: "Pharmacy Name",
  }));

  const prescriptionStats = [
    {
      label: "Active Prescriptions",
      value: "1,234",
      icon: PillBottle,
      color: "text-blue-600",
    },
    {
      label: "Pending Approval",
      value: "23",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      label: "Filled Today",
      value: "89",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      label: "Refill Requests",
      value: "45",
      icon: AlertTriangle,
      color: "text-purple-600",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return CheckCircle2;
      case "completed":
        return CheckCircle2;
      case "cancelled":
        return AlertTriangle;
      case "pending":
        return Clock;
      default:
        return Clock;
    }
  };

  const filteredPrescriptions = mockPrescriptions.filter(
    (prescription: any) =>
      prescription.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.medication
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Prescription System
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage prescriptions, medications, and pharmacy orders
          </p>
        </div>
        <Button onClick={() => router.push('/en/prescriptions/add')}>
          <Plus className="h-4 w-4 mr-2" />
          New Prescription
        </Button>
      </div>

      {/* Prescription Stats */}
      <StatsCardGrid>
        <StatsCard
          title="Active Prescriptions"
          value={1234}
          icon={PillBottle}
          color="text-blue-600"
          bgGradient="from-blue-500/10 to-blue-600/5"
        />
        <StatsCard
          title="Pending Approval"
          value={23}
          icon={Clock}
          color="text-orange-600"
          bgGradient="from-orange-500/10 to-orange-600/5"
        />
        <StatsCard
          title="Filled Today"
          value={89}
          icon={CheckCircle2}
          color="text-green-600"
          bgGradient="from-green-500/10 to-green-600/5"
        />
        <StatsCard
          title="Refill Requests"
          value={45}
          icon={AlertTriangle}
          color="text-purple-600"
          bgGradient="from-purple-500/10 to-purple-600/5"
        />
      </StatsCardGrid>

      {/* Prescription Management Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <div className="w-full overflow-x-auto">
          <TabsList className="inline-flex w-auto min-w-full bg-muted p-1">
            <TabsTrigger value="active" className="whitespace-nowrap">Active Prescriptions</TabsTrigger>
            <TabsTrigger value="pending" className="whitespace-nowrap">Pending Approval</TabsTrigger>
            <TabsTrigger value="medications" className="whitespace-nowrap">Medication Database</TabsTrigger>
            <TabsTrigger value="interactions" className="whitespace-nowrap">Drug Interactions</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="space-y-6">
          {/* Patient Selection and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search prescriptions by patient, medication, or doctor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={selectedPatient}
                    onValueChange={handlePatientChange}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient_2">
                        Bob Wilson (patient_2)
                      </SelectItem>
                      <SelectItem value="patient_4">
                        David Miller (patient_4)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    All Status
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    This Month
                  </Button>
                  <Button variant="outline" size="sm">
                    <Stethoscope className="h-4 w-4 mr-2" />
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
                  <div className="text-sm text-muted-foreground">
                    Loading prescriptions...
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("patient")}</TableHead>
                      <TableHead>{t("medication")}</TableHead>
                      <TableHead>Dosage & Frequency</TableHead>
                      <TableHead>{t("doctor")}</TableHead>
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
                              <p className="font-medium">
                                {prescription.patientName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {prescription.patientId}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {prescription.medication}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {prescription.dosage}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{prescription.frequency}</p>
                              <p className="text-sm text-muted-foreground">
                                for {prescription.duration}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{prescription.doctorName}</TableCell>
                          <TableCell>{prescription.quantity}</TableCell>
                          <TableCell>{prescription.refills}</TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(prescription.status)}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {prescription.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{prescription.pharmacy}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Printer className="h-4 w-4" />
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
              <p className="text-muted-foreground">
                Pending prescriptions will be displayed here.
              </p>
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
                  <div
                    key={medication.id}
                    className="p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{medication.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Generic: {medication.genericName}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline">{medication.category}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {medication.form}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Strengths: {medication.strength.join(", ")}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
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
              <p className="text-muted-foreground">
                Drug interaction checker will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
