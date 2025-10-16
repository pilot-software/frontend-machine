import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle2, Activity, Pill } from "lucide-react";
import { useTranslations } from "next-intl";
import { ClinicalModalState, VitalSigns, LabResult, Diagnosis, TreatmentPlan } from "../types/clinical.types";
import { getStatusColor, getPriorityColor, getSeverityColor } from "../utils/clinicalHelpers";

interface ClinicalDetailModalProps {
  modal: ClinicalModalState;
  onClose: () => void;
}

export const ClinicalDetailModal = React.memo<ClinicalDetailModalProps>(({ modal, onClose }) => {
  const t = useTranslations("common");

  return (
    <Dialog open={modal.isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {modal.type === "vitals" && "Vital Signs Details"}
            {modal.type === "lab" && "Lab Result Details"}
            {modal.type === "diagnosis" && "Diagnosis Details"}
            {modal.type === "treatment" && "Treatment Plan Details"}
          </DialogTitle>
          <DialogDescription>Detailed view of {modal.type} record</DialogDescription>
        </DialogHeader>

        {modal.data && modal.type === "vitals" && (() => {
          const vital = modal.data as VitalSigns;
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("patient")}</Label>
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
                  <p className="text-lg">{vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic} mmHg</p>
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
                  <p className="mt-1 p-3 bg-slate-50 rounded">{vital.notes}</p>
                </div>
              )}
            </div>
          );
        })()}

        {modal.data && modal.type === "lab" && (() => {
          const lab = modal.data as LabResult;
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("patient")}</Label>
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
                  <Badge className={getStatusColor(lab.status)}>{lab.status}</Badge>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge variant="outline" className={getPriorityColor(lab.priority)}>{lab.priority}</Badge>
                </div>
              </div>

              <Separator />

              {lab.results && (
                <div>
                  <Label>Results</Label>
                  <p className="mt-1 p-3 bg-slate-50 rounded">{lab.results}</p>
                </div>
              )}

              {lab.normalRange && (
                <div>
                  <Label>Normal Range</Label>
                  <p className="mt-1 p-3 bg-green-50 rounded">{lab.normalRange}</p>
                </div>
              )}

              {lab.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="mt-1 p-3 bg-slate-50 rounded">{lab.notes}</p>
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

        {modal.data && modal.type === "diagnosis" && (() => {
          const diagnosis = modal.data as Diagnosis;
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("patient")}</Label>
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
                  <Badge className={getStatusColor(diagnosis.status)}>{diagnosis.status}</Badge>
                </div>
                <div>
                  <Label>Severity</Label>
                  <Badge variant="outline" className={getSeverityColor(diagnosis.severity)}>{diagnosis.severity}</Badge>
                </div>
                <div>
                  <Label>Diagnosed By</Label>
                  <p>{diagnosis.diagnosedBy}</p>
                </div>
                <div>
                  <Label>Date</Label>
                  <p>{new Date(diagnosis.diagnosedDate).toLocaleDateString()}</p>
                </div>
              </div>

              <Separator />

              {diagnosis.notes && (
                <div>
                  <Label>Clinical Notes</Label>
                  <p className="mt-1 p-3 bg-slate-50 rounded">{diagnosis.notes}</p>
                </div>
              )}
            </div>
          );
        })()}

        {modal.data && modal.type === "treatment" && (() => {
          const treatment = modal.data as TreatmentPlan;
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("patient")}</Label>
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
                  <Badge className={getStatusColor(treatment.status)}>{treatment.status}</Badge>
                </div>
                <div>
                  <Label>Start Date</Label>
                  <p>{new Date(treatment.startDate).toLocaleDateString()}</p>
                </div>
                {treatment.endDate && (
                  <div>
                    <Label>End Date</Label>
                    <p>{new Date(treatment.endDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Goals</Label>
                  <ul className="space-y-2">
                    {treatment.goals.map((goal, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Interventions</Label>
                  <ul className="space-y-2">
                    {treatment.interventions.map((intervention, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span className="text-sm">{intervention}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700 mb-2 block">Medications</Label>
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
                <p className="mt-1 p-3 bg-slate-50 rounded">{treatment.followUpInstructions}</p>
              </div>
            </div>
          );
        })()}
      </DialogContent>
    </Dialog>
  );
});

ClinicalDetailModal.displayName = "ClinicalDetailModal";
