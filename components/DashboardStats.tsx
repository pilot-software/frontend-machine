import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from './ui/card';
import {Activity, Calendar, DollarSign, Users, TrendingUp, Heart, Clock, AlertTriangle, Stethoscope, UserCheck} from 'lucide-react';
import {useAuth} from './AuthContext';

interface DashboardStatsProps {
    stats: any;
    loading: boolean;
}

export function DashboardStats({stats, loading}: DashboardStatsProps) {
    const {user} = useAuth();

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
            case 'admin':
                return [
                    {
                        title: 'Total Patients',
                        value: statsData?.totalPatients || 1247,
                        icon: Users,
                        color: 'text-blue-600',
                        bgGradient: 'from-blue-500/10 to-blue-600/5',
                        change: '+12%',
                        trend: 'up'
                    },
                    {
                        title: 'Active Staff',
                        value: statsData?.activeStaff || 89,
                        icon: UserCheck,
                        color: 'text-green-600',
                        bgGradient: 'from-green-500/10 to-green-600/5',
                        change: '+3%',
                        trend: 'up'
                    },
                    {
                        title: 'Critical Cases',
                        value: statsData?.criticalCases || 7,
                        icon: AlertTriangle,
                        color: 'text-red-600',
                        bgGradient: 'from-red-500/10 to-red-600/5',
                        change: '-2%',
                        trend: 'down'
                    },
                    {
                        title: 'Monthly Revenue',
                        value: `$${(statsData?.revenue?.monthly || 342100).toLocaleString()}`,
                        icon: DollarSign,
                        color: 'text-emerald-600',
                        bgGradient: 'from-emerald-500/10 to-emerald-600/5',
                        change: '+18%',
                        trend: 'up'
                    }
                ];
            case 'doctor':
                return [
                    {
                        title: 'My Patients',
                        value: statsData?.myPatients || 34,
                        icon: Users,
                        color: 'text-blue-600',
                        bgGradient: 'from-blue-500/10 to-blue-600/5',
                        change: '+5%',
                        trend: 'up'
                    },
                    {
                        title: "Today's Appointments",
                        value: statsData?.todayAppointments || 12,
                        icon: Calendar,
                        color: 'text-purple-600',
                        bgGradient: 'from-purple-500/10 to-purple-600/5',
                        change: '+2',
                        trend: 'up'
                    },
                    {
                        title: 'Pending Reviews',
                        value: statsData?.pendingReviews || 8,
                        icon: Clock,
                        color: 'text-orange-600',
                        bgGradient: 'from-orange-500/10 to-orange-600/5',
                        change: '-3',
                        trend: 'down'
                    },
                    {
                        title: 'Consultations',
                        value: statsData?.consultations || 156,
                        icon: Stethoscope,
                        color: 'text-green-600',
                        bgGradient: 'from-green-500/10 to-green-600/5',
                        change: '+23%',
                        trend: 'up'
                    }
                ];
            case 'patient':
                return [
                    {
                        title: 'Next Appointment',
                        value: 'Tomorrow 2PM',
                        icon: Calendar,
                        color: 'text-blue-600',
                        bgGradient: 'from-blue-500/10 to-blue-600/5',
                        change: 'Dr. Smith',
                        trend: 'neutral'
                    },
                    {
                        title: 'Health Score',
                        value: '92/100',
                        icon: Heart,
                        color: 'text-green-600',
                        bgGradient: 'from-green-500/10 to-green-600/5',
                        change: '+5 pts',
                        trend: 'up'
                    },
                    {
                        title: 'Medications',
                        value: '3 Active',
                        icon: Activity,
                        color: 'text-purple-600',
                        bgGradient: 'from-purple-500/10 to-purple-600/5',
                        change: '2 Daily',
                        trend: 'neutral'
                    },
                    {
                        title: 'Last Visit',
                        value: '5 days ago',
                        icon: Clock,
                        color: 'text-orange-600',
                        bgGradient: 'from-orange-500/10 to-orange-600/5',
                        change: 'Checkup',
                        trend: 'neutral'
                    }
                ];
            default:
                return [
                    {
                        title: 'Total Patients',
                        value: statsData?.totalPatients || 0,
                        icon: Users,
                        color: 'text-blue-600',
                        bgGradient: 'from-blue-500/10 to-blue-600/5',
                        change: '+12%',
                        trend: 'up'
                    },
                    {
                        title: 'New This Month',
                        value: statsData?.newPatientsThisMonth || 0,
                        icon: Activity,
                        color: 'text-green-600',
                        bgGradient: 'from-green-500/10 to-green-600/5',
                        change: '+8%',
                        trend: 'up'
                    },
                    {
                        title: "Today's Appointments",
                        value: statsData?.todayAppointments || 0,
                        icon: Calendar,
                        color: 'text-purple-600',
                        bgGradient: 'from-purple-500/10 to-purple-600/5',
                        change: '+3',
                        trend: 'up'
                    },
                    {
                        title: 'Active Cases',
                        value: statsData?.activeCases || 0,
                        icon: Stethoscope,
                        color: 'text-orange-600',
                        bgGradient: 'from-orange-500/10 to-orange-600/5',
                        change: '+15%',
                        trend: 'up'
                    }
                ];
        }
    };

    const dashboardCards = getRoleSpecificCards();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {dashboardCards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer group border-0 bg-card/80 backdrop-blur-sm">
                        {/* Animated background gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-40 group-hover:opacity-60 transition-all duration-300`} />
                        
                        {/* Floating orb effect */}
                        <div className={`absolute -top-2 -right-2 w-12 h-12 ${card.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-all duration-300`} />
                        
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-1.5 px-3 pt-3 relative z-10">
                            <div className="flex-1">
                                <CardTitle className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 mb-1.5">
                                    {card.title}
                                </CardTitle>
                                <div className="flex items-center space-x-1.5">
                                {card.trend === 'up' && (
                                    <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full">
                                        <TrendingUp className="h-2.5 w-2.5 text-green-600 dark:text-green-400" />
                                        <span className="text-xs font-semibold text-green-700 dark:text-green-400">{card.change}</span>
                                    </div>
                                )}
                                {card.trend === 'down' && (
                                    <div className="flex items-center space-x-1 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded-full">
                                        <TrendingUp className="h-2.5 w-2.5 text-red-600 dark:text-red-400 rotate-180" />
                                        <span className="text-xs font-semibold text-red-700 dark:text-red-400">{card.change}</span>
                                    </div>
                                )}
                                {card.trend === 'neutral' && (
                                    <div className="bg-muted px-1.5 py-0.5 rounded-full">
                                        <span className="text-xs font-semibold text-muted-foreground">{card.change}</span>
                                    </div>
                                )}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                                <Icon className={`h-3.5 w-3.5 ${card.color} group-hover:scale-110 transition-all duration-300 relative z-10`}/>
                                <div className="text-lg font-bold group-hover:scale-105 transition-transform duration-300">
                                    {card.value}
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="hidden" />
                        
                        {/* Bottom accent line */}
                        <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${card.color.replace('text-', 'bg-')} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    </Card>
                );
            })}
        </div>
    );
}
