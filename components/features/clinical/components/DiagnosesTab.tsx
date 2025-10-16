import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Clipboard } from "lucide-react";
import { Diagnosis } from "../types/clinical.types";
import { getStatusColor, getSeverityColor } from "../utils/clinicalHelpers";

interface DiagnosesTabProps {
  diagnoses: Diagnosis[];
}

export const DiagnosesTab = React.memo<DiagnosesTabProps>(({ diagnoses }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Diagnoses</CardTitle>
        <CardDescription>Current and historical diagnoses ({diagnoses.length} total)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {diagnoses.map((diagnosis) => (
            <div key={diagnosis.id} className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Clipboard className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3>{diagnosis.patientName}</h3>
                    <p className="text-sm text-slate-500">
                      Diagnosed by {diagnosis.diagnosedBy} on{" "}
                      {new Date(diagnosis.diagnosedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(diagnosis.status)}>{diagnosis.status}</Badge>
                  <Badge variant="outline" className={getSeverityColor(diagnosis.severity)}>
                    {diagnosis.severity}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <Label className="text-sm font-medium text-slate-700">Diagnosis</Label>
                  <p className="mt-1">
                    <code className="bg-slate-100 px-2 py-1 rounded text-sm mr-2">
                      {diagnosis.diagnosisCode}
                    </code>
                    {diagnosis.diagnosisName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700">Type</Label>
                  <p className="mt-1">
                    <Badge variant="outline">{diagnosis.type}</Badge>
                  </p>
                </div>
              </div>

              {diagnosis.notes && (
                <div className="p-3 bg-slate-50 rounded">
                  <Label className="text-sm font-medium text-slate-700">Clinical Notes</Label>
                  <p className="text-sm mt-1">{diagnosis.notes}</p>
                </div>
              )}
            </div>
          ))}
          {diagnoses.length === 0 && (
            <div className="text-center py-8">
              <Clipboard className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p>No diagnoses recorded</p>
              <p>Patient diagnoses will appear here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

DiagnosesTab.displayName = "DiagnosesTab";
