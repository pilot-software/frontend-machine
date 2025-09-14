'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsPageSkeleton } from '@/components/skeletons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  Activity, Users, Calendar, DollarSign, TrendingUp, TrendingDown,
  Heart, Stethoscope, Building2, Clock, AlertTriangle, CheckCircle2
} from 'lucide-react';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AnalyticsPageSkeleton />;
  }
  // Sample data for healthcare analytics
  const patientGrowthData = [
    { month: 'Jan', patients: 2400, newPatients: 240 },
    { month: 'Feb', patients: 2600, newPatients: 200 },
    { month: 'Mar', patients: 2800, newPatients: 200 },
    { month: 'Apr', patients: 3100, newPatients: 300 },
    { month: 'May', patients: 3300, newPatients: 200 },
    { month: 'Jun', patients: 3500, newPatients: 200 },
  ];

  const departmentData = [
    { name: 'Cardiology', patients: 450, revenue: 125000, satisfaction: 4.8 },
    { name: 'Emergency', patients: 320, revenue: 89000, satisfaction: 4.2 },
    { name: 'Orthopedics', patients: 280, revenue: 95000, satisfaction: 4.6 },
    { name: 'Pediatrics', patients: 210, revenue: 65000, satisfaction: 4.9 },
    { name: 'Neurology', patients: 180, revenue: 78000, satisfaction: 4.5 },
  ];

  const appointmentStatusData = [
    { name: 'Completed', value: 68, color: '#10b981' },
    { name: 'Scheduled', value: 22, color: '#3b82f6' },
    { name: 'Cancelled', value: 7, color: '#ef4444' },
    { name: 'No Show', value: 3, color: '#f59e0b' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 450000, expenses: 320000 },
    { month: 'Feb', revenue: 520000, expenses: 340000 },
    { month: 'Mar', revenue: 480000, expenses: 330000 },
    { month: 'Apr', revenue: 590000, expenses: 380000 },
    { month: 'May', revenue: 620000, expenses: 390000 },
    { month: 'Jun', revenue: 680000, expenses: 420000 },
  ];

  const vitalMetrics = [
    {
      title: 'Total Patients',
      value: '3,547',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Monthly Revenue',
      value: '$680K',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Appointments Today',
      value: '127',
      change: '-2.1%',
      trend: 'down',
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      title: 'Bed Occupancy',
      value: '89%',
      change: '+5.3%',
      trend: 'up',
      icon: Building2,
      color: 'text-orange-600',
    },
  ];

  const qualityMetrics = [
    { metric: 'Patient Satisfaction', score: 4.7, target: 4.5, status: 'excellent' },
    { metric: 'Average Wait Time', score: 18, target: 20, status: 'good', unit: 'min' },
    { metric: 'Readmission Rate', score: 8.2, target: 10, status: 'good', unit: '%' },
    { metric: 'Staff Utilization', score: 87, target: 85, status: 'excellent', unit: '%' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Healthcare Analytics</h2>
        <p className="text-muted-foreground mt-1">Comprehensive system performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vitalMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-semibold text-foreground mt-1">{metric.value}</p>
                    <div className={`flex items-center mt-2 text-sm ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendIcon className="h-3 w-3 mr-1" />
                      {metric.change} from last month
                    </div>
                  </div>
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patient Analytics</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Growth Trend</CardTitle>
                <CardDescription>Total and new patients over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={patientGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="patients" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="newPatients" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Appointment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Status Distribution</CardTitle>
                <CardDescription>Current month appointment breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={appointmentStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {appointmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Patient volume, revenue, and satisfaction by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="patients" fill="#3b82f6" name="Patients" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Age 0-18</span>
                    <span>22%</span>
                  </div>
                  <Progress value={22} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Age 19-35</span>
                    <span>28%</span>
                  </div>
                  <Progress value={28} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Age 36-55</span>
                    <span>31%</span>
                  </div>
                  <Progress value={31} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Age 56+</span>
                    <span>19%</span>
                  </div>
                  <Progress value={19} className="mt-1" />
                </div>
              </CardContent>
            </Card>

            {/* Top Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Top Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { condition: 'Hypertension', count: 342 },
                  { condition: 'Diabetes', count: 298 },
                  { condition: 'Heart Disease', count: 187 },
                  { condition: 'Asthma', count: 156 },
                  { condition: 'Arthritis', count: 134 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{item.condition}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Patient Satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Satisfaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">4.7/5</div>
                  <p className="text-sm text-muted-foreground">Overall Rating</p>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <span className="text-sm w-3">{rating}</span>
                      <Progress value={rating === 5 ? 68 : rating === 4 ? 22 : rating === 3 ? 7 : rating === 2 ? 2 : 1} className="flex-1" />
                      <span className="text-sm text-muted-foreground w-8">
                        {rating === 5 ? '68%' : rating === 4 ? '22%' : rating === 3 ? '7%' : rating === 2 ? '2%' : '1%'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          {/* Revenue vs Expenses */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Monthly financial performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { service: 'Consultations', amount: 245000, percentage: 36 },
                  { service: 'Procedures', amount: 189000, percentage: 28 },
                  { service: 'Emergency', amount: 135000, percentage: 20 },
                  { service: 'Lab Tests', amount: 78000, percentage: 11 },
                  { service: 'Pharmacy', amount: 33000, percentage: 5 },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.service}</span>
                      <span>${item.amount.toLocaleString()}</span>
                    </div>
                    <Progress value={item.percentage} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Financial KPIs */}
            <Card>
              <CardHeader>
                <CardTitle>Financial KPIs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { metric: 'Profit Margin', value: '38.2%', status: 'excellent' },
                  { metric: 'Revenue per Patient', value: '$192', status: 'good' },
                  { metric: 'Collection Rate', value: '94.5%', status: 'excellent' },
                  { metric: 'Days in A/R', value: '28 days', status: 'good' },
                ].map((kpi, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{kpi.metric}</span>
                    <Badge className={getStatusColor(kpi.status)}>{kpi.value}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          {/* Quality Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {qualityMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{metric.metric}</span>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {metric.score}{metric.unit || ''}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Target: {metric.target}{metric.unit || ''}
                      </span>
                    </div>
                    <Progress 
                      value={metric.unit === 'min' || metric.unit === '%' ? 
                        (metric.score / metric.target) * 100 : 
                        (metric.score / 5) * 100
                      } 
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alerts & Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Important notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { type: 'success', message: 'Patient satisfaction target exceeded this month', icon: CheckCircle2 },
                  { type: 'warning', message: 'ICU capacity at 92% - consider overflow planning', icon: AlertTriangle },
                  { type: 'info', message: 'Monthly quality report ready for review', icon: Activity },
                  { type: 'success', message: 'Revenue target achieved 5 days early', icon: CheckCircle2 },
                ].map((alert, index) => {
                  const Icon = alert.icon;
                  return (
                    <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                      alert.type === 'success' ? 'bg-green-50' :
                      alert.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        alert.type === 'success' ? 'text-green-600' :
                        alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                      <span className="text-sm">{alert.message}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}