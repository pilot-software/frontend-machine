import React, {useState} from 'react';
import { useTranslations } from "next-intl";
import {useAuth} from '@/components/providers/AuthContext';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {ArrowLeft, CheckCircle, Loader2, Mail} from 'lucide-react';

interface ForgotPasswordProps {
    onBackToLogin: () => void;
}

export function ForgotPassword({onBackToLogin}: ForgotPasswordProps) {
  const t = useTranslations('common');
    const {resetPassword} = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email) {
            setError('Please enter your email address');
            setIsLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            const result = await resetPassword(email);
            if (result) {
                setSuccess(true);
            } else {
                setError('No account found with this email address');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full max-w-md">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-2">
                                <CheckCircle className="h-12 w-12 text-green-500"/>
                            </div>
                            <CardTitle className="text-green-600">Reset Link Sent!</CardTitle>
                            <CardDescription>
                                We&apos;ve sent a password reset link to your email address.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center text-sm text-muted-foreground space-y-2">
                                <p>Check your email for a link to reset your password.</p>
                                <p>If you don&apos;t see it, check your spam folder.</p>
                            </div>

                            <Button onClick={onBackToLogin} className="w-full">
                                <ArrowLeft className="h-4 w-4 mr-2"/>
                                Back to Login
                            </Button>

                            <div className="text-center">
                                <Button
                                    variant="link"
                                    className="text-sm h-auto p-0"
                                    onClick={() => setSuccess(false)}
                                >
                                    Try another email address
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-2">
                            <Mail className="h-12 w-12 text-primary"/>
                        </div>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>
                            Enter your email address and we&apos;ll send you a link to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                            Sending Reset Link...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={onBackToLogin}
                                    disabled={isLoading}
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2"/>
                                    Back to Login
                                </Button>
                            </div>
                        </form>

                        <div className="mt-4 p-3 bg-accent rounded-lg border border-border">
                            <p className="text-xs text-foreground text-center">
                                <strong>Demo:</strong> Use any of the demo email addresses from the login page
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
