# Component Migration Guide

## ✅ Reorganization Complete!

Your components have been reorganized into an industry-standard structure.

## 📁 New Structure

```
components/
├── features/              # Feature-specific components
│   ├── auth/             # Authentication
│   │   ├── LoginForm.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── TwoFactorAuth.tsx
│   │   └── index.ts
│   ├── patients/         # Patient management
│   │   ├── PatientManagement.tsx
│   │   ├── PatientFormModal.tsx
│   │   ├── PatientListWithBranches.tsx
│   │   ├── PatientList.tsx
│   │   ├── PatientSearch.tsx
│   │   ├── PatientStats.tsx
│   │   ├── PatientTable.tsx
│   │   └── index.ts
│   ├── appointments/     # Appointment system
│   │   ├── AppointmentSystem.tsx
│   │   ├── AppointmentFormModal.tsx
│   │   ├── AppointmentSystemEnhanced.tsx
│   │   └── index.ts
│   ├── prescriptions/    # Prescription management
│   │   ├── PrescriptionSystem.tsx
│   │   └── PrescriptionFormModal.tsx
│   ├── clinical/         # Clinical interface
│   │   ├── ClinicalInterface.tsx
│   │   └── ClinicalInterfaceEnhanced.tsx
│   ├── financial/        # Financial management
│   │   ├── FinancialManagement.tsx
│   │   └── BillingFormModal.tsx
│   └── dashboard/        # Dashboard components
│       ├── DashboardLayout.tsx
│       ├── DashboardStats.tsx
│       ├── DashboardWidgets.tsx
│       ├── HealthcareDashboard.tsx
│       ├── RoleDashboards.tsx
│       ├── AdminDashboardWidgets.tsx
│       ├── DoctorDashboardWidgets.tsx
│       ├── PatientDashboardWidgets.tsx
│       ├── DashboardSearch.tsx
│       ├── DashboardTabs.tsx
│       ├── DoctorFormModal.tsx
│       ├── DoctorTable.tsx
│       └── index.ts
├── shared/               # Reusable components
│   ├── navigation/       # Navigation components
│   │   ├── BranchSelector.tsx
│   │   ├── BranchBadge.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── FilterDropdown.tsx
│   ├── notifications/    # Notification components
│   │   └── NotificationDropdown.tsx
│   ├── guards/          # Route guards
│   │   ├── AuthGuard.tsx
│   │   ├── PermissionGuard.tsx
│   │   └── index.ts
│   └── utils/           # Utility components
│       ├── SessionManager.tsx
│       ├── SecurityLog.tsx
│       ├── QRScanner.tsx
│       ├── ErrorBoundary.tsx
│       └── FormExamples.tsx
├── providers/           # Context providers
│   ├── AuthContext.tsx
│   ├── BranchContext.tsx
│   ├── ThemeProvider.tsx
│   ├── Providers.tsx
│   ├── StoreProvider.tsx
│   └── index.ts
├── ui/                  # Shadcn UI components (unchanged)
├── skeletons/          # Loading skeletons (unchanged)
├── permissions/        # Permission utilities (unchanged)
└── figma/             # Figma components (unchanged)
```

## 🔄 How to Update Imports

### Old Import Style ❌
```tsx
import DashboardLayout from '@/components/DashboardLayout';
import LoginForm from '@/components/LoginForm';
import PatientManagement from '@/components/PatientManagement';
```

### New Import Style ✅

**Option 1: Direct imports**
```tsx
import DashboardLayout from '@/components/features/dashboard/DashboardLayout';
import LoginForm from '@/components/features/auth/LoginForm';
import PatientManagement from '@/components/features/patients/PatientManagement';
```

**Option 2: Barrel imports (Recommended)**
```tsx
import { DashboardLayout } from '@/components/features/dashboard';
import { LoginForm } from '@/components/features/auth';
import { PatientManagement } from '@/components/features/patients';
```

**Option 3: Provider imports**
```tsx
import { AuthProvider, useAuth } from '@/components/providers';
import { AuthGuard } from '@/components/shared/guards';
```

## 🔍 Find & Replace Guide

Use your IDE's find and replace (Cmd/Ctrl + Shift + F) to update imports:

### Dashboard Components
```
Find:    from '@/components/DashboardLayout'
Replace: from '@/components/features/dashboard/DashboardLayout'
```

### Auth Components
```
Find:    from '@/components/LoginForm'
Replace: from '@/components/features/auth/LoginForm'

Find:    from '@/components/ForgotPassword'
Replace: from '@/components/features/auth/ForgotPassword'
```

### Patient Components
```
Find:    from '@/components/PatientManagement'
Replace: from '@/components/features/patients/PatientManagement'

Find:    from '@/components/PatientFormModal'
Replace: from '@/components/features/patients/PatientFormModal'
```

### Appointment Components
```
Find:    from '@/components/AppointmentSystem'
Replace: from '@/components/features/appointments/AppointmentSystem'
```

### Providers
```
Find:    from '@/components/AuthContext'
Replace: from '@/components/providers/AuthContext'

Find:    from '@/components/BranchContext'
Replace: from '@/components/providers/BranchContext'
```

### Guards
```
Find:    from '@/components/AuthGuard'
Replace: from '@/components/shared/guards/AuthGuard'

Find:    from '@/components/PermissionGuard'
Replace: from '@/components/shared/guards/PermissionGuard'
```

### Navigation
```
Find:    from '@/components/BranchSelector'
Replace: from '@/components/shared/navigation/BranchSelector'

Find:    from '@/components/NotificationDropdown'
Replace: from '@/components/shared/notifications/NotificationDropdown'
```

## 🎯 Benefits

✅ **Clear organization** - Find components in seconds
✅ **Feature isolation** - Each feature has its own folder
✅ **Better scalability** - Easy to add new features
✅ **Team collaboration** - Clear ownership boundaries
✅ **Reduced confusion** - No more 50+ files in one folder

## 📝 Next Steps

1. **Update imports** in your app files using find & replace
2. **Test the application** to ensure everything works
3. **Update documentation** if needed
4. **Commit changes** with a clear message

## 🚀 Quick Test

Run your dev server to check for import errors:
```bash
npm run dev
```

If you see import errors, use the find & replace guide above to fix them.
