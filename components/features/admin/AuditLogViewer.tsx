'use client';

import { useState, useEffect } from 'react';
import { auditService, AuditSearchRequest, AuditLogResponse, AuditAction, AuditEntityType } from '@/lib/services/audit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Search, RefreshCw, Eye, ChevronsUpDown, Check, Shield } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader } from '@/components/ui/loader';
import { EnterprisePageHeader } from '@/components/shared/EnterprisePageHeader';
import { cn } from '@/lib/utils';

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLogResponse | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [userSuggestions, setUserSuggestions] = useState<Array<{ id: string; name: string }>>([]);
  const [openUserSelect, setOpenUserSelect] = useState(false);
  const [filters, setFilters] = useState<AuditSearchRequest>({
    page: 0,
    size: 50,
    organizationId: 'hospital_org1'
  });


  useEffect(() => {
    loadData();
    loadUserSuggestions();
  }, [filters.userId, filters.action, filters.entityType, filters.page]);

  const loadUserSuggestions = async () => {
    try {
      const response = await auditService.searchAuditLogs({ page: 0, size: 100, organizationId: 'hospital_org1' });
      const uniqueUsers = Array.from(
        new Map(response.content.map(log => [log.userId, { id: log.userId, name: log.username }])).values()
      );
      setUserSuggestions(uniqueUsers);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const loadData = async () => {
    try {
      setTableLoading(true);
      const searchFilters = {
        ...filters,
        organizationId: filters.organizationId || 'hospital_org1'
      };

      const logsResponse = await auditService.searchAuditLogs(searchFilters);
      setLogs(logsResponse.content);
      setTotalPages(logsResponse.totalPages);
    } catch (error) {
      console.error('Failed to load audit data:', error);
    } finally {
      setInitialLoading(false);
      setTableLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, page: 0 });
    setTimeout(() => loadData(), 100);
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const blob = await auditService.exportLogs(filters, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString()}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getActionBadgeColor = (action: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      // Login/Logout - Green for success, Red for exit
      'LOGIN_SUCCESS': { bg: '#22c55e', text: '#ffffff' },
      'LOGOUT': { bg: '#f87171', text: '#ffffff' },

      // Create - Green (positive action)
      'CREATE': { bg: '#22c55e', text: '#ffffff' },
      'CREATE_APPOINTMENT': { bg: '#22c55e', text: '#ffffff' },
      'CREATE_USER': { bg: '#4ade80', text: '#ffffff' },

      // Read - Blue (neutral, informational)
      'READ': { bg: '#3b82f6', text: '#ffffff' },

      // Update/Change - Amber (warning, modification)
      'UPDATE': { bg: '#fbbf24', text: '#000000' },
      'UPDATES': { bg: '#fbbf24', text: '#000000' },
      'CHANGING': { bg: '#fbbf24', text: '#000000' },
      'UPDATE_APPOINTMENT': { bg: '#fbbf24', text: '#000000' },
      'UPDATE_USER': { bg: '#fbbf24', text: '#000000' },

      // Delete - Red (destructive)
      'DELETE': { bg: '#f87171', text: '#ffffff' },
      'DELETING': { bg: '#fb7185', text: '#ffffff' },
      'DELETE_APPOINTMENT': { bg: '#f87171', text: '#ffffff' },
      'DELETE_USER': { bg: '#f87171', text: '#ffffff' },

      // Other actions
      'UPLOADING': { bg: '#06b6d4', text: '#ffffff' },
      'FEEDBACK': { bg: '#a855f7', text: '#ffffff' },
      'COMMENT': { bg: '#818cf8', text: '#ffffff' }
    };
    return colorMap[action] || { bg: '#9ca3af', text: '#ffffff' };
  };

  if (initialLoading) {
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
        title="System Logs"
        description="Monitor system activity and security events"
        breadcrumbs={[
          { label: "Dashboard", href: "/en/dashboard" },
          { label: "System Logs" },
        ]}
      />

      {/* Filter Bar */}
      <div className="flex flex-col gap-4">
        {/* First Row: Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">User</label>
            <Popover open={openUserSelect} onOpenChange={setOpenUserSelect}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between text-xs sm:text-sm">
                  {filters.userId
                    ? userSuggestions.find(u => u.id === filters.userId)?.name || filters.userId
                    : 'Select user...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search user..." />
                  <CommandList>
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setFilters({ ...filters, userId: undefined, page: 0 });
                          setOpenUserSelect(false);
                        }}
                      >
                        <Check className={cn('mr-2 h-4 w-4', !filters.userId ? 'opacity-100' : 'opacity-0')} />
                        All Users
                      </CommandItem>
                      {userSuggestions.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={`${user.name} ${user.id}`}
                          onSelect={() => {
                            setFilters({ ...filters, userId: user.id, page: 0 });
                            setOpenUserSelect(false);
                          }}
                        >
                          <Check className={cn('mr-2 h-4 w-4', filters.userId === user.id ? 'opacity-100' : 'opacity-0')} />
                          {user.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Action</label>
            <Select value={filters.action || 'all'} onValueChange={(v) => setFilters({ ...filters, action: v === 'all' ? undefined : v, page: 0 })}>
              <SelectTrigger className="w-full text-xs sm:text-sm">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {Object.values(AuditAction).map((action) => (
                  <SelectItem key={action} value={action}>{action.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Browser</label>
            <Select value={filters.entityType || 'all'} onValueChange={(v) => setFilters({ ...filters, entityType: v === 'all' ? undefined : v, page: 0 })}>
              <SelectTrigger className="w-full text-xs sm:text-sm">
                <SelectValue placeholder="All Browsers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Browsers</SelectItem>
                {Object.values(AuditEntityType).map((type) => (
                  <SelectItem key={type} value={type}>{type.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Search</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs here"
                  className="pl-10 text-xs sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => handleExport('csv')} variant="outline" className="whitespace-nowrap text-xs sm:text-sm mt-0 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Export logs</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="border rounded-lg overflow-x-auto bg-white dark:bg-slate-900 relative dark:border-slate-700">
        <table className="w-full">
          <thead className="border-b bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
            <tr>
              <th className="text-left px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">User</th>
              <th className="text-left px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
              <th className="text-left px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</th>
              <th className="text-left px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:table-cell">Browser</th>
              <th className="text-left px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {tableLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <Loader size="lg" text="Loading..." />
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground dark:text-gray-400 text-sm">
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{log.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{log.userEmail || log.userId}</p>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
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
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                    {log.ipAddress || '-'}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-1 hover:bg-gray-200 dark:hover:bg-slate-700"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          <Button
            variant="outline"
            disabled={filters.page === 0}
            onClick={() => setFilters({ ...filters, page: (filters.page || 0) - 1 })}
            className="text-xs sm:text-sm"
          >
            Previous
          </Button>
          <span className="flex items-center px-2 sm:px-4 text-xs sm:text-sm">
            Page {(filters.page || 0) + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={(filters.page || 0) >= totalPages - 1}
            onClick={() => setFilters({ ...filters, page: (filters.page || 0) + 1 })}
            className="text-xs sm:text-sm"
          >
            Next
          </Button>
        </div>
      )}

      {/* Log Details Modal */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
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
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p className="text-sm font-mono">{selectedLog.userId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Username</label>
                  <p className="text-sm">{selectedLog.username}</p>
                </div>
                {selectedLog.userEmail && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{selectedLog.userEmail}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User Role</label>
                  <p className="text-sm">{selectedLog.userRole}</p>
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
                  <p className="text-sm">{selectedLog.outcome}</p>
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
                  <label className="text-sm font-medium text-muted-foreground">Organization ID</label>
                  <p className="text-sm font-mono">{selectedLog.organizationId}</p>
                </div>
              </div>
              {selectedLog.reason && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reason</label>
                  <p className="text-sm mt-1">{selectedLog.reason}</p>
                </div>
              )}
              {selectedLog.oldValue && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Old Value</label>
                  <pre className="text-xs bg-muted p-3 rounded mt-1 overflow-auto">{selectedLog.oldValue}</pre>
                </div>
              )}
              {selectedLog.newValue && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">New Value</label>
                  <pre className="text-xs bg-muted p-3 rounded mt-1 overflow-auto">{selectedLog.newValue}</pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
