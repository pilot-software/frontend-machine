'use client';

import { useState } from 'react';
import { medicalService } from '@/lib/services/medical';
import FileUpload from '@/components/common/FileUpload';
import FileList from '@/components/common/FileList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, TestTube } from 'lucide-react';

export default function MedicalRecordsManagement() {
  const [patientId, setPatientId] = useState('');
  const [labOrder, setLabOrder] = useState({
    patientId: '',
    doctorId: '',
    testType: '',
    instructions: '',
    urgency: 'ROUTINE' as 'ROUTINE' | 'URGENT' | 'STAT'
  });

  const handleLabOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await medicalService.createLabOrder(labOrder);
      alert('Lab order created successfully');
      setLabOrder({ patientId: '', doctorId: '', testType: '', instructions: '', urgency: 'ROUTINE' });
    } catch (error) {
      console.error('Failed to create lab order:', error);
      alert('Failed to create lab order');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Medical Records</h1>

      <Tabs defaultValue="documents">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="lab-orders">
            <TestTube className="w-4 h-4 mr-2" />
            Lab Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Patient ID</Label>
                <Input
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter patient ID"
                />
              </div>

              {patientId && (
                <>
                  <FileUpload
                    entityType="PATIENT"
                    entityId={patientId}
                    allowMultiple={true}
                  />
                  <FileList
                    entityType="PATIENT"
                    entityId={patientId}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab-orders">
          <Card>
            <CardHeader>
              <CardTitle>Create Lab Order</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLabOrderSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Patient ID</Label>
                    <Input
                      value={labOrder.patientId}
                      onChange={(e) => setLabOrder({...labOrder, patientId: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Doctor ID</Label>
                    <Input
                      value={labOrder.doctorId}
                      onChange={(e) => setLabOrder({...labOrder, doctorId: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Test Type</Label>
                    <Input
                      value={labOrder.testType}
                      onChange={(e) => setLabOrder({...labOrder, testType: e.target.value})}
                      placeholder="e.g., Blood Test, X-Ray"
                      required
                    />
                  </div>
                  <div>
                    <Label>Urgency</Label>
                    <Select value={labOrder.urgency} onValueChange={(v: any) => setLabOrder({...labOrder, urgency: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ROUTINE">Routine</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                        <SelectItem value="STAT">STAT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Instructions</Label>
                  <Textarea
                    value={labOrder.instructions}
                    onChange={(e) => setLabOrder({...labOrder, instructions: e.target.value})}
                    placeholder="Special instructions..."
                  />
                </div>
                <Button type="submit" className="w-full">Create Lab Order</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
