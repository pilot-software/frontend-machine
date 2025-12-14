"use client";

import { useState, useEffect } from "react";
import { bedService, ApiBed } from "@/lib/services/bed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, Baby, Bed as BedIcon } from "lucide-react";

export default function BedManagement() {
  const [beds, setBeds] = useState<ApiBed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const bedsData = await bedService.getAll();
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
    };
    return colors[status] || "bg-gray-500";
  };

  const getWardIcon = (wardName: string) => {
    const name = wardName.toLowerCase();
    if (name.includes("icu") || name.includes("intensive care")) {
      return <Activity className="h-4 w-4" />;
    } else if (name.includes("cardiac") || name.includes("heart")) {
      return <Heart className="h-4 w-4" />;
    } else if (name.includes("pediatric") || name.includes("child")) {
      return <Baby className="h-4 w-4" />;
    }
    return <BedIcon className="h-4 w-4" />;
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Bed Management</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {beds.map((bed) => (
          <Card key={bed.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  {getWardIcon(bed.ward)}
                  {bed.bedNumber}
                </span>
                <Badge className={getStatusColor(bed.status)}>
                  {bed.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Ward:</span>
                  <span className="font-medium">{bed.ward}</span>
                </div>
                <div className="flex justify-between">
                  <span>Floor:</span>
                  <span className="font-medium">{bed.floor}</span>
                </div>
                {bed.patientName && (
                  <div className="flex justify-between">
                    <span>Patient:</span>
                    <span className="font-medium">{bed.patientName}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
