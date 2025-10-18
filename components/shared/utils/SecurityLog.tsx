import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatsCard } from "@/components/ui/stats-card";
import {
  AlertTriangle,
  Clock,
  Globe,
  LogIn,
  LogOut,
  Monitor,
  Shield,
  Smartphone,
} from "lucide-react";
import { ROLES } from "@/lib/constants";

interface SecurityEvent {
  id: string;
  type:
    | "login"
    | "logout"
    | "failed_login"
    | "password_change"
    | "session_expired";
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  location?: string;
  device: "desktop" | "mobile" | "tablet";
  success: boolean;
  details?: string;
}

export function SecurityLog() {
  const t = useTranslations("common");
  const { user } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);

  useEffect(() => {
    // Mock security events - in a real app, this would come from your backend
    const mockEvents: SecurityEvent[] = [
      {
        id: "1",
        type: "login",
        timestamp: new Date(),
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        location: "San Francisco, CA",
        device: "desktop",
        success: true,
      },
      {
        id: "2",
        type: "failed_login",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        ipAddress: "203.0.113.45",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)",
        location: "Unknown Location",
        device: "mobile",
        success: false,
        details: "Invalid password attempt",
      },
      {
        id: "3",
        type: "logout",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        location: "San Francisco, CA",
        device: "desktop",
        success: true,
      },
      {
        id: "4",
        type: "session_expired",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        location: "San Francisco, CA",
        device: "desktop",
        success: true,
        details: "Session expired due to inactivity",
      },
    ];

    setEvents(mockEvents);
  }, []);

  const getEventIcon = (type: SecurityEvent["type"]) => {
    switch (type) {
      case "login":
        return LogIn;
      case "logout":
        return LogOut;
      case "failed_login":
        return AlertTriangle;
      case "session_expired":
        return Clock;
      default:
        return Shield;
    }
  };

  const getEventColor = (event: SecurityEvent) => {
    if (!event.success || event.type === "failed_login") {
      return "text-red-600";
    }
    if (event.type === "session_expired") {
      return "text-orange-600";
    }
    return "text-green-600";
  };

  const getEventBadgeVariant = (event: SecurityEvent) => {
    if (!event.success || event.type === "failed_login") {
      return "destructive" as const;
    }
    if (event.type === "session_expired") {
      return "secondary" as const;
    }
    return "default" as const;
  };

  const getDeviceIcon = (device: SecurityEvent["device"]) => {
    switch (device) {
      case "mobile":
        return Smartphone;
      case "desktop":
        return Monitor;
      case "tablet":
        return Monitor; // Using Monitor for tablet as well
      default:
        return Monitor;
    }
  };

  const formatEventType = (type: SecurityEvent["type"]) => {
    switch (type) {
      case "login":
        return "Successful Login";
      case "logout":
        return "logout";
      case "failed_login":
        return "Failed Login Attempt";
      case "session_expired":
        return "Session Expired";
      case "password_change":
        return "Password Changed";
      default:
        return type;
    }
  };

  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return minutes < 1 ? "Just now" : `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground flex items-center">
            <Shield className="h-7 w-7 mr-3 text-blue-600" />
            Security Activity
          </h2>
          <p className="text-muted-foreground mt-1">
            {user?.role === ROLES.ADMIN
              ? "System-wide security events and user activity monitoring"
              : "Your account security events and login activity"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export Log</Button>
          <Button>Security Settings</Button>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-6">
        <StatsCard
          title="Total Logins Today"
          value="47"
          icon={LogIn}
          color="text-blue-600"
          bgGradient="from-blue-500 to-blue-600"
          change="+12%"
          trend="up"
        />
        <StatsCard
          title="Failed Attempts"
          value="3"
          icon={AlertTriangle}
          color="text-red-600"
          bgGradient="from-red-500 to-red-600"
          change="-25%"
          trend="down"
        />
        <StatsCard
          title="Active Sessions"
          value="12"
          icon={Monitor}
          color="text-green-600"
          bgGradient="from-green-500 to-green-600"
          change="+8%"
          trend="up"
        />
      </div>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>
                {user?.role === ROLES.ADMIN
                  ? "Latest security events across all users"
                  : "Your recent security events and login history"}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {events.map((event) => {
                const EventIcon = getEventIcon(event.type);
                const DeviceIcon = getDeviceIcon(event.device);

                return (
                  <div
                    key={event.id}
                    className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`p-2 rounded-full bg-muted ${getEventColor(
                        event
                      )}`}
                    >
                      <EventIcon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">
                          {formatEventType(event.type)}
                        </p>
                        <Badge variant={getEventBadgeVariant(event)}>
                          {formatRelativeTime(event.timestamp)}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Globe className="h-3 w-3" />
                          <span>{event.ipAddress}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <DeviceIcon className="h-3 w-3" />
                          <span className="capitalize">{event.device}</span>
                        </div>

                        {event.location && <span>{event.location}</span>}
                      </div>

                      {event.details && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.details}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground mt-1">
                        {event.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
