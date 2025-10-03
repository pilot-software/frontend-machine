import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Calendar, Clock, Activity, TrendingUp, Users, FileText, 
  Pill, TestTube, Heart, AlertCircle, CheckCircle, ArrowRight 
} from 'lucide-react';
import { useAuth } from './AuthContext';

export function DashboardWidgets() {
  const { user } = useAuth();

  const recentActivities = [
    { id: 1, type: 'appointment', patient: 'John Doe', action: 'Completed checkup', time: '10 mins ago', status: 'success' },
    { id: 2, type: 'lab', patient: 'Sarah Smith', action: 'Lab results ready', time: '25 mins ago', status: 'info' },
    { id: 3, type: 'prescription', patient: 'Mike Johnson', action: 'Prescription issued', time: '1 hour ago', status: 'success' },
    { id: 4, type: 'alert', patient: 'Emma Wilson', action: 'Vital signs alert', time: '2 hours ago', status: 'warning' },
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'Alice Brown', time: '2:00 PM', type: 'Follow-up', status: 'confirmed' },
    { id: 2, patient: 'Bob Taylor', time: '3:30 PM', type: 'Consultation', status: 'pending' },
    { id: 3, patient: 'Carol White', time: '4:15 PM', type: 'Emergency', status: 'urgent' },
  ];

  const quickActions = [
    { icon: Users, label: 'New Patient', color: 'bg-blue-500', path: '/patients' },
    { icon: Calendar, label: 'Schedule', color: 'bg-purple-500', path: '/appointments' },
    { icon: Pill, label: 'Prescribe', color: 'bg-green-500', path: '/prescriptions' },
    { icon: TestTube, label: 'Lab Order', color: 'bg-orange-500', path: '/clinical' },
    { icon: FileText, label: 'Reports', color: 'bg-pink-500', path: '/reports' },
    { icon: Heart, label: 'Vitals', color: 'bg-red-500', path: '/clinical' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment': return Calendar;
      case 'lab': return TestTube;
      case 'prescription': return Pill;
      case 'alert': return AlertCircle;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950';
      case 'warning': return 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950';
      case 'info': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950';
      case 'urgent': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950';
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
    }
  };

  if (user?.role === 'patient') return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Quick Actions */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Button
                  key={idx}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className={`${action.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start gap-3 group cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                  <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{activity.patient}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{activity.time}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-blue-500/50 hover:shadow-md transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{apt.time.split(':')[0]}</span>
                    <span className="text-xs text-blue-500 dark:text-blue-500">{apt.time.split(' ')[1]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{apt.patient}</p>
                    <p className="text-xs text-muted-foreground">{apt.type}</p>
                  </div>
                </div>
                <Badge 
                  variant={apt.status === 'urgent' ? 'destructive' : apt.status === 'confirmed' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {apt.status}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2" size="sm">
              View Full Schedule
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
