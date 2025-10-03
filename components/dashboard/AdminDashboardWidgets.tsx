import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  Bed, Users, Clock, Activity, DollarSign, Package, 
  AlertTriangle, TrendingUp, Calendar, UserCheck, FileText, 
  Pill, TestTube, UserPlus 
} from 'lucide-react';

export function AdminDashboardWidgets() {
  const metrics = [
    { 
      label: 'Patient Census', 
      value: 1247, 
      subValue: '156 admitted', 
      change: '+12 today', 
      icon: Users, 
      color: 'text-blue-600' 
    },
    { label: 'Discharges Today', value: 23, change: '+5', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Transfers', value: 8, change: '-2', icon: Activity, color: 'text-orange-600' },
    { label: 'ER Wait Time', value: '18 min', change: '-5 min', icon: Clock, color: 'text-red-600' },
  ];

  const bedOccupancy = { total: 250, occupied: 198, available: 52, rate: 79 };
  const icuStatus = { total: 30, occupied: 24, available: 6, rate: 80 };
  const erStatus = { waiting: 12, inTreatment: 8, avgWait: '18 min' };
  const staff = { doctors: 45, nurses: 120, technicians: 35, onDuty: 200 };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: UserPlus, label: 'New Patient', color: 'bg-blue-500' },
              { icon: Calendar, label: 'Schedule', color: 'bg-purple-500' },
              { icon: Pill, label: 'Prescribe', color: 'bg-green-500' },
              { icon: TestTube, label: 'Lab Order', color: 'bg-orange-500' },
              { icon: FileText, label: 'Reports', color: 'bg-pink-500' },
              { icon: Bed, label: 'Bed Mgmt', color: 'bg-indigo-500' },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <Button
                  key={idx}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 group rounded-xl"
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          const colors = [
            { bg: 'bg-blue-500', light: 'bg-blue-50 dark:bg-blue-950', border: 'border-l-blue-500' },
            { bg: 'bg-green-500', light: 'bg-green-50 dark:bg-green-950', border: 'border-l-green-500' },
            { bg: 'bg-orange-500', light: 'bg-orange-50 dark:bg-orange-950', border: 'border-l-orange-500' },
            { bg: 'bg-red-500', light: 'bg-red-50 dark:bg-red-950', border: 'border-l-red-500' },
          ];
          return (
            <div key={idx} className={`relative p-4 rounded-lg border-l-4 ${colors[idx].border} ${colors[idx].light} hover:shadow-lg transition-all duration-300 group cursor-pointer`}>
              <div className="flex items-center gap-3">
                <div className={`${colors[idx].bg} p-3 rounded-full text-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">{metric.label}</p>
                  <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                    <p className="text-xl sm:text-2xl font-bold">{metric.value}</p>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">{metric.change}</Badge>
                  </div>
                  {metric.subValue && (
                    <p className="text-xs text-muted-foreground mt-1">{metric.subValue}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bed Occupancy */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bed className="h-5 w-5 text-blue-600" />
              Bed Occupancy Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Occupied: {bedOccupancy.occupied}</span>
                <span className="font-semibold">{bedOccupancy.rate}%</span>
              </div>
              <Progress value={bedOccupancy.rate} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {bedOccupancy.available} beds available
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">ICU Status</p>
              <div className="flex justify-between text-sm mb-2">
                <span>Occupied: {icuStatus.occupied}/{icuStatus.total}</span>
                <Badge variant={icuStatus.rate > 85 ? 'destructive' : 'default'}>
                  {icuStatus.rate}%
                </Badge>
              </div>
              <Progress value={icuStatus.rate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Room Status */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Emergency Room Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <span className="text-sm font-medium">Waiting</span>
              <Badge variant="destructive">{erStatus.waiting} patients</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <span className="text-sm font-medium">In Treatment</span>
              <Badge>{erStatus.inTreatment} patients</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Avg Wait Time</span>
              <span className="font-semibold">{erStatus.avgWait}</span>
            </div>
          </CardContent>
        </Card>

        {/* Staff Availability */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              Staff Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Doctors</span>
              <span className="font-semibold">{staff.doctors} on duty</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Nurses</span>
              <span className="font-semibold">{staff.nurses} on duty</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Technicians</span>
              <span className="font-semibold">{staff.technicians} on duty</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Staff</span>
                <Badge variant="secondary">{staff.onDuty} active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Metrics */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Today's Billing</span>
              <span className="font-semibold text-green-600">$45,230</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Outstanding Claims</span>
              <span className="font-semibold text-orange-600">$12,450</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Insurance Approvals</span>
              <Badge variant="secondary">23 pending</Badge>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Monthly Revenue</span>
                <span className="font-bold text-emerald-600">$342,100</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
