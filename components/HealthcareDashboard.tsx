import React, {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {TabsContent} from "./ui/tabs";
import {PatientManagement} from "./PatientManagement";
import {AppointmentSystem} from "./AppointmentSystem";
import {ClinicalInterface} from "./ClinicalInterface";
import {FinancialManagement} from "./FinancialManagement";
import {PrescriptionSystem} from "./PrescriptionSystem";
import {PatientFormModal} from "./PatientFormModal";
import {DoctorFormModal} from "./DoctorFormModal";
import {DashboardStats} from "./DashboardStats";
import {useAuth} from "./AuthContext";
import {useFeatures} from "../lib/useFeatures";
import {DashboardStatsSkeleton, DashboardTableSkeleton} from "./skeletons";
import {usePatientData} from "../lib/hooks/usePatientData";
import {useFilteredData} from "../lib/hooks/useFilteredData";
import {useAppData} from "../lib/hooks/useAppData";
import {PatientTable} from "./tables/PatientTable";
import {DoctorTable} from "./tables/DoctorTable";
import {DashboardSearch} from "./dashboard/DashboardSearch";
import {DashboardTabs} from "./dashboard/DashboardTabs";
import {DashboardWidgets} from "./DashboardWidgets";
import {useAppDispatch, useAppSelector} from "../lib/store";
import {openPatientModal, closePatientModal, openDoctorModal, closeDoctorModal, openAppointmentModal, closeAppointmentModal, closePrescriptionModal} from "../lib/store/slices/modalSlice";
import {AppointmentFormModal} from "./AppointmentFormModal";
import {PrescriptionFormModal} from "./PrescriptionFormModal";

export function HealthcareDashboard() {
    const {user} = useAuth();
    const features = useFeatures();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedView, setSelectedView] = useState<"patients" | "doctors" | "departments">("patients");
    const dispatch = useAppDispatch();
    const { patientModal, doctorModal, appointmentModal, prescriptionModal } = useAppSelector((state) => state.modal);
    const [activeTab, setActiveTab] = useState(user?.role === "patient" ? "clinical" : "dashboard");
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
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

    const {stats: statsData, doctors: doctorsData, loading} = useAppData();
    const apiPatients = usePatientData();

    const filteredPatients = useFilteredData(
        apiPatients,
        searchTerm,
        activeFilters,
        ['caseNumber', 'firstName', 'lastName', 'email', 'phone'],
        {status: 'status', gender: 'gender', department: 'department'}
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
            avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
        })
    );

    const filteredDoctors = useFilteredData(
        apiDoctors,
        searchTerm,
        activeFilters,
        ['name', 'specialization', 'department', 'email'],
        {specialization: 'specialization', department: 'department', availability: 'availability'}
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
            status: "operational"
        },
        {
            id: "2",
            name: "Emergency",
            head: "Dr. Sarah Wilson",
            totalPatients: 23,
            activeStaff: 18,
            location: "Building B, Ground Floor",
            phone: "+1-555-0202",
            status: "operational"
        },
    ];

    const filteredDepartments = useFilteredData(
        mockDepartments,
        searchTerm,
        activeFilters,
        ['name', 'head', 'location'],
        {status: 'status'}
    );

    const handleViewPatient = (patient: any, origin: { x: number; y: number }) => {
        dispatch(openPatientModal({ mode: 'view', patientId: patient.id, patientData: patient, origin }));
    };

    const handleEditPatient = (patientId: string) => {
        dispatch(openPatientModal({ mode: 'edit', patientId }));
    };

    const handleViewDoctor = (doctorId: string, origin: { x: number; y: number }) => {
        dispatch(openDoctorModal({ mode: 'view', doctorId, origin }));
    };

    const handleEditDoctor = (doctorId: string) => {
        dispatch(openDoctorModal({ mode: 'edit', doctorId }));
    };

    const handleAddPatient = () => {
        dispatch(openPatientModal({ mode: 'add' }));
    };

    const getFilterOptions = () => {
        switch (selectedView) {
            case 'patients':
                return [
                    {
                        key: 'status',
                        label: 'Status',
                        options: [
                            {value: 'active', label: 'Active'},
                            {value: 'inactive', label: 'Inactive'},
                            {value: 'critical', label: 'Critical'},
                        ]
                    },
                    {
                        key: 'gender',
                        label: 'Gender',
                        options: [
                            {value: 'male', label: 'Male'},
                            {value: 'female', label: 'Female'},
                            {value: 'other', label: 'Other'},
                        ]
                    },
                    {
                        key: 'department',
                        label: 'Department',
                        options: [
                            {value: 'General', label: 'General'},
                            {value: 'Cardiology', label: 'Cardiology'},
                            {value: 'Emergency', label: 'Emergency'},
                            {value: 'Orthopedics', label: 'Orthopedics'},
                        ]
                    }
                ];
            case 'doctors':
                return [
                    {
                        key: 'specialization',
                        label: 'Specialization',
                        options: [
                            {value: 'General', label: 'General'},
                            {value: 'Cardiology', label: 'Cardiology'},
                            {value: 'Emergency Medicine', label: 'Emergency Medicine'},
                            {value: 'Orthopedics', label: 'Orthopedics'},
                        ]
                    },
                    {
                        key: 'department',
                        label: 'Department',
                        options: [
                            {value: 'General', label: 'General'},
                            {value: 'Cardiology', label: 'Cardiology'},
                            {value: 'Emergency', label: 'Emergency'},
                            {value: 'Orthopedics', label: 'Orthopedics'},
                        ]
                    },
                    {
                        key: 'availability',
                        label: 'Availability',
                        options: [
                            {value: 'available', label: 'Available'},
                            {value: 'busy', label: 'Busy'},
                            {value: 'off-duty', label: 'Off Duty'},
                        ]
                    }
                ];
            case 'departments':
                return [
                    {
                        key: 'status',
                        label: 'Status',
                        options: [
                            {value: 'operational', label: 'Operational'},
                            {value: 'maintenance', label: 'Maintenance'},
                            {value: 'emergency', label: 'Emergency'},
                        ]
                    }
                ];
            default:
                return [];
        }
    };

    const renderDashboardContent = () => (
        <div className="spacing-responsive">
            <DashboardSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedView={selectedView}
                onViewChange={setSelectedView}
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
                onAddPatient={handleAddPatient}
                filteredCounts={{
                    patients: filteredPatients.length,
                    doctors: filteredDoctors.length,
                    departments: filteredDepartments.length,
                }}
                filterOptions={getFilterOptions()}
            />

            {selectedView === "patients" && (
                <Card className="overflow-hidden">
                    <CardHeader className="px-6 pt-6 pb-2">
                        <CardTitle className="heading-responsive">
                            {user?.role === "patient"
                                ? "My Medical Record"
                                : user?.role === "doctor"
                                    ? "My Patient Records"
                                    : "Patient Records"}
                        </CardTitle>
                        <CardDescription className="text-responsive">
                            {user?.role === "patient"
                                ? "Your personal medical information and health records"
                                : user?.role === "doctor"
                                    ? "Your assigned patients and their medical records"
                                    : "Comprehensive list of all patients in the system"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="table-responsive">
                            <PatientTable
                                patients={filteredPatients}
                                onViewPatient={handleViewPatient}
                                onEditPatient={handleEditPatient}
                                isColumnVisible={isColumnVisible}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {selectedView === "doctors" && user?.role !== "doctor" && features.roles.nurse && (
                <Card className="overflow-hidden">
                    <CardHeader className="px-6 pt-6 pb-2">
                        <CardTitle className="heading-responsive">Medical Staff Directory</CardTitle>
                        <CardDescription className="text-responsive">Complete directory of all medical
                            professionals</CardDescription>
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
                {user?.role !== "patient" && (
                    <TabsContent value="dashboard" className="mt-4 sm:mt-6">
                        <div className="spacing-responsive">
                            {loading.stats ? <DashboardStatsSkeleton/> :
                                <DashboardStats stats={statsData} loading={loading.stats}/>}
                            <DashboardWidgets />
                            {loading.patients || loading.doctors ? <DashboardTableSkeleton/> : renderDashboardContent()}
                        </div>
                    </TabsContent>
                )}

                {features.patientManagement && (user?.role === "admin" || features.roles.nurse) && (
                    <TabsContent value="patients" className="mt-4 sm:mt-6">
                        <PatientManagement/>
                    </TabsContent>
                )}

                {features.appointmentSystem && (
                    <TabsContent value="appointments" className="mt-4 sm:mt-6">
                        <AppointmentSystem/>
                    </TabsContent>
                )}

                {features.clinicalInterface && (
                    <TabsContent value="clinical" className="mt-4 sm:mt-6">
                        <ClinicalInterface/>
                    </TabsContent>
                )}

                {features.financialManagement && (user?.role === "admin" || features.roles.finance) && (
                    <TabsContent value="financial" className="mt-4 sm:mt-6">
                        <FinancialManagement/>
                    </TabsContent>
                )}

                {features.prescriptionSystem && (
                    <TabsContent value="prescriptions" className="mt-4 sm:mt-6">
                        <PrescriptionSystem/>
                    </TabsContent>
                )}
            </DashboardTabs>

            {patientModal.isOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/50" style={{animation: 'fadeIn 0.2s ease-out'}}/>
                    <div
                        className="fixed z-50 modal-responsive"
                        style={{
                            left: patientModal.origin && window.innerWidth > 640 ? `${patientModal.origin.x}px` : '50%',
                            top: patientModal.origin && window.innerWidth > 640 ? `${patientModal.origin.y}px` : '50%',
                            transform: 'translate(-50%, -50%)',
                            animation: 'appleModalGrow 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
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
                    <div className="fixed inset-0 z-40 bg-black/50" style={{animation: 'fadeIn 0.2s ease-out'}}/>
                    <div
                        className="fixed z-50 modal-responsive"
                        style={{
                            left: doctorModal.origin && window.innerWidth > 640 ? `${doctorModal.origin.x}px` : '50%',
                            top: doctorModal.origin && window.innerWidth > 640 ? `${doctorModal.origin.y}px` : '50%',
                            transform: 'translate(-50%, -50%)',
                            animation: 'appleModalGrow 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
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
                    mode={appointmentModal.mode === 'add' ? 'schedule' : appointmentModal.mode === 'edit' ? 'reschedule' : 'view'}
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
