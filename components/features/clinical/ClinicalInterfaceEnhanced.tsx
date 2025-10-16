import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, TestTube } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { ROLES } from "@/lib/constants";

// Import refactored components
import { ClinicalStats } from "./components/ClinicalStats";
import { VitalSignsTab } from "./components/VitalSignsTab";
import { LabResultsTab } from "./components/LabResultsTab";
import { DiagnosesTab } from "./components/DiagnosesTab";
import { TreatmentPlansTab } from "./components/TreatmentPlansTab";
import { ClinicalDetailModal } from "./components/ClinicalDetailModal";

// Import hooks
import { useClinicalData } from "./hooks/useClinicalData";
import { useClinicalStats } from "./hooks/useClinicalStats";
import { useClinicalModal } from "./hooks/useClinicalModal";

// Import data
import { mockVitalSigns, mockLabResults, mockDiagnoses, mockTreatmentPlans } from "./data/mockClinicalData";

export function ClinicalInterfaceEnhanced() {
  const t = useTranslations("common");
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string>("all");

  // Custom hooks
  const { modal, openModal, closeModal } = useClinicalModal();
  const filteredVitals = useClinicalData(mockVitalSigns, searchTerm, selectedPatient);
  const filteredLabs = useClinicalData(mockLabResults, searchTerm, selectedPatient);
  const filteredDiagnoses = useClinicalData(mockDiagnoses, searchTerm, selectedPatient);
  const filteredTreatments = useClinicalData(mockTreatmentPlans, searchTerm, selectedPatient);
  const stats = useClinicalStats(filteredVitals, mockLabResults, mockTreatmentPlans);

  const canAddClinicalData = user?.role === ROLES.DOCTOR || user?.role === ROLES.NURSE;
  const canViewAllPatients = user?.role === ROLES.ADMIN || user?.role === ROLES.DOCTOR || user?.role === ROLES.NURSE;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Clinical Interface</h2>
          <p>
            {user?.role === ROLES.PATIENT
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
      <ClinicalStats stats={stats} />

      {/* Clinical Management Tabs */}
      <Tabs defaultValue="vitals" className="w-full">
        <TabsList className="grid w-full lg:w-auto lg:inline-flex lg:h-10 grid-cols-5">
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="labs">{t("labResults")}</TabsTrigger>
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
                      user?.role === ROLES.PATIENT
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
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
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
          <VitalSignsTab
            vitals={filteredVitals}
            onView={(vital) => openModal("vitals", vital)}
            onEdit={canAddClinicalData ? (vital) => console.log("Edit", vital) : undefined}
            canEdit={canAddClinicalData}
          />
        </TabsContent>

        <TabsContent value="labs" className="space-y-6">
          <LabResultsTab labs={filteredLabs} onView={(lab) => openModal("lab", lab)} />
        </TabsContent>

        <TabsContent value="diagnoses" className="space-y-6">
          <DiagnosesTab diagnoses={filteredDiagnoses} />
        </TabsContent>

        <TabsContent value="treatments" className="space-y-6">
          <TreatmentPlansTab plans={filteredTreatments} />
        </TabsContent>

        <TabsContent value="imaging">
          <Card>
            <CardContent className="p-6">
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
      <ClinicalDetailModal modal={modal} onClose={closeModal} />
    </div>
  );
}
