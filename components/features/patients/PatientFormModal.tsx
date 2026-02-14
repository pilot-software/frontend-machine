import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import { Activity, Calendar, Heart, PillBottle, Save, Thermometer, User } from "lucide-react";
import { PatientFormModalProps } from "./form/types/patient-form.types";
import { usePatientForm } from "./form/hooks/usePatientForm";
import { PatientBasicInfoTab } from "./form/components/PatientBasicInfoTab";
import { PatientConditionsTab, PatientPrescriptionsTab, PatientVitalsTab, PatientLabsTab } from "./form/components/PatientMedicalTabs";

export function PatientFormModal({ isOpen, onClose, patientId, mode }: PatientFormModalProps) {
  const t = useTranslations("common");
  const [activeTab, setActiveTab] = useState("basic");
  
  const {
    patientData,
    medicalData,
    doctors,
    loading,
    loadingMedical,
    error,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  } = usePatientForm(isOpen, patientId, mode);

  const isReadOnly = mode === "view";
  const isEditing = mode === "edit";
  const isAdding = mode === "add";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[800px] max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>
              {isAdding ? t("addNewPatient") : isEditing ? t("editPatientInformation") : t("patientInformation")}
            </span>
          </DialogTitle>
          <DialogDescription>
            {isAdding ? t("enterPatientDetails") : isEditing ? t("updatePatientInfo") : t("completePatientInfo")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {isReadOnly && patientData.firstName && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={`https://images.unsplash.com/photo-${
                        patientData.gender === "MALE" ? "1472099645785-5658abf4ff4e" : "1494790108755-2616b612b590"
                      }?w=200&h=200&fit=crop&crop=face`}
                      alt={`${patientData.firstName} ${patientData.lastName}`}
                    />
                    <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-800">
                      {patientData.firstName?.[0]}{patientData.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {patientData.firstName} {patientData.lastName}
                      </h3>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>DOB: {patientData.dateOfBirth}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>ID: {patientId || "NEW"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{t("basicInfo")}</span>
              </TabsTrigger>
              <TabsTrigger value="conditions" className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>{t("conditions")}</span>
              </TabsTrigger>
              <TabsTrigger value="prescriptions" className="flex items-center space-x-2">
                <PillBottle className="h-4 w-4" />
                <span>{t("prescriptions")}</span>
              </TabsTrigger>
              <TabsTrigger value="vitals" className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4" />
                <span>{t("vitals")}</span>
              </TabsTrigger>
              <TabsTrigger value="labs" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>{t("labResults")}</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 space-y-4">
              {loading.selectedPatient ? (
                <div className="py-8">
                  <Loader text="Loading patient data..." />
                </div>
              ) : error.selectedPatient ? (
                <div className="flex items-center justify-center py-8 text-red-600">
                  <span>Error: {error.selectedPatient}</span>
                </div>
              ) : (
                <>
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <PatientBasicInfoTab
                      patientData={patientData}
                      doctors={doctors}
                      isReadOnly={isReadOnly}
                      onInputChange={handleInputChange}
                    />
                  </TabsContent>

                  <TabsContent value="conditions" className="space-y-4">
                    <PatientConditionsTab medicalData={medicalData} loading={loadingMedical} />
                  </TabsContent>

                  <TabsContent value="prescriptions" className="space-y-4">
                    <PatientPrescriptionsTab medicalData={medicalData} loading={loadingMedical} />
                  </TabsContent>

                  <TabsContent value="vitals" className="space-y-4">
                    <PatientVitalsTab medicalData={medicalData} loading={loadingMedical} />
                  </TabsContent>

                  <TabsContent value="labs" className="space-y-4">
                    <PatientLabsTab medicalData={medicalData} loading={loadingMedical} />
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </div>

        <div className="flex justify-between items-center pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose}>{t("cancel")}</Button>
          {!isReadOnly && (
            <Button onClick={() => handleSubmit(onClose)} disabled={isSubmitting || loading.updating}>
              {isSubmitting || loading.updating ? (
                <>
                  <Loader size="sm" className="border-white mr-2" />
                  {isAdding ? t("creating") : t("saving")}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isAdding ? t("createPatient") : t("saveChanges")}
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
