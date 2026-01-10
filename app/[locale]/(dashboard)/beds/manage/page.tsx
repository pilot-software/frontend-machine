"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { bedService, Room } from "@/lib/services/bed";
import { AuthGuard } from "@/components/shared/guards/AuthGuard";
import { useAlert } from "@/components/AlertProvider";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

export default function ManagePage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [beds, setBeds] = useState<any[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'beds' | 'rooms' | 'wards'>('beds');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<'bed' | 'room' | 'ward' | null>(null);
  
  const [bedForm, setBedForm] = useState({ bedNumber: "", roomId: "", bedType: "STANDARD" as const, status: "AVAILABLE" as const, branchId: "branch_main" });
  const [roomForm, setRoomForm] = useState({ roomNumber: "", wardId: "", roomType: "PRIVATE", capacity: 2, floor: "1", branchId: "branch_main" });
  const [wardForm, setWardForm] = useState({ name: "", branchId: "branch_main", capacity: 20, wardType: "ICU" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [bedsData, roomsData, wardsData] = await Promise.all([
      bedService.getAll(),
      bedService.getRooms(),
      bedService.getWards(),
    ]);
    setBeds(bedsData);
    setRooms(roomsData);
    setWards(wardsData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "bg-green-100 text-green-800";
      case "OCCUPIED": return "bg-blue-100 text-blue-800";
      case "MAINTENANCE": return "bg-orange-100 text-orange-800";
      case "RESERVED": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Manage Beds, Rooms & Wards"
          description="Edit and delete beds, rooms, and wards"
          action={
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          }
        />

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {(['beds', 'rooms', 'wards'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab} ({tab === 'beds' ? beds.length : tab === 'rooms' ? rooms.length : wards.length})
            </button>
          ))}
        </div>

        {/* Beds Tab */}
        {activeTab === 'beds' && (
          <>
            {/* Mobile: Card Grid */}
            <div className="grid gap-4 grid-cols-2 lg:hidden">
              {beds.map((bed) => (
                <Card key={bed.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{bed.bedNumber}</h3>
                        <p className="text-sm text-muted-foreground">{bed.ward}</p>
                      </div>
                      <Badge className={getStatusColor(bed.status)}>{bed.status}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditingItem(bed); setEditType('bed'); setBedForm({ bedNumber: bed.bedNumber, roomId: '', bedType: 'STANDARD', status: bed.status, branchId: 'branch_main' }); }}>
                        <Edit className="h-3 w-3 mr-1" />Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:bg-red-50" onClick={async () => { await bedService.delete(bed.id); await loadData(); showAlert("success", "Bed deleted!"); }}>
                        <Trash2 className="h-3 w-3 mr-1" />Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Desktop: List */}
            <Card className="hidden lg:block">
              <CardContent className="p-0">
                <div className="divide-y">
                  {beds.map((bed) => (
                    <div key={bed.id} className="p-4 hover:bg-muted/50 flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="min-w-[120px]"><span className="font-semibold">{bed.bedNumber}</span></div>
                        <div className="min-w-[150px] text-sm text-muted-foreground">{bed.ward}</div>
                        <Badge className={getStatusColor(bed.status)}>{bed.status}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingItem(bed); setEditType('bed'); setBedForm({ bedNumber: bed.bedNumber, roomId: '', bedType: 'STANDARD', status: bed.status, branchId: 'branch_main' }); }}>
                          <Edit className="h-3 w-3 mr-1" />Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={async () => { await bedService.delete(bed.id); await loadData(); showAlert("success", "Bed deleted!"); }}>
                          <Trash2 className="h-3 w-3 mr-1" />Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <>
            {/* Mobile: Card Grid */}
            <div className="grid gap-4 grid-cols-2 lg:hidden">
              {rooms.map((room) => (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg">Room {room.roomNumber}</h3>
                      <p className="text-sm text-muted-foreground">{wards.find(w => w.id === room.wardId)?.name || '-'}</p>
                      <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                        <span>Type: {room.roomType}</span><span>•</span><span>Capacity: {room.capacity}</span><span>•</span><span>Floor: {room.floor}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditingItem(room); setEditType('room'); setRoomForm(room); }}><Edit className="h-3 w-3 mr-1" />Edit</Button>
                      <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:bg-red-50" onClick={async () => { await bedService.deleteRoom(room.id); await loadData(); showAlert("success", "Room deleted!"); }}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Desktop: List */}
            <Card className="hidden lg:block">
              <CardContent className="p-0">
                <div className="divide-y">
                  {rooms.map((room) => (
                    <div key={room.id} className="p-4 hover:bg-muted/50 flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="min-w-[100px]"><span className="font-semibold">Room {room.roomNumber}</span></div>
                        <div className="min-w-[150px] text-sm text-muted-foreground">{wards.find(w => w.id === room.wardId)?.name || '-'}</div>
                        <div className="text-sm text-muted-foreground">{room.roomType}</div>
                        <div className="text-sm text-muted-foreground">Cap: {room.capacity}</div>
                        <div className="text-sm text-muted-foreground">Floor: {room.floor}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingItem(room); setEditType('room'); setRoomForm(room); }}><Edit className="h-3 w-3 mr-1" />Edit</Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={async () => { await bedService.deleteRoom(room.id); await loadData(); showAlert("success", "Room deleted!"); }}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Wards Tab */}
        {activeTab === 'wards' && (
          <>
            {/* Mobile: Card Grid */}
            <div className="grid gap-4 grid-cols-2 lg:hidden">
              {wards.map((ward) => (
                <Card key={ward.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg">{ward.name}</h3>
                      <div className="flex gap-2 mt-2 text-sm text-muted-foreground">
                        <span>Type: {ward.wardType}</span><span>•</span><span>Capacity: {ward.capacity}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditingItem(ward); setEditType('ward'); setWardForm(ward); }}><Edit className="h-3 w-3 mr-1" />Edit</Button>
                      <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:bg-red-50" onClick={async () => { await bedService.deleteWard(ward.id); await loadData(); showAlert("success", "Ward deleted!"); }}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Desktop: List */}
            <Card className="hidden lg:block">
              <CardContent className="p-0">
                <div className="divide-y">
                  {wards.map((ward) => (
                    <div key={ward.id} className="p-4 hover:bg-muted/50 flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="min-w-[200px]"><span className="font-semibold">{ward.name}</span></div>
                        <div className="min-w-[120px] text-sm text-muted-foreground">{ward.wardType}</div>
                        <div className="text-sm text-muted-foreground">Capacity: {ward.capacity}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingItem(ward); setEditType('ward'); setWardForm(ward); }}><Edit className="h-3 w-3 mr-1" />Edit</Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={async () => { await bedService.deleteWard(ward.id); await loadData(); showAlert("success", "Ward deleted!"); }}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit {editType === 'bed' ? 'Bed' : editType === 'room' ? 'Room' : 'Ward'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editType === 'bed' && (
              <>
                <div className="space-y-2">
                  <Label>Bed Number *</Label>
                  <Input value={bedForm.bedNumber} onChange={(e) => setBedForm({...bedForm, bedNumber: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select value={bedForm.status} onValueChange={(value: any) => setBedForm({...bedForm, status: value})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AVAILABLE">Available</SelectItem>
                      <SelectItem value="OCCUPIED">Occupied</SelectItem>
                      <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                      <SelectItem value="RESERVED">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {editType === 'room' && (
              <>
                <div className="space-y-2">
                  <Label>Room Number *</Label>
                  <Input value={roomForm.roomNumber} onChange={(e) => setRoomForm({...roomForm, roomNumber: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Room Type *</Label>
                  <Select value={roomForm.roomType} onValueChange={(value) => setRoomForm({...roomForm, roomType: value})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                      <SelectItem value="SEMI-PRIVATE">Semi-Private</SelectItem>
                      <SelectItem value="WARD">Ward</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Capacity *</Label>
                    <Input type="number" value={roomForm.capacity} onChange={(e) => setRoomForm({...roomForm, capacity: parseInt(e.target.value) || 0})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Floor *</Label>
                    <Input value={roomForm.floor} onChange={(e) => setRoomForm({...roomForm, floor: e.target.value})} />
                  </div>
                </div>
              </>
            )}
            {editType === 'ward' && (
              <>
                <div className="space-y-2">
                  <Label>Ward Name *</Label>
                  <Input value={wardForm.name} onChange={(e) => setWardForm({...wardForm, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Ward Type *</Label>
                  <Select value={wardForm.wardType} onValueChange={(value) => setWardForm({...wardForm, wardType: value})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="GENERAL">General</SelectItem>
                      <SelectItem value="PEDIATRIC">Pediatric</SelectItem>
                      <SelectItem value="MATERNITY">Maternity</SelectItem>
                      <SelectItem value="CARDIAC">Cardiac</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Capacity *</Label>
                  <Input type="number" value={wardForm.capacity} onChange={(e) => setWardForm({...wardForm, capacity: parseInt(e.target.value) || 0})} />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
            <Button onClick={async () => {
              try {
                if (editType === 'bed') {
                  await bedService.update(editingItem.id, bedForm);
                } else if (editType === 'room') {
                  await bedService.updateRoom(editingItem.id, roomForm);
                } else if (editType === 'ward') {
                  await bedService.updateWard(editingItem.id, wardForm);
                }
                await loadData();
                showAlert("success", `${editType} updated successfully!`);
                setEditingItem(null);
              } catch (error) {
                showAlert("error", `Failed to update ${editType}`);
              }
            }}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
