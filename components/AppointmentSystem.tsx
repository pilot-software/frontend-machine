import React, {useState, useEffect, useRef} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from './ui/card';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {AppointmentFormModal} from './AppointmentFormModal';
import {Badge} from './ui/badge';
import {Tabs, TabsContent, TabsList, TabsTrigger} from './ui/tabs';
import { appointmentService, ApiAppointment } from '../lib/services/appointment';
import { useApi } from '../lib/hooks/useApi';
import {
    AlertCircle,
    Calendar as CalendarIcon,
    CheckCircle2,
    Filter,
    MapPin,
    Phone,
    Plus,
    Search,
    User,
    Video,
    XCircle
} from 'lucide-react';

interface AppointmentDisplay {
    id: string;
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    type: string;
    status: string;
    department: string;
    reason: string;
    duration: number;
    notes?: string;
}

export function AppointmentSystem() {
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'schedule' | 'reschedule' | 'view'>('schedule');
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | undefined>();
    const [searchTerm, setSearchTerm] = useState('');
    
    const { execute: fetchAppointments, loading: appointmentsLoading, data: appointments, statusCode } = useApi<(ApiAppointment & { patientName: string })[]>();
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!hasFetched.current && !statusCode) {
            hasFetched.current = true;
            fetchAppointments(() => appointmentService.getAppointmentsWithPatientNames());
        }
    }, [fetchAppointments, statusCode]);

    // Transform API appointments to display format
    const appointmentsList = appointments?.data || appointments || [];
    const mockAppointments: AppointmentDisplay[] = (Array.isArray(appointmentsList) ? appointmentsList : []).map((appointment: any) => ({
        id: appointment.id,
        patientName: appointment.patientName || 'Unknown Patient',
        doctorName: 'Doctor Name', // TODO: Get from user service
        date: appointment.appointmentDate,
        time: appointment.appointmentTime,
        type: 'routine',
        status: appointment.status.toLowerCase(),
        department: 'General',
        reason: appointment.chiefComplaint || 'General consultation',
        duration: appointment.durationMinutes,
        notes: appointment.notes
    }));

    const todayStats = [
        {label: 'Total Appointments', value: '24', icon: CalendarIcon, color: 'text-blue-600'},
        {label: 'Direct Visits', value: '16', icon: User, color: 'text-green-600'},
        {label: 'Phone Consultations', value: '6', icon: Phone, color: 'text-purple-600'},
        {label: 'Video Calls', value: '2', icon: Video, color: 'text-orange-600'}
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-emerald-100 text-emerald-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'no-show':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-slate-100 text-slate-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'routine':
                return User;
            case 'consultation':
                return Phone;
            case 'follow_up':
                return Video;
            case 'urgent':
                return AlertCircle;
            case 'surgery':
                return CalendarIcon;
            default:
                return CalendarIcon;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return CheckCircle2;
            case 'cancelled':
            case 'no-show':
                return XCircle;
            case 'confirmed':
                return CheckCircle2;
            default:
                return AlertCircle;
        }
    };

    const _timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">Appointment System</h2>
                    <p className="text-muted-foreground mt-1">Schedule and manage patient appointments - Direct, Phone &amp;
                        Video</p>
                </div>
                <Button
                    onClick={() => {
                        setModalMode('schedule');
                        setSelectedAppointmentId(undefined);
                        setIsAppointmentModalOpen(true);
                    }}
                >
                    <Plus className="h-4 w-4 mr-2"/>
                    Schedule Appointment
                </Button>
            </div>

            {/* Today's Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                {todayStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardContent className="p-3 md:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                                        <p className="text-lg md:text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
                                    </div>
                                    <Icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`}/>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Appointment Management Tabs */}
            <Tabs defaultValue="today" className="w-full">
                <TabsList>
                    <TabsTrigger value="today">Today&apos;s Schedule</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="today" className="space-y-6">
                    {/* Search and Filters */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col space-y-4">
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        placeholder="Search appointments by patient, doctor, or reason..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                        <Filter className="h-4 w-4 mr-2"/>
                                        All Types
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <User className="h-4 w-4 mr-2"/>
                                        Direct
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Phone className="h-4 w-4 mr-2"/>
                                        Phone
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Video className="h-4 w-4 mr-2"/>
                                        Video
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today's Appointments */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Today&apos;s Appointments - July 26, 2024</CardTitle>
                            <CardDescription>
                                All scheduled appointments for today
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {appointmentsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-sm text-muted-foreground">Loading appointments...</div>
                                </div>
                            ) : (
                            <div className="space-y-4">
                                {mockAppointments.map((appointment) => {
                                    const TypeIcon = getTypeIcon(appointment.type);
                                    const StatusIcon = getStatusIcon(appointment.status);

                                    return (
                                        <div key={appointment.id}
                                             className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="p-2 bg-muted rounded-full">
                                                        <TypeIcon className="h-4 w-4 text-muted-foreground"/>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{appointment.time}</p>
                                                        <p className="text-xs text-muted-foreground">{appointment.duration} min</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="font-medium">{appointment.patientName}</h3>
                                                        <Badge className={getStatusColor(appointment.status)}>
                                                            {appointment.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {appointment.doctorName} • {appointment.department}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground opacity-70">
                                                        {appointment.reason}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {appointment.type === 'consultation' && (
                                                    <Button variant="outline" size="sm">
                                                        <Phone className="h-4 w-4 mr-2"/>
                                                        Call Patient
                                                    </Button>
                                                )}
                                                {appointment.type === 'follow_up' && (
                                                    <Button variant="outline" size="sm">
                                                        <Video className="h-4 w-4 mr-2"/>
                                                        Start Video
                                                    </Button>
                                                )}
                                                {(appointment.type === 'routine' || appointment.type === 'surgery') && (
                                                    <Button variant="outline" size="sm">
                                                        <MapPin className="h-4 w-4 mr-2"/>
                                                        Room Info
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm">
                                                    <StatusIcon className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {mockAppointments.length === 0 && !appointmentsLoading && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No appointments found
                                    </div>
                                )}
                            </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="upcoming">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Appointments</CardTitle>
                            <CardDescription>
                                Appointments scheduled for the next 7 days
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Upcoming appointments will be displayed here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="calendar">
                    <Card>
                        <CardHeader>
                            <CardTitle>Calendar View</CardTitle>
                            <CardDescription>
                                Monthly calendar with appointment overview
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Calendar interface will be displayed here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appointment History</CardTitle>
                            <CardDescription>
                                Past appointments and their outcomes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Appointment history will be displayed here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Appointment Form Modal */}
            <AppointmentFormModal
                isOpen={isAppointmentModalOpen}
                onClose={() => setIsAppointmentModalOpen(false)}
                appointmentId={selectedAppointmentId}
                mode={modalMode}
            />
        </div>
    );
}
