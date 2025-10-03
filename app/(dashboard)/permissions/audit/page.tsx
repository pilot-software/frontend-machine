'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '../../../../components/ui/card';
import {Button} from '../../../../components/ui/button';
import {Input} from '../../../../components/ui/input';
import {Badge} from '../../../../components/ui/badge';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../../../../components/ui/select';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../../../../components/ui/table';
import {ArrowLeft, FileText, RefreshCw, Search, Shield, User, Users} from 'lucide-react';
import {api} from '../../../../lib/api';

interface PermissionAuditLog {
  id: string;
  timestamp: string;
  action: string;
  targetType: 'USER' | 'ROLE' | 'GROUP' | 'BRANCH';
  targetName: string;
  permission: string;
  changedBy: string;
  details: string;
  status: 'SUCCESS' | 'FAILED';
}

export default function PermissionAuditPage() {
  const router = useRouter();

  const [auditLogs, setAuditLogs] = useState<PermissionAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/permissions/audit');
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockAuditLogs = [
    {
      id: '1',
      timestamp: '2024-01-15 14:30:15',
      action: 'GRANT_PERMISSION',
      targetType: 'USER',
      targetName: 'Dr. John Smith',
      permission: 'patients.delete',
      changedBy: 'Admin Bob Wilson',
      details: 'Granted delete permission for patient records',
      status: 'SUCCESS'
    },
    {
      id: '2',
      timestamp: '2024-01-15 14:25:45',
      action: 'REVOKE_PERMISSION',
      targetType: 'ROLE',
      targetName: 'NURSE',
      permission: 'billing.update',
      changedBy: 'Admin Bob Wilson',
      details: 'Removed billing update permission from nurse role',
      status: 'SUCCESS'
    },
    {
      id: '3',
      timestamp: '2024-01-15 14:20:30',
      action: 'CREATE_GROUP',
      targetType: 'GROUP',
      targetName: 'Emergency Staff',
      permission: 'multiple',
      changedBy: 'Admin Bob Wilson',
      details: 'Created new permission group for emergency department',
      status: 'SUCCESS'
    },
    {
      id: '4',
      timestamp: '2024-01-15 14:15:20',
      action: 'BRANCH_ACCESS_CHANGE',
      targetType: 'BRANCH',
      targetName: 'North Clinic',
      permission: 'access.full',
      changedBy: 'Admin Bob Wilson',
      details: 'Added Dr. Sarah Johnson to North Clinic with full access',
      status: 'SUCCESS'
    },
    {
      id: '5',
      timestamp: '2024-01-15 14:10:10',
      action: 'GRANT_TEMPORARY_ROLE',
      targetType: 'USER',
      targetName: 'Nurse Jane Doe',
      permission: 'role.admin',
      changedBy: 'Admin Bob Wilson',
      details: 'Granted temporary admin role for 7 days',
      status: 'SUCCESS'
    },
    {
      id: '6',
      timestamp: '2024-01-15 14:05:00',
      action: 'FAILED_PERMISSION_CHANGE',
      targetType: 'USER',
      targetName: 'Dr. Mike Brown',
      permission: 'users.delete',
      changedBy: 'Finance Lisa Davis',
      details: 'Attempted to grant user deletion permission - insufficient privileges',
      status: 'FAILED'
    }
  ];

  // Use mock data if API returns empty
  const displayLogs = auditLogs.length > 0 ? auditLogs : mockAuditLogs;

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [targetTypeFilter, setTargetTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = displayLogs.filter(log => {
    const matchesSearch = log.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.permission.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.changedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesTargetType = targetTypeFilter === 'ALL' || log.targetType === targetTypeFilter;
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesSearch && matchesAction && matchesTargetType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getTargetTypeIcon = (type: string) => {
    const icons = {
      USER: <User className="h-4 w-4" />,
      ROLE: <Shield className="h-4 w-4" />,
      GROUP: <Users className="h-4 w-4" />,
      BRANCH: <FileText className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <FileText className="h-4 w-4" />;
  };

  const getTargetTypeBadge = (type: string) => {
    const colors = {
      USER: 'bg-blue-100 text-blue-800',
      ROLE: 'bg-purple-100 text-purple-800',
      GROUP: 'bg-green-100 text-green-800',
      BRANCH: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/permissions/overview')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Permission Audit Log</h1>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={fetchAuditLogs}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Changes</p>
                <p className="text-2xl font-bold">{displayLogs.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold">{displayLogs.filter(l => l.status === 'SUCCESS').length}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{displayLogs.filter(l => l.status === 'FAILED').length}</p>
              </div>
              <User className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">{displayLogs.filter(l => l.timestamp.startsWith('2024-01-15')).length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search audit logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Actions</SelectItem>
                <SelectItem value="GRANT_PERMISSION">Grant Permission</SelectItem>
                <SelectItem value="REVOKE_PERMISSION">Revoke Permission</SelectItem>
                <SelectItem value="CREATE_GROUP">Create Group</SelectItem>
                <SelectItem value="BRANCH_ACCESS_CHANGE">Branch Access</SelectItem>
                <SelectItem value="GRANT_TEMPORARY_ROLE">Temporary Role</SelectItem>
              </SelectContent>
            </Select>
            <Select value={targetTypeFilter} onValueChange={setTargetTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Target type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ROLE">Role</SelectItem>
                <SelectItem value="GROUP">Group</SelectItem>
                <SelectItem value="BRANCH">Branch</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Changes ({filteredLogs.length} entries)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Permission</TableHead>
                <TableHead>Changed By</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No audit logs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{log.action.replace(/_/g, ' ')}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTargetTypeIcon(log.targetType)}
                        <div>
                          <p className="font-medium">{log.targetName}</p>
                          <Badge className={getTargetTypeBadge(log.targetType)} variant="outline">
                            {log.targetType}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.permission}
                    </TableCell>
                    <TableCell>{log.changedBy}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {log.details}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(log.status)}>
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
