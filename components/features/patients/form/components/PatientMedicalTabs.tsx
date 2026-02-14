import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import { Heart, PillBottle, Thermometer, Activity } from "lucide-react";
import { MedicalData } from "@/lib/services/medical";

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "mild": return "bg-green-100 text-green-800";
    case "moderate": return "bg-yellow-100 text-yellow-800";
    case "severe":
    case "critical": return "bg-red-100 text-red-800";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
    case "pending":
    case "in_progress": return "bg-blue-100 text-blue-800";
    case "resolved":
    case "completed": return "bg-green-100 text-green-800";
    case "chronic":
    case "in_remission": return "bg-purple-100 text-purple-800";
    case "cancelled":
    case "discontinued": return "bg-red-100 text-red-800";
    default: return "bg-muted text-muted-foreground";
  }
};

interface MedicalTabProps {
  medicalData: MedicalData | null;
  loading: boolean;
}

export const PatientConditionsTab = React.memo<MedicalTabProps>(({ medicalData, loading }) => {
  if (loading) {
    return (
      <div className="py-8">
        <Loader text="Loading medical data..." />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Conditions</CardTitle>
        <CardDescription>Current and past medical conditions</CardDescription>
      </CardHeader>
      <CardContent>
        {!medicalData?.conditions?.length ? (
          <div className="text-center py-8 text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No medical conditions recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medicalData.conditions.map((condition) => (
              <div key={condition.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{condition.conditionName}</h4>
                    <p className="text-sm text-gray-600 mt-1">{condition.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getSeverityColor(condition.severity.toLowerCase())}>{condition.severity}</Badge>
                      <Badge className={getStatusColor(condition.status.toLowerCase())}>{condition.status}</Badge>
                      <span className="text-sm text-gray-500">Diagnosed: {condition.diagnosedDate}</span>
                    </div>
                    {condition.notes && <p className="text-sm text-gray-600 mt-2">{condition.notes}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export const PatientPrescriptionsTab = React.memo<MedicalTabProps>(({ medicalData, loading }) => {
  if (loading) {
    return (
      <div className="py-8">
        <Loader text="Loading prescriptions..." />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Prescriptions</CardTitle>
        <CardDescription>Active and recent prescriptions</CardDescription>
      </CardHeader>
      <CardContent>
        {!medicalData?.prescriptions?.length ? (
          <div className="text-center py-8 text-gray-500">
            <PillBottle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No prescriptions recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medicalData.prescriptions.map((prescription) => (
              <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{prescription.medicationName}</h4>
                      <Badge className={getStatusColor(prescription.status.toLowerCase())}>{prescription.status}</Badge>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600"><strong>Dosage:</strong> {prescription.dosage} - {prescription.frequency}</p>
                      <p className="text-sm text-gray-600"><strong>Duration:</strong> {prescription.duration}</p>
                      <p className="text-sm text-gray-600"><strong>Refills Remaining:</strong> {prescription.refillsRemaining}</p>
                      <p className="text-sm text-gray-600"><strong>Created:</strong> {new Date(prescription.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export const PatientVitalsTab = React.memo<MedicalTabProps>(({ medicalData, loading }) => {
  if (loading) {
    return (
      <div className="py-8">
        <Loader text="Loading vitals..." />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vital Signs</CardTitle>
        <CardDescription>Recent vital signs and measurements</CardDescription>
      </CardHeader>
      <CardContent>
        {!medicalData?.vitals?.length ? (
          <div className="text-center py-8 text-gray-500">
            <Thermometer className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No vital signs recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medicalData.vitals.map((vital) => (
              <div key={vital.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Vital Signs</h4>
                  <span className="text-sm text-gray-500">{new Date(vital.recordedAt).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="font-semibold">{vital.temperature}°F</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded">
                    <p className="text-sm text-gray-600">Blood Pressure</p>
                    <p className="font-semibold">{vital.bloodPressure}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="text-sm text-gray-600">Heart Rate</p>
                    <p className="font-semibold">{vital.heartRate} bpm</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-semibold">{vital.weight} kg</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <p className="text-sm text-gray-600">Height</p>
                    <p className="font-semibold">{vital.height} cm</p>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 rounded">
                    <p className="text-sm text-gray-600">O2 Saturation</p>
                    <p className="font-semibold">{vital.oxygenSaturation}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export const PatientLabsTab = React.memo<MedicalTabProps>(({ medicalData, loading }) => {
  if (loading) {
    return (
      <div className="py-8">
        <Loader text="Loading lab results..." />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laboratory Results</CardTitle>
        <CardDescription>Recent lab tests and results</CardDescription>
      </CardHeader>
      <CardContent>
        {!medicalData?.labResults?.length ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No lab results recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medicalData.labResults.map((lab) => (
              <div key={lab.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{lab.testName}</h4>
                      <Badge className={getStatusColor(lab.status.toLowerCase())}>{lab.status}</Badge>
                      <Badge className={lab.abnormalFlag === "NORMAL" ? "bg-green-100 text-green-800" : lab.abnormalFlag === "ABNORMAL" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                        {lab.abnormalFlag}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600"><strong>Test Date:</strong> {lab.testDate}</p>
                      <p className="text-sm text-gray-600"><strong>Results:</strong> {lab.testResults}</p>
                      <p className="text-sm text-gray-600"><strong>Created:</strong> {new Date(lab.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

PatientConditionsTab.displayName = "PatientConditionsTab";
PatientPrescriptionsTab.displayName = "PatientPrescriptionsTab";
PatientVitalsTab.displayName = "PatientVitalsTab";
PatientLabsTab.displayName = "PatientLabsTab";
