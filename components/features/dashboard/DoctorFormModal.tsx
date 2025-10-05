import React, {useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Mail, Phone, Save, User} from "lucide-react";
import {userService} from '@/lib/services/user';

interface DoctorFormData {
    name: string;
    email: string;
    specialization: string;
    department: string;
    phone: string;
    passwordHash: string;
    dateOfBirth?: string;
    gender?: "MALE" | "FEMALE" | "OTHER" | "";
    organizationId?: string;
    assignedDoctor?: string;
    bloodType?: string | null;
}

interface DoctorFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctorId?: string;
    mode: "add" | "edit" | "view";
}

export function DoctorFormModal({
                                    isOpen,
                                    onClose,
                                    doctorId,
                                    mode,
                                }: DoctorFormModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [doctorData, setDoctorData] = useState<DoctorFormData>({
        name: "",
        email: "",
        specialization: "",
        department: "",
        phone: "",
        passwordHash: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        if (!isOpen) {
            setDoctorData({
                name: "",
                email: "",
                specialization: "",
                department: "",
                phone: "",
                passwordHash: "",
            });
        }
        // TODO: Implement getUser method to load doctor data for edit/view modes
    }, [isOpen]);

    const handleInputChange = (field: keyof DoctorFormData, value: string) => {
        setDoctorData((prev) => ({...prev, [field]: value}));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Build payload requested by backend
            const [firstName, ...rest] = (doctorData.name || "").trim().split(" ");
            const lastName = rest.join(" ") || "";

            const payload: any = {
                firstName: firstName || "First",
                lastName: lastName || "Last",
                dateOfBirth: doctorData.dateOfBirth || "1990-01-01",
                gender: doctorData.gender || "MALE",
                phone: doctorData.phone || undefined,
                email: doctorData.email,
                bloodType: doctorData.bloodType ?? null,
                assignedDoctor: doctorData.assignedDoctor || null,
                branchId: null,
                organizationId: doctorData.organizationId || null,
                role: "DOCTOR",
                status: "ACTIVE",
            };

            if (mode === "add") {
                // Call API to create user
                await userService.createUser(payload);
                console.log("Doctor created:", payload.email);
            } else if (mode === "edit" && doctorId) {
                // TODO: Implement updateUser method when API supports it
                console.log("Updating doctor:", doctorId, payload);
            }

            onClose();
        } catch (error) {
            console.error("Failed to save doctor:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isReadOnly = mode === "view";
    const isEditing = mode === "edit";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[600px] max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-blue-600"/>
                        <span>
              {mode === "add"
                  ? "Add New Doctor"
                  : mode === "edit"
                      ? "Edit Doctor Information"
                      : "Doctor Information"}
            </span>
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "add"
                            ? "Enter doctor details and professional information"
                            : mode === "edit"
                                ? "Update doctor information and contact details"
                                : "Complete doctor profile and professional information"}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="ml-2">Loading doctor data...</span>
                        </div>
                    ) : (
                        <>
                            {isReadOnly && doctorData.name && (
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage
                                                    src={`https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face`}
                                                    alt={doctorData.name}
                                                />
                                                <AvatarFallback
                                                    className="text-lg font-semibold bg-blue-100 text-blue-800">
                                                    {doctorData.name
                                                        ?.split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-xl font-semibold text-foreground">
                                                        {doctorData.name}
                                                    </h3>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-green-50 text-green-700 border-green-200"
                                                    >
                                                        Active
                                                    </Badge>
                                                </div>
                                                <div
                                                    className="flex items-center text-sm text-muted-foreground space-x-4">
                                                    <div className="flex items-center space-x-1">
                                                        <User className="h-4 w-4"/>
                                                        <span>{doctorData.specialization}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <span>•</span>
                                                        <span>{doctorData.department}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardHeader>
                                    <CardTitle>Professional Information</CardTitle>
                                    <CardDescription>
                                        Doctor details and contact information
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={doctorData.name}
                                                onChange={(e) =>
                                                    handleInputChange("name", e.target.value)
                                                }
                                                placeholder="Dr. John Smith"
                                                disabled={isReadOnly}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="specialization">Specialization</Label>
                                            <Input
                                                id="specialization"
                                                value={doctorData.specialization}
                                                onChange={(e) =>
                                                    handleInputChange("specialization", e.target.value)
                                                }
                                                placeholder="Cardiology"
                                                disabled={isReadOnly}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="email">Email Address</Label>
                                            <div className="relative">
                                                <Mail
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={doctorData.email}
                                                    onChange={(e) =>
                                                        handleInputChange("email", e.target.value)
                                                    }
                                                    placeholder="doctor@hospital.com"
                                                    className="pl-10"
                                                    disabled={isReadOnly}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="relative">
                                                <Phone
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                                <Input
                                                    id="phone"
                                                    value={doctorData.phone}
                                                    onChange={(e) =>
                                                        handleInputChange("phone", e.target.value)
                                                    }
                                                    placeholder="+1-555-0123"
                                                    className="pl-10"
                                                    disabled={isReadOnly}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="department">Department</Label>
                                            <Input
                                                id="department"
                                                value={doctorData.department}
                                                onChange={(e) =>
                                                    handleInputChange("department", e.target.value)
                                                }
                                                placeholder="Cardiology Department"
                                                disabled={isReadOnly}
                                            />
                                        </div>
                                        {mode === "add" && (
                                            <div>
                                                <Label htmlFor="password">Temporary Password</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={doctorData.passwordHash}
                                                    onChange={(e) =>
                                                        handleInputChange("passwordHash", e.target.value)
                                                    }
                                                    placeholder="Temporary password"
                                                    disabled={isReadOnly}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                <div
                    className="flex justify-between items-center pt-6 border-t border-border bg-gradient-to-r from-muted/50 to-emerald-50/30 -mx-6 px-6 pb-6 mt-6 rounded-b-xl">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="bg-background/80 backdrop-blur-sm border-border hover:bg-muted"
                    >
                        Cancel
                    </Button>
                    {!isReadOnly && (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"/>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2"/>
                                    {mode === "add" ? "Create Doctor" : "Save Changes"}
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
