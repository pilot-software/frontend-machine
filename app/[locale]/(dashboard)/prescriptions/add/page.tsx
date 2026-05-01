'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Plus, X, Save, Sparkles, AlertCircle, CheckCircle2, Info, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppData } from '@/lib/hooks/useAppData';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';

// Types
interface Medication {
  id: string;
  drugName: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  dose: string;
  frequency: string;
  route: string;
  duration: string;
  instructions: string;
}

interface Vital {
  bp: string;
  pulse: string;
  temp: string;
  spo2: string;
  weight: string;
  height: string;
}

interface AIInsight {
  differentialDiagnosis: Array<{ condition: string; probability: number; icd10: string }>;
  redFlags: Array<{ alert: string; severity: 'critical' | 'high' | 'moderate' }>;
  drugInteractions: Array<{ warning: string; drugs: string[] }>;
  doseOptimization: Array<{ drug: string; suggestion: string }>;
  followUpDays: number;
  confidenceScore: number;
}

export default function ClinicalCopilotPrescription() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { patients } = useAppData();
  
  // Get patient ID from URL
  const patientIdFromUrl = searchParams.get('patientId');
  
  // Patient Context
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: 0,
    gender: '',
    mrn: '',
    allergies: [] as string[],
    visitType: 'new' as 'new' | 'followup'
  });

  // Load patient data from URL parameter
  useEffect(() => {
    if (patientIdFromUrl && patients && patients.length > 0) {
      const patient = patients.find((p: any) => p.id === patientIdFromUrl);
      if (patient) {
        const allergiesArray = typeof patient.allergies === 'string' 
          ? patient.allergies.split(',').map((a: string) => a.trim()).filter(Boolean)
          : Array.isArray(patient.allergies) ? patient.allergies : [];
        
        const age = patient.age || (patient.dateOfBirth ? 
          new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : 0);

        setPatientInfo({
          name: patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Unknown',
          age,
          gender: patient.gender || 'Unknown',
          mrn: patient.caseNumber || patient.mrn || patient.id || 'N/A',
          allergies: allergiesArray,
          visitType: 'new'
        });
      }
    }
  }, [patientIdFromUrl, patients]);

  // Clinical Data
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [vitals, setVitals] = useState<Vital>({
    bp: '', pulse: '', temp: '', spo2: '', weight: '', height: ''
  });
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('');
  const [icd10Code, setIcd10Code] = useState('');
  const [secondaryDiagnosis, setSecondaryDiagnosis] = useState<string[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [investigations, setInvestigations] = useState('');
  const [followUpPlan, setFollowUpPlan] = useState('');

  // AI State
  const [aiInsights, setAiInsights] = useState<AIInsight | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [criticalAlertsAcknowledged, setCriticalAlertsAcknowledged] = useState(false);

  // Add empty medication row
  const addMedication = () => {
    setMedications([...medications, {
      id: crypto.randomUUID(),
      drugName: '',
      genericName: '',
      strength: '',
      dosageForm: 'Tablet',
      dose: '',
      frequency: '',
      route: 'Oral',
      duration: '',
      instructions: ''
    }]);
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(medications.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  // Trigger AI Analysis
  const analyzeWithAI = async () => {
    setAiLoading(true);
    // Mock AI response - replace with actual API
    setTimeout(() => {
      setAiInsights({
        differentialDiagnosis: [
          { condition: 'Acute Bronchitis', probability: 78, icd10: 'J20.9' },
          { condition: 'Pneumonia', probability: 15, icd10: 'J18.9' },
          { condition: 'Asthma Exacerbation', probability: 7, icd10: 'J45.901' }
        ],
        redFlags: [
          { alert: 'Patient has documented Penicillin allergy', severity: 'critical' },
          { alert: 'SpO2 < 92% - Consider oxygen therapy', severity: 'high' }
        ],
        drugInteractions: [],
        doseOptimization: [
          { drug: 'Azithromycin', suggestion: 'Consider renal dose adjustment if eGFR < 30' }
        ],
        followUpDays: 3,
        confidenceScore: 85
      });
      setAiLoading(false);
    }, 1500);
  };

  const handleSubmit = () => {
    if (aiInsights?.redFlags.some(f => f.severity === 'critical') && !criticalAlertsAcknowledged) {
      alert('Please acknowledge critical alerts before submitting');
      return;
    }
    // Submit prescription
    console.log('Submitting prescription...');
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Clinical Prescription</h1>
          <p className="text-muted-foreground mt-1">
            {patientInfo.name ? `For ${patientInfo.name}` : 'AI-Assisted Clinical Decision Support'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={analyzeWithAI} disabled={aiLoading}>
            <Sparkles className="h-4 w-4 mr-2" />
            {aiLoading ? 'Analyzing...' : 'AI Analyze'}
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Save Prescription
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {patientInfo.name ? (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Patient Name</p>
                  <p className="font-semibold">{patientInfo.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">MRN</p>
                  <p className="font-semibold">{patientInfo.mrn}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Age / Gender</p>
                  <p className="font-semibold">{patientInfo.age}Y / {patientInfo.gender}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Visit Type</p>
                  <Select value={patientInfo.visitType} onValueChange={(v: any) => setPatientInfo({...patientInfo, visitType: v})}>
                    <SelectTrigger className="h-8 w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Visit</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Date & Time</p>
                  <p className="font-semibold text-sm">{new Date().toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Allergies</p>
                  {patientInfo.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {patientInfo.allergies.map(a => (
                        <Badge key={a} variant="destructive" className="text-xs">{a}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">None</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <Label className="text-xs">Patient Name *</Label>
                  <Input 
                    placeholder="Enter name"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs">MRN</Label>
                  <Input 
                    placeholder="MRN"
                    value={patientInfo.mrn}
                    onChange={(e) => setPatientInfo({...patientInfo, mrn: e.target.value})}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs">Age *</Label>
                  <Input 
                    type="number"
                    placeholder="Age"
                    value={patientInfo.age || ''}
                    onChange={(e) => setPatientInfo({...patientInfo, age: parseInt(e.target.value) || 0})}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs">Gender *</Label>
                  <Select value={patientInfo.gender} onValueChange={(v) => setPatientInfo({...patientInfo, gender: v})}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Visit Type</Label>
                  <Select value={patientInfo.visitType} onValueChange={(v: any) => setPatientInfo({...patientInfo, visitType: v})}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Visit</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Allergies</Label>
                  <Input 
                    placeholder="e.g., Penicillin"
                    value={patientInfo.allergies.join(', ')}
                    onChange={(e) => setPatientInfo({...patientInfo, allergies: e.target.value.split(',').map(a => a.trim()).filter(Boolean)})}
                    className="h-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Clinical Workflow */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Chief Complaint */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Chief Complaint</CardTitle>
              </CardHeader>
              <CardContent>
                <Input 
                  placeholder="e.g., Fever and cough for 3 days"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="h-9"
                />
              </CardContent>
            </Card>

            {/* Vitals */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Vitals</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveGrid cols={6}>
                  <div>
                    <Label className="text-xs">BP (mmHg)</Label>
                    <Input placeholder="120/80" value={vitals.bp} onChange={(e) => setVitals({...vitals, bp: e.target.value})} className="h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">Pulse (bpm)</Label>
                    <Input placeholder="72" value={vitals.pulse} onChange={(e) => setVitals({...vitals, pulse: e.target.value})} className="h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">Temp (°F)</Label>
                    <Input placeholder="98.6" value={vitals.temp} onChange={(e) => setVitals({...vitals, temp: e.target.value})} className="h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">SpO2 (%)</Label>
                    <Input placeholder="98" value={vitals.spo2} onChange={(e) => setVitals({...vitals, spo2: e.target.value})} className="h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">Weight (kg)</Label>
                    <Input placeholder="70" value={vitals.weight} onChange={(e) => setVitals({...vitals, weight: e.target.value})} className="h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">Height (cm)</Label>
                    <Input placeholder="170" value={vitals.height} onChange={(e) => setVitals({...vitals, height: e.target.value})} className="h-8 text-sm" />
                  </div>
                </ResponsiveGrid>
              </CardContent>
            </Card>

            {/* Diagnosis */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Diagnosis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Primary Diagnosis</Label>
                    <Input 
                      placeholder="Enter diagnosis"
                      value={primaryDiagnosis}
                      onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">ICD-10 Code</Label>
                    <Input 
                      placeholder="e.g., J20.9"
                      value={icd10Code}
                      onChange={(e) => setIcd10Code(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medications Table */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Medications</CardTitle>
                  <Button size="sm" variant="outline" onClick={addMedication}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Drug
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {medications.length === 0 ? (
                    <div className="text-center py-8 text-sm text-slate-500">
                      No medications added. Click "Add Drug" to start.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {medications.map((med, idx) => (
                        <div key={med.id} className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-900">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Drug #{idx + 1}</span>
                            <Button size="sm" variant="ghost" onClick={() => removeMedication(med.id)} className="h-6 w-6 p-0">
                              <Trash2 className="h-3.5 w-3.5 text-red-600" />
                            </Button>
                          </div>
                          <ResponsiveGrid cols={4}>
                            <div>
                              <Label className="text-xs">Drug Name *</Label>
                              <Input 
                                placeholder="Search drug"
                                value={med.drugName}
                                onChange={(e) => updateMedication(med.id, 'drugName', e.target.value)}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Strength *</Label>
                              <Input 
                                placeholder="500mg"
                                value={med.strength}
                                onChange={(e) => updateMedication(med.id, 'strength', e.target.value)}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Form</Label>
                              <Select value={med.dosageForm} onValueChange={(v) => updateMedication(med.id, 'dosageForm', v)}>
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Tablet">Tablet</SelectItem>
                                  <SelectItem value="Capsule">Capsule</SelectItem>
                                  <SelectItem value="Syrup">Syrup</SelectItem>
                                  <SelectItem value="Injection">Injection</SelectItem>
                                  <SelectItem value="Cream">Cream</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs">Dose *</Label>
                              <Input 
                                placeholder="1"
                                value={med.dose}
                                onChange={(e) => updateMedication(med.id, 'dose', e.target.value)}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Frequency *</Label>
                              <Select value={med.frequency} onValueChange={(v) => updateMedication(med.id, 'frequency', v)}>
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="OD">Once Daily (OD)</SelectItem>
                                  <SelectItem value="BD">Twice Daily (BD)</SelectItem>
                                  <SelectItem value="TDS">Thrice Daily (TDS)</SelectItem>
                                  <SelectItem value="QID">Four Times (QID)</SelectItem>
                                  <SelectItem value="SOS">SOS</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs">Route</Label>
                              <Select value={med.route} onValueChange={(v) => updateMedication(med.id, 'route', v)}>
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Oral">Oral</SelectItem>
                                  <SelectItem value="IV">IV</SelectItem>
                                  <SelectItem value="IM">IM</SelectItem>
                                  <SelectItem value="SC">SC</SelectItem>
                                  <SelectItem value="Topical">Topical</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs">Duration *</Label>
                              <Input 
                                placeholder="7 days"
                                value={med.duration}
                                onChange={(e) => updateMedication(med.id, 'duration', e.target.value)}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Instructions</Label>
                              <Input 
                                placeholder="After food"
                                value={med.instructions}
                                onChange={(e) => updateMedication(med.id, 'instructions', e.target.value)}
                                className="h-8 text-sm"
                              />
                            </div>
                          </ResponsiveGrid>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Investigations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Investigations</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="e.g., CBC, Chest X-ray, Blood culture"
                  value={investigations}
                  onChange={(e) => setInvestigations(e.target.value)}
                  className="resize-none h-20"
                />
              </CardContent>
            </Card>

            {/* Follow-up Plan */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Follow-up Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="e.g., Review after 3 days, Return if fever persists"
                  value={followUpPlan}
                  onChange={(e) => setFollowUpPlan(e.target.value)}
                  className="resize-none h-20"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Copilot Panel */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base">AI Clinical Copilot</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  
                  {!aiInsights ? (
                    <div className="text-center py-8">
                      <Sparkles className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Enter clinical data and click "AI Analyze" to get intelligent insights
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* AI Confidence Score */}
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">AI Confidence</span>
                        <Badge variant="secondary" className="text-sm">{aiInsights.confidenceScore}%</Badge>
                      </div>

                      {/* Red Flags */}
                      {aiInsights.redFlags.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            Critical Alerts
                          </h4>
                          {aiInsights.redFlags.map((flag, idx) => (
                            <Alert key={idx} variant="destructive" className="py-2">
                              <AlertDescription className="text-xs">{flag.alert}</AlertDescription>
                            </Alert>
                          ))}
                          {aiInsights.redFlags.some(f => f.severity === 'critical') && (
                            <div className="flex items-center gap-2 pt-2">
                              <Checkbox 
                                id="acknowledge"
                                checked={criticalAlertsAcknowledged}
                                onCheckedChange={(checked) => setCriticalAlertsAcknowledged(checked as boolean)}
                              />
                              <label htmlFor="acknowledge" className="text-xs font-medium cursor-pointer">
                                I acknowledge these critical alerts
                              </label>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Differential Diagnosis */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Differential Diagnosis</h4>
                        <div className="space-y-2">
                          {aiInsights.differentialDiagnosis.map((dx, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{dx.condition}</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{dx.icd10}</p>
                              </div>
                              <Badge variant={idx === 0 ? "default" : "secondary"} className="text-xs">
                                {dx.probability}%
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dose Optimization */}
                      {aiInsights.doseOptimization.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Info className="h-4 w-4 text-blue-600" />
                            Dose Optimization
                          </h4>
                          {aiInsights.doseOptimization.map((opt, idx) => (
                            <Alert key={idx} className="py-2">
                              <AlertDescription className="text-xs">
                                <span className="font-medium">{opt.drug}:</span> {opt.suggestion}
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      )}

                      {/* Follow-up Recommendation */}
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-semibold">Follow-up Recommendation</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          Review patient in {aiInsights.followUpDays} days
                        </p>
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        <Info className="h-3.5 w-3.5 mr-2" />
                        Explain AI Reasoning
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Doctor Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Prescriber Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Doctor Name</p>
                    <p className="font-medium">Dr. Sarah Johnson</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Registration No.</p>
                    <p className="font-medium">MCI-12345-2020</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Specialization</p>
                    <p className="font-medium">General Medicine</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
