# Branding Configuration Guide

## Overview
The system uses `config/branding.json` for domain-specific branding and text customization.

## Configuration File
Location: `config/branding.json`

## Branding Fields

```json
{
  "hospital": {
    "systemName": "City General Hospital",
    "systemShortName": "CGH",
    "tagline": "Comprehensive Healthcare Excellence",
    "loginTitle": "Hospital Management System",
    "loginSubtitle": "Sign in to access patient care",
    "welcomeMessage": "Welcome to City General Hospital",
    "welcomeDescription": "Comprehensive patient care with advanced medical technology",
    "organizationId": "hospital_org1"
  },
  "clinic": {
    "systemName": "Pediatric Care Clinic",
    "systemShortName": "PCC",
    "tagline": "Caring for Children's Health",
    "loginTitle": "Clinic Management System",
    "loginSubtitle": "Sign in to your account",
    "welcomeMessage": "Welcome to Pediatric Care Clinic",
    "welcomeDescription": "Specialized pediatric care for your little ones",
    "organizationId": "hospital_org2"
  }
}
```

## Usage

### In Components
```typescript
import { getBranding } from "@/lib/runtimeConfig";

const branding = getBranding();
console.log(branding.systemName); // "City General Hospital" or "Pediatric Care Clinic"
```

### Automatic Detection
- `hospital.localhost:3000` → Hospital branding
- `clinic.localhost:3000` → Clinic branding
- `localhost:3000` → Based on selected config

## Where Branding is Used

1. **Login Page** (`LoginForm.tsx`)
   - System name in header
   - Login subtitle
   - Welcome message
   - Welcome description

2. **Dashboard Layout** (`DashboardLayout.tsx`)
   - Header system name
   - Header tagline
   - Mobile menu header

## Adding New Branding Fields

1. Add field to `config/branding.json`:
```json
{
  "hospital": {
    "newField": "Hospital Value"
  },
  "clinic": {
    "newField": "Clinic Value"
  }
}
```

2. Use in component:
```typescript
const branding = getBranding();
<h1>{branding.newField}</h1>
```

## Production Setup

For production domains, update `lib/runtimeConfig.ts`:

```typescript
const domainConfig: Record<string, HospitalType> = {
  'clinic.yourdomain.com': 'clinic',
  'hospital.yourdomain.com': 'hospital',
};
```

Then add production branding to `config/branding.json` if needed.
