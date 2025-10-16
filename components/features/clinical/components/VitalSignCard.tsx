import React from "react";
import { Button } from "@/components/ui/button";
import { Thermometer, Heart, Activity, AlertTriangle, Edit, Eye } from "lucide-react";
import { VitalSigns } from "../types/clinical.types";

interface VitalSignCardProps {
  vital: VitalSigns;
  onView: (vital: VitalSigns) => void;
  onEdit?: (vital: VitalSigns) => void;
  canEdit: boolean;
}

export const VitalSignCard = React.memo<VitalSignCardProps>(({ vital, onView, onEdit, canEdit }) => {
  return (
    <div className="p-4 border border-slate-200 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Thermometer className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3>{vital.patientName}</h3>
            <p className="text-sm text-slate-500">
              {new Date(vital.recordedAt).toLocaleString()} by {vital.recordedBy}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onView(vital)}>
            <Eye className="h-4 w-4" />
          </Button>
          {canEdit && onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(vital)}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-slate-50 p-3 rounded">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <span className="text-xs text-slate-600">Temperature</span>
          </div>
          <p className="mt-1">{vital.temperature}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-xs text-slate-600">Blood Pressure</span>
          </div>
          <p className="mt-1">
            {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}
          </p>
        </div>
        <div className="bg-slate-50 p-3 rounded">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="text-xs text-slate-600">Heart Rate</span>
          </div>
          <p className="mt-1">{vital.heartRate} bpm</p>
        </div>
        <div className="bg-slate-50 p-3 rounded">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-slate-600">Respiratory</span>
          </div>
          <p className="mt-1">{vital.respiratoryRate}/min</p>
        </div>
        <div className="bg-slate-50 p-3 rounded">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-slate-600">O2 Saturation</span>
          </div>
          <p className="mt-1">{vital.oxygenSaturation}%</p>
        </div>
        {vital.painLevel !== undefined && (
          <div className="bg-slate-50 p-3 rounded">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-slate-600">Pain Level</span>
            </div>
            <p className="mt-1">{vital.painLevel}/10</p>
          </div>
        )}
      </div>

      {vital.notes && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm">
            <span className="font-medium">Notes:</span> {vital.notes}
          </p>
        </div>
      )}
    </div>
  );
});

VitalSignCard.displayName = "VitalSignCard";
