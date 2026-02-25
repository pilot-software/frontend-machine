import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsCard, StatsCardGrid } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EnterprisePageHeader } from "@/components/shared/EnterprisePageHeader";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Plus,
  Receipt,
  Search,
  TrendingDown,
  TrendingUp,
  Activity,
  Users,
  Calendar,
  PieChart,
  BarChart3,
  Wallet,
  Shield,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Pill,
  Stethoscope,
  TestTube,
  Ambulance,
  Building2,
  Send,
  RefreshCw,
} from "lucide-react";
import { billingService } from "@/lib/services/billing";
import { useApi } from "@/lib/hooks/useApi";
import {
  BillingTableSkeleton,
  FinancialStatsSkeleton,
} from "@/components/skeletons";
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";

interface Bill {
  id: string;
  patientName: string;
  caseNumber: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "partial";
  dateIssued: string;
  dueDate: string;
  services: string[];
  insurance: string;
  patientResponsibility: number;
}

interface Payment {
  id: string;
  patientName: string;
  amount: number;
  method: "cash" | "card" | "insurance" | "check";
  date: string;
  billId: string;
  status: "completed" | "pending" | "failed";
}

const mockPayments: Payment[] = [
  {
    id: "1",
    patientName: "John Smith",
    amount: 250.0,
    method: "card",
    date: "2024-07-20",
    billId: "1",
    status: "completed",
  },
  {
    id: "2",
    patientName: "Sarah Wilson",
    amount: 150.0,
    method: "cash",
    date: "2024-07-25",
    billId: "4",
    status: "completed",
  },
  {
    id: "3",
    patientName: "Emma Davis",
    amount: 700.0,
    method: "insurance",
    date: "2024-07-26",
    billId: "2",
    status: "pending",
  },
];

export function FinancialManagement() {
  const t = useTranslations('common');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [activeTab, setActiveTab] = useState("billing");

  const {
    execute: fetchBilling,
    data: billingData,
    statusCode,
    loading,
  } = useApi();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && !statusCode) {
      hasFetched.current = true;
      fetchBilling(() => billingService.getBillingRecords());
    }
  }, [fetchBilling, statusCode]);

  const financialStats = [
    {
      label: "Total Revenue",
      value: "$45,230",
      change: "+12%",
      icon: DollarSign,
      color: "text-green-600",
      trend: "up",
    },
    {
      label: "Outstanding Bills",
      value: "$12,450",
      change: "-5%",
      icon: FileText,
      color: "text-orange-600",
      trend: "down",
    },
    {
      label: "Collected Today",
      value: "$3,200",
      change: "+18%",
      icon: CreditCard,
      color: "text-blue-600",
      trend: "up",
    },
    {
      label: "Insurance Claims",
      value: "$28,900",
      change: "+8%",
      icon: Receipt,
      color: "text-purple-600",
      trend: "up",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
      case "failed":
        return "bg-red-100 text-red-800";
      case "partial":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return CheckCircle2;
      case "pending":
        return Clock;
      case "overdue":
      case "failed":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return CreditCard;
      case "cash":
        return DollarSign;
      case "insurance":
        return Receipt;
      case "check":
        return FileText;
      default:
        return DollarSign;
    }
  };

  const billingList = billingData?.data || billingData || [];
  const sampleBills: Bill[] = [
    {
      id: "INV-2024-001",
      patientName: "John Smith",
      caseNumber: "CS-2024-1234",
      amount: 2850.00,
      status: "paid",
      dateIssued: "2024-07-15",
      dueDate: "2024-08-15",
      services: ["General Consultation", "Blood Test", "X-Ray"],
      insurance: "Blue Cross Blue Shield",
      patientResponsibility: 285.00,
    },
    {
      id: "INV-2024-002",
      patientName: "Sarah Wilson",
      caseNumber: "CS-2024-1235",
      amount: 5600.00,
      status: "pending",
      dateIssued: "2024-07-18",
      dueDate: "2024-08-18",
      services: ["Surgery - Appendectomy", "Anesthesia", "Post-op Care"],
      insurance: "United Healthcare",
      patientResponsibility: 1120.00,
    },
    {
      id: "INV-2024-003",
      patientName: "Emma Davis",
      caseNumber: "CS-2024-1236",
      amount: 1250.00,
      status: "overdue",
      dateIssued: "2024-06-20",
      dueDate: "2024-07-20",
      services: ["Physical Therapy - 5 sessions"],
      insurance: "Aetna",
      patientResponsibility: 250.00,
    },
    {
      id: "INV-2024-004",
      patientName: "Michael Brown",
      caseNumber: "CS-2024-1237",
      amount: 3400.00,
      status: "partial",
      dateIssued: "2024-07-22",
      dueDate: "2024-08-22",
      services: ["MRI Scan", "Specialist Consultation", "Lab Tests"],
      insurance: "Cigna",
      patientResponsibility: 680.00,
    },
    {
      id: "INV-2024-005",
      patientName: "Lisa Anderson",
      caseNumber: "CS-2024-1238",
      amount: 890.00,
      status: "paid",
      dateIssued: "2024-07-25",
      dueDate: "2024-08-25",
      services: ["Dental Cleaning", "Cavity Filling"],
      insurance: "Delta Dental",
      patientResponsibility: 178.00,
    },
    {
      id: "INV-2024-006",
      patientName: "David Martinez",
      caseNumber: "CS-2024-1239",
      amount: 7800.00,
      status: "pending",
      dateIssued: "2024-07-26",
      dueDate: "2024-08-26",
      services: ["Emergency Room Visit", "CT Scan", "Overnight Stay"],
      insurance: "Medicare",
      patientResponsibility: 1560.00,
    },
    {
      id: "INV-2024-007",
      patientName: "Jennifer Lee",
      caseNumber: "CS-2024-1240",
      amount: 450.00,
      status: "paid",
      dateIssued: "2024-07-28",
      dueDate: "2024-08-28",
      services: ["Annual Checkup", "Vaccination"],
      insurance: "Humana",
      patientResponsibility: 90.00,
    },
    {
      id: "INV-2024-008",
      patientName: "Robert Taylor",
      caseNumber: "CS-2024-1241",
      amount: 2100.00,
      status: "overdue",
      dateIssued: "2024-06-15",
      dueDate: "2024-07-15",
      services: ["Cardiology Consultation", "ECG", "Stress Test"],
      insurance: "Kaiser Permanente",
      patientResponsibility: 420.00,
    },
  ];
  
  const mockBills = billingList.length > 0 
    ? (Array.isArray(billingList) ? billingList : []).map(
        (bill: any) => ({
          id: bill.id,
          patientName: "Patient Name",
          caseNumber: bill.patientId,
          amount: bill.amount,
          status: bill.status.toLowerCase(),
          dateIssued: bill.billingDate,
          dueDate: bill.dueDate,
          services: [bill.serviceDescription],
          insurance: "Insurance Provider",
          patientResponsibility: bill.amountDue,
        })
      )
    : sampleBills;

  const filteredBills = mockBills.filter((bill: any) => {
    const matchesSearch =
      bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || bill.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExportReport = () => {
    toast.loading("Generating financial report...");
    setTimeout(() => {
      const data = JSON.stringify(mockBills, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      toast.success("Report downloaded successfully!");
    }, 1500);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Invoice created successfully!");
    setIsInvoiceDialogOpen(false);
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Insurance claim submitted for processing!");
    setIsClaimDialogOpen(false);
  };

  const handleViewBill = (bill: Bill) => {
    setSelectedBill(bill);
    toast.info(`Viewing invoice ${bill.id} for ${bill.patientName}`);
  };

  const handleDownloadBill = (bill: Bill) => {
    toast.success(`Invoice ${bill.id} downloaded!`);
  };

  return (
    <div className="space-y-6">
      <EnterprisePageHeader
        icon={CreditCard}
        title="Financial Management"
        description="Billing, payments, and revenue management"
        breadcrumbs={[
          { label: "Dashboard", href: "/en/dashboard" },
          { label: "Financial" },
        ]}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>
                  Generate a new invoice for patient services
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateInvoice}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input id="patientName" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="caseNumber">Case Number</Label>
                      <Input id="caseNumber" placeholder="CS-2024-XXXX" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Total Amount</Label>
                      <Input id="amount" type="number" placeholder="0.00" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insurance">Insurance Provider</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
                          <SelectItem value="united">United Healthcare</SelectItem>
                          <SelectItem value="aetna">Aetna</SelectItem>
                          <SelectItem value="cigna">Cigna</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="services">Services Provided</Label>
                    <Textarea id="services" placeholder="List services..." rows={3} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input id="dueDate" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientPays">Patient Responsibility</Label>
                      <Input id="patientPays" type="number" placeholder="0.00" required />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsInvoiceDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Invoice</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        }
      />

      {/* Financial Stats */}
      {loading ? (
        <FinancialStatsSkeleton />
      ) : (
        <StatsCardGrid>
          <StatsCard
            title="Total Revenue"
            value={45230}
            icon={DollarSign}
            color="text-green-600"
            bgGradient="from-green-500 to-green-600"
            change="+12%"
            trend="up"
          />
          <StatsCard
            title="Outstanding Bills"
            value={12450}
            icon={FileText}
            color="text-orange-600"
            bgGradient="from-orange-500 to-orange-600"
            change="-5%"
            trend="down"
          />
          <StatsCard
            title="Collected Today"
            value={3200}
            icon={CreditCard}
            color="text-blue-600"
            bgGradient="from-blue-500 to-blue-600"
            change="+18%"
            trend="up"
          />
          <StatsCard
            title="Insurance Claims"
            value={28900}
            icon={Receipt}
            color="text-purple-600"
            bgGradient="from-purple-500 to-purple-600"
            change="+8%"
            trend="up"
          />
        </StatsCardGrid>
      )}

      {/* Financial Management Tabs */}
      <div className="w-full">
        <div className="border-b -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveTab('billing')} className={`flex items-center gap-2 px-3 sm:px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${activeTab === 'billing' ? 'border-primary text-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`}>
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Billing & Invoices</span>
              <span className="sm:hidden">Billing</span>
            </button>
            <button onClick={() => setActiveTab('payments')} className={`flex items-center gap-2 px-3 sm:px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${activeTab === 'payments' ? 'border-primary text-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`}>
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
              <span className="sm:hidden">Pay</span>
            </button>
            <button onClick={() => setActiveTab('claims')} className={`flex items-center gap-2 px-3 sm:px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${activeTab === 'claims' ? 'border-primary text-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`}>
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Insurance Claims</span>
              <span className="sm:hidden">Claims</span>
            </button>
            <button onClick={() => setActiveTab('reports')} className={`flex items-center gap-2 px-3 sm:px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${activeTab === 'reports' ? 'border-primary text-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`}>
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Financial Reports</span>
              <span className="sm:hidden">Reports</span>
            </button>
          </div>
        </div>

        <div className={activeTab === 'billing' ? 'space-y-6' : 'hidden'}>
          {/* Search and Filters */}
          <div className="pt-6" />
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bills by patient name or case number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex space-x-2">
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">{t("pending")}</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bills Table */}
          {loading ? (
            <BillingTableSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Patient Bills & Invoices</CardTitle>
                <CardDescription>
                  All patient billing information and payment status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("patient")}</TableHead>
                      <TableHead>Case #</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Insurance</TableHead>
                      <TableHead>Patient Pays</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBills.map((bill: Bill) => {
                      const StatusIcon = getStatusIcon(bill.status);
                      return (
                        <TableRow key={bill.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{bill.patientName}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="bg-muted px-2 py-1 rounded text-sm">
                              {bill.caseNumber}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {bill.services.map(
                                (service: string, index: number) => (
                                  <div
                                    key={index}
                                    className="text-sm text-muted-foreground"
                                  >
                                    • {service}
                                  </div>
                                )
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">
                              ${bill.amount.toFixed(2)}
                            </p>
                          </TableCell>
                          <TableCell>{bill.insurance}</TableCell>
                          <TableCell>
                            <p className="font-medium text-blue-600">
                              ${(bill.patientResponsibility || 0).toFixed(2)}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(bill.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {bill.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{bill.dueDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewBill(bill)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDownloadBill(bill)}>
                                <Download className="h-4 w-4" />
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
          )}
        </div>

        <div className={activeTab === 'payments' ? 'space-y-6' : 'hidden'}>
          <div className="pt-6" />
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Recent payments and transaction history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>{t("patient")}</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayments.map((payment) => {
                    const PaymentIcon = getPaymentMethodIcon(payment.method);
                    const StatusIcon = getStatusIcon(payment.status);
                    return (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{payment.patientName}</TableCell>
                        <TableCell>
                          <p className="font-medium">
                            ${payment.amount.toFixed(2)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <PaymentIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="capitalize">{payment.method}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payment.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => toast.info(`Viewing payment ${payment.id} for ${payment.patientName}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className={activeTab === 'claims' ? 'space-y-6' : 'hidden'}>
          <div className="pt-6" />
          {/* Insurance Overview Cards with Mini Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Claims</p>
                    <p className="text-3xl font-bold mt-1">47</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={[
                    { value: 35 }, { value: 38 }, { value: 42 }, { value: 45 }, { value: 47 }
                  ]}>
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#blueGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved Claims</p>
                    <p className="text-3xl font-bold mt-1">$156K</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Approval Rate</span>
                    <span className="font-semibold text-green-600">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
                <p className="text-xs text-green-600 mt-3 flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> 142 of 160 approved
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-3xl font-bold mt-1">23</p>
                  </div>
                  <div className="p-3 bg-orange-500/10 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Avg Processing</span>
                    <span className="font-semibold">5 days</span>
                  </div>
                  <div className="flex gap-1">
                    {[65, 45, 80, 55, 70].map((h, i) => (
                      <div key={i} className="flex-1 bg-orange-200 rounded-sm" style={{ height: `${h}%` }}>
                        <div className="bg-orange-500 rounded-sm h-full" style={{ height: `${Math.random() * 100}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-orange-600 mt-3 flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> 18 under 7 days
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded-bl-full" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Denied Claims</p>
                    <p className="text-3xl font-bold mt-1">7</p>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={60}>
                  <BarChart data={[
                    { value: 12 }, { value: 9 }, { value: 11 }, { value: 8 }, { value: 7 }
                  ]}>
                    <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" /> -3% improvement
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Insurance Providers & Claims */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Insurance Providers</CardTitle>
                <CardDescription>Claims volume by provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Blue Cross Blue Shield", claims: 156, amount: 45230, color: "bg-blue-500" },
                  { name: "United Healthcare", claims: 134, amount: 38900, color: "bg-green-500" },
                  { name: "Aetna", claims: 98, amount: 28450, color: "bg-purple-500" },
                  { name: "Cigna", claims: 76, amount: 21340, color: "bg-orange-500" },
                  { name: "Medicare", claims: 65, amount: 18900, color: "bg-red-500" },
                ].map((provider, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{provider.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-muted-foreground">{provider.claims} claims</span>
                        <span className="font-semibold">${provider.amount.toLocaleString()}</span>
                      </div>
                    </div>
                    <Progress value={(provider.claims / 156) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Claims by Status</CardTitle>
                <CardDescription>Current claim processing status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: "Approved", count: 142, amount: 156890, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
                    { status: "Pending", count: 23, amount: 34560, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
                    { status: "Under Review", count: 18, amount: 28900, icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
                    { status: "Denied", count: 7, amount: 12340, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className={`p-4 rounded-lg ${item.bg} border border-opacity-20`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Icon className={`h-5 w-5 ${item.color}`} />
                            <div>
                              <p className="font-medium">{item.status}</p>
                              <p className="text-sm text-muted-foreground">{item.count} claims</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${item.amount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Total value</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Claims Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Insurance Claims</CardTitle>
                  <CardDescription>Latest submitted and processed claims</CardDescription>
                </div>
                <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Submit New Claim
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Submit Insurance Claim</DialogTitle>
                      <DialogDescription>
                        Submit a new claim to insurance provider
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitClaim}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="claimPatient">Patient Name</Label>
                            <Input id="claimPatient" placeholder="John Doe" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="provider">Insurance Provider</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
                                <SelectItem value="united">United Healthcare</SelectItem>
                                <SelectItem value="aetna">Aetna</SelectItem>
                                <SelectItem value="cigna">Cigna</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="serviceType">Service Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="surgery">Surgery</SelectItem>
                                <SelectItem value="consultation">Consultation</SelectItem>
                                <SelectItem value="lab">Lab Tests</SelectItem>
                                <SelectItem value="medication">Medication</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="claimAmount">Claim Amount</Label>
                            <Input id="claimAmount" type="number" placeholder="0.00" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="diagnosis">Diagnosis Code</Label>
                          <Input id="diagnosis" placeholder="ICD-10 Code" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Textarea id="notes" placeholder="Any additional information..." rows={3} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsClaimDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          <Send className="h-4 w-4 mr-2" />
                          Submit Claim
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Claim Amount</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: "CLM-2024-001", patient: "John Smith", provider: "Blue Cross", service: "Surgery", amount: 12500, approved: 11200, status: "approved", date: "2024-07-20" },
                    { id: "CLM-2024-002", patient: "Sarah Wilson", provider: "United HC", service: "Lab Tests", amount: 850, approved: 850, status: "approved", date: "2024-07-22" },
                    { id: "CLM-2024-003", patient: "Emma Davis", provider: "Aetna", service: "Consultation", amount: 450, approved: 0, status: "pending", date: "2024-07-25" },
                    { id: "CLM-2024-004", patient: "Michael Brown", provider: "Cigna", service: "Medication", amount: 1200, approved: 960, status: "partial", date: "2024-07-26" },
                  ].map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-xs">{claim.id}</code>
                      </TableCell>
                      <TableCell className="font-medium">{claim.patient}</TableCell>
                      <TableCell>{claim.provider}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{claim.service}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">${claim.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-green-600 font-medium">
                        {claim.approved > 0 ? `$${claim.approved.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{claim.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => toast.info(`Viewing claim ${claim.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => toast.loading(`Checking status for claim ${claim.id}...`)}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className={activeTab === 'reports' ? 'space-y-6' : 'hidden'}>
          <div className="pt-6" />
          {/* Revenue Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[
                    { month: "Jan", revenue: 32000, expenses: 18000 },
                    { month: "Feb", revenue: 35000, expenses: 19500 },
                    { month: "Mar", revenue: 38000, expenses: 20000 },
                    { month: "Apr", revenue: 42000, expenses: 21000 },
                    { month: "May", revenue: 41000, expenses: 20500 },
                    { month: "Jun", revenue: 45230, expenses: 22000 },
                  ]}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpenses)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Department</CardTitle>
                <CardDescription>Service-wise revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { dept: "Surgery", revenue: 15600 },
                    { dept: "Consultation", revenue: 8900 },
                    { dept: "Lab Tests", revenue: 6700 },
                    { dept: "Pharmacy", revenue: 5400 },
                    { dept: "Emergency", revenue: 4800 },
                    { dept: "Radiology", revenue: 3830 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="dept" className="text-xs" angle={-45} textAnchor="end" height={80} />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Service Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Revenue Services</CardTitle>
                <CardDescription>Healthcare services generating highest revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { service: "Surgical Procedures", icon: Stethoscope, revenue: 15600, patients: 45, avg: 347, growth: 12 },
                    { service: "Diagnostic Imaging", icon: Activity, revenue: 8900, patients: 156, avg: 57, growth: 8 },
                    { service: "Laboratory Tests", icon: TestTube, revenue: 6700, patients: 234, avg: 29, growth: 15 },
                    { service: "Pharmacy Services", icon: Pill, revenue: 5400, patients: 189, avg: 29, growth: 5 },
                    { service: "Emergency Care", icon: Ambulance, revenue: 4800, patients: 67, avg: 72, growth: -3 },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{item.service}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-muted-foreground">
                                <Users className="h-3 w-3 inline mr-1" />
                                {item.patients} patients
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Avg: ${item.avg}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">${item.revenue.toLocaleString()}</p>
                          <p className={`text-sm flex items-center justify-end ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.growth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                            {Math.abs(item.growth)}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { method: "Insurance", percentage: 64, amount: 28900, icon: Shield, color: "bg-blue-500" },
                    { method: "Credit Card", percentage: 22, amount: 9950, icon: CreditCard, color: "bg-green-500" },
                    { method: "Cash", percentage: 10, amount: 4520, icon: DollarSign, color: "bg-purple-500" },
                    { method: "Check", percentage: 4, amount: 1860, icon: FileText, color: "bg-orange-500" },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{item.method}</span>
                          </div>
                          <span className="text-sm font-semibold">{item.percentage}%</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">${item.amount.toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Total Collected</span>
                  <span className="text-lg font-bold">$45,230</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Insights with Interactive Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Collection Rate</p>
                    <p className="text-4xl font-bold mt-1 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">94.2%</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={94.2} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Target: 90%</span>
                    <span className="text-green-600 font-semibold">+4.2%</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">vs last month</span>
                  <span className="text-sm font-semibold text-green-600">+2.3%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Bill Amount</p>
                    <p className="text-4xl font-bold mt-1 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">$487</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                    <Receipt className="h-6 w-6 text-white" />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={50}>
                  <LineChart data={[
                    { amt: 420 }, { amt: 445 }, { amt: 460 }, { amt: 475 }, { amt: 487 }
                  ]}>
                    <Line type="monotone" dataKey="amt" stroke="#3b82f6" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Monthly growth</span>
                  <span className="text-sm font-semibold text-green-600">+8%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Patients</p>
                    <p className="text-4xl font-bold mt-1 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">1,247</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <p className="text-xs text-muted-foreground">New</p>
                    <p className="text-lg font-bold text-purple-600">156</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-xs text-muted-foreground">Return</p>
                    <p className="text-lg font-bold text-blue-600">891</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-xs text-muted-foreground">VIP</p>
                    <p className="text-lg font-bold text-green-600">200</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">This month</span>
                  <span className="text-sm font-semibold text-green-600">+156</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue Amount</p>
                    <p className="text-4xl font-bold mt-1 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">$8.4K</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">0-30 days</span>
                    <span className="font-semibold">$3.2K</span>
                  </div>
                  <Progress value={38} className="h-1.5" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">30-60 days</span>
                    <span className="font-semibold">$2.8K</span>
                  </div>
                  <Progress value={33} className="h-1.5" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">60+ days</span>
                    <span className="font-semibold text-red-600">$2.4K</span>
                  </div>
                  <Progress value={29} className="h-1.5" />
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">23 accounts</span>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.info("Opening overdue accounts for follow-up actions")}>
                    Follow Up
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
