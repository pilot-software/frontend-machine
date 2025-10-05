import React, {useEffect, useState} from 'react';
import {useAuth} from '@/components/providers/AuthContext';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {AlertTriangle, Clock} from 'lucide-react';

interface SessionManagerProps {
    children: React.ReactNode;
}

export function SessionManager({children}: SessionManagerProps) {
    const {user, logout} = useAuth();
    const [sessionWarning, setSessionWarning] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);

    // Session timeout in milliseconds (30 minutes for demo)
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before timeout

    useEffect(() => {
        if (!user) return;

        let sessionTimer: NodeJS.Timeout;
        let warningTimer: NodeJS.Timeout;
        let countdownTimer: NodeJS.Timeout;

        const resetSession = () => {
            // Clear existing timers
            if (sessionTimer) clearTimeout(sessionTimer);
            if (warningTimer) clearTimeout(warningTimer);
            if (countdownTimer) clearInterval(countdownTimer);

            // Set warning timer
            warningTimer = setTimeout(() => {
                setSessionWarning(true);
                setTimeRemaining(WARNING_TIME / 1000);

                // Start countdown
                countdownTimer = setInterval(() => {
                    setTimeRemaining(prev => {
                        if (prev <= 1) {
                            logout();
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }, SESSION_TIMEOUT - WARNING_TIME);

            // Set session timeout
            sessionTimer = setTimeout(() => {
                logout();
            }, SESSION_TIMEOUT);
        };

        const handleActivity = () => {
            // Reset session on user activity
            if (sessionWarning) {
                setSessionWarning(false);
                if (countdownTimer) clearInterval(countdownTimer);
            }
            resetSession();
        };

        // Initialize session
        resetSession();

        // Listen for user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            document.addEventListener(event, handleActivity, true);
        });

        return () => {
            // Cleanup
            if (sessionTimer) clearTimeout(sessionTimer);
            if (warningTimer) clearTimeout(warningTimer);
            if (countdownTimer) clearInterval(countdownTimer);

            events.forEach(event => {
                document.removeEventListener(event, handleActivity, true);
            });
        };
    }, [user, logout, sessionWarning, SESSION_TIMEOUT, WARNING_TIME]);

    const extendSession = () => {
        setSessionWarning(false);
        // The activity handler will reset the timers
        document.dispatchEvent(new Event('mousedown'));
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <>
            {children}

            {/* Session Warning Dialog */}
            <Dialog open={sessionWarning} onOpenChange={() => {
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-6 w-6 text-orange-500"/>
                            <DialogTitle>Session Expiring Soon</DialogTitle>
                        </div>
                        <DialogDescription>
                            Your session will expire due to inactivity. Do you want to continue working?
                        </DialogDescription>
                    </DialogHeader>

                    <Alert>
                        <Clock className="h-4 w-4"/>
                        <AlertDescription>
                            Time remaining: <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
                        </AlertDescription>
                    </Alert>

                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={logout}>
                            Sign Out
                        </Button>
                        <Button onClick={extendSession}>
                            Continue Working
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
