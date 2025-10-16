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
  .animate-float { animation: float 4s ease-in-out infinite; }
  .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
  .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
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
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HospitalType, setLocalConfig, getHospitalOrgId, isSubdomainMode, getBranding } from "@/lib/runtimeConfig";
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
  const [branding, setBranding] = useState({
    systemName: "Healthcare System",
    loginTitle: "Healthcare System",
    loginSubtitle: "Sign in to your account",
    welcomeMessage: "Welcome to Healthcare System",
    welcomeDescription: "Comprehensive patient care with advanced medical technology"
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
      if (hostname.startsWith('clinic.localhost')) {
        setSelectedConfig('clinic');
      } else if (hostname.startsWith('hospital.localhost')) {
        setSelectedConfig('hospital');
      } else {
        const currentConfig =
          (localStorage.getItem("hospitalType") as HospitalType) || "hospital";
        setSelectedConfig(currentConfig);
      }
    }
  }, []);

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
      : selectedConfig === "hospital" ? "hospital_org1" : "hospital_org2";
    const success = await login(email, password, orgId);
    if (!success) {
      setError(t("invalidCredentials"));
    }
  };

  // Demo credentials based on subdomain or selected configuration
  const getConfigType = () => {
    if (typeof window !== "undefined") {
      const hostname = window.location.host;
      if (hostname.startsWith('clinic.localhost')) return 'clinic';
      if (hostname.startsWith('hospital.localhost')) return 'hospital';
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
    <>
      <style dangerouslySetInnerHTML={{ __html: floatingStyles }} />
      <div className="min-h-screen flex relative">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 dark:from-blue-950 dark:via-green-950 dark:to-purple-950" />
        <div className="hidden lg:block absolute inset-0 z-0 lg:right-0 lg:left-1/2">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-green-100/30 to-purple-100/30 dark:from-blue-900/30 dark:via-green-900/30 dark:to-purple-900/30 animate-pulse" />
        </div>

        {/* Animated Color Orbs */}
        <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-green-500/15 rounded-full blur-lg animate-pulse delay-1000" />
          <div className="absolute bottom-1/3 right-1/5 w-20 h-20 bg-red-500/10 rounded-full blur-md animate-pulse delay-2000" />
        </div>

        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center relative z-20 p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Stethoscope className="h-8 w-8 text-primary mr-3" />
                  <h1 className="text-3xl font-bold text-foreground">
                    {branding.systemName}
                  </h1>
                </div>
                <LanguageSwitcher />
              </div>
              <p className="text-muted-foreground text-lg ml-11">
                {branding.loginSubtitle}
              </p>
            </div>

            <Card className="!border-0 shadow-none bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {!isSubdomain && (
                  <div className="space-y-2">
                    <Label htmlFor="config" className="text-base font-medium">
                      {t("healthcareConfiguration")}
                    </Label>
                    <Select
                      value={selectedConfig}
                      onValueChange={handleConfigChange}
                    >
                      <SelectTrigger className="h-12">
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
                    <p className="text-sm text-muted-foreground">
                      {
                        hospitalFlags.availableConfigurations[selectedConfig]
                          ?.description
                      }
                    </p>
                  </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">
                      {t("email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("enterEmail")}
                      className="h-12 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-medium">
                      {t("password")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t("enterPassword")}
                        className="h-12 text-base pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-base"
                      onClick={onForgotPassword}
                    >
                      {t("forgotPassword")}
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        {t("signingIn")}
                      </>
                    ) : (
                      t("signIn")
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Demo credentials helper */}
            <Card className="mt-8 bg-accent/50 !border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-foreground">
                  {t("demoCredentials")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {demoCredentials.slice(0, 3).map((cred, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted p-3 rounded transition-colors duration-200"
                    onClick={() => {
                      setEmail(cred.email);
                      setPassword(cred.password);
                    }}
                  >
                    <span className="font-medium text-foreground">
                      {cred.role}:
                    </span>
                    <span className="text-muted-foreground truncate ml-2">
                      {cred.email}
                    </span>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground mt-3">
                  {t("tapToAutoFill")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Floating Medical Icons */}
        <div className="hidden lg:flex flex-1 relative z-20">
          <div className="flex items-center justify-center h-full w-full">
            <div className="text-center max-w-md relative">
              {/* Floating Medical Icons */}
              <div className="absolute -top-20 -left-20 animate-float">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center shadow-lg">
                  <Stethoscope className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="absolute -top-10 right-10 animate-bounce-slow" style={{animationDelay: '0.5s'}}>
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="h-7 w-7 text-green-600 animate-pulse" />
                </div>
              </div>
              <div className="absolute top-20 -right-20 animate-float" style={{animationDelay: '1s'}}>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center shadow-lg">
                  <Monitor className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div className="absolute bottom-10 -left-16 animate-bounce-slow" style={{animationDelay: '1.5s'}}>
                <div className="w-14 h-14 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center shadow-lg">
                  <Cpu className="h-7 w-7 text-red-600" />
                </div>
              </div>
              <div className="absolute -bottom-10 right-20 animate-float" style={{animationDelay: '2s'}}>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center shadow-lg">
                  <Eye className="h-6 w-6 text-yellow-600" />
                </div>
              </div>

              <h2 className="text-4xl font-bold mb-6 text-foreground">
                {branding.welcomeMessage}
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {branding.welcomeDescription}
              </p>
              <div className="mt-8 flex justify-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
