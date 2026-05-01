import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Pill,
  FileText,
  Heart,
  DollarSign,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Phone,
  Video,
  MessageSquare,
  Download,
  Bell,
  Droplet,
  Thermometer,
  Wind,
  Lightbulb,
  Target,
  MessageCircle,
  CreditCard,
  Zap,
  X,
} from "lucide-react";

export function PatientDashboardWidgets() {
  const t = useTranslations("common");
  const [showWelcome, setShowWelcome] = React.useState(true);

  const healthSummary = {
    bloodPressure: { systolic: 120, diastolic: 80, status: "Normal" },
    glucose: { value: 95, unit: "mg/dL", status: "Normal" },
    oxygen: { value: 98, unit: "%", status: "Excellent" },
    temperature: { value: 98.6, unit: "°F", status: "Normal" },
  };

  const appointments = [
    { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiologist", date: "Tomorrow", time: "2:00 PM", type: "Follow-up" },
    { id: 2, doctor: "Lab Test", specialty: "Blood Work", date: "Jan 25", time: "9:00 AM", type: "Lab" },
    { id: 3, doctor: "Dr. Mike Chen", specialty: "General Physician", date: "Jan 28", time: "11:30 AM", type: "Checkup" },
  ];

  const medications = [
    { name: "Aspirin 100mg", dosage: "1 tablet", frequency: "Once daily", time: "8:00 AM", taken: true },
    { name: "Metformin 500mg", dosage: "1 tablet", frequency: "Twice daily", time: "8:00 AM, 8:00 PM", taken: true },
    { name: "Vitamin D", dosage: "1 capsule", frequency: "Once daily", time: "8:00 AM", taken: false },
  ];

  const testResults = [
    { test: "Blood Count (CBC)", date: "Jan 15, 2025", status: "Normal", doctor: "Dr. Johnson" },
    { test: "Lipid Panel", date: "Jan 10, 2025", status: "Review Required", doctor: "Dr. Johnson" },
    { test: "Blood Sugar", date: "Jan 8, 2025", status: "Normal", doctor: "Dr. Chen" },
  ];

  const wellness = {
    steps: { current: 8234, goal: 10000, percentage: 82 },
    sleep: { hours: 7.5, quality: "Good" },
    heartRate: { current: 72, status: "Normal" },
    weight: { current: 165, change: -2 },
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      {showWelcome && (
        <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/5 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-blue-950/20 border-blue-500/20 dark:border-blue-900/40 relative">
          <Button size="icon" variant="ghost" onClick={() => setShowWelcome(false)} className="absolute top-2 right-2 h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome Back! 👋</h2>
                <p className="text-muted-foreground">Here's your health overview for today</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call Doctor
                </Button>
                <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Video className="h-4 w-4" />
                  Video Visit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Vitals Summary */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Health Vitals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Heart className="h-8 w-8 text-red-500" />
                <Badge variant="secondary" className="bg-green-500/10 text-green-700">{healthSummary.bloodPressure.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Blood Pressure</p>
              <p className="text-2xl font-bold">{healthSummary.bloodPressure.systolic}/{healthSummary.bloodPressure.diastolic}</p>
              <p className="text-xs text-muted-foreground mt-1">mmHg</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Droplet className="h-8 w-8 text-blue-500" />
                <Badge variant="secondary" className="bg-green-500/10 text-green-700">{healthSummary.glucose.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Blood Glucose</p>
              <p className="text-2xl font-bold">{healthSummary.glucose.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{healthSummary.glucose.unit}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Wind className="h-8 w-8 text-cyan-500" />
                <Badge variant="secondary" className="bg-green-500/10 text-green-700">{healthSummary.oxygen.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Oxygen Level</p>
              <p className="text-2xl font-bold">{healthSummary.oxygen.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{healthSummary.oxygen.unit}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Thermometer className="h-8 w-8 text-orange-500" />
                <Badge variant="secondary" className="bg-green-500/10 text-green-700">{healthSummary.temperature.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Temperature</p>
              <p className="text-2xl font-bold">{healthSummary.temperature.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{healthSummary.temperature.unit}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wellness Tracking */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Daily Wellness
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
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

          <Card className="hover:shadow-lg transition-shadow">
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

          <Card className="hover:shadow-lg transition-shadow">
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

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <Badge variant="secondary" className="bg-green-500/10 text-green-700">{wellness.weight.change} lbs</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Weight</p>
              <p className="text-2xl font-bold">{wellness.weight.current} lbs</p>
              <p className="text-xs text-green-600 mt-2">On track</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Upcoming Appointments
              </span>
              <Badge variant="outline">{appointments.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{apt.doctor}</p>
                    <Badge variant="outline" className="text-xs">{apt.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                  <p className="text-xs text-muted-foreground mt-1">{apt.date} at {apt.time}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
            <Button variant="outline" className="w-full">Schedule New Appointment</Button>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-green-600" />
                Medication Schedule
              </span>
              <Badge variant="outline">{medications.filter(m => !m.taken).length} Due</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medications.map((med, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg hover:shadow-sm transition-shadow">
                <div className={`mt-1 ${med.taken ? "text-green-600" : "text-orange-500"}`}>
                  {med.taken ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{med.name}</p>
                  <p className="text-xs text-muted-foreground">{med.dosage} - {med.frequency}</p>
                  <p className="text-xs text-muted-foreground mt-1">{med.time}</p>
                </div>
                <Badge variant={med.taken ? "secondary" : "default"}>{med.taken ? "Taken" : "Due"}</Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full gap-2">
              <Bell className="h-4 w-4" />
              Set Reminders
            </Button>
          </CardContent>
        </Card>

        {/* Recent Test Results */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Recent Test Results
              </span>
              <Badge variant="outline">{testResults.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {testResults.map((result, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{result.test}</p>
                  <p className="text-xs text-muted-foreground">{result.doctor}</p>
                  <p className="text-xs text-muted-foreground mt-1">{result.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={result.status === "Normal" ? "secondary" : "default"} className={result.status === "Normal" ? "bg-green-500/10 text-green-700" : "bg-orange-500/10 text-orange-700"}>
                    {result.status}
                  </Badge>
                  <Download className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">View All Results</Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-500/5 to-purple-500/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Message Doctor</p>
                <p className="text-xs text-muted-foreground">Get quick responses</p>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Request Prescription</p>
                <p className="text-xs text-muted-foreground">Refill medications</p>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Download className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Download Records</p>
                <p className="text-xs text-muted-foreground">Access medical history</p>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
              <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Pay Bills</p>
                <p className="text-xs text-muted-foreground">View & pay invoices</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Health Goals */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Health Goals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm">Weight Loss</p>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-700">65%</Badge>
              </div>
              <Progress value={65} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">Goal: 160 lbs • Current: 165 lbs</p>
              <p className="text-xs text-green-600 mt-2">5 lbs to go</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm">Exercise</p>
                <Badge variant="secondary" className="bg-green-500/10 text-green-700">80%</Badge>
              </div>
              <Progress value={80} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">Goal: 150 min/week • Done: 120 min</p>
              <p className="text-xs text-green-600 mt-2">30 min remaining</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm">Water Intake</p>
                <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-700">90%</Badge>
              </div>
              <Progress value={90} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">Goal: 8 glasses • Done: 7 glasses</p>
              <p className="text-xs text-green-600 mt-2">1 glass to go</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Health Tips & Education */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          Health Tips
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">Stay Hydrated</p>
                  <p className="text-xs text-muted-foreground mb-3">Drinking enough water helps maintain healthy blood pressure and improves circulation.</p>
                  <Button size="sm" variant="outline" className="text-xs h-7">Learn More</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">Regular Exercise</p>
                  <p className="text-xs text-muted-foreground mb-3">30 minutes of moderate activity daily can reduce cardiovascular risks significantly.</p>
                  <Button size="sm" variant="outline" className="text-xs h-7">View Exercises</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Medication Adherence */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-purple-600" />
              Medication Adherence
            </span>
            <Badge variant="secondary" className="bg-green-500/10 text-green-700">92%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">This Week</p>
                <p className="text-xs text-muted-foreground">13 of 14 doses taken</p>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div key={day} className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">{day}</p>
                  <div className={`h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                    idx < 6 ? 'bg-green-500/20 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {idx < 6 ? '✓' : '-'}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">Great job! Keep taking your medications on time.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages from Doctor */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Messages
              </span>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-700">2 New</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-sm">Dr. Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">2h ago</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">Your recent blood work looks great! Keep up the good work with your exercise routine.</p>
            </div>
            <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-sm">Dr. Mike Chen</p>
                <p className="text-xs text-muted-foreground">1d ago</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">Please schedule your follow-up appointment for next month.</p>
            </div>
            <Button variant="outline" className="w-full gap-2">
              <MessageSquare className="h-4 w-4" />
              View All Messages
            </Button>
          </CardContent>
        </Card>

        {/* Billing & Insurance */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Billing Summary
              </span>
              <Badge variant="outline">$0 Due</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">Last Visit</p>
                <p className="text-sm text-muted-foreground">Jan 15, 2025</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Amount: $150</p>
                <Badge variant="secondary" className="bg-green-500/10 text-green-700">Paid</Badge>
              </div>
            </div>
            <div className="p-3 border rounded-lg bg-blue-500/5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">Insurance Coverage</p>
                <Badge variant="outline">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Plan: Premium Health Plus • Deductible: $500</p>
            </div>
            <Button variant="outline" className="w-full gap-2">
              <Download className="h-4 w-4" />
              View Invoices
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
