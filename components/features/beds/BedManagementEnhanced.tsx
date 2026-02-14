'use client';

import { useState, useEffect } from 'react';
import { bedService, ApiBed, BedAllocationRequest } from '@/lib/services/bed';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bed, CheckCircle, XCircle, AlertTriangle, Wrench } from 'lucide-react';

export default function BedManagement() {
  const [beds, setBeds] = useState<ApiBed[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBed, setSelectedBed] = useState<ApiBed | null>(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    loadBeds();
  }, [filter]);

  const loadBeds = async () => {
    try {
      setLoading(true);
      const [allBeds, occupancyStats] = await Promise.all([
        bedService.getBeds(filter !== 'ALL' ? { status: filter } : undefined),
        bedService.getBedOccupancyStats()
      ]);
      setBeds(allBeds);
      setStats(occupancyStats);
    } catch (error) {
      console.error('Failed to load beds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllocate = async () => {
    if (!selectedBed || !patientId) return;
    try {
      await bedService.allocateBed({
        bedId: selectedBed.id,
        patientId,
        allocationDate: new Date().toISOString()
      });
      setShowAllocateModal(false);
      setPatientId('');
      setSelectedBed(null);
      loadBeds();
    } catch (error) {
      console.error('Failed to allocate bed:', error);
    }
  };

  const handleRelease = async (bedId: string) => {
    try {
      await bedService.releaseBed({ bedId });
      loadBeds();
    } catch (error) {
      console.error('Failed to release bed:', error);
    }
  };

  const handleMarkMaintenance = async (bedId: string) => {
    try {
      await bedService.markBedMaintenance(bedId, 'Scheduled maintenance');
      loadBeds();
    } catch (error) {
      console.error('Failed to mark maintenance:', error);
    }
  };

  const getBedIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'OCCUPIED': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'MAINTENANCE': return <Wrench className="w-5 h-5 text-orange-500" />;
      case 'CLEANING': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Bed className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBedColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-50 border-green-200';
      case 'OCCUPIED': return 'bg-red-50 border-red-200';
      case 'MAINTENANCE': return 'bg-orange-50 border-orange-200';
      case 'CLEANING': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bed Management</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Beds</SelectItem>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="OCCUPIED">Occupied</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            <SelectItem value="CLEANING">Cleaning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.totalBeds}</p>
                <p className="text-sm text-gray-500">Total Beds</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{stats.availableBeds}</p>
                <p className="text-sm text-gray-500">Available</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{stats.occupiedBeds}</p>
                <p className="text-sm text-gray-500">Occupied</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">{stats.maintenanceBeds}</p>
                <p className="text-sm text-gray-500">Maintenance</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.occupancyRate}%</p>
                <p className="text-sm text-gray-500">Occupancy</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {beds.map((bed) => (
          <Card key={bed.id} className={`${getBedColor(bed.status)} border-2`}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold">{bed.bedNumber}</span>
                  {getBedIcon(bed.status)}
                </div>
                <p className="text-xs text-gray-600">{bed.bedType}</p>
                {bed.patientName && (
                  <p className="text-xs font-medium truncate">{bed.patientName}</p>
                )}
                <div className="flex gap-1">
                  {bed.status === 'AVAILABLE' && (
                    <Button size="sm" className="w-full text-xs" onClick={() => {
                      setSelectedBed(bed);
                      setShowAllocateModal(true);
                    }}>
                      Allocate
                    </Button>
                  )}
                  {bed.status === 'OCCUPIED' && (
                    <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => handleRelease(bed.id)}>
                      Release
                    </Button>
                  )}
                  {bed.status === 'AVAILABLE' && (
                    <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => handleMarkMaintenance(bed.id)}>
                      Maint.
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showAllocateModal} onOpenChange={setShowAllocateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allocate Bed {selectedBed?.bedNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient ID</Label>
              <Input value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Enter patient ID" />
            </div>
            <Button onClick={handleAllocate} className="w-full">Allocate Bed</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
