'use client';

import { useState, useEffect } from 'react';
import { billingService, ApiBilling } from '@/lib/services/billing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { DollarSign, Download, FileText } from 'lucide-react';

export default function BillingDetails() {
  const [billings, setBillings] = useState<ApiBilling[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    loadBillings();
  }, []);

  const loadBillings = async () => {
    try {
      const data = await billingService.getBillingRecords();
      setBillings(data);
    } catch (error) {
      console.error('Failed to load billings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PARTIAL': return 'bg-orange-100 text-orange-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filtered = filter === 'ALL' ? billings : billings.filter(b => b.status === filter);
  const totalRevenue = billings.reduce((sum, b) => sum + b.amount, 0);
  const totalPaid = billings.reduce((sum, b) => sum + b.amountPaid, 0);
  const totalDue = billings.reduce((sum, b) => sum + b.amountDue, 0);

  if (loading) return (
    <div className="p-4">
      <Loader text="Loading billing details..." />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billing Details</h1>
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'PAID', 'OVERDUE'].map(s => (
            <Button key={s} variant={filter === s ? 'default' : 'outline'} size="sm" onClick={() => setFilter(s)}>
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Due</p>
                <p className="text-2xl font-bold text-red-600">${totalDue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing Records ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filtered.map((bill) => (
              <div key={bill.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">Patient ID: {bill.patientId}</p>
                    <p className="text-sm text-gray-500">{bill.serviceDescription}</p>
                  </div>
                  <Badge className={getStatusColor(bill.status)}>{bill.status}</Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Paid</p>
                    <p className="font-semibold text-green-600">${bill.amountPaid.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Due</p>
                    <p className="font-semibold text-red-600">${bill.amountDue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-semibold">{new Date(bill.billingDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-1" />
                    View Invoice
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
