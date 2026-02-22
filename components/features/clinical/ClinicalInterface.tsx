"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard, StatsCardGrid } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EnterprisePageHeader } from "@/components/shared/EnterprisePageHeader";
import { Activity, AlertTriangle, Droplets, Eye, Heart, Plus, Stethoscope, TestTube, Thermometer, TrendingUp, TrendingDown, FileText, Calendar, User, Clock, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VitalSign {
  id: string;
  patientName: string;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
  bmi: number;
  recordedAt: Date;
  recordedBy: string;
  status: "normal" | "warning" | "critical";
}

interface LabResult {
  id: string;
  patientName: string;
  testName: string;
  testType: string;
  result: string;
  normalRange: string;
  unit: string;
  status: "normal" | "abnormal" | "critical";
  orderedBy: string;
  orderedDate: Date;
  resultDate: Date;
  notes?: string;
}

interface Procedure {
  id: string;
  patientName: string;
  procedureName: string;
  type: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  scheduledDate: Date;
  performedBy: string;
  duration: number;
  notes?: string;
  complications?: string;
}

const STATIC_VITALS: VitalSign[] = [
  { id: "V001", patientName: "John Smith", temperature: 98.6, bloodPressure: "120/80", heartRate: 72, respiratoryRate: 16, oxygenSaturation: 98, weight: 70, height: 175, bmi: 22.9, recordedAt: new Date(), recordedBy: "Dr. Sarah Johnson", status: "normal" },
  { id: "V002", patientName: "Emma Wilson", temperature: 99.2, bloodPressure: "135/85", heartRate: 88, respiratoryRate: 18, oxygenSaturation: 96, weight: 65, height: 165, bmi: 23.9, recordedAt: new Date(), recordedBy: "Nurse Mary", status: "warning" },
  { id: "V003", patientName: "Robert Brown", temperature: 100.4, bloodPressure: "145/95", heartRate: 105, respiratoryRate: 22, oxygenSaturation: 94, weight: 85, height: 180, bmi: 26.2, recordedAt: new Date(), recordedBy: "Dr. Michael Chen", status: "critical" },
  { id: "V004", patientName: "Lisa Anderson", temperature: 98.4, bloodPressure: "118/78", heartRate: 68, respiratoryRate: 15, oxygenSaturation: 99, weight: 62, height: 168, bmi: 22.0, recordedAt: new Date(), recordedBy: "Nurse John", status: "normal" },
  { id: "V005", patientName: "David Martinez", temperature: 98.8, bloodPressure: "125/82", heartRate: 75, respiratoryRate: 17, oxygenSaturation: 97, weight: 78, height: 182, bmi: 23.5, recordedAt: new Date(), recordedBy: "Dr. Emily Davis", status: "normal" },
  { id: "V006", patientName: "Sarah Taylor", temperature: 99.5, bloodPressure: "140/90", heartRate: 92, respiratoryRate: 20, oxygenSaturation: 95, weight: 68, height: 170, bmi: 23.5, recordedAt: new Date(), recordedBy: "Dr. Sarah Johnson", status: "warning" },
  { id: "V007", patientName: "James Lee", temperature: 98.2, bloodPressure: "115/75", heartRate: 65, respiratoryRate: 14, oxygenSaturation: 99, weight: 75, height: 178, bmi: 23.7, recordedAt: new Date(), recordedBy: "Nurse Mary", status: "normal" },
  { id: "V008", patientName: "Maria Garcia", temperature: 98.9, bloodPressure: "122/80", heartRate: 70, respiratoryRate: 16, oxygenSaturation: 98, weight: 60, height: 162, bmi: 22.9, recordedAt: new Date(), recordedBy: "Dr. Michael Chen", status: "normal" },
];

const STATIC_LABS: LabResult[] = [
  { id: "L001", patientName: "John Smith", testName: "Complete Blood Count", testType: "Hematology", result: "Normal", normalRange: "4.5-11.0", unit: "10^9/L", status: "normal", orderedBy: "Dr. Sarah Johnson", orderedDate: new Date(), resultDate: new Date(), notes: "All parameters within normal limits" },
  { id: "L002", patientName: "Emma Wilson", testName: "Blood Glucose", testType: "Chemistry", result: "145", normalRange: "70-100", unit: "mg/dL", status: "abnormal", orderedBy: "Dr. Michael Chen", orderedDate: new Date(), resultDate: new Date(), notes: "Elevated fasting glucose" },
  { id: "L003", patientName: "Robert Brown", testName: "Lipid Panel", testType: "Chemistry", result: "High", normalRange: "<200", unit: "mg/dL", status: "abnormal", orderedBy: "Dr. Sarah Johnson", orderedDate: new Date(), resultDate: new Date() },
  { id: "L004", patientName: "Lisa Anderson", testName: "Thyroid Function", testType: "Endocrinology", result: "Normal", normalRange: "0.4-4.0", unit: "mIU/L", status: "normal", orderedBy: "Dr. Emily Davis", orderedDate: new Date(), resultDate: new Date() },
];

const STATIC_PROCEDURES: Procedure[] = [
  { id: "P001", patientName: "John Smith", procedureName: "Echocardiogram", type: "Diagnostic", status: "completed", scheduledDate: new Date(), performedBy: "Dr. Sarah Johnson", duration: 45, notes: "Normal cardiac function" },
  { id: "P002", patientName: "Emma Wilson", procedureName: "Endoscopy", type: "Diagnostic", status: "scheduled", scheduledDate: new Date(), performedBy: "Dr. Michael Chen", duration: 30 },
  { id: "P003", patientName: "Robert Brown", procedureName: "Knee Arthroscopy", type: "Surgical", status: "in-progress", scheduledDate: new Date(), performedBy: "Dr. James Wilson", duration: 90, notes: "Meniscus repair" },
];

export function ClinicalInterface() {
  const [vitals, setVitals] = useState<VitalSign[]>(STATIC_VITALS);
  const [labs, setLabs] = useState<LabResult[]>(STATIC_LABS);
  const [procedures, setProcedures] = useState<Procedure[]>(STATIC_PROCEDURES);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"vital" | "lab" | "procedure">("vital");
  const [activeTab, setActiveTab] = useState("vitals");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isOrderLabOpen, setIsOrderLabOpen] = useState(false);
  const [isNewAssessmentOpen, setIsNewAssessmentOpen] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);

  const stats = [
    { title: "Active Patients", value: 156, icon: Activity, color: "text-blue-600", bgGradient: "from-blue-500 to-blue-600" },
    { title: "Critical Cases", value: 8, icon: AlertTriangle, color: "text-red-600", bgGradient: "from-red-500 to-red-600" },
    { title: "Pending Labs", value: 23, icon: TestTube, color: "text-purple-600", bgGradient: "from-purple-500 to-purple-600" },
    { title: "Procedures Today", value: 12, icon: Stethoscope, color: "text-green-600", bgGradient: "from-green-500 to-green-600" },
  ];

  const getVitalIcon = (type: string) => {
    const icons = { temperature: Thermometer, heartRate: Heart, bloodPressure: Activity, oxygen: Droplets };
    return icons[type as keyof typeof icons] || Activity;
  };

  const getStatusColor = (status: string) => {
    const colors = { normal: "bg-green-100 text-green-700", warning: "bg-yellow-100 text-yellow-700", critical: "bg-red-100 text-red-700", abnormal: "bg-orange-100 text-orange-700" };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const handleViewDetails = (item: any, type: "vital" | "lab" | "procedure") => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const filteredVitals = vitals.filter(v => {
    const matchesSearch = v.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const filteredLabs = labs.filter(l => {
    const matchesSearch = l.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || l.testName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const filteredProcedures = procedures.filter(p => {
    const matchesSearch = p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || p.procedureName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedVitals = filteredVitals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedLabs = filteredLabs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedProcedures = filteredProcedures.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredVitals.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <EnterprisePageHeader
        icon={Stethoscope}
        title="Clinical Interface"
        description="Patient clinical data, vitals, and medical records"
        breadcrumbs={[
          { label: "Dashboard", href: "/en/dashboard" },
          { label: "Clinical" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsOrderLabOpen(true)}><TestTube className="h-4 w-4 mr-2" />Order Labs</Button>
            <Button size="sm" onClick={() => setIsNewAssessmentOpen(true)}><Plus className="h-4 w-4 mr-2" />New Assessment</Button>
          </div>
        }
      />

      <StatsCardGrid>
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </StatsCardGrid>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="hidden md:block">
          <TabsList>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="labs">Lab Results</TabsTrigger>
            <TabsTrigger value="procedures">Procedures</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
          </TabsList>
        </div>
        <div className="md:hidden mb-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="vitals">Vital Signs</SelectItem>
              <SelectItem value="labs">Lab Results</SelectItem>
              <SelectItem value="procedures">Procedures</SelectItem>
              <SelectItem value="assessment">Assessment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="vitals" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Vital Signs Monitoring</CardTitle>
                  <CardDescription>Real-time patient vital signs tracking</CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Input placeholder="Search patients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-[200px]" />
                  <Button onClick={() => setIsAddRecordOpen(true)}><Plus className="h-4 w-4 mr-2" />Record</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">Showing {paginatedVitals.length} of {filteredVitals.length}</span>
              </div>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {paginatedVitals.map((vital) => (
                  <div key={vital.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{vital.patientName}</h3>
                          <Badge className={getStatusColor(vital.status)}>{vital.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div><Thermometer className="h-3 w-3 inline mr-1" />{vital.temperature}°F</div>
                          <div><Heart className="h-3 w-3 inline mr-1" />{vital.heartRate} bpm</div>
                          <div><Activity className="h-3 w-3 inline mr-1" />{vital.bloodPressure}</div>
                          <div><Droplets className="h-3 w-3 inline mr-1" />{vital.oxygenSaturation}%</div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{format(vital.recordedAt, "MMM d, yyyy h:mm a")} • {vital.recordedBy}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(vital, "vital")}><Eye className="h-4 w-4" /></Button>
                  </div>
                  ))}
                </div>
              </ScrollArea>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4 mr-1" />Previous
                  </Button>
                  <span className="text-sm">Page {currentPage} of {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    Next<ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Vital Trends</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Heart className="h-4 w-4 text-red-600" /><span className="text-sm">Heart Rate</span></div>
                  <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-600" /><span className="text-sm font-medium">Normal</span></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-blue-600" /><span className="text-sm">Blood Pressure</span></div>
                  <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-600" /><span className="text-sm font-medium">Stable</span></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Thermometer className="h-4 w-4 text-orange-600" /><span className="text-sm">Temperature</span></div>
                  <div className="flex items-center gap-2"><TrendingDown className="h-4 w-4 text-yellow-600" /><span className="text-sm font-medium">Elevated</span></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Critical Alerts</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">High BP - Robert Brown</p>
                    <p className="text-xs text-muted-foreground">145/95 mmHg</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Elevated Temp - Emma Wilson</p>
                    <p className="text-xs text-muted-foreground">99.2°F</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="labs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Laboratory Results</CardTitle>
                  <CardDescription>Recent lab tests and diagnostic results</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Search tests..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-[200px]" />
                  <Button><TestTube className="h-4 w-4 mr-2" />Order Test</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="abnormal">Abnormal</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">Showing {paginatedLabs.length} of {filteredLabs.length}</span>
              </div>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {paginatedLabs.map((lab) => (
                  <div key={lab.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-full ${lab.status === "normal" ? "bg-green-100" : lab.status === "abnormal" ? "bg-orange-100" : "bg-red-100"}`}>
                        <TestTube className={`h-5 w-5 ${lab.status === "normal" ? "text-green-600" : lab.status === "abnormal" ? "text-orange-600" : "text-red-600"}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{lab.testName}</h3>
                          <Badge className={getStatusColor(lab.status)}>{lab.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{lab.patientName} • {lab.testType}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                          <span>Result: {lab.result} {lab.unit}</span>
                          <span>Normal: {lab.normalRange} {lab.unit}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Ordered: {format(lab.orderedDate, "MMM d, yyyy")} • By: {lab.orderedBy}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(lab, "lab")}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  ))}
                </div>
              </ScrollArea>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4 mr-1" />Previous
                  </Button>
                  <span className="text-sm">Page {currentPage} of {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    Next<ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedures" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Procedures & Treatments</CardTitle>
                  <CardDescription>Scheduled and completed medical procedures</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Search procedures..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-[200px]" />
                  <Button><Plus className="h-4 w-4 mr-2" />Schedule</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">Showing {paginatedProcedures.length} of {filteredProcedures.length}</span>
              </div>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {paginatedProcedures.map((proc) => (
                  <div key={proc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Stethoscope className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{proc.procedureName}</h3>
                          <Badge className={getStatusColor(proc.status === "completed" ? "normal" : proc.status === "in-progress" ? "warning" : "normal")}>{proc.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{proc.patientName} • {proc.type}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                          <span><Calendar className="h-3 w-3 inline mr-1" />{format(proc.scheduledDate, "MMM d, yyyy")}</span>
                          <span><Clock className="h-3 w-3 inline mr-1" />{proc.duration} min</span>
                          <span><User className="h-3 w-3 inline mr-1" />{proc.performedBy}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(proc, "procedure")}><Eye className="h-4 w-4" /></Button>
                  </div>
                  ))}
                </div>
              </ScrollArea>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4 mr-1" />Previous
                  </Button>
                  <span className="text-sm">Page {currentPage} of {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    Next<ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Assessment</CardTitle>
              <CardDescription>Patient evaluation and clinical notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Chief Complaint</Label><Textarea placeholder="Patient's primary concern..." /></div>
              <div><Label>History of Present Illness</Label><Textarea placeholder="Detailed history..." /></div>
              <div><Label>Physical Examination</Label><Textarea placeholder="Physical exam findings..." /></div>
              <div><Label>Assessment & Plan</Label><Textarea placeholder="Clinical assessment and treatment plan..." /></div>
              <Button><FileText className="h-4 w-4 mr-2" />Save Assessment</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={selectedItem} type={modalType} />
      <OrderLabModal isOpen={isOrderLabOpen} onClose={() => setIsOrderLabOpen(false)} />
      <NewAssessmentModal isOpen={isNewAssessmentOpen} onClose={() => setIsNewAssessmentOpen(false)} />
      <AddRecordModal isOpen={isAddRecordOpen} onClose={() => setIsAddRecordOpen(false)} />
    </div>
  );
}

function DetailModal({ isOpen, onClose, item, type }: { isOpen: boolean; onClose: () => void; item: any; type: "vital" | "lab" | "procedure" }) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{type === "vital" ? "Vital Signs Details" : type === "lab" ? "Lab Result Details" : "Procedure Details"}</DialogTitle>
          <DialogDescription>{item.patientName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {type === "vital" && (
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Temperature</Label><p className="text-lg font-medium">{item.temperature}°F</p></div>
              <div><Label>Heart Rate</Label><p className="text-lg font-medium">{item.heartRate} bpm</p></div>
              <div><Label>Blood Pressure</Label><p className="text-lg font-medium">{item.bloodPressure}</p></div>
              <div><Label>Oxygen Saturation</Label><p className="text-lg font-medium">{item.oxygenSaturation}%</p></div>
              <div><Label>Respiratory Rate</Label><p className="text-lg font-medium">{item.respiratoryRate}/min</p></div>
              <div><Label>BMI</Label><p className="text-lg font-medium">{item.bmi}</p></div>
              <div><Label>Recorded By</Label><p className="text-lg font-medium">{item.recordedBy}</p></div>
              <div><Label>Status</Label><Badge className={`${item.status === "normal" ? "bg-green-100 text-green-700" : item.status === "warning" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{item.status}</Badge></div>
            </div>
          )}
          {type === "lab" && (
            <div className="space-y-3">
              <div><Label>Test Name</Label><p className="text-lg font-medium">{item.testName}</p></div>
              <div><Label>Test Type</Label><p className="text-lg font-medium">{item.testType}</p></div>
              <div><Label>Result</Label><p className="text-lg font-medium">{item.result} {item.unit}</p></div>
              <div><Label>Normal Range</Label><p className="text-lg font-medium">{item.normalRange} {item.unit}</p></div>
              <div><Label>Status</Label><Badge className={`${item.status === "normal" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>{item.status}</Badge></div>
              <div><Label>Ordered By</Label><p className="text-lg font-medium">{item.orderedBy}</p></div>
              {item.notes && <div><Label>Notes</Label><p className="text-sm text-muted-foreground">{item.notes}</p></div>}
            </div>
          )}
          {type === "procedure" && (
            <div className="space-y-3">
              <div><Label>Procedure</Label><p className="text-lg font-medium">{item.procedureName}</p></div>
              <div><Label>Type</Label><p className="text-lg font-medium">{item.type}</p></div>
              <div><Label>Status</Label><Badge>{item.status}</Badge></div>
              <div><Label>Scheduled Date</Label><p className="text-lg font-medium">{format(item.scheduledDate, "MMM d, yyyy h:mm a")}</p></div>
              <div><Label>Performed By</Label><p className="text-lg font-medium">{item.performedBy}</p></div>
              <div><Label>Duration</Label><p className="text-lg font-medium">{item.duration} minutes</p></div>
              {item.notes && <div><Label>Notes</Label><p className="text-sm text-muted-foreground">{item.notes}</p></div>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OrderLabModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Laboratory Test</DialogTitle>
          <DialogDescription>Request new lab tests for patient</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div><Label>Patient Name</Label><Input placeholder="Search patient..." /></div>
          <div><Label>Test Type</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select test type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hematology">Hematology</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="microbiology">Microbiology</SelectItem>
                <SelectItem value="endocrinology">Endocrinology</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Test Name</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select test" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cbc">Complete Blood Count</SelectItem>
                <SelectItem value="glucose">Blood Glucose</SelectItem>
                <SelectItem value="lipid">Lipid Panel</SelectItem>
                <SelectItem value="thyroid">Thyroid Function</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Priority</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="stat">STAT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Clinical Notes</Label><Textarea placeholder="Reason for test..." /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Order Test</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NewAssessmentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Clinical Assessment</DialogTitle>
          <DialogDescription>Complete patient evaluation and clinical notes</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div><Label>Patient Name</Label><Input placeholder="Search patient..." /></div>
          <div><Label>Chief Complaint</Label><Textarea placeholder="Patient's primary concern..." /></div>
          <div><Label>History of Present Illness</Label><Textarea placeholder="Detailed history..." /></div>
          <div><Label>Physical Examination</Label><Textarea placeholder="Physical exam findings..." /></div>
          <div><Label>Assessment</Label><Textarea placeholder="Clinical assessment..." /></div>
          <div><Label>Plan</Label><Textarea placeholder="Treatment plan..." /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}><FileText className="h-4 w-4 mr-2" />Save Assessment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddRecordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Record Vital Signs</DialogTitle>
          <DialogDescription>Add new vital signs measurement</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div><Label>Patient Name</Label><Input placeholder="Search patient..." /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Temperature (°F)</Label><Input type="number" placeholder="98.6" /></div>
            <div><Label>Heart Rate (bpm)</Label><Input type="number" placeholder="72" /></div>
            <div><Label>Blood Pressure</Label><Input placeholder="120/80" /></div>
            <div><Label>Oxygen Saturation (%)</Label><Input type="number" placeholder="98" /></div>
            <div><Label>Respiratory Rate (/min)</Label><Input type="number" placeholder="16" /></div>
            <div><Label>Weight (kg)</Label><Input type="number" placeholder="70" /></div>
            <div><Label>Height (cm)</Label><Input type="number" placeholder="175" /></div>
          </div>
          <div><Label>Notes</Label><Textarea placeholder="Additional observations..." /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Save Record</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
