import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Printer, Send } from 'lucide-react';

interface PrescriptionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescriptionId?: string;
  mode: 'add' | 'edit' | 'view';
}

const mockMedications = [
  { id: '1', name: 'Lisinopril', genericName: 'Lisinopril', contraindications: ['Pregnancy', 'Angioedema history'], sideEffects: ['Dry cough', 'Dizziness', 'Hyperkalemia'] },
  { id: '2', name: 'Amoxicillin', genericName: 'Amoxicillin', contraindications: ['Penicillin allergy'], sideEffects: ['Nausea', 'Diarrhea', 'Rash'] },
  { id: '3', name: 'Metformin', genericName: 'Metformin Hydrochloride', contraindications: ['Kidney disease', 'Heart failure'], sideEffects: ['GI upset', 'Lactic acidosis', 'Vitamin B12 deficiency'] }
];

export function PrescriptionFormModal({ isOpen, onClose, prescriptionId, mode }: PrescriptionFormModalProps) {
  const [selectedMedication, setSelectedMedication] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Prescription</DialogTitle>
          <DialogDescription>Write a new prescription for a patient</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <Select>
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
            <div className="space-y-2">
              <Label htmlFor="prescribing-doctor">Prescribing Doctor</Label>
              <Select>
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
            <div className="space-y-2">
              <Label htmlFor="medication">Medication</Label>
              <Select value={selectedMedication} onValueChange={setSelectedMedication}>
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
            <div className="space-y-2">
              <Label htmlFor="strength">Strength/Dosage</Label>
              <Select>
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
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select>
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
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select>
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
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="refills">Refills</Label>
              <Select>
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

          <div className="space-y-2">
            <Label htmlFor="pharmacy">Preferred Pharmacy</Label>
            <Select>
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

          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions</Label>
            <Textarea id="instructions" placeholder="Take with food, avoid alcohol, etc..." />
          </div>

          {selectedMedication && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <p className="font-medium text-yellow-900">Medication Information</p>
              </div>
              {mockMedications.find(med => med.name === selectedMedication) && (
                <div className="text-sm text-yellow-800">
                  <p><strong>Contraindications:</strong> {mockMedications.find(med => med.name === selectedMedication)?.contraindications.join(', ')}</p>
                  <p><strong>Common Side Effects:</strong> {mockMedications.find(med => med.name === selectedMedication)?.sideEffects.join(', ')}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print Preview
            </Button>
            <Button onClick={onClose}>
              <Send className="h-4 w-4 mr-2" />
              Send to Pharmacy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
