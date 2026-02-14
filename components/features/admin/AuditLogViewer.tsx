'use client';

import { useState, useEffect } from 'react';
import { auditService, AuditSearchRequest, AuditLogResponse, AuditAction, AuditEntityType, AuditOutcome } from '@/lib/services/audit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Download, Filter, Search, RefreshCw, Eye, Shield, ChevronsUpDown, Check, ExternalLink } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import SuspiciousActivitiesModal from './SuspiciousActivitiesModal';

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [suspicious, setSuspicious] = useState<AuditLogResponse[]>([]);
  const [showSuspiciousModal, setShowSuspiciousModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [userSuggestions, setUserSuggestions] = useState<Array<{ id: string; name: string }>>([]);
  const [entitySuggestions, setEntitySuggestions] = useState<Array<{ id: string; type: string }>>([]);
  const [openUserSelect, setOpenUserSelect] = useState(false);
  const [openEntitySelect, setOpenEntitySelect] = useState(false);
  const [filters, setFilters] = useState<AuditSearchRequest>({
    page: 0,
    size: 50,
    organizationId: 'hospital_org1'
  });

  useEffect(() => {
    loadData();
    loadUserSuggestions();
  }, [filters.page]); // Reload when page changes

  const loadUserSuggestions = async () => {
    try {
      const response = await auditService.searchAuditLogs({ page: 0, size: 100, organizationId: 'hospital_org1' });
      const uniqueUsers = Array.from(
        new Map(response.content.map(log => [log.userId, { id: log.userId, name: log.username }])).values()
      );
      const uniqueEntities = Array.from(
        new Map(response.content.map(log => [log.entityId, { id: log.entityId, type: log.entityType }])).values()
      );
      setUserSuggestions(uniqueUsers);
      setEntitySuggestions(uniqueEntities);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      // Add organizationId to filters if not present
      const searchFilters = {
        ...filters,
        organizationId: filters.organizationId || 'hospital_org1'
      };

      const [logsResponse, statsData, suspiciousData] = await Promise.all([
        auditService.searchAuditLogs(searchFilters),
        auditService.getStatistics(startDate.toISOString()).catch(() => ({})),
        auditService.getSuspiciousActivities(startDate.toISOString()).catch(() => [])
      ]);

      setLogs(logsResponse.content);
      setTotalPages(logsResponse.totalPages);
      setStats(statsData);
      setSuspicious(suspiciousData);
    } catch (error) {
      console.error('Failed to load audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, page: 0 });
    setTimeout(() => loadData(), 100); // Ensure state updates
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Security & Audit Logs</h1>
          <p className="text-gray-500 mt-1">Monitor system activity and security events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(stats).slice(0, 8).map(([action, count]) => (
            <Card key={action}>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{count as number}</div>
                <div className="text-sm text-gray-500 mt-1">{action.replace(/_/g, ' ')}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Suspicious Activities Alert */}
      {suspicious.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-red-700">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Suspicious Activities Detected ({suspicious.length})
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-700"
                onClick={() => setShowSuspiciousModal(true)}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suspicious.slice(0, 3).map((log) => (
                <div key={log.id} className="bg-white p-3 rounded border border-red-200">
                  <div className="flex items-center gap-3 mb-2">
                    {getOutcomeBadge(log.outcome)}
                    <span className="font-semibold">{log.action}</span>
                    <span className="text-gray-500">→</span>
                    <Badge variant="outline">{log.entityType}</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{log.username}</span> on {log.entityId}
                    <span className="text-gray-500 ml-2">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {suspicious.length > 3 && (
                <p className="text-sm text-gray-500 text-center pt-2">
                  +{suspicious.length - 3} more suspicious activities
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <SuspiciousActivitiesModal 
        open={showSuspiciousModal}
        onOpenChange={setShowSuspiciousModal}
        activities={suspicious}
      />

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>User</Label>
                <Popover open={openUserSelect} onOpenChange={setOpenUserSelect}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
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
                              setFilters({ ...filters, userId: undefined });
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
                                setFilters({ ...filters, userId: user.id });
                                setOpenUserSelect(false);
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', filters.userId === user.id ? 'opacity-100' : 'opacity-0')} />
                              <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-xs text-gray-500">{user.id}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Action</Label>
                <Select value={filters.action || 'all'} onValueChange={(v) => setFilters({ ...filters, action: v === 'all' ? undefined : v })}>
                  <SelectTrigger>
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

              <div>
                <Label>Entity Type</Label>
                <Select value={filters.entityType || 'all'} onValueChange={(v) => setFilters({ ...filters, entityType: v === 'all' ? undefined : v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Entity Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.values(AuditEntityType).map((type) => (
                      <SelectItem key={type} value={type}>{type.replace(/_/g, ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Outcome</Label>
                <Select value={filters.outcome || 'all'} onValueChange={(v) => setFilters({ ...filters, outcome: v === 'all' ? undefined : v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Outcomes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Outcomes</SelectItem>
                    {Object.values(AuditOutcome).map((outcome) => (
                      <SelectItem key={outcome} value={outcome}>{outcome.replace(/_/g, ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Entity ID</Label>
                <Popover open={openEntitySelect} onOpenChange={setOpenEntitySelect}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {filters.entityId 
                        ? entitySuggestions.find(e => e.id === filters.entityId)?.id || filters.entityId
                        : 'Select entity...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search entity..." />
                      <CommandList>
                        <CommandEmpty>No entity found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              setFilters({ ...filters, entityId: undefined });
                              setOpenEntitySelect(false);
                            }}
                          >
                            <Check className={cn('mr-2 h-4 w-4', !filters.entityId ? 'opacity-100' : 'opacity-0')} />
                            All Entities
                          </CommandItem>
                          {entitySuggestions.map((entity) => (
                            <CommandItem
                              key={entity.id}
                              value={`${entity.id} ${entity.type}`}
                              onSelect={() => {
                                setFilters({ ...filters, entityId: entity.id });
                                setOpenEntitySelect(false);
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', filters.entityId === entity.id ? 'opacity-100' : 'opacity-0')} />
                              <div className="flex flex-col">
                                <span className="font-mono text-xs">{entity.id}</span>
                                <span className="text-xs text-gray-500">{entity.type}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Start Date</Label>
                <Input
                  type="datetime-local"
                  value={filters.startDate?.slice(0, 16) || ''}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                />
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="datetime-local"
                  value={filters.endDate?.slice(0, 16) || ''}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleSearch} className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilters({ page: 0, size: 50, organizationId: 'hospital_org1' });
                  loadData();
                }}
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs ({logs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {logs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No audit logs found</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getOutcomeBadge(log.outcome)}
                        <span className="font-semibold text-lg">{log.action}</span>
                        <span className="text-gray-500">→</span>
                        <Badge variant="outline">{log.entityType}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                        <div className="mt-2 text-sm">
                          <span className="text-gray-500">Reason:</span>
                          <p className="text-gray-700">{log.reason}</p>
                        </div>
                      )}

                      {(log.oldValue || log.newValue) && (
                        <details className="mt-2">
                          <summary className="text-sm text-blue-600 cursor-pointer">View Changes</summary>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
                            {log.oldValue && (
                              <div>
                                <p className="font-medium text-gray-500 mb-1">Old Value:</p>
                                <pre className="bg-gray-100 p-2 rounded overflow-auto">{log.oldValue}</pre>
                              </div>
                            )}
                            {log.newValue && (
                              <div>
                                <p className="font-medium text-gray-500 mb-1">New Value:</p>
                                <pre className="bg-gray-100 p-2 rounded overflow-auto">{log.newValue}</pre>
                              </div>
                            )}
                          </div>
                        </details>
                      )}

                      {log.tamperDetected && (
                        <Badge variant="destructive" className="mt-2">
                          ⚠️ Tamper Detected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                disabled={filters.page === 0}
                onClick={() => setFilters({ ...filters, page: (filters.page || 0) - 1 })}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {(filters.page || 0) + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={(filters.page || 0) >= totalPages - 1}
                onClick={() => setFilters({ ...filters, page: (filters.page || 0) + 1 })}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
