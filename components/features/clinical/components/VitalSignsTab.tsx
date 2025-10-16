import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer } from "lucide-react";
import { VitalSigns } from "../types/clinical.types";
import { VitalSignCard } from "./VitalSignCard";

interface VitalSignsTabProps {
  vitals: VitalSigns[];
  onView: (vital: VitalSigns) => void;
  onEdit?: (vital: VitalSigns) => void;
  canEdit: boolean;
}

export const VitalSignsTab = React.memo<VitalSignsTabProps>(({ vitals, onView, onEdit, canEdit }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Vital Signs</CardTitle>
        <CardDescription>Latest vital signs measurements ({vitals.length} records)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vitals.map((vital) => (
            <VitalSignCard
              key={vital.id}
              vital={vital}
              onView={onView}
              onEdit={onEdit}
              canEdit={canEdit}
            />
          ))}
          {vitals.length === 0 && (
            <div className="text-center py-8">
              <Thermometer className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p>No vital signs recorded</p>
              <p>Vital signs will appear here once recorded</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

VitalSignsTab.displayName = "VitalSignsTab";
