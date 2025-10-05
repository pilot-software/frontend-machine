"use client";

import {useState} from "react";
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {AlertCircle, Bell, Calendar, FileText} from "lucide-react";
import {useRouter} from "next/navigation";

const mockNotifications = [
    {
        id: "1",
        type: "alert",
        title: "Critical Patient Alert",
        message: "Patient John Smith requires immediate attention",
        time: "2 min ago",
        unread: true,
    },
    {
        id: "2",
        type: "appointment",
        title: "Upcoming Appointment",
        message: "Appointment with Emma Davis in 30 minutes",
        time: "28 min ago",
        unread: true,
    },
    {
        id: "3",
        type: "report",
        title: "Lab Results Ready",
        message: "Blood test results for Michael Johnson are available",
        time: "1 hour ago",
        unread: false,
    },
];

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const router = useRouter();
    const unreadCount = notifications.filter((n) => n.unread).length;

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

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? {...n, unread: false} : n))
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5"/>
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {notifications.map((notification) => {
                    const Icon = getIcon(notification.type);
                    return (
                        <DropdownMenuItem
                            key={notification.id}
                            className="flex items-start space-x-3 p-3 cursor-pointer"
                            onClick={() => markAsRead(notification.id)}
                        >
                            <Icon className="h-4 w-4 mt-1 text-primary"/>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">{notification.title}</p>
                                    {notification.unread && (
                                        <div className="h-2 w-2 bg-primary rounded-full"/>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">{notification.message}</p>
                                <p className="text-xs text-muted-foreground opacity-70">{notification.time}</p>
                            </div>
                        </DropdownMenuItem>
                    );
                })}
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    className="text-center text-sm text-primary cursor-pointer"
                    onClick={() => router.push('/notifications')}
                >
                    View all notifications
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
