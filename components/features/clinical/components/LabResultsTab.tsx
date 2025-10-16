import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Download, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { LabResult } from "../types/clinical.types";
import { getStatusColor, getPriorityColor } from "../utils/clinicalHelpers";

interface LabResultsTabProps {
  labs: LabResult[];
  onView: (lab: LabResult) => void;
}

export const LabResultsTab = React.memo<LabResultsTabProps>(({ labs, onView }) => {
  const t = useTranslations("common");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laboratory Results</CardTitle>
        <CardDescription>Lab tests and results ({labs.length} total)</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("patient")}</TableHead>
              <TableHead>Test</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Ordered By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {labs.map((lab) => (
              <TableRow key={lab.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {lab.patientName.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{lab.patientName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{lab.testName}</p>
                    {lab.flagged && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mt-1">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Flagged
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{lab.testType}</TableCell>
                <TableCell>{lab.orderedBy}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(lab.status)}>{lab.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getPriorityColor(lab.priority)}>
                    {lab.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <p>Ordered: {new Date(lab.orderedDate).toLocaleDateString()}</p>
                    {lab.completedDate && (
                      <p className="text-sm text-slate-500">
                        Completed: {new Date(lab.completedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => onView(lab)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
});

LabResultsTab.displayName = "LabResultsTab";
