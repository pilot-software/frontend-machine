import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "@/lib/store";
import { useAppData } from "@/lib/hooks/useAppData";
import { patientService } from "@/lib/services/patient";
import { userService } from "@/lib/services/user";
import { medicalService, MedicalData } from "@/lib/services/medical";
import { PatientFormData, INITIAL_FORM_DATA } from "../types/patient-form.types";

const BLOOD_TYPE_MAP: Record<string, string> = {
  "O+": "O_POSITIVE",
  "O-": "O_NEGATIVE",
  "A+": "A_POSITIVE",
  "A-": "A_NEGATIVE",
  "B+": "B_POSITIVE",
  "B-": "B_NEGATIVE",
  "AB+": "AB_POSITIVE",
  "AB-": "AB_NEGATIVE",
};

export function usePatientForm(
  isOpen: boolean,
  patientId?: string,
  mode?: string
) {
  const { refetch } = useAppData();
  const reduxDoctors = useAppSelector((state) => state.app.doctors || []);

  const [patientData, setPatientData] =
    useState<PatientFormData>(INITIAL_FORM_DATA);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [medicalData, setMedicalData] = useState<MedicalData | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    selectedPatient: false,
    updating: false,
  });
  const [loadingMedical, setLoadingMedical] = useState(false);
  const [error, setError] = useState<{ selectedPatient: string | null }>({
    selectedPatient: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (isOpen) {
        try {
          const doctorUsers = reduxDoctors?.length
            ? reduxDoctors
            : await userService.getUsersByRole("DOCTOR");
          setDoctors(doctorUsers);
        } catch (error) {
          console.error("Failed to load doctors:", error);
        }

        if (patientId && (mode === "edit" || mode === "view")) {
          setLoading((prev) => ({ ...prev, selectedPatient: true }));
          try {
            const patient = await patientService.getPatientById(patientId);
            setSelectedPatient(patient);
            setError((prev) => ({ ...prev, selectedPatient: null }));
          } catch (error) {
            console.error("Failed to load patient:", error);
            setError((prev) => ({
              ...prev,
              selectedPatient:
                error instanceof Error ? error.message : "Unknown error",
            }));
          } finally {
            setLoading((prev) => ({ ...prev, selectedPatient: false }));
          }


        }
      }
    };
    loadData();
  }, [isOpen, patientId, mode, reduxDoctors]);

  useEffect(() => {
    if (selectedPatient) {
      const raw =
        (selectedPatient as any).bloodType ??
        (selectedPatient as any).blood_type ??
        (selectedPatient as any).btype ??
        "";
      const bloodType =
        raw && typeof raw === "string"
          ? raw.includes("_")
            ? raw
            : BLOOD_TYPE_MAP[raw] ?? raw
          : "";

      const doctorId =
        (selectedPatient as any).assignedDoctor ??
        (selectedPatient as any).assignedDoctorId ??
        (selectedPatient as any).primaryDoctorId ??
        (selectedPatient as any).doctorId;
      const assignedDoctor = doctorId
        ? typeof doctorId === "string"
          ? doctorId
          : doctorId.id || ""
        : "";

      setPatientData({
        firstName: selectedPatient.firstName || "",
        lastName: selectedPatient.lastName || "",
        email: selectedPatient.email || "",
        phone: selectedPatient.phone || "",
        dateOfBirth: selectedPatient.dateOfBirth || "",
        gender: selectedPatient.gender || "",
        address: selectedPatient.address || "",
        city: selectedPatient.city || "",
        state: selectedPatient.state || "",
        zipCode: selectedPatient.zipCode || "",
        country: selectedPatient.country || "USA",
        emergencyContactName: selectedPatient.emergencyContactName || "",
        emergencyContactPhone: selectedPatient.emergencyContactPhone || "",
        emergencyContactRelationship:
          selectedPatient.emergencyContactRelationship || "",
        bloodType: bloodType as any,
        allergies: selectedPatient.allergies || "",
        chronicConditions: selectedPatient.chronicConditions || "",
        currentMedications: selectedPatient.currentMedications || "",
        assignedDoctor,
        insuranceProvider: selectedPatient.insuranceProvider || "",
        insurancePolicyNumber: selectedPatient.insurancePolicyNumber || "",
      });
    }
  }, [selectedPatient]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedPatient(null);
      setMedicalData(null);
      setPatientData(INITIAL_FORM_DATA);
    }
  }, [isOpen]);

  const handleInputChange = useCallback((field: keyof PatientFormData, value: string) => {
    setPatientData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (onClose: () => void) => {
      setIsSubmitting(true);
      try {
        if (!patientData.firstName || !patientData.lastName || !patientData.email) {
          alert("Please fill in all required fields (First Name, Last Name, Email)");
          return;
        }
        const apiData = {
          firstName: patientData.firstName.trim(),
          lastName: patientData.lastName.trim(),
          dateOfBirth: patientData.dateOfBirth,
          gender: patientData.gender as
            | "MALE"
            | "FEMALE"
            | "OTHER"
            | "PREFER_NOT_TO_SAY",
          phone: patientData.phone || undefined,
          email: patientData.email.trim(),
          address: patientData.address || undefined,
          city: patientData.city || undefined,
          state: patientData.state || undefined,
          zipCode: patientData.zipCode || undefined,
          country: patientData.country || "USA",
          emergencyContactName: patientData.emergencyContactName || undefined,
          emergencyContactPhone: patientData.emergencyContactPhone || undefined,
          emergencyContactRelationship:
            patientData.emergencyContactRelationship || undefined,
          bloodType: patientData.bloodType || undefined,
          allergies: patientData.allergies || undefined,
          chronicConditions: patientData.chronicConditions || undefined,
          currentMedications: patientData.currentMedications || undefined,
          assignedDoctor: patientData.assignedDoctor || undefined,
          insuranceProvider: patientData.insuranceProvider || undefined,
          insurancePolicyNumber: patientData.insurancePolicyNumber || undefined,
        };

        if (mode === "add") {
          await patientService.createPatient(apiData);
          refetch.patients();
        } else if (mode === "edit" && patientId) {
          await patientService.updatePatient(patientId, apiData);
          refetch.patients();
        }

        onClose();
      } catch (error) {
        console.error("Failed to save patient:", error);
        alert(
          `Failed to save patient: ${
            error instanceof Error ? error.message : "Unknown error occurred"
          }`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [patientData, mode, patientId, refetch]
  );

  return {
    patientData,
    selectedPatient,
    medicalData,
    doctors,
    loading,
    loadingMedical,
    error,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  };
}
