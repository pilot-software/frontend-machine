import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Calendar, MapPin } from "lucide-react";
import { PatientFormData, INSURANCE_OPTIONS } from "../types/patient-form.types";

interface PatientBasicInfoTabProps {
  patientData: PatientFormData;
  doctors: any[];
  isReadOnly: boolean;
  onInputChange: (field: keyof PatientFormData, value: string) => void;
}

export const PatientBasicInfoTab = React.memo<PatientBasicInfoTabProps>(({
  patientData,
  doctors,
  isReadOnly,
  onInputChange,
}) => {
  const t = useTranslations("common");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("personalInformation")}</CardTitle>
        <CardDescription>Basic patient demographics and contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="firstName">{t("firstName")} *</Label>
            <Input
              id="firstName"
              value={patientData.firstName}
              onChange={(e) => onInputChange("firstName", e.target.value)}
              placeholder="Enter first name"
              disabled={isReadOnly}
            />
          </div>
          <div>
            <Label htmlFor="lastName">{t("lastName")} *</Label>
            <Input
              id="lastName"
              value={patientData.lastName}
              onChange={(e) => onInputChange("lastName", e.target.value)}
              placeholder="Enter last name"
              disabled={isReadOnly}
            />
          </div>
          <div>
            <Label htmlFor="gender">{t("gender")} *</Label>
            <Select value={patientData.gender} onValueChange={(value) => onInputChange("gender", value)} disabled={isReadOnly}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
                <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="email">{t("emailAddress")} *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={patientData.email}
                onChange={(e) => onInputChange("email", e.target.value)}
                placeholder="patient@example.com"
                className="pl-10"
                disabled={isReadOnly}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">{t("phoneNumber")} *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                value={patientData.phone}
                onChange={(e) => onInputChange("phone", e.target.value)}
                placeholder="+1-555-0123"
                className="pl-10"
                disabled={isReadOnly}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="dateOfBirth">{t("dateOfBirth")} *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="dateOfBirth"
                type="date"
                value={patientData.dateOfBirth}
                onChange={(e) => onInputChange("dateOfBirth", e.target.value)}
                className="pl-10"
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Textarea
              id="address"
              value={patientData.address}
              onChange={(e) => onInputChange("address", e.target.value)}
              placeholder="Enter full address"
              className="pl-10"
              disabled={isReadOnly}
            />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
            <Input
              id="emergencyContactName"
              value={patientData.emergencyContactName}
              onChange={(e) => onInputChange("emergencyContactName", e.target.value)}
              placeholder="Contact person name"
              disabled={isReadOnly}
            />
          </div>
          <div>
            <Label htmlFor="emergencyContact">Emergency Contact Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="emergencyContact"
                value={patientData.emergencyContactPhone}
                onChange={(e) => onInputChange("emergencyContactPhone", e.target.value)}
                placeholder="+1-555-0124"
                className="pl-10"
                disabled={isReadOnly}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="emergencyRelationship">Relationship</Label>
            <Input
              id="emergencyRelationship"
              value={patientData.emergencyContactRelationship}
              onChange={(e) => onInputChange("emergencyContactRelationship", e.target.value)}
              placeholder="Spouse, Parent, etc."
              disabled={isReadOnly}
            />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="bloodType">{t("bloodType")}</Label>
            <Select value={patientData.bloodType} onValueChange={(value) => onInputChange("bloodType", value)} disabled={isReadOnly}>
              <SelectTrigger>
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="O_POSITIVE">O+</SelectItem>
                <SelectItem value="O_NEGATIVE">O-</SelectItem>
                <SelectItem value="A_POSITIVE">A+</SelectItem>
                <SelectItem value="A_NEGATIVE">A-</SelectItem>
                <SelectItem value="B_POSITIVE">B+</SelectItem>
                <SelectItem value="B_NEGATIVE">B-</SelectItem>
                <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="insuranceProvider">{t("insuranceProvider")}</Label>
            <Select value={patientData.insuranceProvider} onValueChange={(value) => onInputChange("insuranceProvider", value)} disabled={isReadOnly}>
              <SelectTrigger>
                <SelectValue placeholder="Select insurance" />
              </SelectTrigger>
              <SelectContent>
                {INSURANCE_OPTIONS.map((insurance) => (
                  <SelectItem key={insurance.value} value={insurance.value}>
                    {insurance.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="insurancePolicyNumber">{t("policyNumber")}</Label>
            <Input
              id="insurancePolicyNumber"
              value={patientData.insurancePolicyNumber}
              onChange={(e) => onInputChange("insurancePolicyNumber", e.target.value)}
              placeholder="Policy number"
              disabled={isReadOnly}
            />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="assignedDoctor">{t("assignedDoctor")}</Label>
            <Select value={patientData.assignedDoctor} onValueChange={(value) => onInputChange("assignedDoctor", value)} disabled={isReadOnly}>
              <SelectTrigger>
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(doctors) && doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization || doctor.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="allergies">{t("allergies")}</Label>
            <Textarea
              id="allergies"
              value={patientData.allergies}
              onChange={(e) => onInputChange("allergies", e.target.value)}
              placeholder="List any known allergies"
              disabled={isReadOnly}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="chronicConditions">{t("chronicConditions")}</Label>
            <Textarea
              id="chronicConditions"
              value={patientData.chronicConditions}
              onChange={(e) => onInputChange("chronicConditions", e.target.value)}
              placeholder="List chronic conditions"
              disabled={isReadOnly}
            />
          </div>
          <div>
            <Label htmlFor="currentMedications">{t("currentMedications")}</Label>
            <Textarea
              id="currentMedications"
              value={patientData.currentMedications}
              onChange={(e) => onInputChange("currentMedications", e.target.value)}
              placeholder="List current medications"
              disabled={isReadOnly}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PatientBasicInfoTab.displayName = "PatientBasicInfoTab";
