import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { setLocalConfig, HospitalType } from "../lib/runtimeConfig";
import hospitalFlags from "../config/hospital-flags.json";

interface LoginFormProps {
  onForgotPassword: () => void;
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const { login, isLoading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedConfig, setSelectedConfig] =
    useState<HospitalType>("hospital");
  const router = useRouter();

  const handleConfigChange = (value: string) => {
    const configType = value as HospitalType;
    setSelectedConfig(configType);
    setLocalConfig(configType);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentConfig =
        (localStorage.getItem("hospitalType") as HospitalType) || "hospital";
      setSelectedConfig(currentConfig);
    }
  }, []);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const orgId =
      selectedConfig === "hospital" ? "hospital_org1" : "hospital_org2";
    const success = await login(email, password, orgId);
    if (!success) {
      setError("Invalid email or password");
    }
  };

  // Demo credentials based on selected configuration
  const demoCredentials =
    selectedConfig === "hospital"
      ? [
          {
            role: "Admin",
            email: "admin@hospital.com",
            password: "admin123",
            org: "hospital_org1",
          },
          {
            role: "Doctor",
            email: "dr.johnson@hospital.com",
            password: "admin123",
            org: "hospital_org1",
          },
          {
            role: "Patient",
            email: "alice.brown@email.com",
            password: "admin123",
            org: "hospital_org1",
          },
          {
            role: "North Manager",
            email: "manager.north@hospital.com",
            password: "admin123",
            org: "hospital_org1",
          },
          {
            role: "South Manager",
            email: "manager.south@hospital.com",
            password: "admin123",
            org: "hospital_org1",
          },
          {
            role: "East Manager",
            email: "manager.east@hospital.com",
            password: "admin123",
            org: "hospital_org1",
          },
          {
            role: "West Manager",
            email: "manager.west@hospital.com",
            password: "admin123",
            org: "hospital_org1",
          },
        ]
      : [
          {
            role: "Admin",
            email: "admin@pedcare.com",
            password: "admin123",
            org: "hospital_org2",
          },
          {
            role: "Doctor",
            email: "dr.williams@pedcare.com",
            password: "admin123",
            org: "hospital_org2",
          },
          {
            role: "Patient",
            email: "tommy.johnson@email.com",
            password: "admin123",
            org: "hospital_org2",
          },
        ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-3 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md spacing-responsive">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            HealthCare System
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader className="card-responsive">
            <CardTitle className="text-lg sm:text-xl">Login</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enter your credentials to access the healthcare management system
            </CardDescription>
          </CardHeader>
          <CardContent className="card-responsive">
            <form onSubmit={handleSubmit} className="spacing-responsive">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="config">Healthcare Configuration</Label>
                <Select
                  value={selectedConfig}
                  onValueChange={handleConfigChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(hospitalFlags.availableConfigurations)
                      .filter(([_, config]) => config.enabled)
                      .map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {
                    hospitalFlags.availableConfigurations[selectedConfig]
                      ?.description
                  }
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent touch-target"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={onForgotPassword}
                >
                  Forgot password?
                </Button>
              </div>

              <Button type="submit" className="w-full button-responsive touch-target" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials helper */}
        <Card className="bg-accent border-border">
          <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-sm sm:text-base text-foreground">
              Demo Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-2">
            {demoCredentials.map((cred, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-xs sm:text-sm cursor-pointer hover:bg-muted p-2 sm:p-3 rounded touch-target transition-colors duration-200"
                onClick={() => {
                  setEmail(cred.email);
                  setPassword(cred.password);
                }}
              >
                <span className="font-medium text-foreground">{cred.role}:</span>
                <span className="text-muted-foreground truncate ml-2">{cred.email}</span>
              </div>
            ))}
            <div className="text-xs sm:text-sm text-muted-foreground mt-2 p-2 sm:p-3 bg-muted rounded">
              <div className="font-medium">
                {selectedConfig === "hospital"
                  ? "City General Hospital (7 roles)"
                  : "Pediatric Care Clinic (3 roles)"}
              </div>
              <div className="text-xs">Organization: {demoCredentials[0]?.org}</div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Tap any role above to auto-fill credentials
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
