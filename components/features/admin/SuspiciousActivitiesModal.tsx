'use client';

import { useState } from 'react';
import { AuditLogResponse, AuditAction, AuditEntityType, AuditOutcome } from '@/lib/services/audit';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Search } from 'lucide-react';

interface SuspiciousActivitiesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activities: AuditLogResponse[];
}

export default function SuspiciousActivitiesModal({ open, onOpenChange, activities }: SuspiciousActivitiesModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');

  const getOutcomeBadge = (outcome: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      SUCCESS: { variant: 'default', icon: CheckCircle },
      FAILURE: { variant: 'destructive', icon: XCircle },
      WARNING: { variant: 'secondary', icon: AlertTriangle },
      PARTIAL_SUCCESS: { variant: 'outline', icon: AlertTriangle }
    };
    const config = variants[outcome] || variants.SUCCESS;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {outcome}
      </Badge>
    );
  };

  const filteredActivities = activities.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesUser = filterUser === 'all' || log.userId === filterUser;

    return matchesSearch && matchesAction && matchesUser;
  });

  const uniqueActions = Array.from(new Set(activities.map(a => a.action)));
  const uniqueUsers = Array.from(
    new Map(activities.map((a, idx) => [a.userId, { id: a.userId, name: a.username, idx }])).values()
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-700">
            Suspicious Activities ({filteredActivities.length} of {activities.length})
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="grid grid-cols-3 gap-4 pb-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger>
              <span>Action: {filterAction === 'all' ? 'All' : filterAction}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {uniqueActions.map(action => (
                <SelectItem key={action} value={action}>{action}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterUser} onValueChange={setFilterUser}>
            <SelectTrigger>
              <span>User: {filterUser === 'all' ? 'All' : uniqueUsers.find(u => u.id === filterUser)?.name}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {uniqueUsers.map((user) => (
                <SelectItem key={`${user.id}-${user.idx}`} value={user.id}>{user.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Activities List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {filteredActivities.map((log) => (
            <div key={log.id} className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center gap-3 mb-3">
                {getOutcomeBadge(log.outcome)}
                <span className="font-semibold text-lg">{log.action}</span>
                <span className="text-gray-500">→</span>
                <Badge variant="outline">{log.entityType}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">User:</span>
                  <p className="font-medium">{log.username}</p>
                  <p className="text-xs text-gray-400">{log.userRole}</p>
                </div>
                <div>
                  <span className="text-gray-500">Entity ID:</span>
                  <p className="font-mono text-xs">{log.entityId}</p>
                </div>
                <div>
                  <span className="text-gray-500">IP Address:</span>
                  <p className="font-mono text-xs">{log.ipAddress}</p>
                </div>
                <div>
                  <span className="text-gray-500">Timestamp:</span>
                  <p className="text-xs">{new Date(log.timestamp).toLocaleString()}</p>
                </div>
              </div>

              {log.reason && (
                <div className="mt-3 p-2 bg-white rounded border border-red-200">
                  <span className="text-gray-500 text-sm">Reason:</span>
                  <p className="text-red-700 font-medium">{log.reason}</p>
                </div>
              )}

              {(log.oldValue || log.newValue) && (
                <details className="mt-3">
                  <summary className="text-sm text-blue-600 cursor-pointer">View Changes</summary>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
                    {log.oldValue && (
                      <div>
                        <p className="font-medium text-gray-500 mb-1">Old Value:</p>
                        <pre className="bg-white p-2 rounded overflow-auto border">{log.oldValue}</pre>
                      </div>
                    )}
                    {log.newValue && (
                      <div>
                        <p className="font-medium text-gray-500 mb-1">New Value:</p>
                        <pre className="bg-white p-2 rounded overflow-auto border">{log.newValue}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
