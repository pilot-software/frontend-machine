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
import { Plus, Trash2, Clock, Calendar as CalendarIcon, CalendarDays } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthContext';
import { useRouter } from 'next/navigation';

export default function SlotManagement() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
    if (!confirm('Delete this slot?')) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/doctor-availability/slot/${slotId}`, {
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
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Slot Management</h1>
          <p className="text-gray-500 mt-1">Create and manage doctor availability slots</p>
        </div>
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
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Slots</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.role !== 'doctor' && (
                <div>
                  <Label>Select Doctor</Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor..." />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{doctor.name || doctor.email}</span>
                            <span className="text-xs text-gray-500">{doctor.specialization || doctor.id}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedDoctor && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium">💡 Suggestion:</p>
                      <p className="text-sm text-blue-600 mt-1">
                        Consider creating slots during peak hours (9 AM - 12 PM, 2 PM - 5 PM) for better patient accessibility.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Slot Duration (minutes)</Label>
                <Select value={slotDuration} onValueChange={setSlotDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Break Start</Label>
                  <Input type="time" value={breakStart} onChange={(e) => setBreakStart(e.target.value)} />
                </div>
                <div>
                  <Label>Break End</Label>
                  <Input type="time" value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)} />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={createSlots} disabled={!selectedDoctor || loading} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Slots for {selectedDate.toLocaleDateString()}
                </Button>
                {slots.length > 0 && (
                  <Button variant="destructive" onClick={deleteAllSlotsForDate} disabled={loading}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Slots ({slots.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-500">Loading slots...</span>
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No slots for this date</p>
                  <p className="text-sm text-gray-400 mt-1">Create slots using the form above</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {slots.map((slot) => (
                    <div key={slot.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <Badge variant={slot.status === 'AVAILABLE' ? 'default' : 'secondary'}>
                          {slot.status}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm">{slot.startTime} - {slot.endTime}</p>
                      {slot.patientId && (
                        <p className="text-xs text-gray-500 mt-1">Patient: {slot.patientId}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="destructive" onClick={() => deleteSlot(slot.id)} className="w-full">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
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
                <CalendarIcon className="w-5 h-5" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full"
                />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Selected Date:</p>
                  <p className="text-gray-900">{selectedDate.toLocaleDateString('en-US', { 
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
    </div>
  );
}