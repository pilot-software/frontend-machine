import React from "react";
import {useTranslations} from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Bed,
  Activity,
  DollarSign,
  AlertTriangle,
  Calendar,
  UserCheck,
  FileText,
  Pill,
  TestTube,
  UserPlus,
} from "lucide-react";

interface AdminDashboardWidgetsProps {
  onNavigate?: (path: string) => void;
  onAddPatient?: () => void;
  onAddAppointment?: () => void;
  onAddPrescription?: () => void;
}

export function AdminDashboardWidgets({
  onAddPatient,
  onAddAppointment,
  onAddPrescription,
}: AdminDashboardWidgetsProps) {
  const t = useTranslations('common');
  const bedOccupancy = { total: 250, occupied: 198, available: 52, rate: 79 };
  const icuStatus = { total: 30, occupied: 24, available: 6, rate: 80 };
  const erStatus = { waiting: 12, inTreatment: 8, avgWait: "18 min" };
  const staff = { doctors: 45, nurses: 120, technicians: 35, onDuty: 200 };

  const handleQuickAction = (action: string) => {
    if (action === "Add Patients" && onAddPatient) {
      onAddPatient();
      return;
    }
    if (action === "Schedule Appointments" && onAddAppointment) {
      onAddAppointment();
      return;
    }
    if (action === "New Prescriptions" && onAddPrescription) {
      onAddPrescription();
      return;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            {t('quickActions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: UserPlus, label: t('addPatients'), key: "Add Patients", color: "bg-blue-500" },
              {
                icon: Calendar,
                label: t('scheduleAppointments'),
                key: "Schedule Appointments",
                color: "bg-purple-500",
              },
              {
                icon: Pill,
                label: t('newPrescriptions'),
                key: "New Prescriptions",
                color: "bg-green-500",
              },
              {
                icon: TestTube,
                label: t('viewLabOrder'),
                key: "View Lab Order",
                color: "bg-orange-500",
              },
              { icon: FileText, label: t('viewReports'), key: "View Reports", color: "bg-pink-500" },
              { icon: Bed, label: t('viewBedMgmt'), key: "View Bed Mgmt", color: "bg-indigo-500" },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <Button
                  key={idx}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 group rounded-xl"
                  onClick={() => handleQuickAction(action.key)}
                >
                  <div
                    className={`${action.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bed Occupancy */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bed className="h-5 w-5 text-blue-600" />
              {t('bedOccupancyRate')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{t('occupied')}: {bedOccupancy.occupied}</span>
                <span className="font-semibold">{bedOccupancy.rate}%</span>
              </div>
              <Progress value={bedOccupancy.rate} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {bedOccupancy.available} {t('bedsAvailable')}
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">{t('icuStatus')}</p>
              <div className="flex justify-between text-sm mb-2">
                <span>
                  {t('occupied')}: {icuStatus.occupied}/{icuStatus.total}
                </span>
                <Badge
                  variant={icuStatus.rate > 85 ? "destructive" : "default"}
                >
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
              {t('emergencyRoomStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <span className="text-sm font-medium">{t('waiting')}</span>
              <Badge variant="destructive">{erStatus.waiting} {t('patients')}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <span className="text-sm font-medium">{t('inTreatment')}</span>
              <Badge>{erStatus.inTreatment} {t('patients')}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">{t('avgWaitTime')}</span>
              <span className="font-semibold">{erStatus.avgWait}</span>
            </div>
          </CardContent>
        </Card>

        {/* Staff Availability */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              {t('staffAvailability')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('doctors')}</span>
              <span className="font-semibold">{staff.doctors} {t('onDuty')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('nurses')}</span>
              <span className="font-semibold">{staff.nurses} {t('onDuty')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('technicians')}</span>
              <span className="font-semibold">{staff.technicians} {t('onDuty')}</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('totalStaff')}</span>
                <Badge variant="secondary">{staff.onDuty} {t('active')}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Metrics */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              {t('financialOverview')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('todaysBilling')}</span>
              <span className="font-semibold text-green-600">$45,230</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('outstandingClaims')}</span>
              <span className="font-semibold text-orange-600">$12,450</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('insuranceApprovals')}</span>
              <Badge variant="secondary">23 {t('pending')}</Badge>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('monthlyRevenue')}</span>
                <span className="font-bold text-emerald-600">$342,100</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
