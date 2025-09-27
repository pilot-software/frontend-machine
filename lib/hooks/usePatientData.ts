import { useMemo } from "react";
import { useAppData } from "./useAppData";
import { Doctor, Patient } from "@/lib/types";
import { safeDateToString } from "@/lib/utils/dateUtils";

export function usePatientData() {
  const { doctors: doctorsData, patients: patientsData } = useAppData();

  return useMemo(() => {
    if (!Array.isArray(patientsData)) return [];

    return patientsData.map((patient: Patient) => {
      // API may return assignedDoctor as an id string or as an object { id, name }
      const rawAssigned: any =
        (patient as any).assignedDoctor ??
        (patient as any).assignedDoctorId ??
        (patient as any).primaryDoctorId ??
        (patient as any).doctorId;

      const assignedIdFromRaw =
        typeof rawAssigned === "string" ? rawAssigned : rawAssigned?.id;
      const assignedNameFromRaw =
        typeof rawAssigned === "object"
          ? rawAssigned?.name
          : (patient as any).assignedDoctorName || undefined;

      const assignedDoctorDetails = doctorsData.find(
        (doctor: Doctor) => doctor.id === assignedIdFromRaw
      );

      return {
        id: patient.id,
        caseNumber: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email || "N/A",
        phone: patient.phone || "N/A",
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender?.toLowerCase() || "other",
        address: patient.address || "N/A",
        emergencyContact: patient.emergencyContactPhone || "N/A",
        lastVisit: safeDateToString(
          patient.updatedAt,
          new Date().toISOString().split("T")[0]
        ),
        status: (patient.status as string) || "active",
        assignedDoctor: assignedDoctorDetails?.name || assignedNameFromRaw,
        assignedDoctorId: assignedDoctorDetails?.id || assignedIdFromRaw,
        department: patient.department || "General",
        insurance: patient.insuranceProvider || patient.insurance || "N/A",
        avatar:
          patient.avatar ||
          `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
      };
    });
  }, [patientsData, doctorsData]);
}
