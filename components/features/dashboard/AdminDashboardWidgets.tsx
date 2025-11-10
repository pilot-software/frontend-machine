import React from "react";
import {useTranslations} from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/providers/AuthContext';
import { PermissionStrategy } from '@/lib/strategies/permission.strategy';
import { useRouter } from 'next/navigation';
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
  const { permissions } = useAuth();
  const router = useRouter();
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              onClick={onAddPatient}
            >
              <UserPlus className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">Add Patient</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              onClick={onAddAppointment}
            >
              <Calendar className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium">Schedule Appointment</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-colors"
              onClick={onAddPrescription}
            >
              <Pill className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">New Prescription</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-300 transition-colors"
              onClick={() => router.push('/en/clinical')}
            >
              <TestTube className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium">Lab Orders</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-pink-50 hover:border-pink-300 transition-colors"
              onClick={() => router.push('/en/reports')}
            >
              <FileText className="h-6 w-6 text-pink-600" />
              <span className="text-sm font-medium">Reports</span>
            </Button>
            {(PermissionStrategy.hasAnyPermission(permissions, ['BEDS_VIEW', 'BEDS_MANAGE', 'SYSTEM_HOSPITAL_SETTINGS', 'USERS_MANAGE_PERMISSIONS']) || 
              permissions.some(p => p?.name?.includes('BED') || p?.name?.includes('BEDS'))) && (
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                onClick={() => window.location.href = '/en/beds'}
              >
                <Bed className="h-6 w-6 text-indigo-600" />
                <span className="text-sm font-medium">Bed Management</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bed Occupancy */}
        <Card>
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
        <Card>
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
        <Card>
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
        <Card>
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
