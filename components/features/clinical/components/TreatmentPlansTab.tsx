import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Activity, Pill, FileText } from "lucide-react";
import { TreatmentPlan } from "../types/clinical.types";
import { getStatusColor } from "../utils/clinicalHelpers";

interface TreatmentPlansTabProps {
  plans: TreatmentPlan[];
}

export const TreatmentPlansTab = React.memo<TreatmentPlansTabProps>(({ plans }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treatment Plans</CardTitle>
        <CardDescription>Active and completed treatment plans ({plans.length} total)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {plans.map((plan) => (
            <div key={plan.id} className="p-6 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <FileText className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3>{plan.planName}</h3>
                    <p className="text-sm text-slate-500">
                      {plan.patientName} • Created by {plan.createdBy}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(plan.status)}>{plan.status}</Badge>
                  {plan.nextReviewDate && (
                    <Badge variant="outline">
                      Next Review: {new Date(plan.nextReviewDate).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Treatment Goals</Label>
                  <ul className="space-y-2">
                    {plan.goals.map((goal, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Interventions</Label>
                  <ul className="space-y-2">
                    {plan.interventions.map((intervention, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span className="text-sm">{intervention}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Medications</Label>
                  <ul className="space-y-2">
                    {plan.medications.map((medication, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Pill className="h-4 w-4 text-orange-500 mt-0.5" />
                        <span className="text-sm">{medication}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Timeline</Label>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Start Date:</span>
                      <span>{new Date(plan.startDate).toLocaleDateString()}</span>
                    </div>
                    {plan.endDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">End Date:</span>
                        <span>{new Date(plan.endDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded">
                <Label className="text-sm font-medium text-slate-700">Follow-up Instructions</Label>
                <p className="text-sm mt-1">{plan.followUpInstructions}</p>
              </div>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p>No treatment plans</p>
              <p>Treatment plans will appear here when created</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

TreatmentPlansTab.displayName = "TreatmentPlansTab";
