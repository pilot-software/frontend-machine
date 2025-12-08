"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAlert } from "@/components/AlertProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  Heart,
  Shield,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { patientService } from "@/lib/services/patient";
import { userService } from "@/lib/services/user";
import { useAppData } from "@/lib/hooks/useAppData";
import { useAppSelector } from "@/lib/store";
import { PatientFormData, validatePersonalInfo } from "@/lib/utils";

export default function AddPatientPage() {
  const t = useTranslations("common");
  const router = useRouter();
  const { refetch } = useAppData();
  const reduxDoctors = useAppSelector((state) => state.app.doctors || []);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showAlert } = useAlert();

  const [patientData, setPatientData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    bloodType: "",
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
    assignedDoctor: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
  });

  React.useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorUsers =
          reduxDoctors && reduxDoctors.length
            ? reduxDoctors
            : await userService.getUsersByRole("DOCTOR");
        setDoctors(doctorUsers);
      } catch (error) {
        console.error("Failed to load doctors:", error);
      }
    };
    loadDoctors();
  }, [reduxDoctors]);

  const insuranceOptions = [
    { value: "blue-cross", label: t("blueCross") },
    { value: "aetna", label: t("aetna") },
    { value: "kaiser", label: t("kaiser") },
    { value: "cigna", label: t("cigna") },
    { value: "united", label: t("united") },
    { value: "medicare", label: t("medicare") },
    { value: "medicaid", label: t("medicaid") },
    { value: "self-pay", label: t("selfPay") },
  ];

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setPatientData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleValidatePersonalInfo = (): boolean => {
    const newErrors = validatePersonalInfo(patientData, t);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!handleValidatePersonalInfo()) {
      setIsSubmitting(false);
      showAlert(
        "warning",
        t("fillRequiredFields")
      );
      return;
    }

    try {
      const apiData = {
        firstName: patientData.firstName.trim(),
        lastName: patientData.lastName.trim(),
        dateOfBirth: patientData.dateOfBirth,
        gender: patientData.gender as
          | "MALE"
          | "FEMALE"
          | "OTHER"
          | "PREFER_NOT_TO_SAY",
        phone: patientData.phone,
        email: patientData.email.trim(),
        address: patientData.address || undefined,
        city: patientData.city || undefined,
        state: patientData.state || undefined,
        zipCode: patientData.zipCode || undefined,
        country: patientData.country || undefined,
        emergencyContactName: patientData.emergencyContactName || undefined,
        emergencyContactPhone: patientData.emergencyContactPhone || undefined,
        emergencyContactRelationship:
          patientData.emergencyContactRelationship || undefined,
        bloodType: patientData.bloodType || undefined,
        allergies: patientData.allergies || undefined,
        chronicConditions: patientData.chronicConditions || undefined,
        currentMedications: patientData.currentMedications || undefined,
        assignedDoctor: patientData.assignedDoctor || undefined,
        insuranceProvider: patientData.insuranceProvider || undefined,
        insurancePolicyNumber: patientData.insurancePolicyNumber || undefined,
      };

      const response = await patientService.createPatient(apiData);
      showAlert("success", t("patientCreatedSuccess"));
      refetch.patients();
      const patientId = response?.id;
      if (patientId) {
        setTimeout(() => router.push(`/en/patients/edit/${patientId}`), 1500);
      }
    } catch (error) {
      console.error("Failed to save patient:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      showAlert("error", t("failedSavePatient").replace("{error}", errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("addNewPatient")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("enterPatientDetails")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Accordion type="multiple" defaultValue={["personal"]} className="space-y-4">
          <AccordionItem value="personal">
            <Card>
              <CardHeader>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="flex items-center gap-2">
                        {t("personalInformation")}
                        <span className="text-xs font-normal text-red-600 bg-red-50 px-2 py-0.5 rounded">Mandatory</span>
                      </CardTitle>
                      <CardDescription>{t("basicDemographics")}</CardDescription>
                    </div>
                  </div>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {t("firstName")} *
                </Label>
                <Input
                  id="firstName"
                  value={patientData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder={t("enterFirstName")}
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {t("lastName")} *
                </Label>
                <Input
                  id="lastName"
                  value={patientData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder={t("enterLastName")}
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.lastName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="gender">{t("gender")} *</Label>
                <Select
                  value={patientData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger aria-invalid={!!errors.gender}>
                    <SelectValue placeholder={t("selectGender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">{t("male")}</SelectItem>
                    <SelectItem value="FEMALE">{t("female")}</SelectItem>
                    <SelectItem value="OTHER">{t("other")}</SelectItem>
                    <SelectItem value="PREFER_NOT_TO_SAY">
                      {t("preferNotToSay")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.gender}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {t("emailAddress")} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={patientData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {t("phoneNumber")} *
                </Label>
                <Input
                  id="phone"
                  value={patientData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder={t("phonePlaceholder")}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="dateOfBirth"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {t("dateOfBirth")} *
                  {patientData.dateOfBirth && (
                    <span className="text-xs font-normal text-muted-foreground">
                      ({Math.floor((new Date().getTime() - new Date(patientData.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years)
                    </span>
                  )}
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={patientData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className="dark:text-white dark:[color-scheme:dark]"
                  aria-invalid={!!errors.dateOfBirth}
                />
                {errors.dateOfBirth && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
            </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="address">
            <Card>
              <CardHeader>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <CardTitle>{t("addressInformation")}</CardTitle>
                      <CardDescription>{t("residentialAddress")}</CardDescription>
                    </div>
                  </div>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">{t("streetAddress")}</Label>
              <Input
                id="address"
                value={patientData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder={t("streetAddressPlaceholder")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="city">{t("city")}</Label>
                <Input
                  id="city"
                  value={patientData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder={t("city")}
                />
              </div>
              <div>
                <Label htmlFor="state">{t("state")}</Label>
                <Input
                  id="state"
                  value={patientData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder={t("state")}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">{t("zipCode")}</Label>
                <Input
                  id="zipCode"
                  value={patientData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  placeholder={t("zipCode")}
                />
              </div>
              <div>
                <Label htmlFor="country">{t("country")}</Label>
                <Input
                  id="country"
                  value={patientData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder={t("country")}
                />
              </div>
            </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="emergency">
            <Card>
              <CardHeader>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Phone className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="text-left">
                      <CardTitle>{t("emergencyContact")}</CardTitle>
                      <CardDescription>
                        {t("emergencyContactDescription")}
                      </CardDescription>
                    </div>
                  </div>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emergencyContactName">{t("contactName")}</Label>
                <Input
                  id="emergencyContactName"
                  value={patientData.emergencyContactName}
                  onChange={(e) =>
                    handleInputChange("emergencyContactName", e.target.value)
                  }
                  placeholder={t("contactNamePlaceholder")}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact">{t("contactPhone")}</Label>
                <Input
                  id="emergencyContact"
                  value={patientData.emergencyContactPhone}
                  onChange={(e) =>
                    handleInputChange("emergencyContactPhone", e.target.value)
                  }
                  placeholder={t("emergencyPhonePlaceholder")}
                />
              </div>
              <div>
                <Label htmlFor="emergencyRelationship">
                  {t("relationship")}
                </Label>
                <Input
                  id="emergencyRelationship"
                  value={patientData.emergencyContactRelationship}
                  onChange={(e) =>
                    handleInputChange(
                      "emergencyContactRelationship",
                      e.target.value
                    )
                  }
                  placeholder={t("relationshipPlaceholder")}
                />
              </div>
            </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="medical">
            <Card>
              <CardHeader>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Heart className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="flex items-center gap-2">
                        {t("medicalInformation")}
                        <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Recommended</span>
                      </CardTitle>
                      <CardDescription>
                        {t("medicalInformationDescription")}
                      </CardDescription>
                    </div>
                  </div>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bloodType">{t("bloodType")}</Label>
                <Select
                  value={patientData.bloodType}
                  onValueChange={(value) =>
                    handleInputChange("bloodType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectBloodType")} />
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
                <Label htmlFor="assignedDoctor">{t("assignedDoctor")}</Label>
                <Select
                  value={patientData.assignedDoctor}
                  onValueChange={(value) =>
                    handleInputChange("assignedDoctor", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectDoctor")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(doctors) &&
                      doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} -{" "}
                          {doctor.specialization || doctor.department}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="allergies">{t("allergies")}</Label>
                <Textarea
                  id="allergies"
                  value={patientData.allergies}
                  onChange={(e) =>
                    handleInputChange("allergies", e.target.value)
                  }
                  placeholder={t("allergiesPlaceholder")}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="chronicConditions">
                  {t("chronicConditions")}
                </Label>
                <Textarea
                  id="chronicConditions"
                  value={patientData.chronicConditions}
                  onChange={(e) =>
                    handleInputChange("chronicConditions", e.target.value)
                  }
                  placeholder={t("chronicConditionsPlaceholder")}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="currentMedications">
                  {t("currentMedications")}
                </Label>
                <Textarea
                  id="currentMedications"
                  value={patientData.currentMedications}
                  onChange={(e) =>
                    handleInputChange("currentMedications", e.target.value)
                  }
                  placeholder={t("currentMedicationsPlaceholder")}
                  rows={3}
                />
              </div>
            </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="insurance">
            <Card>
              <CardHeader>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Shield className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <CardTitle>{t("insuranceInformation")}</CardTitle>
                      <CardDescription>{t("insuranceDescription")}</CardDescription>
                    </div>
                  </div>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insuranceProvider">
                  {t("insuranceProvider")}
                </Label>
                <Select
                  value={patientData.insuranceProvider}
                  onValueChange={(value) =>
                    handleInputChange("insuranceProvider", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectInsurance")} />
                  </SelectTrigger>
                  <SelectContent>
                    {insuranceOptions.map((insurance) => (
                      <SelectItem key={insurance.value} value={insurance.value}>
                        {insurance.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="insurancePolicyNumber">
                  {t("policyNumber")}
                </Label>
                <Input
                  id="insurancePolicyNumber"
                  value={patientData.insurancePolicyNumber}
                  onChange={(e) =>
                    handleInputChange("insurancePolicyNumber", e.target.value)
                  }
                  placeholder={t("policyNumberPlaceholder")}
                />
              </div>
            </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("creating")}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {t("createPatient")}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
