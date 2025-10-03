import React, {useEffect, useRef, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "./ui/card";
import {StatsCard, StatsCardGrid} from "./ui/stats-card";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "./ui/select";
import {Badge} from "./ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "./ui/tabs";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "./ui/table";
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
} from "lucide-react";
import {billingService} from "../lib/services/billing";
import {useApi} from "../lib/hooks/useApi";
import {BillingTableSkeleton, FinancialStatsSkeleton} from "./skeletons";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");

    const {execute: fetchBilling, data: billingData, statusCode, loading} = useApi();
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
    const mockBills = (Array.isArray(billingList) ? billingList : []).map((bill: any) => ({
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
    }));

    const filteredBills = mockBills.filter((bill: any) => {
        const matchesSearch =
            bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bill.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            selectedStatus === "all" || bill.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">
                        Financial Management
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Billing, payments, and revenue management
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2"/>
                        Export Report
                    </Button>
                    <Button>
                        <Plus className="h-4 w-4 mr-2"/>
                        Create Invoice
                    </Button>
                </div>
            </div>

            {/* Financial Stats */}
            {loading ? (
                <FinancialStatsSkeleton/>
            ) : (
                <StatsCardGrid>
                    <StatsCard
                        title="Total Revenue"
                        value="$45,230"
                        icon={DollarSign}
                        color="text-green-600"
                        bgGradient="from-green-500/10 to-green-600/5"
                        change="+12%"
                        trend="up"
                    />
                    <StatsCard
                        title="Outstanding Bills"
                        value="$12,450"
                        icon={FileText}
                        color="text-orange-600"
                        bgGradient="from-orange-500/10 to-orange-600/5"
                        change="-5%"
                        trend="down"
                    />
                    <StatsCard
                        title="Collected Today"
                        value="$3,200"
                        icon={CreditCard}
                        color="text-blue-600"
                        bgGradient="from-blue-500/10 to-blue-600/5"
                        change="+18%"
                        trend="up"
                    />
                    <StatsCard
                        title="Insurance Claims"
                        value="$28,900"
                        icon={Receipt}
                        color="text-purple-600"
                        bgGradient="from-purple-500/10 to-purple-600/5"
                        change="+8%"
                        trend="up"
                    />
                </StatsCardGrid>
            )}

            {/* Financial Management Tabs */}
            <Tabs defaultValue="billing" className="w-full">
                <TabsList>
                    <TabsTrigger value="billing">Billing & Invoices</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="insurance">Insurance Claims</TabsTrigger>
                    <TabsTrigger value="reports">Financial Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="billing" className="space-y-6">
                    {/* Search and Filters */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col space-y-4">
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
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
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="overdue">Overdue</SelectItem>
                                            <SelectItem value="partial">Partial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" size="sm">
                                        <Filter className="h-4 w-4 mr-2"/>
                                        More Filters
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bills Table */}
                    {loading ? (
                        <BillingTableSkeleton/>
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
                                            <TableHead>Patient</TableHead>
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
                                                            <StatusIcon className="h-3 w-3 mr-1"/>
                                                            {bill.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{bill.dueDate}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4"/>
                                                            </Button>
                                                            <Button variant="ghost" size="sm">
                                                                <Download className="h-4 w-4"/>
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
                </TabsContent>

                <TabsContent value="payments" className="space-y-6">
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
                                        <TableHead>Patient</TableHead>
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
                                                        <PaymentIcon className="h-4 w-4 text-muted-foreground"/>
                                                        <span className="capitalize">{payment.method}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(payment.status)}>
                                                        <StatusIcon className="h-3 w-3 mr-1"/>
                                                        {payment.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4"/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="insurance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Insurance Claims</CardTitle>
                            <CardDescription>
                                Insurance claim processing and status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Insurance claims interface will be displayed here.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reports">
                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Reports</CardTitle>
                            <CardDescription>
                                Revenue analytics and financial insights
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Financial reports and analytics will be displayed here.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
