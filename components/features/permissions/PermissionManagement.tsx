"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { permissionService } from "@/lib/services/permission";
import { Shield, Search, Lock, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { StatsCard, StatsCardGrid } from "@/components/ui/stats-card";

interface PermissionItem {
  id: string;
  name: string;
  description: string;
  module: string;
}

export function PermissionManagement() {
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const data = await permissionService.getAllPermissions();
      console.log("Raw API response:", data);

      // Handle the Permission type from API which has groups and permissions arrays
      let perms: PermissionItem[] = [];
      
      if (data?.permissions && Array.isArray(data.permissions)) {
        perms = data.permissions.map((perm: string) => ({
          id: perm,
          name: perm,
          description: "",
          module: "General",
        }));
      } else if (Array.isArray(data)) {
        perms = data.map((perm: string) => ({
          id: perm,
          name: perm,
          description: "",
          module: "General",
        }));
      }

      console.log("Processed permissions:", perms);
      setPermissions(perms);
    } catch (error) {
      console.error("Failed to load permissions:", error);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    const module = perm.module || "General";
    if (!acc[module]) acc[module] = [];
    acc[module].push(perm);
    return acc;
  }, {} as Record<string, PermissionItem[]>);

  const filteredModules = Object.entries(groupedPermissions).filter(
    ([module, perms]) =>
      module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perms.some((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading permissions...
      </div>
    );
  }

  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Permission Management</h1>
          <p className="text-muted-foreground">
            Manage system permissions and access control
          </p>
        </div>
        <Button onClick={() => router.push('/permissions/roles')} className="gap-2">
          <Settings className="h-4 w-4" />
          Manage Roles
        </Button>
      </div>

      <StatsCardGrid>
        <StatsCard
          title="Total Permissions"
          value={permissions.length}
          icon={Shield}
          color="text-blue-600"
          bgGradient="from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Permission Modules"
          value={Object.keys(groupedPermissions).length}
          icon={Lock}
          color="text-green-600"
          bgGradient="from-green-500 to-green-600"
        />
        <StatsCard
          title="System Settings"
          value="Active"
          icon={Settings}
          color="text-purple-600"
          bgGradient="from-purple-500 to-purple-600"
        />
      </StatsCardGrid>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search permissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map(([module, perms]) => (
          <Card key={module} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" />
                {module}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {perms.map((perm, idx) => (
                <div
                  key={perm.id || perm.name || idx}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{perm.name}</p>
                    {perm.description && (
                      <p className="text-xs text-muted-foreground">
                        {perm.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No permissions found</p>
        </div>
      )}
    </div>
  );
}
