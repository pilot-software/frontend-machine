import { useMemo } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import { usePatientData } from "@/lib/hooks/usePatientData";
import { ROLES } from "@/lib/constants";

export function useClinicalData<T extends { patientId: string; patientName: string }>(
  data: T[],
  searchTerm: string,
  selectedPatient: string
) {
  const { user } = useAuth();
  const appPatients = usePatientData();

  return useMemo(() => {
    let filtered = data;

    // Role-based filtering
    if (user?.role === ROLES.DOCTOR) {
      const myPatientIds = new Set(
        appPatients
          .filter((p) => String(p.assignedDoctorId) === String(user.id))
          .map((p) => p.id)
      );
      filtered = filtered.filter((item) => myPatientIds.has(item.patientId));
    } else if (user?.role === ROLES.PATIENT) {
      filtered = filtered.filter((item) =>
        item.patientName.includes(user.name || "")
      );
    }

    // Patient filtering
    if (selectedPatient !== "all") {
      filtered = filtered.filter((item) => item.patientId === selectedPatient);
    }

    // Search filtering
    if (searchTerm) {
      filtered = filtered.filter((item) => {
        const itemName = item.patientName.toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        if (itemName.includes(searchLower)) return true;

        if ("testName" in item && typeof (item as any).testName === "string") {
          return (item as any).testName.toLowerCase().includes(searchLower);
        }
        if ("diagnosisName" in item && typeof (item as any).diagnosisName === "string") {
          return (item as any).diagnosisName.toLowerCase().includes(searchLower);
        }
        if ("planName" in item && typeof (item as any).planName === "string") {
          return (item as any).planName.toLowerCase().includes(searchLower);
        }

        return false;
      });
    }

    return filtered;
  }, [data, user, searchTerm, selectedPatient, appPatients]);
}
