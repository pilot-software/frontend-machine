import React from 'react';
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { 
  Activity, AlertCircle, TestTube, Pill, Calendar, 
  FileText, Heart, TrendingUp, Clock, UserPlus, 
  CalendarPlus, ClipboardList, Stethoscope, FileEdit
} from 'lucide-react';

export function DoctorDashboardWidgets() {
  const t = useTranslations('common');
  const router = useRouter();
  const vitalsOverview = [
    { patient: 'Alice Brown', room: '105', bp: '120/80', hr: 72, spo2: 98, status: 'stable' },
    { patient: 'Bob Wilson', room: '203', bp: '145/95', hr: 88, spo2: 95, status: 'monitor' },
    { patient: 'Carol White', room: '308', bp: '110/70', hr: 65, spo2: 99, status: 'stable' },
    { patient: 'David Chen', room: '112', bp: '135/85', hr: 78, spo2: 97, status: 'stable' },
    { patient: 'Emma Davis', room: '215', bp: '150/100', hr: 92, spo2: 94, status: 'monitor' },
    { patient: 'Frank Miller', room: '301', bp: '118/75', hr: 68, spo2: 99, status: 'stable' },
    { patient: 'Grace Lee', room: '405', bp: '128/82', hr: 75, spo2: 96, status: 'stable' },
    { patient: 'Henry Clark', room: '208', bp: '142/90', hr: 85, spo2: 95, status: 'monitor' },
  ];

  const labResults = [
    { patient: 'Emma Davis', test: 'Blood Count', status: 'completed', time: '2h ago', urgent: false },
    { patient: 'Frank Miller', test: 'X-Ray Chest', status: 'pending', time: '4h ago', urgent: true },
    { patient: 'Grace Lee', test: 'Urinalysis', status: 'completed', time: '1h ago', urgent: false },
    { patient: 'Alice Brown', test: 'CT Scan', status: 'pending', time: '3h ago', urgent: true },
    { patient: 'Bob Wilson', test: 'Lipid Panel', status: 'completed', time: '5h ago', urgent: false },
    { patient: 'Carol White', test: 'ECG', status: 'completed', time: '30m ago', urgent: false },
    { patient: 'David Chen', test: 'MRI Brain', status: 'pending', time: '6h ago', urgent: false },
    { patient: 'Henry Clark', test: 'Blood Culture', status: 'pending', time: '2h ago', urgent: true },
  ];

  const medications = [
    { patient: 'Henry Clark', medication: 'Aspirin 100mg', status: 'administered', time: '8:00 AM' },
    { patient: 'Ivy Martinez', medication: 'Insulin 10 units', status: 'missed', time: '9:00 AM' },
    { patient: 'Jack Taylor', medication: 'Antibiotics', status: 'due', time: '11:00 AM' },
    { patient: 'Alice Brown', medication: 'Metformin 500mg', status: 'administered', time: '8:30 AM' },
    { patient: 'Bob Wilson', medication: 'Lisinopril 10mg', status: 'due', time: '12:00 PM' },
    { patient: 'Carol White', medication: 'Atorvastatin 20mg', status: 'administered', time: '9:00 AM' },
    { patient: 'Emma Davis', medication: 'Levothyroxine 50mcg', status: 'missed', time: '7:00 AM' },
    { patient: 'Frank Miller', medication: 'Omeprazole 40mg', status: 'due', time: '1:00 PM' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              onClick={() => router.push('/en/patients/add')}
            >
              <UserPlus className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">Add Patient</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-colors"
              onClick={() => router.push('/en/appointments/add')}
            >
              <CalendarPlus className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Schedule Appointment</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              onClick={() => router.push('/en/prescriptions/add')}
            >
              <Pill className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium">Write Prescription</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-300 transition-colors"
              onClick={() => router.push('/en/clinical')}
            >
              <ClipboardList className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium">Clinical Notes</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
              onClick={() => router.push('/en/appointments')}
            >
              <Calendar className="h-6 w-6 text-teal-600" />
              <span className="text-sm font-medium">View Schedule</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scrollable Widgets Container */}
      <div className="relative">
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="flex gap-6 min-w-max lg:grid lg:grid-cols-2 lg:min-w-0">
        {/* Today's Schedule */}
        <Card className="w-full lg:w-auto min-w-[320px] lg:min-w-0">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto space-y-3 scrollbar-thin">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div>
                <p className="font-semibold text-sm">Consultations</p>
                <p className="text-xs text-muted-foreground">8:00 AM - 12:00 PM</p>
              </div>
              <Badge>12 patients</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div>
                <p className="font-semibold text-sm">Surgery - Appendectomy</p>
                <p className="text-xs text-muted-foreground">2:00 PM - 4:00 PM</p>
              </div>
              <Badge variant="secondary">Scheduled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div>
                <p className="font-semibold text-sm">Ward Rounds</p>
                <p className="text-xs text-muted-foreground">5:00 PM - 6:00 PM</p>
              </div>
              <Badge variant="outline">{t("pending")}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div>
                <p className="font-semibold text-sm">Emergency Consultation</p>
                <p className="text-xs text-muted-foreground">1:00 PM - 1:30 PM</p>
              </div>
              <Badge variant="destructive">Urgent</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-950 rounded-lg">
              <div>
                <p className="font-semibold text-sm">Team Meeting</p>
                <p className="text-xs text-muted-foreground">12:30 PM - 1:00 PM</p>
              </div>
              <Badge variant="secondary">Scheduled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <div>
                <p className="font-semibold text-sm">Follow-up Calls</p>
                <p className="text-xs text-muted-foreground">6:00 PM - 7:00 PM</p>
              </div>
              <Badge variant="outline">{t("pending")}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Patient Vitals Overview */}
        <Card className="w-full lg:w-auto min-w-[320px] lg:min-w-0">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Patient Vitals Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto space-y-3 scrollbar-thin">
            {vitalsOverview.map((patient, idx) => (
              <div key={idx} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{patient.patient}</p>
                    <p className="text-xs text-muted-foreground">Room {patient.room}</p>
                  </div>
                  <Badge variant={patient.status === 'stable' ? 'secondary' : 'default'}>
                    {patient.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">BP</p>
                    <p className="font-semibold">{patient.bp}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">HR</p>
                    <p className="font-semibold">{patient.hr} bpm</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">SpO₂</p>
                    <p className="font-semibold">{patient.spo2}%</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Medication Tracking */}
        <Card className="w-full lg:w-auto min-w-[320px] lg:min-w-0">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Pill className="h-5 w-5 text-green-600" />
              Medication Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto space-y-3 scrollbar-thin">
            {medications.map((med, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{med.patient}</p>
                  <p className="text-sm text-muted-foreground">{med.medication}</p>
                  <p className="text-xs text-muted-foreground mt-1">{med.time}</p>
                </div>
                <Badge 
                  variant={
                    med.status === 'administered' ? 'secondary' : 
                    med.status === 'missed' ? 'destructive' : 'default'
                  }
                >
                  {med.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Lab Results Summary */}
        <Card className="w-full lg:w-auto min-w-[320px] lg:min-w-0">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TestTube className="h-5 w-5 text-purple-600" />
              Lab Results Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto space-y-3 scrollbar-thin">
            {labResults.map((lab, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{lab.patient}</p>
                    {lab.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{lab.test}</p>
                  <p className="text-xs text-muted-foreground mt-1">{lab.time}</p>
                </div>
                <Badge variant={lab.status === 'completed' ? 'secondary' : 'default'}>
                  {lab.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
          </div>
        </div>
        {/* Scroll Indicator - Only visible on mobile/tablet */}
        <div className="lg:hidden text-center text-xs text-muted-foreground mt-2">
          <span className="inline-flex items-center gap-1">
            <span>Swipe to see more</span>
            <span className="animate-pulse">→</span>
          </span>
        </div>
      </div>
    </div>
  );
}
