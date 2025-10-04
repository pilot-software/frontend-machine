"use client";

import {useEffect, useState} from "react";
import {NotificationPageSkeleton} from "@/components/skeletons";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {AlertCircle, Bell, Calendar, Check, FileText, Search, Settings, Trash2,} from "lucide-react";

const mockNotifications = [
    {
        id: "1",
        type: "alert",
        title: "Critical Patient Alert",
        message: "Patient John Smith requires immediate attention in Room 302",
        time: "2024-12-19T10:30:00Z",
        unread: true,
        priority: "high",
    },
    {
        id: "2",
        type: "appointment",
        title: "Upcoming Appointment",
        message: "Appointment with Emma Davis in 30 minutes - Cardiology",
        time: "2024-12-19T09:45:00Z",
        unread: true,
        priority: "medium",
    },
    {
        id: "3",
        type: "report",
        title: "Lab Results Ready",
        message: "Blood test results for Michael Johnson are available for review",
        time: "2024-12-19T08:15:00Z",
        unread: false,
        priority: "low",
    },
    {
        id: "4",
        type: "alert",
        title: "Medication Alert",
        message: "Patient Sarah Wilson missed scheduled medication at 8:00 AM",
        time: "2024-12-19T08:30:00Z",
        unread: true,
        priority: "high",
    },
    {
        id: "5",
        type: "appointment",
        title: "Appointment Cancelled",
        message: "Patient Tom Brown cancelled appointment scheduled for 2:00 PM",
        time: "2024-12-18T14:20:00Z",
        unread: false,
        priority: "low",
    },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API loading
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <NotificationPageSkeleton/>;
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "alert":
                return AlertCircle;
            case "appointment":
                return Calendar;
            case "report":
                return FileText;
            default:
                return Bell;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            case "low":
                return "bg-green-100 text-green-800";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    const formatTime = (timeString: string) => {
        const date = new Date(timeString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? {...n, unread: false} : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({...n, unread: false})));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const filteredNotifications = notifications.filter(notification => {
        const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTab = selectedTab === "all" ||
            (selectedTab === "unread" && notification.unread) ||
            (selectedTab === "read" && !notification.unread) ||
            notification.type === selectedTab;

        return matchesSearch && matchesTab;
    });

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">Notifications</h2>
                    <p className="text-muted-foreground mt-1">
                        Manage your healthcare notifications and alerts
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={markAllAsRead}>
                        <Check className="h-4 w-4 mr-2"/>
                        Mark All Read
                    </Button>
                    <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2"/>
                        Settings
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>All Notifications</span>
                        {unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white">
                                {unreadCount} unread
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Search notifications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="unread">Unread</TabsTrigger>
                                <TabsTrigger value="alert">Alerts</TabsTrigger>
                                <TabsTrigger value="appointment">Appointments</TabsTrigger>
                                <TabsTrigger value="report">Reports</TabsTrigger>
                            </TabsList>

                            <TabsContent value={selectedTab} className="mt-4">
                                <div className="space-y-3">
                                    {filteredNotifications.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No notifications found
                                        </div>
                                    ) : (
                                        filteredNotifications.map((notification) => {
                                            const Icon = getIcon(notification.type);
                                            return (
                                                <Card
                                                    key={notification.id}
                                                    className={`transition-colors ${
                                                        notification.unread ? "bg-blue-50 border-blue-200" : ""
                                                    }`}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start space-x-3">
                                                            <Icon className="h-5 w-5 mt-1 text-blue-600"/>
                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <h3 className="font-medium text-foreground">
                                                                        {notification.title}
                                                                    </h3>
                                                                    <div className="flex items-center space-x-2">
                                                                        <Badge
                                                                            className={getPriorityColor(notification.priority)}>
                                                                            {notification.priority}
                                                                        </Badge>
                                                                        {notification.unread && (
                                                                            <div
                                                                                className="h-2 w-2 bg-blue-600 rounded-full"/>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {notification.message}
                                                                </p>
                                                                <div className="flex items-center justify-between">
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {formatTime(notification.time)}
                                                                    </p>
                                                                    <div className="flex space-x-1">
                                                                        {notification.unread && (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => markAsRead(notification.id)}
                                                                            >
                                                                                <Check className="h-4 w-4"/>
                                                                            </Button>
                                                                        )}
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => deleteNotification(notification.id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4"/>
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
