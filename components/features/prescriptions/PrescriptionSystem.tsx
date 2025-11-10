"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard, StatsCardGrid } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Calendar, CheckCircle2, Clock, Edit, Eye, PillBottle, Plus, Printer, Search, Send, AlertCircle, Pill, Syringe, ChevronLeft, ChevronRight, Download, FileText, User, Upload, X, File, CheckCircle } from "lucide-react";
import { format, addDays } from "date-fns";

interface Prescription {
  id: string;
  patientName: string;
  patientAge: number;
  medication: string;
  genericName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  refills: number;
  status: "active" | "completed" | "cancelled" | "pending";
  dateIssued: Date;
  expiryDate: Date;
  doctorName: string;
  instructions: string;
  pharmacy?: string;
  category: string;
  sideEffects?: string[];
}

const STATIC_PRESCRIPTIONS: Prescription[] = [
  { id: "RX001", patientName: "John Smith", patientAge: 45, medication: "Lisinopril", genericName: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days", quantity: 30, refills: 3, status: "active", dateIssued: new Date(), expiryDate: addDays(new Date(), 365), doctorName: "Dr. Sarah Johnson", instructions: "Take with water in the morning", pharmacy: "CVS Pharmacy", category: "Blood Pressure", sideEffects: ["Dizziness", "Dry cough"] },
  { id: "RX002", patientName: "Emma Wilson", patientAge: 32, medication: "Amoxicillin", genericName: "Amoxicillin", dosage: "500mg", frequency: "Three times daily", duration: "7 days", quantity: 21, refills: 0, status: "active", dateIssued: new Date(), expiryDate: addDays(new Date(), 7), doctorName: "Dr. Michael Chen", instructions: "Take with food", pharmacy: "Walgreens", category: "Antibiotic", sideEffects: ["Nausea", "Diarrhea"] },
  { id: "RX003", patientName: "Robert Brown", patientAge: 58, medication: "Metformin", genericName: "Metformin HCL", dosage: "850mg", frequency: "Twice daily", duration: "90 days", quantity: 180, refills: 5, status: "active", dateIssued: new Date(), expiryDate: addDays(new Date(), 365), doctorName: "Dr. Sarah Johnson", instructions: "Take with meals", pharmacy: "CVS Pharmacy", category: "Diabetes", sideEffects: ["GI upset", "Metallic taste"] },
  { id: "RX004", patientName: "Lisa Anderson", patientAge: 41, medication: "Atorvastatin", genericName: "Atorvastatin Calcium", dosage: "20mg", frequency: "Once daily", duration: "90 days", quantity: 90, refills: 3, status: "active", dateIssued: new Date(), expiryDate: addDays(new Date(), 365), doctorName: "Dr. James Wilson", instructions: "Take at bedtime", pharmacy: "Rite Aid", category: "Cholesterol", sideEffects: ["Muscle pain", "Headache"] },
  { id: "RX005", patientName: "David Martinez", patientAge: 29, medication: "Albuterol", genericName: "Albuterol Sulfate", dosage: "90mcg", frequency: "As needed", duration: "30 days", quantity: 1, refills: 2, status: "active", dateIssued: new Date(), expiryDate: addDays(new Date(), 180), doctorName: "Dr. Emily Davis", instructions: "Use inhaler as needed for breathing difficulty", pharmacy: "Walgreens", category: "Respiratory", sideEffects: ["Tremor", "Rapid heartbeat"] },
  { id: "RX006", patientName: "Sarah Taylor", patientAge: 36, medication: "Omeprazole", genericName: "Omeprazole", dosage: "20mg", frequency: "Once daily", duration: "30 days", quantity: 30, refills: 2, status: "pending", dateIssued: new Date(), expiryDate: addDays(new Date(), 365), doctorName: "Dr. Michael Chen", instructions: "Take before breakfast", pharmacy: "CVS Pharmacy", category: "Gastric", sideEffects: ["Headache", "Nausea"] },
  { id: "RX007", patientName: "Michael Brown", patientAge: 48, medication: "Prednisone", genericName: "Prednisone", dosage: "10mg", frequency: "Once daily", duration: "14 days", quantity: 14, refills: 0, status: "pending", dateIssued: new Date(), expiryDate: addDays(new Date(), 14), doctorName: "Dr. Sarah Johnson", instructions: "Take with food, taper as directed", pharmacy: "CVS Pharmacy", category: "Steroid", sideEffects: ["Insomnia", "Increased appetite"] },
  { id: "RX008", patientName: "Jennifer Davis", patientAge: 55, medication: "Gabapentin", genericName: "Gabapentin", dosage: "300mg", frequency: "Three times daily", duration: "30 days", quantity: 90, refills: 2, status: "pending", dateIssued: new Date(), expiryDate: addDays(new Date(), 365), doctorName: "Dr. James Wilson", instructions: "May cause drowsiness", pharmacy: "Walgreens", category: "Nerve Pain", sideEffects: ["Dizziness", "Drowsiness"] },
  { id: "RX009", patientName: "James Lee", patientAge: 52, medication: "Levothyroxine", genericName: "Levothyroxine Sodium", dosage: "75mcg", frequency: "Once daily", duration: "90 days", quantity: 90, refills: 5, status: "completed", dateIssued: addDays(new Date(), -90), expiryDate: addDays(new Date(), 275), doctorName: "Dr. Anna White", instructions: "Take on empty stomach", pharmacy: "Rite Aid", category: "Thyroid", sideEffects: ["Weight loss", "Insomnia"] },
  { id: "RX010", patientName: "Patricia Moore", patientAge: 63, medication: "Warfarin", genericName: "Warfarin Sodium", dosage: "5mg", frequency: "Once daily", duration: "90 days", quantity: 90, refills: 3, status: "completed", dateIssued: addDays(new Date(), -95), expiryDate: addDays(new Date(), 270), doctorName: "Dr. Michael Chen", instructions: "Regular INR monitoring required", pharmacy: "CVS Pharmacy", category: "Blood Thinner", sideEffects: ["Bleeding", "Bruising"] },
  { id: "RX011", patientName: "William Garcia", patientAge: 39, medication: "Sertraline", genericName: "Sertraline HCL", dosage: "50mg", frequency: "Once daily", duration: "90 days", quantity: 90, refills: 2, status: "completed", dateIssued: addDays(new Date(), -100), expiryDate: addDays(new Date(), 265), doctorName: "Dr. Emily Davis", instructions: "Take in the morning", pharmacy: "Walgreens", category: "Antidepressant", sideEffects: ["Nausea", "Insomnia"] },
];

interface RefillRequest {
  id: string;
  prescriptionId: string;
  patientName: string;
  medication: string;
  requestDate: Date;
  status: "pending" | "approved" | "denied";
  pharmacyNotes?: string;
}

const REFILL_REQUESTS: RefillRequest[] = [
  { id: "RF001", prescriptionId: "RX001", patientName: "John Smith", medication: "Lisinopril 10mg", requestDate: new Date(), status: "pending", pharmacyNotes: "Patient called for refill" },
  { id: "RF002", prescriptionId: "RX003", patientName: "Robert Brown", medication: "Metformin 850mg", requestDate: addDays(new Date(), -1), status: "approved", pharmacyNotes: "Approved by Dr. Johnson" },
  { id: "RF003", prescriptionId: "RX004", patientName: "Lisa Anderson", medication: "Atorvastatin 20mg", requestDate: addDays(new Date(), -2), status: "pending", pharmacyNotes: "Awaiting doctor approval" },
  { id: "RF004", prescriptionId: "RX005", patientName: "David Martinez", medication: "Albuterol 90mcg", requestDate: addDays(new Date(), -3), status: "approved", pharmacyNotes: "Ready for pickup" },
];

export function PrescriptionSystem() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(STATIC_PRESCRIPTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("active");
  const itemsPerPage = 6;

  const filteredPrescriptions = prescriptions.filter(rx => {
    const matchesSearch = searchTerm === "" || 
      rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || rx.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || rx.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const paginatedPrescriptions = filteredPrescriptions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);

  const stats = [
    { title: "Active Prescriptions", value: prescriptions.filter(p => p.status === "active").length, icon: PillBottle, color: "text-blue-600", bgGradient: "from-blue-500 to-blue-600" },
    { title: "Pending Approval", value: prescriptions.filter(p => p.status === "pending").length, icon: Clock, color: "text-orange-600", bgGradient: "from-orange-500 to-orange-600" },
    { title: "Expiring Soon", value: 12, icon: AlertTriangle, color: "text-red-600", bgGradient: "from-red-500 to-red-600" },
    { title: "Refill Requests", value: 8, icon: CheckCircle2, color: "text-green-600", bgGradient: "from-green-500 to-green-600" },
  ];

  const getStatusColor = (status: string) => {
    const colors = { active: "bg-green-100 text-green-700", completed: "bg-blue-100 text-blue-700", cancelled: "bg-red-100 text-red-700", pending: "bg-yellow-100 text-yellow-700" };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const getCategoryIcon = (category: string) => {
    const icons = { "Blood Pressure": AlertCircle, Antibiotic: Pill, Diabetes: Syringe, Cholesterol: PillBottle, Respiratory: AlertCircle, Gastric: Pill, Thyroid: PillBottle };
    return icons[category as keyof typeof icons] || Pill;
  };

  const handleViewDetails = (rx: Prescription) => {
    setSelectedPrescription(rx);
    setIsModalOpen(true);
  };

  const handlePrint = (rx: Prescription) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescription - ${rx.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; background: white; }
            .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #2563eb; font-size: 28px; margin-bottom: 5px; }
            .header p { color: #64748b; font-size: 14px; }
            .rx-symbol { float: right; font-size: 48px; color: #2563eb; font-weight: bold; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 16px; font-weight: bold; color: #1e293b; margin-bottom: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .info-item { padding: 10px; background: #f8fafc; border-radius: 6px; }
            .info-label { font-size: 12px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
            .info-value { font-size: 15px; color: #1e293b; font-weight: 600; }
            .medication-box { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 25px; }
            .medication-box h2 { font-size: 24px; margin-bottom: 5px; }
            .medication-box p { font-size: 14px; opacity: 0.9; }
            .instructions { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-top: 20px; }
            .instructions strong { color: #92400e; display: block; margin-bottom: 8px; }
            .side-effects { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
            .side-effect-tag { background: #fee2e2; color: #991b1b; padding: 6px 12px; border-radius: 20px; font-size: 12px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px; }
            .signature-line { margin-top: 40px; border-top: 2px solid #1e293b; width: 300px; padding-top: 10px; }
            .signature-label { font-size: 12px; color: #64748b; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="rx-symbol">℞</div>
            <h1>Medical Prescription</h1>
            <p>Prescription ID: ${rx.id} | Date: ${format(rx.dateIssued, 'MMMM d, yyyy')}</p>
          </div>

          <div class="medication-box">
            <h2>${rx.medication}</h2>
            <p>${rx.genericName}</p>
          </div>

          <div class="section">
            <div class="section-title">Patient Information</div>
            <div class="info-grid">
              <div class="info-item"><div class="info-label">Patient Name</div><div class="info-value">${rx.patientName}</div></div>
              <div class="info-item"><div class="info-label">Age</div><div class="info-value">${rx.patientAge} years</div></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Prescription Details</div>
            <div class="info-grid">
              <div class="info-item"><div class="info-label">Dosage</div><div class="info-value">${rx.dosage}</div></div>
              <div class="info-item"><div class="info-label">Frequency</div><div class="info-value">${rx.frequency}</div></div>
              <div class="info-item"><div class="info-label">Duration</div><div class="info-value">${rx.duration}</div></div>
              <div class="info-item"><div class="info-label">Quantity</div><div class="info-value">${rx.quantity} pills</div></div>
              <div class="info-item"><div class="info-label">Refills</div><div class="info-value">${rx.refills} remaining</div></div>
              <div class="info-item"><div class="info-label">Category</div><div class="info-value">${rx.category}</div></div>
            </div>
          </div>

          <div class="instructions">
            <strong>⚠️ Instructions for Use:</strong>
            ${rx.instructions}
          </div>

          ${rx.sideEffects ? `
            <div class="section">
              <div class="section-title">Possible Side Effects</div>
              <div class="side-effects">
                ${rx.sideEffects.map(effect => `<span class="side-effect-tag">${effect}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          ${rx.pharmacy ? `
            <div class="section">
              <div class="info-item"><div class="info-label">Pharmacy</div><div class="info-value">${rx.pharmacy}</div></div>
            </div>
          ` : ''}

          <div class="signature-line">
            <div class="signature-label">Prescribing Physician</div>
            <div class="info-value">${rx.doctorName}</div>
          </div>

          <div class="footer">
            <p>This prescription is valid until ${format(rx.expiryDate, 'MMMM d, yyyy')}</p>
            <p style="margin-top: 10px;">For medical use only. Keep out of reach of children.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Prescription Management</h2>
          <p className="text-muted-foreground mt-1">Manage medications, dosages, and refills</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />Upload Prescription
          </Button>
          <Button onClick={() => router.push('/prescriptions/add')}>
            <Plus className="h-4 w-4 mr-2" />New Prescription
          </Button>
        </div>
      </div>

      <StatsCardGrid>
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </StatsCardGrid>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="hidden md:block">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="refills">Refills</TabsTrigger>
          </TabsList>
        </div>
        <div className="md:hidden mb-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Prescriptions</SelectItem>
              <SelectItem value="pending">Pending Approval</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="refills">Refill Requests</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="active" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by patient, medication, or doctor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                    <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={(val) => { setCategoryFilter(val); setCurrentPage(1); }}>
                    <SelectTrigger className="w-[150px]"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Blood Pressure">Blood Pressure</SelectItem>
                      <SelectItem value="Diabetes">Diabetes</SelectItem>
                      <SelectItem value="Antibiotic">Antibiotic</SelectItem>
                      <SelectItem value="Cholesterol">Cholesterol</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground self-center">Showing {paginatedPrescriptions.length} of {filteredPrescriptions.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedPrescriptions.map((rx) => {
              const CategoryIcon = getCategoryIcon(rx.category);
              return (
                <Card key={rx.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewDetails(rx)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <CategoryIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{rx.medication}</CardTitle>
                          <p className="text-xs text-muted-foreground">{rx.genericName}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(rx.status)}>{rx.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{rx.patientName}</span>
                      <span className="text-muted-foreground">({rx.patientAge}y)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Dosage</p>
                        <p className="font-medium">{rx.dosage}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Frequency</p>
                        <p className="font-medium">{rx.frequency}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Pill className="h-3 w-3" />
                        <span>{rx.quantity} pills</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{rx.refills} refills</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); handlePrint(rx); }}><Printer className="h-3 w-3 mr-1" />Print</Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); }}><Send className="h-3 w-3 mr-1" />Send</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pb-6">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Previous</span>
              </Button>
              <span className="text-sm whitespace-nowrap">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                <span className="hidden sm:inline">Next</span><ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prescriptions.filter(rx => rx.status === "pending").map((rx) => {
              const CategoryIcon = getCategoryIcon(rx.category);
              return (
                <Card key={rx.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{rx.medication}</CardTitle>
                          <p className="text-xs text-muted-foreground">{rx.patientName}</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p className="text-muted-foreground">Dosage: {rx.dosage}</p>
                      <p className="text-muted-foreground">Doctor: {rx.doctorName}</p>
                      <p className="text-muted-foreground">Requested: {format(rx.dateIssued, "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1"><CheckCircle2 className="h-3 w-3 mr-1" />Approve</Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewDetails(rx)}><Eye className="h-3 w-3 mr-1" />View</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Prescription History</CardTitle>
              <CardDescription>Completed prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prescriptions.filter(rx => rx.status === "completed").map((rx) => (
                  <div key={rx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{rx.medication} - {rx.dosage}</h3>
                        <p className="text-sm text-muted-foreground">{rx.patientName} • {rx.doctorName}</p>
                        <p className="text-xs text-muted-foreground">Completed: {format(rx.dateIssued, "MMM d, yyyy")}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(rx)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refills">
          <Card>
            <CardHeader>
              <CardTitle>Refill Requests</CardTitle>
              <CardDescription>Manage prescription refill requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {REFILL_REQUESTS.map((refill) => (
                  <div key={refill.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${refill.status === "approved" ? "bg-green-100" : refill.status === "denied" ? "bg-red-100" : "bg-yellow-100"}`}>
                        {refill.status === "approved" ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : refill.status === "denied" ? <AlertCircle className="h-5 w-5 text-red-600" /> : <Clock className="h-5 w-5 text-yellow-600" />}
                      </div>
                      <div>
                        <h3 className="font-medium">{refill.medication}</h3>
                        <p className="text-sm text-muted-foreground">{refill.patientName}</p>
                        <p className="text-xs text-muted-foreground">Requested: {format(refill.requestDate, "MMM d, yyyy")}</p>
                        {refill.pharmacyNotes && <p className="text-xs text-muted-foreground mt-1">Note: {refill.pharmacyNotes}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {refill.status === "pending" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"><CheckCircle2 className="h-4 w-4 mr-1" />Approve</Button>
                          <Button size="sm" variant="destructive"><AlertCircle className="h-4 w-4 mr-1" />Deny</Button>
                        </>
                      )}
                      {refill.status === "approved" && <Badge className="bg-green-100 text-green-700">Approved</Badge>}
                      {refill.status === "denied" && <Badge className="bg-red-100 text-red-700">Denied</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PrescriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} prescription={selectedPrescription} onPrint={handlePrint} />
      <UploadPrescriptionModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </div>
  );
}

function UploadPrescriptionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'application/pdf' || file.type.startsWith('image/')
    );
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setIsUploading(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUploading(false);
    setUploadedFiles([]);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Upload className="h-5 w-5 text-white" />
            </div>
            Upload Prescription
          </DialogTitle>
          <DialogDescription>
            Upload prescription images or PDF files for processing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
              isDragging 
                ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-xl opacity-20 animate-pulse" />
                <div className="relative p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  or click to browse from your device
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>PDF</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>JPG</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>PNG</span>
                </div>
                <span>•</span>
                <span>Max 10MB per file</span>
              </div>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <File className="h-4 w-4" />
                Uploaded Files ({uploadedFiles.length})
              </h4>
              <ScrollArea className="max-h-48">
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg group hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {file.type === 'application/pdf' ? (
                            <FileText className="h-5 w-5 text-red-500" />
                          ) : (
                            <File className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={uploadedFiles.length === 0 || isUploading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {uploadedFiles.length > 0 && `(${uploadedFiles.length})`}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PrescriptionModal({ isOpen, onClose, prescription, onPrint }: { isOpen: boolean; onClose: () => void; prescription: Prescription | null; onPrint: (rx: Prescription) => void }) {
  if (!prescription) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Prescription Details</DialogTitle>
          <DialogDescription>Complete prescription information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-muted rounded-lg">
            <div>
              <h3 className="font-semibold text-base sm:text-lg">{prescription.medication}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{prescription.genericName}</p>
            </div>
            <Badge className={prescription.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>{prescription.status}</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div><Label className="text-xs sm:text-sm">Patient</Label><p className="font-medium text-sm sm:text-base">{prescription.patientName} ({prescription.patientAge}y)</p></div>
            <div><Label className="text-xs sm:text-sm">Doctor</Label><p className="font-medium text-sm sm:text-base">{prescription.doctorName}</p></div>
            <div><Label className="text-xs sm:text-sm">Dosage</Label><p className="font-medium text-sm sm:text-base">{prescription.dosage}</p></div>
            <div><Label className="text-xs sm:text-sm">Frequency</Label><p className="font-medium text-sm sm:text-base">{prescription.frequency}</p></div>
            <div><Label className="text-xs sm:text-sm">Duration</Label><p className="font-medium text-sm sm:text-base">{prescription.duration}</p></div>
            <div><Label className="text-xs sm:text-sm">Quantity</Label><p className="font-medium text-sm sm:text-base">{prescription.quantity} pills</p></div>
            <div><Label className="text-xs sm:text-sm">Refills Remaining</Label><p className="font-medium text-sm sm:text-base">{prescription.refills}</p></div>
            <div><Label className="text-xs sm:text-sm">Category</Label><p className="font-medium text-sm sm:text-base">{prescription.category}</p></div>
            <div><Label className="text-xs sm:text-sm">Date Issued</Label><p className="font-medium text-sm sm:text-base">{format(prescription.dateIssued, "MMM d, yyyy")}</p></div>
            <div><Label className="text-xs sm:text-sm">Expiry Date</Label><p className="font-medium text-sm sm:text-base">{format(prescription.expiryDate, "MMM d, yyyy")}</p></div>
          </div>

          <div><Label className="text-xs sm:text-sm">Instructions</Label><p className="text-xs sm:text-sm text-muted-foreground mt-1">{prescription.instructions}</p></div>

          {prescription.sideEffects && (
            <div>
              <Label className="text-xs sm:text-sm">Possible Side Effects</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {prescription.sideEffects.map((effect, idx) => (
                  <Badge key={idx} variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">{effect}</Badge>
                ))}
              </div>
            </div>
          )}

          {prescription.pharmacy && (
            <div><Label className="text-xs sm:text-sm">Pharmacy</Label><p className="font-medium text-sm sm:text-base">{prescription.pharmacy}</p></div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button className="flex-1" size="sm" onClick={() => onPrint(prescription)}><Printer className="h-4 w-4 mr-2" />Print</Button>
            <Button variant="outline" className="flex-1" size="sm"><Download className="h-4 w-4 mr-2" />Download</Button>
            <Button variant="outline" className="flex-1" size="sm"><Send className="h-4 w-4 mr-2" />Send</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
