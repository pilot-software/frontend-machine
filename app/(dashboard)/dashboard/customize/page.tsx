'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';

interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  required?: boolean;
}

interface DashboardConfig {
  patients: ColumnConfig[];
  doctors: ColumnConfig[];
  departments: ColumnConfig[];
}

export default function DashboardCustomizePage() {
  const { user } = useAuth();
  const [config, setConfig] = useState<DashboardConfig>({
    patients: [
      { key: 'patient', label: 'Patient', visible: true, required: true },
      { key: 'caseNumber', label: 'Case #', visible: true },
      { key: 'contact', label: 'Contact', visible: true },
      { key: 'doctor', label: 'Doctor', visible: true },
      { key: 'department', label: 'Department', visible: true },
      { key: 'status', label: 'Status', visible: true },
      { key: 'lastVisit', label: 'Last Visit', visible: true },
      { key: 'actions', label: 'Actions', visible: true, required: true },
    ],
    doctors: [
      { key: 'doctor', label: 'Doctor', visible: true, required: true },
      { key: 'specialization', label: 'Specialization', visible: true },
      { key: 'department', label: 'Department', visible: true },
      { key: 'contact', label: 'Contact', visible: true },
      { key: 'patients', label: 'Patients', visible: true },
      { key: 'availability', label: 'Availability', visible: true },
      { key: 'actions', label: 'Actions', visible: true, required: true },
    ],
    departments: [
      { key: 'department', label: 'Department', visible: true, required: true },
      { key: 'head', label: 'Department Head', visible: true },
      { key: 'location', label: 'Location', visible: true },
      { key: 'contact', label: 'Contact', visible: true },
      { key: 'patients', label: 'Patients', visible: true },
      { key: 'staff', label: 'Staff', visible: true },
      { key: 'status', label: 'Status', visible: true },
      { key: 'actions', label: 'Actions', visible: true, required: true },
    ],
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem(`dashboard-config-${user?.role}`);
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, [user?.role]);

  const handleToggleColumn = (table: keyof DashboardConfig, columnKey: string) => {
    setConfig(prev => ({
      ...prev,
      [table]: prev[table].map(col =>
        col.key === columnKey ? { ...col, visible: !col.visible } : col
      )
    }));
  };

  const handleSave = () => {
    localStorage.setItem(`dashboard-config-${user?.role}`, JSON.stringify(config));
    alert('Dashboard configuration saved successfully!');
  };

  const handleReset = () => {
    localStorage.removeItem(`dashboard-config-${user?.role}`);
    window.location.reload();
  };

  const getVisibleColumns = (table: keyof DashboardConfig) => {
    return config[table].filter(col => col.visible).length;
  };

  const getTotalColumns = (table: keyof DashboardConfig) => {
    return config[table].length;
  };

  const canAccessTable = (table: keyof DashboardConfig) => {
    if (table === 'patients') return true;
    if (table === 'doctors' && user?.role === 'doctor') return false;
    if (table === 'departments' && !['admin'].includes(user?.role || '')) return false;
    return true;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => window.close()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Close
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Dashboard Customization</h1>
            <p className="text-muted-foreground">Customize column visibility for your role: {user?.role}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(config).map(([tableKey, columns]) => {
          const table = tableKey as keyof DashboardConfig;
          
          if (!canAccessTable(table)) return null;

          return (
            <Card key={table}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="capitalize">{table} Table</span>
                  <Badge variant="outline">
                    {getVisibleColumns(table)} / {getTotalColumns(table)} columns visible
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {columns.map((column: ColumnConfig) => (
                    <div
                      key={column.key}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={column.visible}
                          onCheckedChange={() => handleToggleColumn(table, column.key)}
                          disabled={column.required}
                        />
                        <div>
                          <p className="font-medium">{column.label}</p>
                          {column.required && (
                            <p className="text-xs text-muted-foreground">Required column</p>
                          )}
                        </div>
                      </div>
                      {column.required && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Scope</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Current Role:</strong> {user?.role}</p>
            <p><strong>Customization Scope:</strong> Settings are saved per user role</p>
            <p><strong>Available Tables:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {canAccessTable('patients') && <li>Patients - View and manage patient records</li>}
              {canAccessTable('doctors') && <li>Doctors - Medical staff directory</li>}
              {canAccessTable('departments') && <li>Departments - Hospital departments overview</li>}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}