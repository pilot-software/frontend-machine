'use client';

import { useState, useEffect } from 'react';
import { vitalSignService, ApiVitalSign, CreateVitalSign } from '@/lib/services/vital-signs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Activity, Heart, Thermometer, Wind, Weight, Ruler } from 'lucide-react';

interface VitalSignsManagementProps {
  patientId: string;
  onClose?: () => void;
}

export default function VitalSignsManagement({ patientId, onClose }: VitalSignsManagementProps) {
  const [vitals, setVitals] = useState<ApiVitalSign[]>([]);
  const [latest, setLatest] = useState<ApiVitalSign | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateVitalSign>>({
    patientId,
    temperatureUnit: 'CELSIUS',
    weightUnit: 'KG',
    heightUnit: 'CM',
    recordedAt: new Date().toISOString(),
    recordedBy: ''
  });

  useEffect(() => {
    loadVitals();
  }, [patientId]);

  const loadVitals = async () => {
    try {
      setLoading(true);
      const [allVitals, latestVital] = await Promise.all([
        vitalSignService.getPatientVitals(patientId),
        vitalSignService.getLatestVitals(patientId)
      ]);
      setVitals(allVitals);
      setLatest(latestVital);
    } catch (error) {
      console.error('Failed to load vitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('healthcare_user') ? JSON.parse(localStorage.getItem('healthcare_user')!).id : '';
      await vitalSignService.createVitalSign({
        ...formData,
        patientId,
        recordedBy: userId,
        recordedAt: new Date().toISOString()
      } as CreateVitalSign);
      setShowForm(false);
      loadVitals();
      setFormData({ patientId, temperatureUnit: 'CELSIUS', weightUnit: 'KG', heightUnit: 'CM', recordedAt: new Date().toISOString(), recordedBy: '' });
    } catch (error) {
      console.error('Failed to save vitals:', error);
    }
  };

  const getAbnormalities = (vital: ApiVitalSign) => {
    return vitalSignService.isAbnormal(vital);
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vital Signs</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New'}
        </Button>
      </div>

      {latest && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Vitals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latest.bloodPressureSystolic && (
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Blood Pressure</p>
                    <p className="font-semibold">{latest.bloodPressureSystolic}/{latest.bloodPressureDiastolic}</p>
                  </div>
                </div>
              )}
              {latest.heartRate && (
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <div>
                    <p className="text-sm text-gray-500">Heart Rate</p>
                    <p className="font-semibold">{latest.heartRate} bpm</p>
                  </div>
                </div>
              )}
              {latest.temperature && (
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Temperature</p>
                    <p className="font-semibold">{latest.temperature}° {latest.temperatureUnit === 'CELSIUS' ? 'C' : 'F'}</p>
                  </div>
                </div>
              )}
              {latest.oxygenSaturation && (
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">SpO2</p>
                    <p className="font-semibold">{latest.oxygenSaturation}%</p>
                  </div>
                </div>
              )}
              {latest.weight && (
                <div className="flex items-center gap-2">
                  <Weight className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-semibold">{latest.weight} {latest.weightUnit}</p>
                  </div>
                </div>
              )}
              {latest.height && (
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-semibold">{latest.height} {latest.heightUnit}</p>
                  </div>
                </div>
              )}
              {latest.bmi && (
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-sm text-gray-500">BMI</p>
                    <p className="font-semibold">{latest.bmi}</p>
                  </div>
                </div>
              )}
            </div>
            {getAbnormalities(latest).length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">Abnormal Values Detected</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {getAbnormalities(latest).map((abn, idx) => (
                    <li key={idx} className="text-sm text-red-600">
                      {abn.field}: {abn.value} ({abn.status})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Record New Vitals</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Blood Pressure (Systolic)</Label>
                  <Input type="number" placeholder="120" onChange={(e) => setFormData({...formData, bloodPressureSystolic: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Blood Pressure (Diastolic)</Label>
                  <Input type="number" placeholder="80" onChange={(e) => setFormData({...formData, bloodPressureDiastolic: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Heart Rate (bpm)</Label>
                  <Input type="number" placeholder="72" onChange={(e) => setFormData({...formData, heartRate: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Temperature</Label>
                  <div className="flex gap-2">
                    <Input type="number" step="0.1" placeholder="98.6" onChange={(e) => setFormData({...formData, temperature: Number(e.target.value)})} />
                    <Select value={formData.temperatureUnit} onValueChange={(v) => setFormData({...formData, temperatureUnit: v as any})}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CELSIUS">°C</SelectItem>
                        <SelectItem value="FAHRENHEIT">°F</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Oxygen Saturation (%)</Label>
                  <Input type="number" placeholder="98" onChange={(e) => setFormData({...formData, oxygenSaturation: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Respiratory Rate</Label>
                  <Input type="number" placeholder="16" onChange={(e) => setFormData({...formData, respiratoryRate: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Weight</Label>
                  <div className="flex gap-2">
                    <Input type="number" step="0.1" placeholder="70" onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})} />
                    <Select value={formData.weightUnit} onValueChange={(v) => setFormData({...formData, weightUnit: v as any})}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KG">KG</SelectItem>
                        <SelectItem value="LBS">LBS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Height</Label>
                  <div className="flex gap-2">
                    <Input type="number" step="0.1" placeholder="170" onChange={(e) => setFormData({...formData, height: Number(e.target.value)})} />
                    <Select value={formData.heightUnit} onValueChange={(v) => setFormData({...formData, heightUnit: v as any})}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CM">CM</SelectItem>
                        <SelectItem value="INCHES">IN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea placeholder="Additional notes..." onChange={(e) => setFormData({...formData, notes: e.target.value})} />
              </div>
              <Button type="submit" className="w-full">Save Vitals</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {vitals.slice(0, 10).map((vital) => (
              <div key={vital.id} className="p-3 border rounded hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{new Date(vital.recordedAt).toLocaleString()}</p>
                    <div className="flex gap-4 text-sm text-gray-600">
                      {vital.bloodPressureSystolic && <span>BP: {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}</span>}
                      {vital.heartRate && <span>HR: {vital.heartRate}</span>}
                      {vital.temperature && <span>Temp: {vital.temperature}°</span>}
                      {vital.oxygenSaturation && <span>SpO2: {vital.oxygenSaturation}%</span>}
                    </div>
                  </div>
                  {getAbnormalities(vital).length > 0 && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
