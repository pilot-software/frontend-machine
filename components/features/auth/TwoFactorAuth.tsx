import React, {useState} from 'react';
import {useAuth} from '@/components/providers/AuthContext';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {InputOTP, InputOTPGroup, InputOTPSlot} from '@/components/ui/input-otp';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Loader2, Shield, Smartphone} from 'lucide-react';

export function TwoFactorAuth() {
    const {verifyTwoFactor, isLoading, logout} = useAuth();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (code.length !== 6) {
            setError('Please enter a 6-digit verification code');
            return;
        }

        const success = await verifyTwoFactor(code);
        if (!success) {
            setError('Invalid verification code. Please try again.');
            setCode('');
        }
    };

    const handleBackToLogin = () => {
        logout();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Shield className="h-8 w-8 text-blue-600"/>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Two-Factor Authentication</h1>
                    <p className="text-slate-600 mt-2">Verify your identity to continue</p>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-2">
                            <Smartphone className="h-12 w-12 text-blue-600"/>
                        </div>
                        <CardTitle>Enter Verification Code</CardTitle>
                        <CardDescription>
                            We&apos;ve sent a 6-digit code to your registered device. Enter it below to complete your
                            login.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={6}
                                    value={code}
                                    onChange={(value) => setCode(value)}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0}/>
                                        <InputOTPSlot index={1}/>
                                        <InputOTPSlot index={2}/>
                                        <InputOTPSlot index={3}/>
                                        <InputOTPSlot index={4}/>
                                        <InputOTPSlot index={5}/>
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>

                            <div className="space-y-3">
                                <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify Code'
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleBackToLogin}
                                    disabled={isLoading}
                                >
                                    Back to Login
                                </Button>
                            </div>
                        </form>

                        <div className="mt-6 text-center space-y-2">
                            <p className="text-sm text-slate-600">
                                Didn&apos;t receive the code?
                            </p>
                            <Button variant="link" className="text-sm h-auto p-0">
                                Resend code
                            </Button>
                        </div>

                        {/* Demo helper */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-700 text-center">
                                <strong>Demo:</strong> Enter <code>123456</code> as the verification code
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
