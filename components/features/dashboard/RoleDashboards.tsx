import React from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/AuthContext";
import { HealthcareDashboard } from "@/components/features/dashboard/HealthcareDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionGuard } from "@/components/shared/guards/PermissionGuard";
import { usePermissions } from "@/lib/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Clock,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";

function FinanceDashboard() {
  const { user } = useAuth();
  const { canViewFinancials } = usePermissions();

  if (!canViewFinancials()) {
    return null;
  }

  const financeStats = [
    {
      label: "Monthly Revenue",
      value: "$342,100",
      change: "+18%",
      icon: TrendingUp,
      color: "text-emerald-600",
    },
    {
      label: "Pending Payments",
      value: "$45,200",
      change: "-5%",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      label: "Insurance Claims",
      value: "234",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      label: "Outstanding Bills",
      value: "$12,800",
      change: "-8%",
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Welcome, {user?.name}
        </h2>
        <p className="text-slate-600 mt-1">Finance Department Dashboard</p>
      </div>

      {/* Finance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {financeStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-start sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-slate-600 truncate">
                      {stat.label}
                    </p>
                    <p className="text-lg sm:text-2xl font-semibold text-slate-900 mt-1">
                      {stat.value}
                    </p>
                    <p
                      className={`text-xs sm:text-sm mt-1 ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <Icon
                    className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color} shrink-0`}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Finance Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
          <Button
            variant="outline"
            className="h-auto p-3 sm:p-4 flex flex-col items-center text-xs sm:text-sm"
          >
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
            Revenue Reports
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center"
          >
            <FileText className="h-6 w-6 mb-2" />
            Insurance Claims
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center"
          >
            <Clock className="h-6 w-6 mb-2" />
            Pending Payments
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center"
          >
            <Users className="h-6 w-6 mb-2" />
            Patient Billing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function RoleDashboards() {
  const t = useTranslations("common");
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <PermissionGuard
        permissions={["FINANCIAL_REPORTS", "BILLING_MANAGEMENT"]}
      >
        <FinanceDashboard />
      </PermissionGuard>
      <HealthcareDashboard />
    </div>
  );
}
