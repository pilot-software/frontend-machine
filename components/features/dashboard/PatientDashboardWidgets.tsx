import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, Pill, FileText, Heart, DollarSign, 
  Activity, TrendingUp, Clock, CheckCircle, ArrowRight 
} from 'lucide-react';

export function PatientDashboardWidgets() {
  const appointments = [
    { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: 'Tomorrow', time: '2:00 PM', type: 'Follow-up' },
    { id: 2, doctor: 'Lab Test', specialty: 'Blood Work', date: 'Jan 25', time: '9:00 AM', type: 'Lab' },
    { id: 3, doctor: 'Dr. Mike Chen', specialty: 'General Physician', date: 'Jan 28', time: '11:30 AM', type: 'Checkup' },
  ];

  const medications = [
    { name: 'Aspirin 100mg', dosage: '1 tablet', frequency: 'Once daily', time: '8:00 AM', taken: true },
    { name: 'Metformin 500mg', dosage: '1 tablet', frequency: 'Twice daily', time: '8:00 AM, 8:00 PM', taken: true },
    { name: 'Vitamin D', dosage: '1 capsule', frequency: 'Once daily', time: '8:00 AM', taken: false },
  ];

  const testResults = [
    { test: 'Blood Count (CBC)', date: 'Jan 15, 2025', status: 'Normal', doctor: 'Dr. Johnson' },
    { test: 'Lipid Panel', date: 'Jan 10, 2025', status: 'Review Required', doctor: 'Dr. Johnson' },
    { test: 'Blood Sugar', date: 'Jan 8, 2025', status: 'Normal', doctor: 'Dr. Chen' },
  ];

  const healthRecords = [
    { type: 'Vaccination', name: 'COVID-19 Booster', date: 'Dec 2024', status: 'Up to date' },
    { type: 'Allergy', name: 'Penicillin', severity: 'Moderate', status: 'Active' },
    { type: 'Condition', name: 'Hypertension', since: '2020', status: 'Managed' },
  ];

  const billing = [
    { description: 'Consultation - Dr. Johnson', date: 'Jan 15', amount: '$150', status: 'Paid' },
    { description: 'Lab Tests', date: 'Jan 10', amount: '$85', status: 'Pending' },
    { description: 'Insurance Claim', date: 'Jan 5', amount: '$200', status: 'Approved' },
  ];

  const wellness = {
    steps: { current: 8234, goal: 10000, percentage: 82 },
    sleep: { hours: 7.5, quality: 'Good' },
    heartRate: { current: 72, status: 'Normal' },
    weight: { current: 165, change: -2 },
  };

  return (
    <div className="space-y-6">
      {/* Wellness Tracking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <Badge variant="secondary">{wellness.steps.percentage}%</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Steps Today</p>
            <p className="text-2xl font-bold">{wellness.steps.current.toLocaleString()}</p>
            <Progress value={wellness.steps.percentage} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Goal: {wellness.steps.goal.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <Badge variant="secondary">{wellness.sleep.quality}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Sleep</p>
            <p className="text-2xl font-bold">{wellness.sleep.hours}h</p>
            <p className="text-xs text-green-600 mt-2">Quality sleep</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Heart className="h-5 w-5 text-red-600" />
              <Badge variant="secondary">{wellness.heartRate.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Heart Rate</p>
            <p className="text-2xl font-bold">{wellness.heartRate.current} bpm</p>
            <p className="text-xs text-muted-foreground mt-2">Resting rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <Badge variant="secondary">{wellness.weight.change} lbs</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Weight</p>
            <p className="text-2xl font-bold">{wellness.weight.current} lbs</p>
            <p className="text-xs text-green-600 mt-2">On track</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{apt.doctor}</p>
                    <Badge variant="outline" className="text-xs">{apt.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                  <p className="text-xs text-muted-foreground mt-1">{apt.date} at {apt.time}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Schedule New Appointment
            </Button>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Pill className="h-5 w-5 text-green-600" />
              Medication Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medications.map((med, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className={`mt-1 ${med.taken ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{med.name}</p>
                  <p className="text-xs text-muted-foreground">{med.dosage} - {med.frequency}</p>
                  <p className="text-xs text-muted-foreground mt-1">{med.time}</p>
                </div>
                <Badge variant={med.taken ? 'secondary' : 'default'}>
                  {med.taken ? 'Taken' : 'Due'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Recent Test Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {testResults.map((result, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{result.test}</p>
                  <p className="text-xs text-muted-foreground">{result.doctor}</p>
                  <p className="text-xs text-muted-foreground mt-1">{result.date}</p>
                </div>
                <Badge variant={result.status === 'Normal' ? 'secondary' : 'default'}>
                  {result.status}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Results
            </Button>
          </CardContent>
        </Card>

        {/* Bills & Insurance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Bills & Insurance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {billing.map((bill, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{bill.description}</p>
                  <p className="text-xs text-muted-foreground">{bill.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{bill.amount}</p>
                  <Badge 
                    variant={
                      bill.status === 'Paid' ? 'secondary' : 
                      bill.status === 'Approved' ? 'default' : 'outline'
                    }
                    className="text-xs mt-1"
                  >
                    {bill.status}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View Billing History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
