'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {AlertTriangle, Calendar, Phone, QrCode, User} from 'lucide-react';

interface PatientQRData {
    type: string;
    version: string;
    id: string;
    name: string;
    dob: string;
    gender?: string;
    phone: string;
    emergency: string;
    bloodType?: string;
    allergies?: string;
    insurance?: string;
    redirectUrl: string;
    timestamp: string;
    facility: string;
}

interface QRScannerProps {
    onPatientScanned?: (patientData: PatientQRData) => void;
}

export default function QRScanner({onPatientScanned}: QRScannerProps) {
    const t = useTranslations('common');
    const router = useRouter();
    const [scannedData, setScannedData] = useState<PatientQRData | null>(null);
    const [error, setError] = useState<string>('');
    const [isScanning, setIsScanning] = useState(false);

    const handleManualInput = (qrText: string) => {
        try {
            const data = JSON.parse(qrText) as PatientQRData;

            if (data.type !== 'HEALTHCARE_PATIENT_ID') {
                throw new Error('Invalid QR code type');
            }

            if (!data.version || !data.facility) {
                throw new Error('Invalid QR code format');
            }

            setScannedData(data);
            setError('');
            onPatientScanned?.(data);

            // Auto-redirect to patient page
            if (data.redirectUrl) {
                console.log('Redirecting to:', data.redirectUrl);
                router.push(data.redirectUrl);
            }
        } catch (err) {
            setError('Invalid QR code format');
            setScannedData(null);
        }
    };

    const simulateQRScan = () => {
        // Simulate scanning a patient QR code for demo purposes
        const mockPatientData: PatientQRData = {
            type: 'HEALTHCARE_PATIENT_ID',
            version: '1.0',
            id: 'patient_1',
            name: 'John Doe',
            dob: '1985-06-15',
            gender: 'male',
            phone: '+1-555-0123',
            emergency: '+1-555-0456',
            bloodType: 'O+',
            allergies: 'Penicillin',
            insurance: 'HealthCare Plus',
            redirectUrl: '/patient/patient_1',
            timestamp: new Date().toISOString(),
            facility: 'Healthcare Management System'
        };

        setIsScanning(true);
        setTimeout(() => {
            handleManualInput(JSON.stringify(mockPatientData));
            setIsScanning(false);
        }, 2000);
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <QrCode className="h-5 w-5"/>
                        <span>Patient QR Code Scanner</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center">
                        <Button
                            onClick={simulateQRScan}
                            disabled={isScanning}
                            className="w-full"
                        >
                            <QrCode className="h-4 w-4 mr-2"/>
                            {isScanning ? 'Scanning...' : 'Simulate QR Scan'}
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">
                            Click to simulate scanning a patient QR code
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {scannedData && (
                        <Card className="border-green-200 bg-green-50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center space-x-2">
                                    <User className="h-5 w-5 text-green-600"/>
                                    <span>Patient Identified</span>
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                        Verified
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Patient Name</p>
                                        <p className="font-semibold">{scannedData.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Patient ID</p>
                                        <p className="font-mono text-sm">{scannedData.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 flex items-center">
                                            <Calendar className="h-4 w-4 mr-1"/>{t("dateOfBirth")}</p>
                                        <p>{scannedData.dob}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 flex items-center">
                                            <Phone className="h-4 w-4 mr-1"/>{t("phone")}</p>
                                        <p>{scannedData.phone || 'Not provided'}</p>
                                    </div>
                                    {scannedData.bloodType && (
                                        <div>
                                            <p className="text-sm font-medium text-red-600">{t("bloodType")}</p>
                                            <p className="text-red-700 font-bold">{scannedData.bloodType}</p>
                                        </div>
                                    )}
                                    {scannedData.allergies && (
                                        <div>
                                            <p className="text-sm font-medium text-orange-600">{t("allergies")}</p>
                                            <p className="text-orange-700 font-medium">{scannedData.allergies}</p>
                                        </div>
                                    )}
                                    <div className="md:col-span-2">
                                        <p className="text-sm font-medium text-red-600 flex items-center">
                                            <AlertTriangle className="h-4 w-4 mr-1"/>
                                            Emergency Contact
                                        </p>
                                        <p className="text-red-700 font-medium">{scannedData.emergency || 'Not provided'}</p>
                                    </div>
                                    {scannedData.insurance && (
                                        <div className="md:col-span-2">
                                            <p className="text-sm font-medium text-blue-600">Insurance Provider</p>
                                            <p className="text-blue-700">{scannedData.insurance}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3 border-t border-green-200 space-y-2">
                                    <Button
                                        onClick={() => router.push(scannedData.redirectUrl)}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                    >
                                        View Patient Details
                                    </Button>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500">
                                            <strong>Facility:</strong> {scannedData.facility}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            <strong>QR
                                                Version:</strong> {scannedData.version} | <strong>Generated:</strong> {new Date(scannedData.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
