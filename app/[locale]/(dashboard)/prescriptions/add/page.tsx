'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';

export default function AddPrescriptionPage() {
  const t = useTranslations('common');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState('');

  const [prescriptionData, setprescriptionData] = useState({
    patientId: '',
    doctorId: '',
    medication: '',
    strength: '',
    frequency: '',
    duration: '',
    quantity: '',
    refills: '',
    pharmacy: '',
    instructions: '',
  });

  const mockMedications = [
    { id: '1', name: 'Lisinopril', genericName: 'Lisinopril', contraindications: ['Pregnancy', 'Angioedema history'], sideEffects: ['Dry cough', 'Dizziness'] },
    { id: '2', name: 'Amoxicillin', genericName: 'Amoxicillin', contraindications: ['Penicillin allergy'], sideEffects: ['Nausea', 'Diarrhea'] },
    { id: '3', name: 'Metformin', genericName: 'Metformin Hydrochloride', contraindications: ['Kidney disease'], sideEffects: ['GI upset', 'Lactic acidosis'] },
  ];

  const handleInputChange = (field: string, value: string) => {
    setprescriptionData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!prescriptionData.patientId || !prescriptionData.medication) {
        alert('Please fill in all required fields');
        return;
      }

      // TODO: Implement prescription service
      console.log('Prescription data:', prescriptionData);
      router.push('/en/prescriptions');
    } catch (error) {
      console.error('Failed to save prescription:', error);
      alert(`Failed to save prescription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Create New Prescription</h2>
            <p className="text-muted-foreground mt-1">Write a new prescription for a patient</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Prescription
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Prescription Information</CardTitle>
            <CardDescription>Complete prescription details and medication information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient">Patient *</Label>
                <Select value={prescriptionData.patientId} onValueChange={(value) => handleInputChange('patientId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-smith">John Smith (HC001234)</SelectItem>
                    <SelectItem value="emma-davis">Emma Davis (HC001235)</SelectItem>
                    <SelectItem value="michael-johnson">Michael Johnson (HC001236)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="prescribing-doctor">Prescribing Doctor *</Label>
                <Select value={prescriptionData.doctorId} onValueChange={(value) => handleInputChange('doctorId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-johnson">Dr. Sarah Johnson</SelectItem>
                    <SelectItem value="dr-chen">Dr. Michael Chen</SelectItem>
                    <SelectItem value="dr-rodriguez">Dr. Emily Rodriguez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="medication">Medication *</Label>
                <Select value={selectedMedication} onValueChange={(value) => { setSelectedMedication(value); handleInputChange('medication', value); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select medication" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMedications.map((med) => (
                      <SelectItem key={med.id} value={med.name}>
                        {med.name} ({med.genericName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="strength">Strength/Dosage *</Label>
                <Select value={prescriptionData.strength} onValueChange={(value) => handleInputChange('strength', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strength" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10mg">10mg</SelectItem>
                    <SelectItem value="20mg">20mg</SelectItem>
                    <SelectItem value="50mg">50mg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frequency">Frequency *</Label>
                <Select value={prescriptionData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once-daily">Once daily</SelectItem>
                    <SelectItem value="twice-daily">Twice daily</SelectItem>
                    <SelectItem value="three-times-daily">Three times daily</SelectItem>
                    <SelectItem value="four-times-daily">Four times daily</SelectItem>
                    <SelectItem value="as-needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration *</Label>
                <Select value={prescriptionData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7-days">7 days</SelectItem>
                    <SelectItem value="14-days">14 days</SelectItem>
                    <SelectItem value="30-days">30 days</SelectItem>
                    <SelectItem value="90-days">90 days</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input id="quantity" type="number" placeholder="30" value={prescriptionData.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="refills">Refills *</Label>
                <Select value={prescriptionData.refills} onValueChange={(value) => handleInputChange('refills', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select refills" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 refills</SelectItem>
                    <SelectItem value="1">1 refill</SelectItem>
                    <SelectItem value="2">2 refills</SelectItem>
                    <SelectItem value="3">3 refills</SelectItem>
                    <SelectItem value="5">5 refills</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="pharmacy">Preferred Pharmacy</Label>
              <Select value={prescriptionData.pharmacy} onValueChange={(value) => handleInputChange('pharmacy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pharmacy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cvs">CVS Pharmacy</SelectItem>
                  <SelectItem value="walgreens">Walgreens</SelectItem>
                  <SelectItem value="rite-aid">Rite Aid</SelectItem>
                  <SelectItem value="kroger">Kroger Pharmacy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Take with food, avoid alcohol, etc..."
                value={prescriptionData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
              />
            </div>

            {selectedMedication && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <p className="font-medium text-yellow-900">Medication Information</p>
                </div>
                {mockMedications.find((med) => med.name === selectedMedication) && (
                  <div className="text-sm text-yellow-800">
                    <p><strong>Contraindications:</strong> {mockMedications.find((med) => med.name === selectedMedication)?.contraindications.join(', ')}</p>
                    <p><strong>Common Side Effects:</strong> {mockMedications.find((med) => med.name === selectedMedication)?.sideEffects.join(', ')}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>


      </form>
    </div>
  );
}
