import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Activity, AlertCircle, TestTube, Pill, Calendar, 
  FileText, Heart, TrendingUp, Clock 
} from 'lucide-react';

export function DoctorDashboardWidgets() {
  const vitalsOverview = [
    { patient: 'Alice Brown', room: '105', bp: '120/80', hr: 72, spo2: 98, status: 'stable' },
    { patient: 'Bob Wilson', room: '203', bp: '145/95', hr: 88, spo2: 95, status: 'monitor' },
    { patient: 'Carol White', room: '308', bp: '110/70', hr: 65, spo2: 99, status: 'stable' },
  ];

  const labResults = [
    { patient: 'Emma Davis', test: 'Blood Count', status: 'completed', time: '2h ago', urgent: false },
    { patient: 'Frank Miller', test: 'X-Ray Chest', status: 'pending', time: '4h ago', urgent: true },
    { patient: 'Grace Lee', test: 'Urinalysis', status: 'completed', time: '1h ago', urgent: false },
  ];

  const medications = [
    { patient: 'Henry Clark', medication: 'Aspirin 100mg', status: 'administered', time: '8:00 AM' },
    { patient: 'Ivy Martinez', medication: 'Insulin 10 units', status: 'missed', time: '9:00 AM' },
    { patient: 'Jack Taylor', medication: 'Antibiotics', status: 'due', time: '11:00 AM' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
              <Badge variant="outline">Pending</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Patient Vitals Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Patient Vitals Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Pill className="h-5 w-5 text-green-600" />
              Medication Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TestTube className="h-5 w-5 text-purple-600" />
              Lab Results Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
  );
}
