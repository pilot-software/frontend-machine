import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { PatientManagement } from "@/components/features/patients/PatientManagement";
import { AppointmentSystem } from "@/components/features/appointments/AppointmentSystem";
import { ClinicalInterface } from "@/components/features/clinical/ClinicalInterface";
import { FinancialManagement } from "@/components/features/financial/FinancialManagement";
import { PrescriptionSystem } from "@/components/features/prescriptions/PrescriptionSystem";
import { PatientFormModal } from "@/components/features/patients/PatientFormModal";
import { DoctorFormModal } from "@/components/features/dashboard/DoctorFormModal";
import { DashboardStats } from "@/components/features/dashboard/DashboardStats";
import { useAuth } from "@/components/providers/AuthContext";
import { useFeatures } from "@/lib/useFeatures";
import {
  DashboardStatsSkeleton,
  DashboardTableSkeleton,
} from "@/components/skeletons";
import { usePatientData } from "@/lib/hooks/usePatientData";
import { useFilteredData } from "@/lib/hooks/useFilteredData";
import { useAppData } from "@/lib/hooks/useAppData";
import { PatientDataTable } from "@/components/features/patients/PatientDataTable";
import { DoctorTable } from "@/components/features/dashboard/DoctorTable";
import { DashboardSearch } from "@/components/features/dashboard/DashboardSearch";
import { DashboardTabs } from "@/components/features/dashboard/DashboardTabs";
import { DashboardWidgets } from "@/components/features/dashboard/DashboardWidgets";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  openPatientModal,
  closePatientModal,
  openDoctorModal,
  closeDoctorModal,
  closeAppointmentModal,
  closePrescriptionModal,
} from "@/lib/store/slices/modalSlice";
import { AppointmentFormModal } from "@/components/features/appointments/AppointmentFormModal";
import { PrescriptionFormModal } from "@/components/features/prescriptions/PrescriptionFormModal";
import { ROLES } from "@/lib/constants";

export function HealthcareDashboard() {
  const t = useTranslations("common");
  const { user } = useAuth();
  const features = useFeatures();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState<
    "patients" | "doctors" | "departments"
  >("patients");
  const dispatch = useAppDispatch();
  const { patientModal, doctorModal, appointmentModal, prescriptionModal } =
    useAppSelector((state) => state.modal);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [columnConfig, setColumnConfig] = useState<any>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem(`dashboard-config-${user?.role}`);
    if (savedConfig) {
      setColumnConfig(JSON.parse(savedConfig));
    }
  }, [user?.role]);

  const isColumnVisible = (table: string, column: string) => {
    if (!columnConfig) return true;
    const tableConfig = columnConfig[table];
    if (!tableConfig) return true;
    const colConfig = tableConfig.find((col: any) => col.key === column);
    return colConfig ? colConfig.visible : true;
  };

  const { stats: statsData, doctors: doctorsData, loading } = useAppData();
  const apiPatients = usePatientData();

  const filteredPatients = useFilteredData(
    apiPatients,
    searchTerm,
    activeFilters,
    ["caseNumber", "firstName", "lastName", "email", "phone"],
    { status: "status", gender: "gender", department: "department" }
  );

  const apiDoctors = (Array.isArray(doctorsData) ? doctorsData : []).map(
    (doctor) => ({
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization || "General",
      department: doctor.department || "General",
      email: doctor.email,
      phone: doctor.phone || "N/A",
      patients: 0,
      availability: "available",
      avatar:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
    })
  );

  const filteredDoctors = useFilteredData(
    apiDoctors,
    searchTerm,
    activeFilters,
    ["name", "specialization", "department", "email"],
    {
      specialization: "specialization",
      department: "department",
      availability: "availability",
    }
  );

  const mockDepartments = [
    {
      id: "1",
      name: "Cardiology",
      head: "Dr. John Smith",
      totalPatients: 45,
      activeStaff: 12,
      location: "Building A, Floor 2",
      phone: "+1-555-0201",
      status: "operational",
    },
    {
      id: "2",
      name: "Emergency",
      head: "Dr. Sarah Wilson",
      totalPatients: 23,
      activeStaff: 18,
      location: "Building B, Ground Floor",
      phone: "+1-555-0202",
      status: "operational",
    },
  ];

  const filteredDepartments = useFilteredData(
    mockDepartments,
    searchTerm,
    activeFilters,
    ["name", "head", "location"],
    { status: "status" }
  );

  const handleViewPatient = (
    patient: any,
    origin: { x: number; y: number }
  ) => {
    dispatch(
      openPatientModal({
        mode: "view",
        patientId: patient.id,
        patientData: patient,
        origin,
      })
    );
  };

  const handleEditPatient = (patientId: string) => {
    dispatch(openPatientModal({ mode: "edit", patientId }));
  };

  const handleViewDoctor = (
    doctorId: string,
    origin: { x: number; y: number }
  ) => {
    dispatch(openDoctorModal({ mode: "view", doctorId, origin }));
  };

  const handleEditDoctor = (doctorId: string) => {
    dispatch(openDoctorModal({ mode: "edit", doctorId }));
  };

  const handleAddPatient = () => {
    dispatch(openPatientModal({ mode: "add" }));
  };

  const getFilterOptions = () => {
    switch (selectedView) {
      case "patients":
        return [
          {
            key: "status",
            label: t("status"),
            options: [
              { value: "active", label: t("active") },
              { value: "inactive", label: t("inactive") },
              { value: "critical", label: t("critical") },
            ],
          },
          {
            key: "gender",
            label: t("gender"),
            options: [
              { value: "male", label: t("male") },
              { value: "female", label: t("female") },
              { value: "other", label: t("other") },
            ],
          },
          {
            key: "department",
            label: t("department"),
            options: [
              { value: "General", label: t("general") },
              { value: "Cardiology", label: t("cardiology") },
              { value: "Emergency", label: t("emergency") },
              { value: "Orthopedics", label: t("orthopedics") },
            ],
          },
        ];
      case "doctors":
        return [
          {
            key: "specialization",
            label: t("specialization"),
            options: [
              { value: "General", label: t("general") },
              { value: "Cardiology", label: t("cardiology") },
              { value: "Emergency Medicine", label: t("emergencyMedicine") },
              { value: "Orthopedics", label: t("orthopedics") },
            ],
          },
          {
            key: "department",
            label: t("department"),
            options: [
              { value: "General", label: t("general") },
              { value: "Cardiology", label: t("cardiology") },
              { value: "Emergency", label: t("emergency") },
              { value: "Orthopedics", label: t("orthopedics") },
            ],
          },
          {
            key: "availability",
            label: t("availability"),
            options: [
              { value: "available", label: t("available") },
              { value: "busy", label: t("busy") },
              { value: "off-duty", label: t("offDuty") },
            ],
          },
        ];
      case "departments":
        return [
          {
            key: "status",
            label: t("status"),
            options: [
              { value: "operational", label: t("operational") },
              { value: "maintenance", label: t("maintenance") },
              { value: "emergency", label: t("emergency") },
            ],
          },
        ];
      default:
        return [];
    }
  };

  const renderDashboardContent = () => (
    <div className="spacing-responsive">
      {selectedView === "doctors" &&
        user?.role !== "doctor" &&
        features.roles.nurse && (
          <Card className="overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="heading-responsive">
                {t("medicalStaffDirectory")}
              </CardTitle>
              <CardDescription className="text-responsive">
                {t("completeMedicalDirectory")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="table-responsive">
                <DoctorTable
                  doctors={filteredDoctors}
                  onViewDoctor={handleViewDoctor}
                  onEditDoctor={handleEditDoctor}
                />
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );

  return (
    <div className="spacing-responsive">
      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab}>
        <TabsContent value="dashboard" className="mt-4 sm:mt-6">
          <div className="spacing-responsive">
            {user?.role !== ROLES.PATIENT && (
              <>
                {loading.stats ? (
                  <DashboardStatsSkeleton />
                ) : (
                  <DashboardStats stats={statsData} loading={loading.stats} />
                )}
              </>
            )}
            <DashboardWidgets />
            {user?.role !== ROLES.PATIENT && (
              <>
                {loading.patients || loading.doctors ? (
                  <DashboardTableSkeleton />
                ) : (
                  renderDashboardContent()
                )}
              </>
            )}
          </div>
        </TabsContent>

        {features.patientManagement &&
          (user?.role === ROLES.ADMIN || features.roles.nurse) && (
            <TabsContent value="patients" className="mt-4 sm:mt-6">
              <PatientManagement />
            </TabsContent>
          )}

        {features.appointmentSystem && (
          <TabsContent value="appointments" className="mt-4 sm:mt-6">
            <AppointmentSystem />
          </TabsContent>
        )}

        {features.clinicalInterface && (
          <TabsContent value="clinical" className="mt-4 sm:mt-6">
            <ClinicalInterface />
          </TabsContent>
        )}

        {features.financialManagement &&
          (user?.role === ROLES.ADMIN || features.roles.finance) && (
            <TabsContent value="financial" className="mt-4 sm:mt-6">
              <FinancialManagement />
            </TabsContent>
          )}

        {features.prescriptionSystem && (
          <TabsContent value="prescriptions" className="mt-4 sm:mt-6">
            <PrescriptionSystem />
          </TabsContent>
        )}
      </DashboardTabs>

      {patientModal.isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            style={{ animation: "fadeIn 0.2s ease-out" }}
          />
          <div
            className="fixed z-50 modal-responsive"
            style={{
              left:
                patientModal.origin && window.innerWidth > 640
                  ? `${patientModal.origin.x}px`
                  : "50%",
              top:
                patientModal.origin && window.innerWidth > 640
                  ? `${patientModal.origin.y}px`
                  : "50%",
              transform: "translate(-50%, -50%)",
              animation:
                "appleModalGrow 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            <PatientFormModal
              isOpen={patientModal.isOpen}
              onClose={() => dispatch(closePatientModal())}
              patientId={patientModal.patientId}
              mode={patientModal.mode}
            />
          </div>
        </>
      )}

      {doctorModal.isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            style={{ animation: "fadeIn 0.2s ease-out" }}
          />
          <div
            className="fixed z-50 modal-responsive"
            style={{
              left:
                doctorModal.origin && window.innerWidth > 640
                  ? `${doctorModal.origin.x}px`
                  : "50%",
              top:
                doctorModal.origin && window.innerWidth > 640
                  ? `${doctorModal.origin.y}px`
                  : "50%",
              transform: "translate(-50%, -50%)",
              animation:
                "appleModalGrow 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            <DoctorFormModal
              isOpen={doctorModal.isOpen}
              onClose={() => dispatch(closeDoctorModal())}
              doctorId={doctorModal.doctorId}
              mode={doctorModal.mode}
            />
          </div>
        </>
      )}

      {appointmentModal.isOpen && (
        <AppointmentFormModal
          isOpen={appointmentModal.isOpen}
          onClose={() => dispatch(closeAppointmentModal())}
          appointmentId={appointmentModal.appointmentId}
          mode={
            appointmentModal.mode === "add"
              ? "schedule"
              : appointmentModal.mode === "edit"
              ? "reschedule"
              : "view"
          }
        />
      )}

      {prescriptionModal.isOpen && (
        <PrescriptionFormModal
          isOpen={prescriptionModal.isOpen}
          onClose={() => dispatch(closePrescriptionModal())}
          prescriptionId={prescriptionModal.prescriptionId}
          mode={prescriptionModal.mode}
        />
      )}
    </div>
  );
}
