'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Save, User } from 'lucide-react';
import { patientService } from '@/lib/services/patient';
import { userService } from '@/lib/services/user';
import { useAppData } from '@/lib/hooks/useAppData';
import { useAppSelector } from '@/lib/store';

interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | '';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  bloodType: 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE' | '';
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  assignedDoctor: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
}

export default function EditPatientPage() {
  const t = useTranslations('common');
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  const { refetch } = useAppData();
  const reduxDoctors = useAppSelector((state) => state.app.doctors || []);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [patientData, setPatientData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    currentMedications: '',
    assignedDoctor: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patient, doctorUsers] = await Promise.all([
          patientService.getPatientById(patientId),
          reduxDoctors && reduxDoctors.length ? Promise.resolve(reduxDoctors) : userService.getUsersByRole('DOCTOR')
        ]);
        
        setDoctors(doctorUsers);
        setPatientData({
          firstName: patient.firstName || '',
          lastName: patient.lastName || '',
          email: patient.email || '',
          phone: patient.phone || '',
          dateOfBirth: patient.dateOfBirth || '',
          gender: patient.gender || '',
          address: patient.address || '',
          city: patient.city || '',
          state: patient.state || '',
          zipCode: patient.zipCode || '',
          country: patient.country || 'USA',
          emergencyContactName: patient.emergencyContactName || '',
          emergencyContactPhone: patient.emergencyContactPhone || '',
          emergencyContactRelationship: patient.emergencyContactRelationship || '',
          bloodType: patient.bloodType || '',
          allergies: patient.allergies || '',
          chronicConditions: patient.chronicConditions || '',
          currentMedications: patient.currentMedications || '',
          assignedDoctor: (patient as any).assignedDoctor || '',
          insuranceProvider: patient.insuranceProvider || '',
          insurancePolicyNumber: patient.insurancePolicyNumber || '',
        });
      } catch (error) {
        console.error('Failed to load patient:', error);
        alert('Failed to load patient data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [patientId, reduxDoctors]);

  const insuranceOptions = [
    { value: 'blue-cross', label: 'Blue Cross Blue Shield' },
    { value: 'aetna', label: 'Aetna' },
    { value: 'kaiser', label: 'Kaiser Permanente' },
    { value: 'cigna', label: 'Cigna' },
    { value: 'united', label: 'United Healthcare' },
    { value: 'medicare', label: 'Medicare' },
    { value: 'medicaid', label: 'Medicaid' },
    { value: 'self-pay', label: 'Self Pay' },
  ];

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setPatientData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!patientData.firstName || !patientData.lastName || !patientData.email) {
        alert('Please fill in all required fields (First Name, Last Name, Email)');
        return;
      }

      const apiData = {
        firstName: patientData.firstName.trim(),
        lastName: patientData.lastName.trim(),
        dateOfBirth: patientData.dateOfBirth,
        gender: patientData.gender as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY',
        phone: patientData.phone || undefined,
        email: patientData.email.trim(),
        address: patientData.address || undefined,
        city: patientData.city || undefined,
        state: patientData.state || undefined,
        zipCode: patientData.zipCode || undefined,
        country: patientData.country || 'USA',
        emergencyContactName: patientData.emergencyContactName || undefined,
        emergencyContactPhone: patientData.emergencyContactPhone || undefined,
        emergencyContactRelationship: patientData.emergencyContactRelationship || undefined,
        bloodType: patientData.bloodType || undefined,
        allergies: patientData.allergies || undefined,
        chronicConditions: patientData.chronicConditions || undefined,
        currentMedications: patientData.currentMedications || undefined,
        assignedDoctor: patientData.assignedDoctor || undefined,
        insuranceProvider: patientData.insuranceProvider || undefined,
        insurancePolicyNumber: patientData.insurancePolicyNumber || undefined,
      };

      await patientService.updatePatient(patientId, apiData);
      refetch.patients();
      router.push('/en/patients');
    } catch (error) {
      console.error('Failed to update patient:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to update patient: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Edit Patient</h2>
          <p className="text-muted-foreground mt-1">Update patient information</p>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button type="button" variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit} className="flex-1 sm:flex-none">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Patient
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>{t('personalInformation')}</span>
            </CardTitle>
            <CardDescription>Basic patient demographics and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="firstName">{t('firstName')} *</Label>
                <Input
                  id="firstName"
                  value={patientData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">{t('lastName')} *</Label>
                <Input
                  id="lastName"
                  value={patientData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">{t('gender')} *</Label>
                <Select value={patientData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                    <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="email">{t('emailAddress')} *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={patientData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="patient@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">{t('phoneNumber')} *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={patientData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1-555-0123"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="dateOfBirth">{t('dateOfBirth')} *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={patientData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="address"
                  value={patientData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter full address"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={patientData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={patientData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="State"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={patientData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="Zip Code"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={patientData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  value={patientData.emergencyContactName}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  placeholder="Contact person name"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="emergencyContact"
                    value={patientData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    placeholder="+1-555-0124"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="emergencyRelationship">Relationship</Label>
                <Input
                  id="emergencyRelationship"
                  value={patientData.emergencyContactRelationship}
                  onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                  placeholder="Spouse, Parent, etc."
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bloodType">{t('bloodType')}</Label>
                <Select value={patientData.bloodType} onValueChange={(value) => handleInputChange('bloodType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="O_POSITIVE">O+</SelectItem>
                    <SelectItem value="O_NEGATIVE">O-</SelectItem>
                    <SelectItem value="A_POSITIVE">A+</SelectItem>
                    <SelectItem value="A_NEGATIVE">A-</SelectItem>
                    <SelectItem value="B_POSITIVE">B+</SelectItem>
                    <SelectItem value="B_NEGATIVE">B-</SelectItem>
                    <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                    <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="insuranceProvider">{t('insuranceProvider')}</Label>
                <Select value={patientData.insuranceProvider} onValueChange={(value) => handleInputChange('insuranceProvider', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select insurance" />
                  </SelectTrigger>
                  <SelectContent>
                    {insuranceOptions.map((insurance) => (
                      <SelectItem key={insurance.value} value={insurance.value}>
                        {insurance.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="insurancePolicyNumber">{t('policyNumber')}</Label>
                <Input
                  id="insurancePolicyNumber"
                  value={patientData.insurancePolicyNumber}
                  onChange={(e) => handleInputChange('insurancePolicyNumber', e.target.value)}
                  placeholder="Policy number"
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignedDoctor">{t('assignedDoctor')}</Label>
                <Select value={patientData.assignedDoctor} onValueChange={(value) => handleInputChange('assignedDoctor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(doctors) &&
                      doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialization || doctor.department}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="allergies">{t('allergies')}</Label>
                <Textarea
                  id="allergies"
                  value={patientData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="List any known allergies"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chronicConditions">{t('chronicConditions')}</Label>
                <Textarea
                  id="chronicConditions"
                  value={patientData.chronicConditions}
                  onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
                  placeholder="List chronic conditions"
                />
              </div>
              <div>
                <Label htmlFor="currentMedications">{t('currentMedications')}</Label>
                <Textarea
                  id="currentMedications"
                  value={patientData.currentMedications}
                  onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                  placeholder="List current medications"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
