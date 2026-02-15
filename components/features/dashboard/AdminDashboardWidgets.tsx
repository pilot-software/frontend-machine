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
  enabledWidgets?: string[];
}

export function AdminDashboardWidgets({
  onAddPatient,
  onAddAppointment,
  onAddPrescription,
  enabledWidgets = ['quickActions', 'bedOccupancy', 'emergencyRoom', 'staffAvailability', 'financial'],
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
    <div className="space-y-4">
      {/* Quick Actions */}
      {enabledWidgets.includes('quickActions') && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              {t('quickActions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="flex-1 min-w-[140px] h-20 flex flex-col items-center justify-center gap-2 hover:bg-accent transition-all"
                onClick={onAddPatient}
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                  <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-medium">{t('addPatient')}</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 min-w-[140px] h-20 flex flex-col items-center justify-center gap-2 hover:bg-accent transition-all"
                onClick={onAddAppointment}
              >
                <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs font-medium">{t('appointment')}</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 min-w-[140px] h-20 flex flex-col items-center justify-center gap-2 hover:bg-accent transition-all"
                onClick={onAddPrescription}
              >
                <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                  <Pill className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xs font-medium">{t('prescription')}</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 min-w-[140px] h-20 flex flex-col items-center justify-center gap-2 hover:bg-accent transition-all"
                onClick={() => router.push('/en/clinical')}
              >
                <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
                  <TestTube className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-xs font-medium">{t('labOrders')}</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 min-w-[140px] h-20 flex flex-col items-center justify-center gap-2 hover:bg-accent transition-all"
                onClick={() => router.push('/en/reports')}
              >
                <div className="w-9 h-9 rounded-lg bg-pink-50 dark:bg-pink-950 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                </div>
                <span className="text-xs font-medium">{t('reports')}</span>
              </Button>
              {(PermissionStrategy.hasAnyPermission(permissions, ['BEDS_VIEW', 'BEDS_MANAGE', 'SYSTEM_HOSPITAL_SETTINGS', 'USERS_MANAGE_PERMISSIONS']) || 
                permissions.some(p => p?.name?.includes('BED') || p?.name?.includes('BEDS'))) && (
                <Button
                  variant="outline"
                  className="flex-1 min-w-[140px] h-20 flex flex-col items-center justify-center gap-2 hover:bg-accent transition-all"
                  onClick={() => window.location.href = '/en/beds'}
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center">
                    <Bed className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-xs font-medium">{t('beds')}</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bed Occupancy */}
        {enabledWidgets.includes('bedOccupancy') && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bed className="h-4 w-4 text-primary" />
                {t('bedOccupancyRate')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('occupied')}: {bedOccupancy.occupied}</span>
                  <span className="font-semibold">{bedOccupancy.rate}%</span>
                </div>
                <Progress value={bedOccupancy.rate} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {bedOccupancy.available} {t('bedsAvailable')}
                </p>
              </div>
              <div className="pt-3 border-t">
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
        )}

        {/* Emergency Room Status */}
        {enabledWidgets.includes('emergencyRoom') && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
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
        )}

        {/* Staff Availability */}
        {enabledWidgets.includes('staffAvailability') && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
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
        )}

        {/* Financial Metrics */}
        {enabledWidgets.includes('financial') && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
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
        )}
      </div>
    </div>
  );
}
