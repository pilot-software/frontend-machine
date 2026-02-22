import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const floatingStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-20px) scale(1.05); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
    50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
  }
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  @keyframes ecg-draw {
    0% { stroke-dashoffset: 1000; }
    100% { stroke-dashoffset: 0; }
  }
  .animate-float { animation: float 4s ease-in-out infinite; }
  .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
  .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
  .ecg-line { animation: ecg-draw 2s linear infinite; stroke-dasharray: 1000; }
`;
import { useAuth } from "@/components/providers/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LanguageSwitcher } from "@/components/shared/navigation/LanguageSwitcher";
import {
  Eye,
  EyeOff,
  Loader2,
  Monitor,
  Stethoscope,
  Cpu,
  Heart,
  Moon,
  Sun,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HospitalType,
  setLocalConfig,
  getHospitalOrgId,
  isSubdomainMode,
  getBranding,
} from "@/lib/runtimeConfig";
import hospitalFlags from "@/config/hospital-flags.json";
import { ROUTES } from "@/lib/constants";

interface LoginFormProps {
  onForgotPassword: () => void;
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const t = useTranslations("common");
  const { login, isLoading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedConfig, setSelectedConfig] =
    useState<HospitalType>("hospital");
  const [isSubdomain, setIsSubdomain] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [branding, setBranding] = useState({
    systemName: "Healthcare System",
    loginTitle: "Healthcare System",
    loginSubtitle: "Sign in to your account",
    welcomeMessage: "Welcome to Healthcare System",
    welcomeDescription:
      "Comprehensive patient care with advanced medical technology",
  });
  const router = useRouter();

  const handleConfigChange = (value: string) => {
    const configType = value as HospitalType;
    setSelectedConfig(configType);
    setLocalConfig(configType);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const subdomain = isSubdomainMode();
      setIsSubdomain(subdomain);
      setBranding(getBranding());

      // Set config based on subdomain
      const hostname = window.location.host;
      if (hostname.startsWith("clinic.localhost")) {
        setSelectedConfig("clinic");
      } else if (hostname.startsWith("hospital.localhost")) {
        setSelectedConfig("hospital");
      } else {
        const currentConfig =
          (localStorage.getItem("hospitalType") as HospitalType) || "hospital";
        setSelectedConfig(currentConfig);
      }

      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    }
  }, []);

  const toggleDarkMode = () => {
    if (typeof window !== "undefined") {
      const html = document.documentElement;
      html.classList.toggle("dark");
      setIsDark(!isDark);
      localStorage.setItem("theme", isDark ? "light" : "dark");
    }
  };

  useEffect(() => {
    if (user) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("fillAllFields"));
      return;
    }

    const orgId = isSubdomainMode()
      ? getHospitalOrgId()
      : selectedConfig === "hospital"
      ? "hospital_org1"
      : "hospital_org2";
    const success = await login(email, password, orgId);
    if (!success) {
      setError(t("invalidCredentials"));
    }
  };

  // Demo credentials based on subdomain or selected configuration
  const getConfigType = () => {
    if (typeof window !== "undefined") {
      const hostname = window.location.host;
      if (hostname.startsWith("clinic.localhost")) return "clinic";
      if (hostname.startsWith("hospital.localhost")) return "hospital";
    }
    return selectedConfig;
  };

  const demoCredentials =
    getConfigType() === "hospital"
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{branding.systemName}</h1>
              <p className="text-sm text-muted-foreground">{branding.loginSubtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <LanguageSwitcher />
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!isSubdomain && (
                <div className="space-y-2">
                  <Label htmlFor="config">{t("healthcareConfiguration")}</Label>
                  <Select value={selectedConfig} onValueChange={handleConfigChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(hospitalFlags.availableConfigurations)
                        .filter(([_, config]) => config.enabled)
                        .map(([key, config]) => (
                          <SelectItem key={key} value={key}>{config.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("enterEmail")}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("enterPassword")}
                    className="h-11 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={onForgotPassword}
              >
                {t("forgotPassword")}
              </Button>

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("signingIn")}
                  </>
                ) : (
                  t("signIn")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-4 bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t("demoCredentials")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoCredentials.slice(0, 3).map((cred, index) => (
              <button
                key={index}
                type="button"
                className="w-full flex items-center justify-between text-sm p-2 rounded hover:bg-muted transition-colors"
                onClick={() => {
                  setEmail(cred.email);
                  setPassword(cred.password);
                }}
              >
                <span className="font-medium">{cred.role}</span>
                <span className="text-muted-foreground text-xs truncate ml-2">{cred.email}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
