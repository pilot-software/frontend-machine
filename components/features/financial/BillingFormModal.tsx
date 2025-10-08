import React, {useState} from 'react';
import { useTranslations } from "next-intl";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {CreditCard, DollarSign, Save} from 'lucide-react';
import {useAuth} from '@/components/providers/AuthContext';

interface BillingFormData {
    patientId: string;
    amount: number;
    description: string;
    paymentMethod: string;
    status: string;
}

interface PaymentFormData {
    billingId: number;
    patientId: string;
    amount: number;
    paymentMethod: string;
    notes: string;
}

interface BillingFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'billing' | 'payment';
    patientId?: string;
    billingId?: number;
}

export function BillingFormModal({isOpen, onClose, mode, patientId, billingId}: BillingFormModalProps) {
  const t = useTranslations('common');
    const {user} = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [patients, setPatients] = useState<any[]>([]);

    const [billingData, setBillingData] = useState<BillingFormData>({
        patientId: patientId || '',
        amount: 0,
        description: '',
        paymentMethod: 'INSURANCE',
        status: 'PENDING'
    });

    const [paymentData, setPaymentData] = useState<PaymentFormData>({
        billingId: billingId || 0,
        patientId: patientId || '',
        amount: 0,
        paymentMethod: 'CREDIT_CARD',
        notes: ''
    });

    // Load patients when modal opens
    React.useEffect(() => {
        const loadPatients = async () => {
            if (isOpen) {
                try {
                    const {patientService} = await import('@/lib/services/patient');
                    const patientsData = await patientService.getPatients();
                    setPatients(patientsData);
                } catch (error) {
                    console.error('Failed to load patients:', error);
                }
            }
        };
        loadPatients();
    }, [isOpen]);

    const paymentMethods = [
        {value: 'CREDIT_CARD', label: 'Credit Card'},
        {value: 'DEBIT_CARD', label: 'Debit Card'},
        {value: 'CASH', label: 'Cash'},
        {value: 'CHECK', label: 'Check'},
        {value: 'INSURANCE', label: 'Insurance'},
        {value: 'BANK_TRANSFER', label: 'Bank Transfer'}
    ];

    const handleBillingChange = (field: keyof BillingFormData, value: string | number) => {
        setBillingData(prev => ({...prev, [field]: value}));
    };

    const handlePaymentChange = (field: keyof PaymentFormData, value: string | number) => {
        setPaymentData(prev => ({...prev, [field]: value}));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (mode === 'billing') {
                const {api} = await import('@/lib/api');
                await api.post('/financial', billingData);
            } else {
                const {api} = await import('@/lib/api');
                await api.post('/financial/payments', paymentData);
            }
            onClose();
        } catch (error) {
            console.error('Failed to process transaction:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[600px] max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        {mode === 'billing' ? (
                            <>
                                <DollarSign className="h-5 w-5 text-green-600"/>
                                <span>Create Billing Record</span>
                            </>
                        ) : (
                            <>
                                <CreditCard className="h-5 w-5 text-blue-600"/>
                                <span>Process Payment</span>
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'billing'
                            ? 'Create a new billing record for patient services'
                            : 'Process payment for an existing billing record'
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {mode === 'billing' ? 'Billing Information' : 'Payment Information'}
                            </CardTitle>
                            <CardDescription>
                                {mode === 'billing'
                                    ? 'Enter billing details and service information'
                                    : 'Enter payment details and transaction information'
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mode === 'billing' ? (
                                <>
                                    <div>
                                        <Label htmlFor="patient">Patient *</Label>
                                        <Select
                                            value={billingData.patientId}
                                            onValueChange={(value) => handleBillingChange('patientId', value)}
                                            disabled={!!patientId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select patient"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.isArray(patients) && patients.map((patient) => (
                                                    <SelectItem key={patient.id} value={patient.id}>
                                                        {patient.firstName} {patient.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="amount">Amount *</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                step="0.01"
                                                value={billingData.amount}
                                                onChange={(e) => handleBillingChange('amount', parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="paymentMethod">Payment Method</Label>
                                            <Select
                                                value={billingData.paymentMethod}
                                                onValueChange={(value) => handleBillingChange('paymentMethod', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {paymentMethods.map((method) => (
                                                        <SelectItem key={method.value} value={method.value}>
                                                            {method.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description *</Label>
                                        <Textarea
                                            id="description"
                                            value={billingData.description}
                                            onChange={(e) => handleBillingChange('description', e.target.value)}
                                            placeholder="Description of services provided"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="billingId">Billing ID *</Label>
                                            <Input
                                                id="billingId"
                                                type="number"
                                                value={paymentData.billingId}
                                                onChange={(e) => handlePaymentChange('billingId', parseInt(e.target.value) || 0)}
                                                placeholder="Billing record ID"
                                                disabled={!!billingId}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="patient">Patient *</Label>
                                            <Select
                                                value={paymentData.patientId}
                                                onValueChange={(value) => handlePaymentChange('patientId', value)}
                                                disabled={!!patientId}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select patient"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {patients.map((patient) => (
                                                        <SelectItem key={patient.id} value={patient.id}>
                                                            {patient.firstName} {patient.lastName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="paymentAmount">Payment Amount *</Label>
                                            <Input
                                                id="paymentAmount"
                                                type="number"
                                                step="0.01"
                                                value={paymentData.amount}
                                                onChange={(e) => handlePaymentChange('amount', parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="paymentMethod">Payment Method *</Label>
                                            <Select
                                                value={paymentData.paymentMethod}
                                                onValueChange={(value) => handlePaymentChange('paymentMethod', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {paymentMethods.map((method) => (
                                                        <SelectItem key={method.value} value={method.value}>
                                                            {method.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="notes">Payment Notes</Label>
                                        <Textarea
                                            id="notes"
                                            value={paymentData.notes}
                                            onChange={(e) => handlePaymentChange('notes', e.target.value)}
                                            placeholder="Additional notes about the payment"
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div
                    className="flex justify-between items-center pt-6 border-t border-border bg-gradient-to-r from-muted/50 to-green-50/30 -mx-6 px-6 pb-6 mt-6 rounded-b-xl">
                    <Button variant="outline" onClick={onClose}
                            className="bg-background/80 backdrop-blur-sm border-border hover:bg-muted">{t("cancel")}</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg">
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"/>
                                Processing...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2"/>
                                {mode === 'billing' ? 'Create Billing Record' : 'Process Payment'}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
