"use client";

import { useState, useEffect } from "react";
import { bedService, Ward, Room, Bed } from "@/lib/services/bed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function BedManagement() {
  const [wards, setWards] = useState<Ward[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [wardsData, roomsData, bedsData] = await Promise.all([
        bedService.getWards(),
        bedService.getRooms(),
        bedService.getBeds(),
      ]);
      setWards(wardsData);
      setRooms(roomsData);
      setBeds(bedsData);
    } catch (error) {
      console.error("Failed to load bed management data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      AVAILABLE: "bg-green-500",
      OCCUPIED: "bg-red-500",
      MAINTENANCE: "bg-yellow-500",
      RESERVED: "bg-blue-500",
      ACTIVE: "bg-green-500",
      INACTIVE: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Bed Management</h1>

      <Tabs defaultValue="wards">
        <TabsList>
          <TabsTrigger value="wards">Wards</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="beds">Beds</TabsTrigger>
        </TabsList>

        <TabsContent value="wards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wards.map((ward) => (
              <Card key={ward.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {ward.name}
                    <Badge className={getStatusColor(ward.status)}>
                      {ward.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Floor:</span>
                      <span className="font-medium">{ward.floor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span className="font-medium">{ward.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Occupied:</span>
                      <span className="font-medium">{ward.occupiedBeds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available:</span>
                      <span className="font-medium text-green-600">
                        {ward.capacity - ward.occupiedBeds}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <Card key={room.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Room {room.roomNumber}
                    <Badge className={getStatusColor(room.status)}>
                      {room.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium">{room.roomType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span className="font-medium">{room.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Occupied:</span>
                      <span className="font-medium">{room.occupiedBeds}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="beds" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {beds.map((bed) => (
              <Card key={bed.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    Bed {bed.bedNumber}
                    <Badge className={getStatusColor(bed.status)}>
                      {bed.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bed.patientName && (
                    <div className="space-y-1 text-sm">
                      <div className="font-medium">{bed.patientName}</div>
                      {bed.admissionDate && (
                        <div className="text-muted-foreground">
                          Admitted: {new Date(bed.admissionDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
