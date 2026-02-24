'use client';

import { useState, useEffect } from 'react';
import { doctorAvailabilityService } from '@/lib/services/doctor-availability';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { EnterprisePageHeader } from '@/components/shared/EnterprisePageHeader';
import { Plus, Trash2, Clock, Calendar as CalendarIcon, CalendarDays } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthContext';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function SlotManagement() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);

  // Form state
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState('30');
  const [breakStart, setBreakStart] = useState('13:00');
  const [breakEnd, setBreakEnd] = useState('14:00');

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const loadDoctors = async () => {
    try {
      if (user?.role === 'doctor') {
        setSelectedDoctor(user.id);
        setDoctors([{ id: user.id, name: user.name, email: user.email }]);
      } else {
        const orgId = user?.organizationId || 'hospital_org1';
        
        const response = await fetch('http://localhost:8080/api/users/doctors', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Organization-ID': orgId
          }
        });
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        }
      }
    } catch (error) {
      console.error('Failed to load doctors:', error);
    }
  };

  const loadSlots = async () => {
    try {
      setLoading(true);
      // Format date as YYYY-MM-DD in local timezone
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const response = await fetch(`http://localhost:8080/api/doctor-availability/doctor/${selectedDoctor}?date=${dateStr}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Organization-ID': user?.organizationId || 'hospital_org1'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSlots(data);
      }
    } catch (error) {
      console.error('Failed to load slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSlots = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      // Format date as YYYY-MM-DD in local timezone
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const response = await fetch('http://localhost:8080/api/doctor-availability/generate-slots', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Organization-ID': user?.organizationId || 'hospital_org1'
        },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          date: dateStr,
          startTime: startTime + ':00',
          endTime: endTime + ':00',
          slotDurationMinutes: parseInt(slotDuration),
          branchId: user?.branchId || 'branch_main',
          notes: 'Regular consultation hours'
        })
      });

      if (response.ok) {
        await loadSlots();
        alert('Slots created successfully!');
      } else {
        throw new Error('Failed to create slots');
      }
    } catch (error) {
      console.error('Failed to create slots:', error);
      alert('Failed to create slots');
    } finally {
      setLoading(false);
    }
  };

  const deleteSlot = async (slotId: string) => {
    setSlotToDelete(slotId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!slotToDelete) return;
    setDeleteConfirmOpen(false);
    setDeletingId(slotToDelete);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const response = await fetch(`http://localhost:8080/api/doctor-availability/slot/${slotToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Organization-ID': user?.organizationId || 'hospital_org1'
        }
      });
      if (response.ok) {
        await loadSlots();
      }
    } catch (error) {
      console.error('Failed to delete slot:', error);
    } finally {
      setDeletingId(null);
      setSlotToDelete(null);
    }
  };

  const deleteAllSlotsForDate = async () => {
    if (!confirm(`Delete all slots for ${selectedDate.toLocaleDateString()}?`)) return;
    
    try {
      // Format date as YYYY-MM-DD in local timezone
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const response = await fetch(`http://localhost:8080/api/doctor-availability/doctor/${selectedDoctor}/date/${dateStr}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Organization-ID': user?.organizationId || 'hospital_org1'
        }
      });
      if (response.ok) {
        await loadSlots();
        alert('All slots deleted successfully!');
      }
    } catch (error) {
      console.error('Failed to delete slots:', error);
    }
  };

  return (
    <div className="space-y-6">
      <EnterprisePageHeader
        icon={Clock}
        title="Slot Management"
        description="Create and manage doctor availability slots"
        breadcrumbs={[
          { label: "Dashboard", href: "/en/dashboard" },
          { label: "Availability" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button onClick={() => router.push('/appointments')}>
              <CalendarDays className="w-4 h-4 mr-2" />
              View Appointments
            </Button>
            {(user?.role === 'doctor' || user?.role === 'admin' || user?.role === 'receptionist') && (
              <Button variant="outline" onClick={() => router.push('/appointments/add')}>
                <Plus className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Slots</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.role !== 'doctor' && (
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Select Doctor</Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger className="h-14 border-2 hover:border-primary/50 transition-colors">
                      <SelectValue placeholder="Choose a doctor..." />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{doctor.name || doctor.email}</span>
                            {doctor.specialization && (
                              <span className="text-xs text-muted-foreground">• {doctor.specialization}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedDoctor && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">💡 Pro Tip:</p>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                        Peak hours (9 AM - 12 PM, 2 PM - 5 PM) ensure better patient accessibility.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Start Time</Label>
                  <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="h-10" />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">End Time</Label>
                  <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="h-10" />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">Slot Duration</Label>
                <Select value={slotDuration} onValueChange={setSlotDuration}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">⏱️ 15 minutes</SelectItem>
                    <SelectItem value="30">⏱️ 30 minutes</SelectItem>
                    <SelectItem value="45">⏱️ 45 minutes</SelectItem>
                    <SelectItem value="60">⏱️ 60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-3">Break Time</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium mb-1 block text-amber-800 dark:text-amber-200">Break Start</Label>
                    <Input type="time" value={breakStart} onChange={(e) => setBreakStart(e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-1 block text-amber-800 dark:text-amber-200">Break End</Label>
                    <Input type="time" value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)} className="h-9 text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={createSlots} disabled={!selectedDoctor || loading} className="flex-1 h-11 font-semibold">
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Slots
                    </>
                  )}
                </Button>
                {slots.length > 0 && (
                  <Button variant="outline" onClick={deleteAllSlotsForDate} disabled={loading} className="h-11">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Slots for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <Badge variant="secondary" className="text-sm font-semibold">{slots.length} slots</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <Loader text="Loading slots..." />
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-muted-foreground font-medium">No slots created yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Create slots using the form above to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {slots.map((slot) => (
                    <div key={slot.id} className="group relative border rounded-lg p-3 hover:shadow-md hover:border-primary/50 transition-all duration-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
                          slot.status === 'AVAILABLE' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            slot.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-blue-500'
                          }`} />
                          {slot.status}
                        </div>
                      </div>
                      <p className="font-bold text-sm text-foreground">{slot.startTime} - {slot.endTime}</p>
                      {slot.patientId && (
                        <p className="text-xs text-muted-foreground mt-2 truncate">👤 {slot.patientId}</p>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => deleteSlot(slot.id)} 
                        className={`w-full mt-2 h-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity ${
                          deletingId === slot.id ? 'bg-red-50 dark:bg-red-900/20' : ''
                        }`}
                        disabled={deletingId === slot.id}
                      >
                        <Trash2 className={`w-3 h-3 mr-1 ${deletingId === slot.id ? 'animate-[trashDrop_0.6s_ease-in-out]' : ''}`} />
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Date Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date" className="text-sm font-semibold mb-2 block">Choose Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-10 font-medium"
                />
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📅 Selected Date</p>
                  <p className="text-blue-800 dark:text-blue-200 font-medium">{selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Slot</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this slot? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}