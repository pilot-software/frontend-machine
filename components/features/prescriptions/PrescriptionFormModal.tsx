import React, { useState, useEffect } from 'react';
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, ArrowLeft, Printer, Send, X, Plus, Search } from 'lucide-react';
import { terminologyService, ICDCode, Drug, Procedure } from '@/lib/services/terminology';
import { prescriptionService } from '@/lib/services/prescription';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface PrescriptionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescriptionId?: string;
  mode: 'add' | 'edit' | 'view';
}

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

export function PrescriptionFormModal({ isOpen, onClose, prescriptionId, mode }: PrescriptionFormModalProps) {
  const t = useTranslations('common');
  
  // Conditions state
  const [conditionSearch, setConditionSearch] = useState('');
  const [conditionResults, setConditionResults] = useState<ICDCode[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<SelectedCondition[]>([]);
  const [conditionOpen, setConditionOpen] = useState(false);
  
  // Medicines state
  const [medicineSearch, setMedicineSearch] = useState('');
  const [medicineResults, setMedicineResults] = useState<Drug[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<SelectedMedicine[]>([]);
  const [medicineOpen, setMedicineOpen] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState<Drug | null>(null);
  
  // Procedures state (optional)
  const [procedureSearch, setProcedureSearch] = useState('');
  const [procedureResults, setProcedureResults] = useState<Procedure[]>([]);
  const [selectedProcedures, setSelectedProcedures] = useState<Procedure[]>([]);
  const [procedureOpen, setProcedureOpen] = useState(false);
  
  // Form state
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  
  // Search ICD codes
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
    }
  }, [conditionSearch]);
  
  // Search drugs
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
    }
  }, [medicineSearch]);
  
  // Search procedures
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
  
  const handleCreatePrescription = async () => {
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
    
    try {
      console.log('Creating Prescription:', prescriptionData);
      await prescriptionService.createPrescriptionWithTerminology(prescriptionData);
      alert('Prescription created successfully');
      onClose();
    } catch (error) {
      console.error('Prescription creation error:', error);
      alert('Failed to create prescription');
    }
  };

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
              <Label htmlFor="patient">{t("patient")}</Label>
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
            <div className="space-y-2">
              <Label htmlFor="prescribing-doctor">Prescribing Doctor</Label>
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
          
          {/* Conditions Section */}
          <div className="space-y-2">
            <Label>Medical Conditions (ICD-10/11)</Label>
            <Popover open={conditionOpen} onOpenChange={setConditionOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  Search conditions (cough, fever, cold...)
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search ICD codes..." 
                    value={conditionSearch}
                    onValueChange={setConditionSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No conditions found.</CommandEmpty>
                    <CommandGroup>
                      {conditionResults.map((condition) => (
                        <CommandItem
                          key={condition.code}
                          onSelect={() => addCondition(condition)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{condition.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {condition.code} ({condition.system})
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {selectedConditions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedConditions.map((condition) => (
                  <Badge key={condition.id} variant="secondary" className="gap-1">
                    {condition.title} ({condition.code})
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeCondition(condition.id)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Medicines Section */}
          <div className="space-y-2">
            <Label>Medicines</Label>
            <Popover open={medicineOpen} onOpenChange={setMedicineOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  Search medicines (Azee, Crocin, Paracetamol...)
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search drugs..." 
                    value={medicineSearch}
                    onValueChange={setMedicineSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No medicines found.</CommandEmpty>
                    <CommandGroup>
                      {medicineResults.map((drug) => (
                        <CommandItem
                          key={drug.id}
                          onSelect={() => addMedicine(drug)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{drug.brand_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {drug.generic_name} {drug.strength && `- ${drug.strength}`}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {currentMedicine && (
              <div className="border rounded-lg p-4 space-y-3 mt-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{currentMedicine.brand_name}</p>
                    <p className="text-sm text-muted-foreground">{currentMedicine.generic_name}</p>
                  </div>
                  <X className="h-4 w-4 cursor-pointer" onClick={() => setCurrentMedicine(null)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Dosage</Label>
                    <Input 
                      placeholder="500mg" 
                      value={currentMedicine.dosage || ''}
                      onChange={(e) => setCurrentMedicine({...currentMedicine, dosage: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Frequency</Label>
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
                    <Label className="text-xs">Duration</Label>
                    <Input 
                      placeholder="7 days" 
                      value={currentMedicine.duration || ''}
                      onChange={(e) => setCurrentMedicine({...currentMedicine, duration: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Quantity</Label>
                    <Input 
                      type="number" 
                      placeholder="30" 
                      value={currentMedicine.quantity || ''}
                      onChange={(e) => setCurrentMedicine({...currentMedicine, quantity: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Instructions</Label>
                  <Textarea 
                    placeholder="Take after meals" 
                    value={currentMedicine.instructions || ''}
                    onChange={(e) => setCurrentMedicine({...currentMedicine, instructions: e.target.value})}
                  />
                </div>
                <Button onClick={saveMedicine} size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medicine
                </Button>
              </div>
            )}
            
            {selectedMedicines.length > 0 && (
              <div className="space-y-2 mt-2">
                {selectedMedicines.map((medicine) => (
                  <div key={medicine.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{medicine.brand_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {medicine.dosage} - {medicine.frequency} - {medicine.duration}
                      </p>
                    </div>
                    <X 
                      className="h-4 w-4 cursor-pointer" 
                      onClick={() => removeMedicine(medicine.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Procedures Section (Optional) */}
          <div className="space-y-2">
            <Label>Procedures (Optional - AB-HBP)</Label>
            <Popover open={procedureOpen} onOpenChange={setProcedureOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  Search procedures...
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search procedures..." 
                    value={procedureSearch}
                    onValueChange={setProcedureSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No procedures found.</CommandEmpty>
                    <CommandGroup>
                      {procedureResults.map((procedure) => (
                        <CommandItem
                          key={procedure.package_code}
                          onSelect={() => addProcedure(procedure)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{procedure.package_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {procedure.package_code} {procedure.specialty && `- ${procedure.specialty}`}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {selectedProcedures.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedProcedures.map((procedure) => (
                  <Badge key={procedure.package_code} variant="secondary" className="gap-1">
                    {procedure.package_name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeProcedure(procedure.package_code)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between space-x-2 pt-4">
            <Button variant="outline" size="icon" onClick={onClose}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print Preview
              </Button>
              <Button onClick={handleCreatePrescription}>
                <Send className="h-4 w-4 mr-2" />
                Create Prescription
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
