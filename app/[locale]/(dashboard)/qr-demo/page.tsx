'use client';

import {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import QRScanner from '@/components/QRScanner';
import {downloadPatientHTML, downloadPatientPDF} from '@/lib/services/pdf-simple';
import {Doctor, Patient} from '@/lib/types';
import {Download, FileText, QrCode, User} from 'lucide-react';

export default function QRDemoPage() {
    const [isGenerating, setIsGenerating] = useState(false);

    // Sample patient data for demo
    const samplePatient: Patient = {
        id: 'PAT-001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0123',
        dateOfBirth: '1985-06-15',
        gender: 'male',
        address: '123 Main St, Anytown, ST 12345',
        emergencyContactPhone: '+1-555-0456',
        insuranceProvider: 'HealthCare Plus',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const sampleDoctor: Doctor = {
        id: 'DOC-001',
        email: 'dr.smith@hospital.com',
        name: 'Dr. Sarah Smith',
        role: 'doctor',
        department: 'Cardiology',
        specialization: 'Interventional Cardiology',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const handleGeneratePDF = async () => {
        setIsGenerating(true);
        try {
            await downloadPatientPDF(samplePatient, sampleDoctor);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateHTML = async () => {
        setIsGenerating(true);
        try {
            await downloadPatientHTML(samplePatient, sampleDoctor);
        } catch (error) {
            console.error('Failed to generate HTML:', error);
            alert('Failed to generate HTML. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePatientScanned = (patientData: any) => {
        console.log('Patient scanned:', patientData);
        // Here you would typically navigate to the patient's record or perform other actions
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">QR Code Integration Demo</h1>
                    <p className="text-muted-foreground mt-2">
                        Demonstration of patient identification QR codes in healthcare PDF reports
                    </p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Healthcare QR System
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PDF Generation Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <FileText className="h-5 w-5"/>
                            <span>Patient Report Generation</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3 mb-3">
                                <User className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full p-2"/>
                                <div>
                                    <h3 className="font-semibold">{samplePatient.firstName} {samplePatient.lastName}</h3>
                                    <p className="text-sm text-muted-foreground">ID: {samplePatient.id}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="font-medium">DOB:</span> {samplePatient.dateOfBirth}
                                </div>
                                <div>
                                    <span className="font-medium">Phone:</span> {samplePatient.phone}
                                </div>
                                <div className="col-span-2">
                                    <span className="font-medium">Doctor:</span> {sampleDoctor.name}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Button
                                onClick={handleGeneratePDF}
                                disabled={isGenerating}
                                className="w-full"
                            >
                                <Download className="h-4 w-4 mr-2"/>
                                {isGenerating ? 'Generating...' : 'Generate PDF with QR Code'}
                            </Button>

                            <Button
                                onClick={handleGenerateHTML}
                                disabled={isGenerating}
                                variant="outline"
                                className="w-full"
                            >
                                <FileText className="h-4 w-4 mr-2"/>
                                {isGenerating ? 'Generating...' : 'Generate HTML Report'}
                            </Button>
                        </div>

                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-blue-800 text-sm">
                                <strong>QR Code Features:</strong>
                            </p>
                            <ul className="text-blue-700 text-sm mt-1 space-y-1">
                                <li>• Patient identification data</li>
                                <li>• Emergency contact information</li>
                                <li>• Secure JSON format</li>
                                <li>• Timestamp for verification</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                {/* QR Scanner Section */}
                <div>
                    <QRScanner onPatientScanned={handlePatientScanned}/>
                </div>
            </div>

            {/* Features Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <QrCode className="h-5 w-5"/>
                        <span>QR Code Integration Features</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold text-green-600 mb-2">Patient Identification</h3>
                            <p className="text-sm text-gray-600">
                                Quick patient lookup using QR codes embedded in medical reports and ID cards.
                            </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold text-blue-600 mb-2">Emergency Access</h3>
                            <p className="text-sm text-gray-600">
                                Instant access to critical patient information and emergency contacts.
                            </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold text-purple-600 mb-2">Secure Data</h3>
                            <p className="text-sm text-gray-600">
                                Encrypted patient data with timestamp verification for security.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
