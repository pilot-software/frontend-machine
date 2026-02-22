"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bell, Database, Palette, Shield, User, Lock } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuth } from "@/components/providers/AuthContext";

import { toast } from "sonner";

type SettingsSection = "appearance" | "notifications" | "system" | "security" | "privacy";

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [activeSection, setActiveSection] = useState<SettingsSection>("appearance");
    const locale = useLocale();
    const [language, setLanguage] = useState(locale);
    const [fontSize, setFontSize] = useState("medium");
    const [timezone, setTimezone] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('timezone') || 'utc' : 'utc');
    const [widgets, setWidgets] = useState({
        quickActions: true,
        bedOccupancy: true,
        emergencyRoom: true,
        staffAvailability: true,
        financial: true,
        admissions: true,
        diagnostics: true,
        inventory: true,
    });

    useEffect(() => {
        const saved = localStorage.getItem(`dashboard-widgets-${user?.role}`);
        if (saved) {
            const enabledIds = JSON.parse(saved);
            setWidgets({
                quickActions: enabledIds.includes('quickActions'),
                bedOccupancy: enabledIds.includes('bedOccupancy'),
                emergencyRoom: enabledIds.includes('emergencyRoom'),
                staffAvailability: enabledIds.includes('staffAvailability'),
                financial: enabledIds.includes('financial'),
                admissions: enabledIds.includes('admissions'),
                diagnostics: enabledIds.includes('diagnostics'),
                inventory: enabledIds.includes('inventory'),
            });
        }
    }, [user?.role]);

    const toggleWidget = (key: keyof typeof widgets) => {
        const updated = { ...widgets, [key]: !widgets[key] };
        setWidgets(updated);
        const enabledIds = Object.entries(updated)
            .filter(([_, enabled]) => enabled)
            .map(([key]) => {
                const map: Record<string, string> = {
                    quickActions: 'quickActions',
                    bedOccupancy: 'bedOccupancy',
                    emergencyRoom: 'emergencyRoom',
                    staffAvailability: 'staffAvailability',
                    financial: 'financial',
                    admissions: 'admissions',
                    diagnostics: 'diagnostics',
                    inventory: 'inventory',
                };
                return map[key];
            });
        localStorage.setItem(`dashboard-widgets-${user?.role}`, JSON.stringify(enabledIds));
    };

    const handleLanguageChange = (newLang: string) => {
        setLanguage(newLang);
        const segments = pathname.split("/").filter(Boolean);
        if (segments.length > 0) {
            segments.shift();
        }
        const newPath = "/" + newLang + (segments.length > 0 ? "/" + segments.join("/") : "");
        startTransition(() => {
            router.push(newPath);
        });
    };

    const handleTimezoneChange = (value: string) => {
        setTimezone(value);
        localStorage.setItem('timezone', value);
    };

    const sections = [
        { id: "appearance" as SettingsSection, label: "Appearance", icon: Palette },
        { id: "notifications" as SettingsSection, label: "Notifications", icon: Bell },
        { id: "system" as SettingsSection, label: "System", icon: Database },
        { id: "security" as SettingsSection, label: "Security", icon: Shield },
        { id: "privacy" as SettingsSection, label: "Privacy", icon: Lock },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold">Settings</h2>
                <p className="text-muted-foreground mt-1">Manage your preferences and configuration</p>
            </div>

            {/* Horizontal Tabs */}
            <div className="border-b -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${
                                    activeSection === section.id
                                        ? "border-primary text-primary font-medium"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="hidden sm:inline">{section.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div>
                {/* Appearance */}
                {activeSection === "appearance" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Customize the look and feel of your dashboard</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between pb-6 border-b border-muted">
                                <div>
                                    <Label>Dark Mode</Label>
                                    <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                                </div>
                                <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                            </div>
                            <div className="space-y-2 pb-6 border-b border-muted">
                                <Label>Language</Label>
                                <Select value={language} onValueChange={handleLanguageChange}>
                                    <SelectTrigger className="w-full sm:w-64">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Español</SelectItem>
                                        <SelectItem value="fr">Français</SelectItem>
                                        <SelectItem value="hi">हिन्दी</SelectItem>
                                        <SelectItem value="gu">ગુજરાતી</SelectItem>
                                        <SelectItem value="mr">मराठी</SelectItem>
                                        <SelectItem value="bn">বাংলা</SelectItem>
                                        <SelectItem value="ta">தமிழ்</SelectItem>
                                        <SelectItem value="te">తెలుగు</SelectItem>
                                        <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Dashboard Widgets</Label>
                                <p className="text-sm text-muted-foreground">Choose which widgets to display on your dashboard</p>
                                <div className="space-y-2 mt-4 bg-muted/20 p-3 rounded-lg">
                                    <div className="flex items-center gap-3 px-2 py-1">
                                        <Checkbox checked={widgets.quickActions} onCheckedChange={() => toggleWidget('quickActions')} />
                                        <span className="text-sm font-medium">Quick Actions</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-2 py-1">
                                        <Checkbox checked={widgets.bedOccupancy} onCheckedChange={() => toggleWidget('bedOccupancy')} />
                                        <span className="text-sm font-medium">Bed Occupancy Rate</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-2 py-1">
                                        <Checkbox checked={widgets.emergencyRoom} onCheckedChange={() => toggleWidget('emergencyRoom')} />
                                        <span className="text-sm font-medium">Emergency Room Status</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-2 py-1">
                                        <Checkbox checked={widgets.staffAvailability} onCheckedChange={() => toggleWidget('staffAvailability')} />
                                        <span className="text-sm font-medium">Staff Availability</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-2 py-1">
                                        <Checkbox checked={widgets.financial} onCheckedChange={() => toggleWidget('financial')} />
                                        <span className="text-sm font-medium">Financial Overview</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-2 py-1">
                                        <Checkbox checked={widgets.admissions} onCheckedChange={() => toggleWidget('admissions')} />
                                        <span className="text-sm font-medium">Patient Admissions</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-2 py-1">
                                        <Checkbox checked={widgets.diagnostics} onCheckedChange={() => toggleWidget('diagnostics')} />
                                        <span className="text-sm font-medium">Lab & Diagnostics</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-2 py-1">
                                        <Checkbox checked={widgets.inventory} onCheckedChange={() => toggleWidget('inventory')} />
                                        <span className="text-sm font-medium">Medication Inventory</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Notifications */}
                {activeSection === "notifications" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Manage your notification preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between pb-6 border-b border-muted">
                                <div>
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between pb-6 border-b border-muted">
                                <div>
                                    <Label>Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between pb-6 border-b border-muted">
                                <div>
                                    <Label>Critical Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Emergency and critical system alerts</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>SMS Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive text message alerts</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* System */}
                {activeSection === "system" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>System</CardTitle>
                            <CardDescription>System-wide configuration options</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2 pb-6 border-b border-muted">
                                <Label>Time Zone</Label>
                                <Select value={timezone} onValueChange={handleTimezoneChange}>
                                    <SelectTrigger className="w-64">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="utc">UTC</SelectItem>
                                        <SelectItem value="est">Eastern Time</SelectItem>
                                        <SelectItem value="pst">Pacific Time</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 pb-6 border-b border-muted">
                                <Label>Date Format</Label>
                                <Select defaultValue="mm-dd-yyyy">
                                    <SelectTrigger className="w-64">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                                        <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Auto-save</Label>
                                    <p className="text-sm text-muted-foreground">Automatically save changes</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Security */}
                {activeSection === "security" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Security and authentication settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2 pb-6 border-b border-muted">
                                <Label>Session Timeout</Label>
                                <Select defaultValue="30">
                                    <SelectTrigger className="w-64">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="15">15 minutes</SelectItem>
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="60">1 hour</SelectItem>
                                        <SelectItem value="240">4 hours</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between pb-6 border-b border-muted">
                                <div>
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between pb-6 border-b border-muted">
                                <div>
                                    <Label>Activity Logging</Label>
                                    <p className="text-sm text-muted-foreground">Log user activities for security</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="pt-4">
                                <Button variant="outline">Export Security Logs</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Privacy */}
                {activeSection === "privacy" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Privacy</CardTitle>
                            <CardDescription>Control your privacy settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between pb-6 border-b border-muted">
                                <div>
                                    <Label>Profile Visibility</Label>
                                    <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between pb-6 border-b border-muted">
                                <div>
                                    <Label>Data Collection</Label>
                                    <p className="text-sm text-muted-foreground">Allow anonymous usage data collection</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="space-y-2">
                                <Label>Download Your Data</Label>
                                <p className="text-sm text-muted-foreground">Export all your personal data</p>
                                <Button variant="outline">Request Data Export</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    );
}
