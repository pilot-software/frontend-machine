'use client';

import {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Badge} from '@/components/ui/badge';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {
    Activity,
    BarChart3,
    Calendar as CalendarIcon,
    Clock,
    DollarSign,
    Download,
    File,
    FileImage,
    FileText,
    Filter,
    Mail,
    Pause,
    Play,
    Search,
    Settings,
    TrendingUp,
    Users
} from 'lucide-react';
import {format} from 'date-fns';

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [reportType, setReportType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample report data
  const reportCategories = [
    {
      title: 'Patient Reports',
      icon: Users,
      color: 'text-blue-600',
      reports: [
        { name: 'Patient Demographics', description: 'Age, gender, location breakdown', lastRun: '2024-01-15', status: 'ready' },
        { name: 'Patient Satisfaction', description: 'Survey results and feedback analysis', lastRun: '2024-01-14', status: 'ready' },
        { name: 'Patient Visit Summary', description: 'Visit frequency and patterns', lastRun: '2024-01-13', status: 'ready' },
        { name: 'Chronic Conditions Report', description: 'Top conditions and treatment outcomes', lastRun: '2024-01-12', status: 'ready' },
      ]
    },
    {
      title: 'Financial Reports',
      icon: DollarSign,
      color: 'text-green-600',
      reports: [
        { name: 'Revenue Analysis', description: 'Monthly and quarterly revenue trends', lastRun: '2024-01-15', status: 'ready' },
        { name: 'Insurance Claims', description: 'Claims processing and reimbursements', lastRun: '2024-01-14', status: 'processing' },
        { name: 'Outstanding Payments', description: 'Pending payments and collections', lastRun: '2024-01-13', status: 'ready' },
        { name: 'Cost Analysis', description: 'Operational costs and efficiency metrics', lastRun: '2024-01-12', status: 'ready' },
      ]
    },
    {
      title: 'Clinical Reports',
      icon: Activity,
      color: 'text-red-600',
      reports: [
        { name: 'Treatment Outcomes', description: 'Success rates and patient recovery', lastRun: '2024-01-15', status: 'ready' },
        { name: 'Lab Results Summary', description: 'Test results and abnormal findings', lastRun: '2024-01-14', status: 'ready' },
        { name: 'Medication Usage', description: 'Prescription patterns and drug utilization', lastRun: '2024-01-13', status: 'ready' },
        { name: 'Quality Metrics', description: 'Clinical quality indicators and benchmarks', lastRun: '2024-01-12', status: 'ready' },
      ]
    },
    {
      title: 'Operational Reports',
      icon: BarChart3,
      color: 'text-purple-600',
      reports: [
        { name: 'Staff Performance', description: 'Employee productivity and efficiency', lastRun: '2024-01-15', status: 'ready' },
        { name: 'Appointment Analytics', description: 'Scheduling patterns and no-shows', lastRun: '2024-01-14', status: 'ready' },
        { name: 'Resource Utilization', description: 'Equipment and facility usage', lastRun: '2024-01-13', status: 'ready' },
        { name: 'Wait Time Analysis', description: 'Patient wait times and bottlenecks', lastRun: '2024-01-12', status: 'ready' },
      ]
    }
  ];

  const scheduledReports = [
    { name: 'Daily Census Report', frequency: 'Daily', nextRun: '2024-01-16 08:00', recipients: 'admin@hospital.com', status: 'active' },
    { name: 'Weekly Financial Summary', frequency: 'Weekly', nextRun: '2024-01-21 09:00', recipients: 'finance@hospital.com', status: 'active' },
    { name: 'Monthly Quality Report', frequency: 'Monthly', nextRun: '2024-02-01 10:00', recipients: 'quality@hospital.com', status: 'active' },
    { name: 'Quarterly Board Report', frequency: 'Quarterly', nextRun: '2024-04-01 14:00', recipients: 'board@hospital.com', status: 'paused' },
  ];

  const recentReports = [
    { name: 'Patient Demographics Q4 2023', type: 'Patient Report', generatedBy: 'Dr. Smith', date: '2024-01-15', size: '2.4 MB', format: 'PDF' },
    { name: 'Revenue Analysis December', type: 'Financial Report', generatedBy: 'Finance Team', date: '2024-01-14', size: '1.8 MB', format: 'Excel' },
    { name: 'Quality Metrics Summary', type: 'Clinical Report', generatedBy: 'Quality Dept', date: '2024-01-13', size: '3.1 MB', format: 'PDF' },
    { name: 'Staff Performance Review', type: 'Operational Report', generatedBy: 'HR Department', date: '2024-01-12', size: '1.2 MB', format: 'Excel' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PDF': return File;
      case 'Excel': return FileImage;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Healthcare Reports</h2>
          <p className="text-muted-foreground mt-1">Generate, schedule, and manage system reports</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Reports', value: '156', icon: FileText, color: 'text-blue-600' },
          { title: 'Scheduled Reports', value: '12', icon: Clock, color: 'text-green-600' },
          { title: 'Generated Today', value: '8', icon: TrendingUp, color: 'text-purple-600' },
          { title: 'Active Recipients', value: '24', icon: Mail, color: 'text-orange-600' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="generate" className="w-full">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Quick Report Generator */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Report Generator</CardTitle>
              <CardDescription>Generate reports instantly with custom parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient-demographics">Patient Demographics</SelectItem>
                      <SelectItem value="financial-summary">Financial Summary</SelectItem>
                      <SelectItem value="clinical-outcomes">Clinical Outcomes</SelectItem>
                      <SelectItem value="operational-metrics">Operational Metrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportCategories.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon className={`h-5 w-5 ${category.color}`} />
                      <span>{category.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.reports.map((report, reportIndex) => (
                        <div key={reportIndex} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{report.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">Last run: {report.lastRun}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Manage automated report generation and distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledReports.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.frequency}</TableCell>
                      <TableCell>{report.nextRun}</TableCell>
                      <TableCell>{report.recipients}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            {report.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Previously generated reports and downloads</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Generated By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReports.map((report, index) => {
                    const FormatIcon = getFormatIcon(report.format);
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.generatedBy}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>{report.size}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <FormatIcon className="h-4 w-4" />
                            <span>{report.format}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Monthly Executive Summary', description: 'High-level overview for leadership', category: 'Executive', usage: 45 },
              { name: 'Department Performance', description: 'Detailed department metrics', category: 'Operational', usage: 32 },
              { name: 'Patient Safety Report', description: 'Safety incidents and quality measures', category: 'Quality', usage: 28 },
              { name: 'Financial Dashboard', description: 'Revenue, costs, and profitability', category: 'Financial', usage: 41 },
              { name: 'Clinical Outcomes', description: 'Treatment success and patient outcomes', category: 'Clinical', usage: 36 },
              { name: 'Regulatory Compliance', description: 'Compliance metrics and audit results', category: 'Compliance', usage: 19 },
            ].map((template, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Category:</span>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Usage this month:</span>
                      <span>{template.usage} times</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Play className="h-3 w-3 mr-1" />
                        Use Template
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
