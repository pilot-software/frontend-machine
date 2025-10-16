import { useMemo } from "react";
import { User, TestTube, AlertTriangle, FileText } from "lucide-react";
import { VitalSigns, LabResult, TreatmentPlan } from "../types/clinical.types";

export function useClinicalStats(
  vitals: VitalSigns[],
  labs: LabResult[],
  treatments: TreatmentPlan[]
) {
  return useMemo(() => [
    {
      label: "Active Patients",
      value: vitals.length.toString(),
      icon: User,
      color: "text-blue-600",
      change: "+3",
    },
    {
      label: "Pending Labs",
      value: labs.filter((lab) => lab.status === "In Progress" || lab.status === "Ordered").length.toString(),
      icon: TestTube,
      color: "text-orange-600",
      change: "+2",
    },
    {
      label: "Critical Results",
      value: labs.filter((lab) => lab.flagged).length.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
      change: "0",
    },
    {
      label: "Treatment Plans",
      value: treatments.filter((plan) => plan.status === "Active").length.toString(),
      icon: FileText,
      color: "text-green-600",
      change: "+1",
    },
  ], [vitals, labs, treatments]);
}
