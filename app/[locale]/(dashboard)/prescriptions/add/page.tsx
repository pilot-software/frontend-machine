'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, AlertTriangle, Search, X, Plus } from 'lucide-react';
import { terminologyService, ICDCode, Drug, Procedure } from '@/lib/services/terminology';
import { prescriptionService } from '@/lib/services/prescription';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface SelectedCondition extends ICDCode {
  id: string;
}

interface SelectedMedicine extends Drug {
  dosage?: string;
  frequency?: string;
  duration?: string;
  quantity?: number;
  instructions?: string;
}

export default function AddPrescriptionPage() {
  const t = useTranslations('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const patientFromUrl = searchParams.get('patient');
  const appointmentId = searchParams.get('appointmentId');

  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  
  // Conditions
  const [conditionSearch, setConditionSearch] = useState('');
  const [conditionResults, setConditionResults] = useState<ICDCode[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<SelectedCondition[]>([]);
  const [conditionOpen, setConditionOpen] = useState(false);
  
  // Medicines
  const [medicineSearch, setMedicineSearch] = useState('');
  const [medicineResults, setMedicineResults] = useState<Drug[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<SelectedMedicine[]>([]);
  const [medicineOpen, setMedicineOpen] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState<Drug | null>(null);
  
  // Procedures
  const [procedureSearch, setProcedureSearch] = useState('');
  const [procedureResults, setProcedureResults] = useState<Procedure[]>([]);
  const [selectedProcedures, setSelectedProcedures] = useState<Procedure[]>([]);
  const [procedureOpen, setProcedureOpen] = useState(false);

  useEffect(() => {
    if (patientFromUrl) {
      const patientMap: Record<string, string> = {
        'John Smith': 'john-smith',
        'Emma Wilson': 'emma-davis',
        'Robert Brown': 'michael-johnson',
      };
      setPatientId(patientMap[patientFromUrl] || 'john-smith');
    }
  }, [patientFromUrl]);
  
  useEffect(() => {
    if (conditionSearch.length >= 2) {
      const timer = setTimeout(async () => {
        try {
          const results = await terminologyService.searchICD(conditionSearch);
          setConditionResults(results);
        } catch (error) {
          console.error('ICD search error:', error);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setConditionResults([]);
    }
  }, [conditionSearch]);
  
  useEffect(() => {
    if (medicineSearch.length >= 2) {
      const timer = setTimeout(async () => {
        try {
          const results = await terminologyService.searchDrugs(medicineSearch);
          setMedicineResults(results);
        } catch (error) {
          console.error('Drug search error:', error);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setMedicineResults([]);
    }
  }, [medicineSearch]);
  
  useEffect(() => {
    if (procedureSearch.length >= 2) {
      const timer = setTimeout(async () => {
        try {
          const results = await terminologyService.searchProcedures(procedureSearch);
          setProcedureResults(results);
        } catch (error) {
          console.error('Procedure search error:', error);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setProcedureResults([]);
    }
  }, [procedureSearch]);

  const addCondition = (condition: ICDCode) => {
    if (!selectedConditions.find(c => c.code === condition.code)) {
      setSelectedConditions([...selectedConditions, { ...condition, id: crypto.randomUUID() }]);
    }
    setConditionOpen(false);
    setConditionSearch('');
  };
  
  const removeCondition = (id: string) => {
    setSelectedConditions(selectedConditions.filter(c => c.id !== id));
  };
  
  const addMedicine = (drug: Drug) => {
    setCurrentMedicine(drug);
    setMedicineOpen(false);
  };
  
  const saveMedicine = () => {
    if (currentMedicine) {
      setSelectedMedicines([...selectedMedicines, currentMedicine as SelectedMedicine]);
      setCurrentMedicine(null);
      setMedicineSearch('');
    }
  };
  
  const removeMedicine = (id: number) => {
    setSelectedMedicines(selectedMedicines.filter(m => m.id !== id));
  };
  
  const addProcedure = (procedure: Procedure) => {
    if (!selectedProcedures.find(p => p.package_code === procedure.package_code)) {
      setSelectedProcedures([...selectedProcedures, procedure]);
    }
    setProcedureOpen(false);
    setProcedureSearch('');
  };
  
  const removeProcedure = (code: string) => {
    setSelectedProcedures(selectedProcedures.filter(p => p.package_code !== code));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientId || !doctorId) {
      alert('Please select patient and doctor');
      return;
    }
    
    if (selectedConditions.length === 0) {
      alert('Please add at least one condition');
      return;
    }
    
    if (selectedMedicines.length === 0) {
      alert('Please add at least one medicine');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const prescriptionData = {
        patientId,
        doctorId,
        conditions: selectedConditions.map(c => ({
          code: c.code,
          title: c.title,
          system: c.system,
        })),
        medicines: selectedMedicines.map(m => ({
          drugId: m.id,
          brandName: m.brand_name,
          genericName: m.generic_name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          quantity: m.quantity,
          instructions: m.instructions,
        })),
        procedures: selectedProcedures.map(p => ({
          code: p.package_code,
          name: p.package_name,
          specialty: p.specialty,
        })),
      };
      
      console.log('Creating Prescription:', prescriptionData);
      await prescriptionService.createPrescriptionWithTerminology(prescriptionData);
      alert('Prescription created successfully');
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Create New Prescription</h2>
          <p className="text-muted-foreground mt-1">
            {patientFromUrl ? `Write a prescription for ${patientFromUrl}` : 'Write a new prescription for a patient'}
            {appointmentId && <span className="text-xs ml-2 text-blue-600">(From Appointment #{appointmentId})</span>}
          </p>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit} className="flex-1 sm:flex-none">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient">Patient *</Label>
                <Select value={patientId} onValueChange={setPatientId}>
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
                <Select value={doctorId} onValueChange={setDoctorId}>
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
            
            {/* Conditions */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Medical Conditions (ICD-10/11) *</Label>
                <p className="text-xs text-muted-foreground mt-1">Search and add patient diagnoses</p>
              </div>
              <Popover open={conditionOpen} onOpenChange={setConditionOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start h-10 text-sm">
                    <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Search conditions (e.g., fever, cough, diabetes...)</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[600px] p-0" align="start" sideOffset={4}>
                  <Command shouldFilter={false}>
                    <CommandInput 
                      placeholder="Search ICD codes..." 
                      value={conditionSearch}
                      onValueChange={setConditionSearch}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {conditionSearch.length >= 2 ? 'No conditions found.' : 'Type at least 2 characters...'}
                      </CommandEmpty>
                      <CommandGroup>
                        {conditionResults.length > 0 ? (
                          conditionResults.map((condition) => (
                            <CommandItem
                              key={condition.code}
                              onSelect={() => addCondition(condition)}
                              className="cursor-pointer"
                            >
                              <div className="flex items-start justify-between w-full py-1">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{condition.title}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    Code: {condition.code} • System: {condition.system.toUpperCase()}
                                  </p>
                                </div>
                              </div>
                            </CommandItem>
                          ))
                        ) : conditionSearch.length >= 2 ? (
                          <div className="p-2 text-sm text-muted-foreground">Searching...</div>
                        ) : null}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {selectedConditions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Selected Conditions ({selectedConditions.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedConditions.map((condition) => (
                      <Badge key={condition.id} variant="secondary" className="gap-2 py-1.5 px-3">
                        <span className="font-medium">{condition.title}</span>
                        <span className="text-xs opacity-70">({condition.code})</span>
                        <X 
                          className="h-3.5 w-3.5 cursor-pointer hover:text-destructive transition-colors" 
                          onClick={() => removeCondition(condition.id)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Medicines */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Medicines *</Label>
                <p className="text-xs text-muted-foreground mt-1">Search and configure medications</p>
              </div>
              <Popover open={medicineOpen} onOpenChange={setMedicineOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start h-10 text-sm">
                    <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Search medicines (e.g., Crocin, Azithromycin...)</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[600px] p-0" align="start" sideOffset={4}>
                  <Command shouldFilter={false}>
                    <CommandInput 
                      placeholder="Search drugs..." 
                      value={medicineSearch}
                      onValueChange={setMedicineSearch}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {medicineSearch.length >= 2 ? 'No medicines found.' : 'Type at least 2 characters...'}
                      </CommandEmpty>
                      <CommandGroup>
                        {medicineResults.length > 0 ? (
                          medicineResults.map((drug) => (
                            <CommandItem
                              key={drug.id}
                              onSelect={() => addMedicine(drug)}
                              className="cursor-pointer"
                            >
                              <div className="flex items-start justify-between w-full py-1">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{drug.brand_name}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {drug.generic_name} {drug.strength && `• ${drug.strength}`} {drug.manufacturer && `• ${drug.manufacturer}`}
                                  </p>
                                </div>
                                {drug.mrp && (
                                  <span className="text-xs font-medium text-green-600">₹{drug.mrp}</span>
                                )}
                              </div>
                            </CommandItem>
                          ))
                        ) : medicineSearch.length >= 2 ? (
                          <div className="p-2 text-sm text-muted-foreground">Searching...</div>
                        ) : null}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {currentMedicine && (
                <div className="border-2 border-primary/20 rounded-lg p-4 space-y-4 bg-primary/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-base">{currentMedicine.brand_name}</p>
                      <p className="text-sm text-muted-foreground">{currentMedicine.generic_name} • {currentMedicine.strength}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMedicine(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium">Dosage</Label>
                      <Input 
                        placeholder="500mg" 
                        value={currentMedicine.dosage || ''}
                        onChange={(e) => setCurrentMedicine({...currentMedicine, dosage: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Frequency</Label>
                      <Select 
                        value={currentMedicine.frequency}
                        onValueChange={(v) => setCurrentMedicine({...currentMedicine, frequency: v})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="once-daily">Once daily</SelectItem>
                          <SelectItem value="twice-daily">Twice daily</SelectItem>
                          <SelectItem value="thrice-daily">Thrice daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Duration</Label>
                      <Input 
                        placeholder="7 days" 
                        value={currentMedicine.duration || ''}
                        onChange={(e) => setCurrentMedicine({...currentMedicine, duration: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Quantity</Label>
                      <Input 
                        type="number" 
                        placeholder="30" 
                        value={currentMedicine.quantity || ''}
                        onChange={(e) => setCurrentMedicine({...currentMedicine, quantity: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Special Instructions</Label>
                    <Textarea 
                      placeholder="Take after meals" 
                      value={currentMedicine.instructions || ''}
                      onChange={(e) => setCurrentMedicine({...currentMedicine, instructions: e.target.value})}
                    />
                  </div>
                  <Button onClick={saveMedicine} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Prescription
                  </Button>
                </div>
              )}
              
              {selectedMedicines.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Prescribed Medicines ({selectedMedicines.length})</p>
                  <div className="space-y-2">
                    {selectedMedicines.map((medicine, index) => (
                      <div key={medicine.id} className="flex items-start gap-3 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-semibold text-sm">{medicine.brand_name}</p>
                          <p className="text-xs text-muted-foreground">{medicine.generic_name}</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs mt-2">
                            <span className="font-medium">💊 {medicine.dosage}</span>
                            <span>⏰ {medicine.frequency}</span>
                            <span>📅 {medicine.duration}</span>
                            <span>📦 Qty: {medicine.quantity}</span>
                          </div>
                          {medicine.instructions && (
                            <p className="text-xs text-muted-foreground mt-2 italic">📝 {medicine.instructions}</p>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => removeMedicine(medicine.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Procedures */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Procedures (Optional)</Label>
                <p className="text-xs text-muted-foreground mt-1">Add AB-HBP procedures if applicable</p>
              </div>
              <Popover open={procedureOpen} onOpenChange={setProcedureOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start h-10 text-sm">
                    <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Search procedures...</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[600px] p-0" align="start" sideOffset={4}>
                  <Command shouldFilter={false}>
                    <CommandInput 
                      placeholder="Search procedures..." 
                      value={procedureSearch}
                      onValueChange={setProcedureSearch}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {procedureSearch.length >= 2 ? 'No procedures found.' : 'Type at least 2 characters...'}
                      </CommandEmpty>
                      <CommandGroup>
                        {procedureResults.length > 0 ? (
                          procedureResults.map((procedure) => (
                            <CommandItem
                              key={procedure.package_code}
                              onSelect={() => addProcedure(procedure)}
                            >
                              <div className="flex flex-col w-full">
                                <span className="font-medium">{procedure.package_name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {procedure.package_code} {procedure.specialty && `- ${procedure.specialty}`}
                                </span>
                              </div>
                            </CommandItem>
                          ))
                        ) : procedureSearch.length >= 2 ? (
                          <div className="p-2 text-sm text-muted-foreground">Searching...</div>
                        ) : null}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {selectedProcedures.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Selected Procedures ({selectedProcedures.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProcedures.map((procedure) => (
                      <Badge key={procedure.package_code} variant="outline" className="gap-2 py-1.5 px-3">
                        <span className="font-medium">{procedure.package_name}</span>
                        {procedure.specialty && <span className="text-xs opacity-70">• {procedure.specialty}</span>}
                        <X 
                          className="h-3.5 w-3.5 cursor-pointer hover:text-destructive transition-colors" 
                          onClick={() => removeProcedure(procedure.package_code)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>


      </form>
    </div>
  );
}
