import React, {useState} from 'react';
import { useTranslations } from "next-intl";
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {PatientFormModal} from '@/components/features/patients/PatientFormModal';
import {AppointmentFormModal} from '@/components/features/appointments/AppointmentFormModal';
import {DoctorFormModal} from '@/components/features/dashboard/DoctorFormModal';
import {BillingFormModal} from '@/components/features/financial/BillingFormModal';
import {Calendar, CreditCard, DollarSign, Stethoscope, User} from 'lucide-react';

export function FormExamples() {
  const t = useTranslations('common');
    const [patientModalOpen, setPatientModalOpen] = useState(false);
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
    const [doctorModalOpen, setDoctorModalOpen] = useState(false);
    const [billingModalOpen, setBillingModalOpen] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);

    return (
        <div className="p-6 space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Healthcare Management Forms</h1>
                <p className="text-gray-600">Real API Integration Examples</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Patient Management */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-blue-600"/>
                            <span>Patient Management</span>
                        </CardTitle>
                        <CardDescription>
                            Create and manage patient records with complete medical information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => setPatientModalOpen(true)}
                            className="w-full"
                        >
                            Add New Patient
                        </Button>
                    </CardContent>
                </Card>

                {/* Appointment Scheduling */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-green-600"/>
                            <span>Appointment Scheduling</span>
                        </CardTitle>
                        <CardDescription>
                            Schedule appointments with doctors and manage patient visits
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => setAppointmentModalOpen(true)}
                            className="w-full"
                        >
                            Schedule Appointment
                        </Button>
                    </CardContent>
                </Card>

                {/* Doctor Management */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Stethoscope className="h-5 w-5 text-purple-600"/>
                            <span>Doctor Management</span>
                        </CardTitle>
                        <CardDescription>
                            Add new doctors and manage their professional information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => setDoctorModalOpen(true)}
                            className="w-full"
                        >
                            Add New Doctor
                        </Button>
                    </CardContent>
                </Card>

                {/* Billing Management */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5 text-orange-600"/>
                            <span>Billing Management</span>
                        </CardTitle>
                        <CardDescription>
                            Create billing records for patient services and treatments
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => setBillingModalOpen(true)}
                            className="w-full"
                        >
                            Create Bill
                        </Button>
                    </CardContent>
                </Card>

                {/* Payment Processing */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <CreditCard className="h-5 w-5 text-red-600"/>
                            <span>Payment Processing</span>
                        </CardTitle>
                        <CardDescription>
                            Process payments for existing billing records
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => setPaymentModalOpen(true)}
                            className="w-full"
                        >
                            Process Payment
                        </Button>
                    </CardContent>
                </Card>

                {/* API Integration Info */}
                <Card className="md:col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-700">
                            API Integration Features
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600 space-y-2">
                        <div>✅ Real JWT Authentication</div>
                        <div>✅ RESTful API Endpoints</div>
                        <div>✅ Form Validation</div>
                        <div>✅ Error Handling</div>
                        <div>✅ Loading States</div>
                        <div>✅ Auto-refresh Data</div>
                    </CardContent>
                </Card>
            </div>

            {/* Form Modals */}
            <PatientFormModal
                isOpen={patientModalOpen}
                onClose={() => setPatientModalOpen(false)}
                mode="add"
            />

            <AppointmentFormModal
                isOpen={appointmentModalOpen}
                onClose={() => setAppointmentModalOpen(false)}
                mode="schedule"
            />

            <DoctorFormModal
                isOpen={doctorModalOpen}
                onClose={() => setDoctorModalOpen(false)}
                mode="add"
            />

            <BillingFormModal
                isOpen={billingModalOpen}
                onClose={() => setBillingModalOpen(false)}
                mode="billing"
            />

            <BillingFormModal
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                mode="payment"
            />
        </div>
    );
}
