'use client';

import { useState, useEffect } from 'react';
import { doctorAvailabilityService, DoctorAvailabilitySlot } from '@/lib/services/doctor-availability';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, User } from 'lucide-react';

interface DoctorAvailabilityCalendarProps {
  doctorId: string;
  onSlotSelect?: (slot: DoctorAvailabilitySlot) => void;
}

export default function DoctorAvailabilityCalendar({ doctorId, onSlotSelect }: DoctorAvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState<DoctorAvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<DoctorAvailabilitySlot | null>(null);
  const [patientId, setPatientId] = useState('');

  useEffect(() => {
    loadSlots();
  }, [doctorId, selectedDate]);

  const loadSlots = async () => {
    try {
      setLoading(true);
      const availableSlots = await doctorAvailabilityService.getDoctorAvailability(doctorId, selectedDate);
      setSlots(availableSlots);
    } catch (error) {
      console.error('Failed to load slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async () => {
    if (!selectedSlot || !patientId) return;
    try {
      await doctorAvailabilityService.bookSlot({
        slotId: selectedSlot.id,
        patientId
      });
      setShowBookModal(false);
      setPatientId('');
      loadSlots();
      onSlotSelect?.(selectedSlot);
    } catch (error) {
      console.error('Failed to book slot:', error);
    }
  };

  const getSlotColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 border-green-300 hover:bg-green-200';
      case 'BOOKED': return 'bg-red-100 border-red-300';
      case 'BLOCKED': return 'bg-gray-100 border-gray-300';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    const hour = slot.startTime.split(':')[0];
    if (!acc[hour]) acc[hour] = [];
    acc[hour].push(slot);
    return acc;
  }, {} as Record<string, DoctorAvailabilitySlot[]>);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Doctor Availability</h2>
        <div className="flex gap-2 items-center">
          <Calendar className="w-5 h-5 text-gray-500" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Slots - {new Date(selectedDate).toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedSlots).length === 0 ? (
            <p className="text-center text-gray-500 py-8">No slots available for this date</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedSlots).map(([hour, hourSlots]) => (
                <div key={hour}>
                  <h3 className="font-semibold mb-2">{hour}:00</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {hourSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => {
                          if (slot.status === 'AVAILABLE') {
                            setSelectedSlot(slot);
                            setShowBookModal(true);
                          }
                        }}
                        disabled={slot.status !== 'AVAILABLE'}
                        className={`p-3 border-2 rounded text-sm ${getSlotColor(slot.status)} ${
                          slot.status === 'AVAILABLE' ? 'cursor-pointer' : 'cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-1 justify-center">
                          <Clock className="w-4 h-4" />
                          <span>{slot.startTime.substring(0, 5)}</span>
                        </div>
                        {slot.status === 'BOOKED' && slot.patientName && (
                          <div className="flex items-center gap-1 justify-center mt-1 text-xs">
                            <User className="w-3 h-3" />
                            <span className="truncate">{slot.patientName}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
          <span>Blocked</span>
        </div>
      </div>

      <Dialog open={showBookModal} onOpenChange={setShowBookModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSlot && (
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">{selectedSlot.startTime} - {selectedSlot.endTime}</p>
              </div>
            )}
            <div>
              <Label>Patient ID</Label>
              <Input
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter patient ID"
              />
            </div>
            <Button onClick={handleBookSlot} className="w-full">
              Book Slot
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
