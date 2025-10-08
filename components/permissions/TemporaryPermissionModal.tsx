'use client';

import React, {useEffect, useState} from 'react';
import { useTranslations } from "next-intl";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '../ui/dialog';
import {Button} from '../ui/button';
import {Input} from '../ui/input';
import {Label} from '../ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select';
import {Textarea} from '../ui/textarea';
import {RadioGroup, RadioGroupItem} from '../ui/radio-group';
import {api} from '../../lib/api';

interface TemporaryPermissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onSuccess?: () => void;
}


export function TemporaryPermissionModal({isOpen, onClose, userId, onSuccess}: TemporaryPermissionModalProps) {
  const t = useTranslations('common');
    const [permissionType, setPermissionType] = useState<'group' | 'individual'>('group');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedPermission, setSelectedPermission] = useState('');
    const [expiresInHours, setExpiresInHours] = useState('24');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [permissionGroups, setPermissionGroups] = useState<any[]>([]);
    const [individualPermissions, setIndividualPermissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchPermissionData();
        }
    }, [isOpen]);

    const fetchPermissionData = async () => {
        try {
            setLoading(true);
            const [groups, permissions] = await Promise.all([
                Promise.resolve([]),
                api.get('/api/permissions/all')
            ]);
            setPermissionGroups(groups || []);
            setIndividualPermissions(permissions || []);
        } catch (error) {
            console.error('Failed to fetch permission data:', error);
            // Fallback to static data
            setPermissionGroups([
                {value: 'MEDICAL_STAFF', label: 'Medical Staff', description: 'Full medical permissions'},
                {value: 'ADMINISTRATIVE_STAFF', label: 'Administrative Staff', description: 'Admin permissions'},
                {value: 'FINANCIAL_STAFF', label: 'Financial Staff', description: 'Billing/payment permissions'},
                {value: 'DASHBOARD_VIEW', label: 'Dashboard View', description: 'Basic dashboard access'},
                {value: 'DASHBOARD_FINANCIAL', label: 'Dashboard Financial', description: 'Financial dashboard'},
                {value: 'DASHBOARD_CLINICAL', label: 'Dashboard Clinical', description: 'Clinical dashboard'}
            ]);
            setIndividualPermissions([
                {name: 'USERS_MANAGE_PERMISSIONS', description: 'Manage user permissions'},
                {name: 'MEDICAL_RECORDS_DELETE', description: 'Delete medical records'},
                {name: 'BILLING_PROCESS_PAYMENTS', description: 'Process payments'},
                {name: 'SYSTEM_MANAGE_ROLES', description: 'Manage system roles'}
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload: any = {
                expiresInHours: parseInt(expiresInHours),
                reason
            };

            if (permissionType === 'group') {
                payload.permissionGroup = selectedGroup;
            } else {
                payload.permission = selectedPermission;
            }

            await api.grantTemporaryRole(userId, payload);
            onSuccess?.();
            onClose();
            resetForm();
        } catch (error) {
            console.error('Failed to grant temporary permission:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setPermissionType('group');
        setSelectedGroup('');
        setSelectedPermission('');
        setExpiresInHours('24');
        setReason('');
    };

    const isValid = reason.trim() && expiresInHours &&
        ((permissionType === 'group' && selectedGroup) ||
            (permissionType === 'individual' && selectedPermission));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Grant Temporary Permission</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Permission Type</Label>
                        <RadioGroup value={permissionType}
                                    onValueChange={(value: 'group' | 'individual') => setPermissionType(value)}
                                    className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="group" id="group"
                                                className="border-2 border-gray-400 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-50"/>
                                <Label htmlFor="group" className="cursor-pointer font-medium">Permission Group</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="individual" id="individual"
                                                className="border-2 border-gray-400 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-50"/>
                                <Label htmlFor="individual" className="cursor-pointer font-medium">Individual
                                    Permission</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {permissionType === 'group' ? (
                        <div>
                            <Label htmlFor="permissionGroup">Permission Group</Label>
                            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select permission group"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {loading ? (
                                        <SelectItem value="loading" disabled>{t("loading")}</SelectItem>
                                    ) : (
                                        permissionGroups.map(group => (
                                            <SelectItem key={group.value || group.name}
                                                        value={group.value || group.name}>
                                                <div>
                                                    <div className="font-medium">{group.label || group.name}</div>
                                                    <div
                                                        className="text-sm text-muted-foreground">{group.description}</div>
                                                </div>
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div>
                            <Label htmlFor="permission">Individual Permission</Label>
                            <Select value={selectedPermission} onValueChange={setSelectedPermission}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select permission"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {loading ? (
                                        <SelectItem value="loading" disabled>{t("loading")}</SelectItem>
                                    ) : (
                                        individualPermissions.map(permission => (
                                            <SelectItem key={permission.name || permission}
                                                        value={permission.name || permission}>
                                                <div>
                                                    <div
                                                        className="font-medium">{(permission.name || permission).replace(/_/g, ' ')}</div>
                                                    {permission.description && (
                                                        <div
                                                            className="text-sm text-muted-foreground">{permission.description}</div>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="expiresInHours">Expires In (Hours)</Label>
                        <Input
                            id="expiresInHours"
                            type="number"
                            min="1"
                            max="168"
                            value={expiresInHours}
                            onChange={(e) => setExpiresInHours(e.target.value)}
                            placeholder="24"
                        />
                    </div>

                    <div>
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Emergency access required..."
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">{t("cancel")}</Button>
                        <Button type="submit" disabled={!isValid || isSubmitting} className="flex-1">
                            {isSubmitting ? 'Granting...' : 'Grant Permission'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
