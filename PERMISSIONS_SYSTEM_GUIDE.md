# Permissions System Documentation

## Overview

The permissions system provides comprehensive role-based access control (RBAC) with the following features:

- **Permission Catalog**: Global system permissions that can be distributed to organizations
- **Organization Permissions**: Organization-specific permissions derived from the catalog
- **Permission Groups**: Reusable permission bundles (like roles)
- **User Permissions**: Individual user access through groups and custom permissions
- **Effective Permissions**: Computed final permissions for each user
- **Audit Trail**: Complete history of permission changes

## Architecture

### Permission Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    1. PERMISSION CATALOG                     │
│                    (Global/System Level)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ permissions table                                       │ │
│  │ - id: 1                                                 │ │
│  │ - permission_code: "VIEW_PATIENTS"                      │ │
│  │ - permission_name: "View Patients"                      │ │
│  │ - is_system: true                                       │ │
│  │ - category: "PATIENT_MANAGEMENT"                        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ (distributed to)
┌─────────────────────────────────────────────────────────────┐
│              2. ORGANIZATION PERMISSIONS                     │
│                  (Organization Level)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ organization_permissions table                          │ │
│  │ - id: 101 ← THIS IS WHAT GROUPS/USERS REFERENCE        │ │
│  │ - organization_id: "hospital_org1"                      │ │
│  │ - permission_id: 1 (FK to permissions.id)              │ │
│  │ - is_enabled: true                                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ (grouped into)
┌─────────────────────────────────────────────────────────────┐
│                 3. PERMISSION GROUPS                         │
│                    (Role Templates)                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ permission_groups table                                 │ │
│  │ - id: 201                                               │ │
│  │ - group_name: "Doctor"                                  │ │
│  │ - organization_id: "hospital_org1"                      │ │
│  │                                                         │ │
│  │ permission_group_permissions (junction)                 │ │
│  │ - permission_group_id: 201                              │ │
│  │ - organization_permission_id: 101, 102, 103...          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ (assigned to)
┌─────────────────────────────────────────────────────────────┐
│                    4. USER PERMISSIONS                       │
│                   (Individual Access)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ user_permission_groups (Group Assignment)               │ │
│  │ - user_id: "user123"                                    │ │
│  │ - permission_group_id: 201                              │ │
│  │                                                         │ │
│  │ user_custom_permissions (Direct Override)               │ │
│  │ - user_id: "user123"                                    │ │
│  │ - organization_permission_id: 105                       │ │
│  │ - is_granted: true/false (grant or revoke)             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Implementation

### 1. Permission Context Provider

The `PermissionProvider` manages permissions state across the application:

```typescript
import { usePermissions } from '@/components/providers/PermissionProvider';

function MyComponent() {
  const { hasPermission, hasAnyPermission, loading } = usePermissions();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {hasPermission('VIEW_PATIENTS') && <PatientList />}
      {hasAnyPermission(['CREATE_PATIENT', 'UPDATE_PATIENT']) && <PatientForm />}
    </div>
  );
}
```

### 2. Permission Guard Component

Protect components based on permissions:

```typescript
import { PermissionGuard } from '@/components/providers/PermissionProvider';

<PermissionGuard 
  permission="VIEW_PATIENTS"
  fallback={<div>Access denied</div>}
>
  <PatientDashboard />
</PermissionGuard>

<PermissionGuard 
  permissions={['CREATE_PATIENT', 'UPDATE_PATIENT']}
  requireAll={false}
>
  <PatientForm />
</PermissionGuard>
```

### 3. Permission Hooks

Use predefined permission checks:

```typescript
import { usePermissionChecks } from '@/components/providers/PermissionProvider';

function PatientComponent() {
  const { 
    canViewPatients, 
    canCreatePatients, 
    canUpdatePatients 
  } = usePermissionChecks();
  
  return (
    <div>
      {canViewPatients() && <PatientList />}
      {canCreatePatients() && <CreatePatientButton />}
      {canUpdatePatients() && <EditPatientButton />}
    </div>
  );
}
```

## API Endpoints

### Permission Catalog
- `GET /api/permissions/catalog` - Get all permissions
- `POST /api/permissions/catalog` - Create new permission (SUPER_ADMIN only)

### Organization Permissions
- `GET /api/permissions/organization/permissions` - Get org permissions
- `POST /api/permissions/organization/permissions/{id}/assign` - Assign to org
- `PUT /api/permissions/organization/permissions/{id}/toggle` - Enable/disable

### Permission Groups
- `GET /api/permissions/groups` - List groups
- `POST /api/permissions/groups` - Create group
- `GET /api/permissions/groups/{id}` - Group details
- `PUT /api/permissions/groups/{id}` - Update group
- `DELETE /api/permissions/groups/{id}` - Delete group

### User Permissions
- `GET /api/permissions/users/{userId}` - Get user permissions
- `POST /api/permissions/users/{userId}/groups` - Assign groups
- `DELETE /api/permissions/users/{userId}/groups/{groupId}` - Remove group
- `POST /api/permissions/users/{userId}/custom` - Assign custom permissions
- `DELETE /api/permissions/users/{userId}/custom/{permissionId}` - Revoke permission

## Permission Codes

### Patient Management
- `VIEW_PATIENTS` - View patient list and details
- `CREATE_PATIENT` - Create new patients
- `UPDATE_PATIENT` - Update patient information
- `DELETE_PATIENT` - Delete patients

### Appointments
- `VIEW_APPOINTMENTS` - View appointments
- `CREATE_APPOINTMENT` - Schedule appointments
- `UPDATE_APPOINTMENT` - Modify appointments
- `CANCEL_APPOINTMENT` - Cancel appointments

### Prescriptions
- `VIEW_PRESCRIPTIONS` - View prescriptions
- `CREATE_PRESCRIPTION` - Create prescriptions
- `UPDATE_PRESCRIPTION` - Modify prescriptions

### Lab Results
- `VIEW_LAB_RESULTS` - View lab results
- `CREATE_LAB_ORDER` - Create lab orders
- `UPDATE_LAB_RESULTS` - Update lab results

### Billing
- `VIEW_BILLING` - View billing information
- `CREATE_INVOICE` - Create invoices
- `PROCESS_PAYMENT` - Process payments

### User Management
- `VIEW_USER` - View users
- `CREATE_USER` - Create users
- `UPDATE_USER` - Update users
- `DEACTIVATE_USER` - Deactivate users

### System
- `VIEW_ANALYTICS` - View analytics
- `VIEW_SECURITY_LOGS` - View security logs
- `MANAGE_PERMISSIONS` - Manage permissions
- `MANAGE_SETTINGS` - Manage system settings

### Medical Records
- `VIEW_MEDICAL_RECORD` - View medical records
- `CREATE_MEDICAL_RECORD` - Create medical records
- `UPDATE_MEDICAL_RECORD` - Update medical records

## Usage Examples

### 1. Admin Workflow - Creating Permission Groups

```typescript
// 1. Create a "Doctor" permission group
const doctorGroup = await permissionService.createPermissionGroup({
  groupName: "Doctor",
  description: "Full access to patient care",
  organizationPermissionIds: [101, 102, 103, 104] // org permission IDs
});

// 2. Assign group to user
await permissionService.assignGroupsToUser("user123", {
  groupIds: [doctorGroup.id]
});
```

### 2. User Permission Check

```typescript
// Get user's effective permissions
const userPerms = await permissionService.getUserEffectivePermissions("user123");

// Check permissions
const canViewPatients = userPerms.effectivePermissions.includes('VIEW_PATIENTS');
const canCreatePrescriptions = userPerms.effectivePermissions.includes('CREATE_PRESCRIPTION');
```

### 3. Custom Permission Override

```typescript
// Grant additional permission to user
await permissionService.assignCustomPermissions("user123", {
  permissions: [
    { permissionId: 105, isGranted: true }  // Grant additional permission
  ]
});

// Revoke permission from user (even if they have it through groups)
await permissionService.assignCustomPermissions("user123", {
  permissions: [
    { permissionId: 102, isGranted: false }  // Revoke permission
  ]
});
```

## Permission Resolution

Effective permissions are calculated as:
```
EFFECTIVE_PERMISSIONS = 
  (Group Permissions) 
  + (Custom Granted Permissions) 
  - (Custom Revoked Permissions)
```

Example:
```javascript
// User assigned to "Doctor" group
Group Permissions: ["VIEW_PATIENTS", "CREATE_PRESCRIPTION", "VIEW_LAB_RESULTS"]

// Custom permissions added
Custom Granted: ["MANAGE_APPOINTMENTS"]
Custom Revoked: ["CREATE_PRESCRIPTION"]

// Final effective permissions
Effective: ["VIEW_PATIENTS", "VIEW_LAB_RESULTS", "MANAGE_APPOINTMENTS"]
```

## Security Considerations

1. **Always verify permissions on backend** - Frontend checks are for UX only
2. **Use organization_permission_id** when creating groups or assigning permissions
3. **Cache user permissions** after login and refresh on changes
4. **Audit all permission changes** for compliance and security
5. **Implement proper role hierarchy** to prevent privilege escalation

## Testing

Test permission functionality:

```typescript
// Test permission checks
expect(hasPermission(['VIEW_PATIENTS'], 'VIEW_PATIENTS')).toBe(true);
expect(hasAnyPermission(['VIEW_PATIENTS'], ['VIEW_PATIENTS', 'CREATE_PATIENT'])).toBe(true);
expect(hasAllPermissions(['VIEW_PATIENTS'], ['VIEW_PATIENTS', 'CREATE_PATIENT'])).toBe(false);

// Test permission resolution
const effective = resolveEffectivePermissions(
  ['VIEW_PATIENTS', 'CREATE_PRESCRIPTION'], // group permissions
  ['MANAGE_APPOINTMENTS'], // custom granted
  ['CREATE_PRESCRIPTION']  // custom revoked
);
expect(effective).toEqual(['VIEW_PATIENTS', 'MANAGE_APPOINTMENTS']);
```

## Troubleshooting

### Common Issues

1. **Permission not working**: Check if organization permission is enabled
2. **User can't access feature**: Verify effective permissions include required permission
3. **Group permissions not applying**: Ensure user is assigned to the group
4. **Custom permissions not working**: Check if permission is granted (not revoked)

### Debug Steps

1. Check user's effective permissions: `GET /api/permissions/users/{userId}`
2. Verify organization has the permission enabled
3. Check if permission group contains the required permissions
4. Review audit logs for recent permission changes

## Environment Variables

```env
PERMISSION_SERVICE_URL=http://localhost:8080
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## File Structure

```
frontend-machine/
├── app/
│   ├── [locale]/(dashboard)/permissions/
│   │   └── page.tsx                    # Main permissions page
│   └── api/permissions/
│       ├── catalog/route.ts            # Permission catalog API
│       ├── groups/route.ts             # Permission groups API
│       ├── organization/permissions/route.ts
│       └── users/[userId]/route.ts     # User permissions API
├── components/
│   ├── providers/
│   │   └── PermissionProvider.tsx      # Permission context
│   └── features/permissions/
│       ├── PermissionManagement.tsx    # Basic permission management
│       └── PermissionManagementEnhanced.tsx # Advanced management
└── lib/
    ├── services/permission.ts          # Permission service
    ├── hooks/usePermissions.ts         # Permission hooks
    └── constants/permissions.ts        # Permission constants
```