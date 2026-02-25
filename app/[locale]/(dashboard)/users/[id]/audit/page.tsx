'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auditService, AuditLogResponse } from '@/lib/services/audit';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, ArrowLeft, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader } from '@/components/ui/loader';
import { EnterprisePageHeader } from '@/components/shared/EnterprisePageHeader';
import { api } from '@/lib/api';

export default function UserAuditPage() {
  const params = useParams();
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadData();
    fetchUserName();
  }, [page, params.id]);

  const fetchUserName = async () => {
    try {
      const userData = await api.get(`/api/users/${params.id}`);
      setUserName(userData.name);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/audit/search', {
        organizationId: 'hospital_org1',
        userId: params.id,
        page,
        size: 20
      });
      setLogs(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeColor = (action: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      'LOGIN_SUCCESS': { bg: '#22c55e', text: '#ffffff' },
      'LOGOUT': { bg: '#f87171', text: '#ffffff' },
      'CREATE': { bg: '#22c55e', text: '#ffffff' },
      'CREATE_APPOINTMENT': { bg: '#22c55e', text: '#ffffff' },
      'CREATE_PATIENT': { bg: '#22c55e', text: '#ffffff' },
      'UPDATE': { bg: '#fbbf24', text: '#000000' },
      'UPDATE_APPOINTMENT': { bg: '#fbbf24', text: '#000000' },
      'DELETE': { bg: '#f87171', text: '#ffffff' },
      'DELETE_APPOINTMENT': { bg: '#f87171', text: '#ffffff' },
    };
    return colorMap[action] || { bg: '#9ca3af', text: '#ffffff' };
  };

  if (loading && page === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" text="Loading audit logs..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EnterprisePageHeader
        icon={Shield}
        title={`Activity Log - ${userName}`}
        description="User activity and security events"
        breadcrumbs={[
          { label: "Dashboard", href: "/en/dashboard" },
          { label: "Users", href: "/en/users" },
          { label: userName, href: `/en/users/${params.id}/profile` },
          { label: "Activity Log" },
        ]}
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        }
      />

      <div className="border rounded-lg overflow-x-auto bg-white dark:bg-slate-900 dark:border-slate-700">
        <table className="w-full">
          <thead className="border-b bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Entity</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:table-cell">IP Address</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <Loader size="lg" text="Loading..." />
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                  No activity logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 text-sm">
                    <span
                      style={{
                        display: 'inline-block',
                        border: `2px solid ${getActionBadgeColor(log.action).bg}`,
                        color: getActionBadgeColor(log.action).bg,
                        fontWeight: '600',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    >
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {log.entityType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-mono hidden md:table-cell">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge className={log.outcome === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {log.outcome}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-1 hover:bg-gray-200 dark:hover:bg-slate-700"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Activity Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Log ID</label>
                  <p className="text-sm font-mono">{selectedLog.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                  <p className="text-sm">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Action</label>
                  <p className="text-sm">
                    <span
                      style={{
                        display: 'inline-block',
                        border: `2px solid ${getActionBadgeColor(selectedLog.action).bg}`,
                        color: getActionBadgeColor(selectedLog.action).bg,
                        fontWeight: '600',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    >
                      {selectedLog.action.replace(/_/g, ' ')}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Outcome</label>
                  <p className="text-sm">
                    <Badge className={selectedLog.outcome === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {selectedLog.outcome}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Entity Type</label>
                  <p className="text-sm">{selectedLog.entityType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Entity ID</label>
                  <p className="text-sm font-mono">{selectedLog.entityId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                  <p className="text-sm font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Service</label>
                  <p className="text-sm">{selectedLog.serviceName || '-'}</p>
                </div>
              </div>
              {selectedLog.userAgent && !selectedLog.userAgent.includes('Postman') && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                  <p className="text-xs bg-muted p-3 rounded mt-1 overflow-auto">{selectedLog.userAgent}</p>
                </div>
              )}
              {selectedLog.additionalContext && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Additional Context</label>
                  <p className="text-xs bg-muted p-3 rounded mt-1 overflow-auto">{selectedLog.additionalContext}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
