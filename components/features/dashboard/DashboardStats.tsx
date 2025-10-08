import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  Calendar,
  DollarSign,
  Users,
  Heart,
  Clock,
  AlertTriangle,
  Stethoscope,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { StatsCard } from "@/components/ui/stats-card";
import { ROLES } from "@/lib/constants/roles";

interface DashboardStatsProps {
  stats: any;
  loading: boolean;
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  const t = useTranslations("common");
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-50" />
            <CardContent className="card-responsive relative">
              <div className="animate-pulse">
                <div className="h-3 sm:h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-6 sm:h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = stats?.data || stats || {};

  // Role-specific dashboard cards
  const getRoleSpecificCards = () => {
    switch (user?.role) {
      case ROLES.ADMIN:
        return [
          {
            title: t("totalPatients"),
            value: statsData?.totalPatients || 1247,
            icon: Users,
            color: "text-blue-600",
            bgGradient: "from-blue-500/10 to-blue-600/5",
            change: "+12%",
            trend: "up",
          },
          {
            title: t("activeStaff"),
            value: statsData?.activeStaff || 89,
            icon: UserCheck,
            color: "text-green-600",
            bgGradient: "from-green-500/10 to-green-600/5",
            change: "+3%",
            trend: "up",
          },
          {
            title: t("criticalCases"),
            value: statsData?.criticalCases || 7,
            icon: AlertTriangle,
            color: "text-red-600",
            bgGradient: "from-red-500/10 to-red-600/5",
            change: "-2%",
            trend: "down",
          },
          {
            title: t("monthlyRevenue"),
            value: `$${(
              statsData?.revenue?.monthly || 342100
            ).toLocaleString()}`,
            icon: DollarSign,
            color: "text-emerald-600",
            bgGradient: "from-emerald-500/10 to-emerald-600/5",
            change: "+18%",
            trend: "up",
          },
        ];
      case ROLES.DOCTOR:
        return [
          {
            title: t("myPatients"),
            value: statsData?.myPatients || 34,
            icon: Users,
            color: "text-blue-600",
            bgGradient: "from-blue-500/10 to-blue-600/5",
            change: "+5%",
            trend: "up",
          },
          {
            title: t("todaysAppointments"),
            value: statsData?.todayAppointments || 12,
            icon: Calendar,
            color: "text-purple-600",
            bgGradient: "from-purple-500/10 to-purple-600/5",
            change: "+2",
            trend: "up",
          },
          {
            title: t("pendingReviews"),
            value: statsData?.pendingReviews || 8,
            icon: Clock,
            color: "text-orange-600",
            bgGradient: "from-orange-500/10 to-orange-600/5",
            change: "-3",
            trend: "down",
          },
          {
            title: t("consultations"),
            value: statsData?.consultations || 156,
            icon: Stethoscope,
            color: "text-green-600",
            bgGradient: "from-green-500/10 to-green-600/5",
            change: "+23%",
            trend: "up",
          },
        ];
      case ROLES.PATIENT:
        return [
          {
            title: t("nextAppointment"),
            value: "Tomorrow 2PM",
            icon: Calendar,
            color: "text-blue-600",
            bgGradient: "from-blue-500/10 to-blue-600/5",
            change: "Dr. Smith",
            trend: "neutral",
          },
          {
            title: t("healthScore"),
            value: "92/100",
            icon: Heart,
            color: "text-green-600",
            bgGradient: "from-green-500/10 to-green-600/5",
            change: "+5 pts",
            trend: "up",
          },
          {
            title: t("medications"),
            value: "3 Active",
            icon: Activity,
            color: "text-purple-600",
            bgGradient: "from-purple-500/10 to-purple-600/5",
            change: "2 Daily",
            trend: "neutral",
          },
          {
            title: t("lastVisit"),
            value: "5 days ago",
            icon: Clock,
            color: "text-orange-600",
            bgGradient: "from-orange-500/10 to-orange-600/5",
            change: "Checkup",
            trend: "neutral",
          },
        ];
      default:
        return [
          {
            title: t("totalPatients"),
            value: statsData?.totalPatients || 0,
            icon: Users,
            color: "text-blue-600",
            bgGradient: "from-blue-500/10 to-blue-600/5",
            change: "+12%",
            trend: "up",
          },
          {
            title: t("newThisMonth"),
            value: statsData?.newPatientsThisMonth || 0,
            icon: Activity,
            color: "text-green-600",
            bgGradient: "from-green-500/10 to-green-600/5",
            change: "+8%",
            trend: "up",
          },
          {
            title: t("todaysAppointments"),
            value: statsData?.todayAppointments || 0,
            icon: Calendar,
            color: "text-purple-600",
            bgGradient: "from-purple-500/10 to-purple-600/5",
            change: "+3",
            trend: "up",
          },
          {
            title: t("activeCases"),
            value: statsData?.activeCases || 0,
            icon: Stethoscope,
            color: "text-orange-600",
            bgGradient: "from-orange-500/10 to-orange-600/5",
            change: "+15%",
            trend: "up",
          },
        ];
    }
  };

  const dashboardCards = getRoleSpecificCards();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {dashboardCards.map((card, index) => (
        <StatsCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          bgGradient={card.bgGradient}
          change={card.change}
          trend={card.trend as "up" | "down" | "neutral"}
        />
      ))}
    </div>
  );
}
