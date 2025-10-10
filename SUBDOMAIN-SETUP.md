# Subdomain Setup Guide

## Overview
The application now supports subdomain-based hospital routing. Each subdomain automatically selects the correct hospital organization without requiring manual configuration.

## Subdomain Configuration

### Available Subdomains

1. **hospital.localhost:3000**
   - Organization: `hospital_org1` (City General Hospital)
   - Auto-configured as "Hospital" type
   - No configuration selector shown

2. **clinic.localhost:3000**
   - Organization: `hospital_org2` (Pediatric Care Clinic)
   - Auto-configured as "Clinic" type
   - No configuration selector shown

3. **localhost:3000**
   - Shows configuration selector
   - Manual selection between Hospital and Clinic
   - Legacy behavior maintained

## Setup Instructions

### 1. Configure /etc/hosts (macOS/Linux)

```bash
sudo nano /etc/hosts
```

Add these lines:
```
127.0.0.1 hospital.localhost
127.0.0.1 clinic.localhost
```

Save and exit (Ctrl+X, Y, Enter)

### 2. Start Development Server

```bash
npm run dev
```

### 3. Access Different Hospitals

- **Hospital**: http://hospital.localhost:3000
- **Clinic**: http://clinic.localhost:3000
- **Config Selector**: http://localhost:3000

## Test Credentials

### Hospital (hospital.localhost:3000)
```
Admin:    admin@hospital.com     / admin123
Doctor:   dr.johnson@hospital.com / admin123
Patient:  alice.brown@email.com  / admin123
```

### Clinic (clinic.localhost:3000)
```
Admin:    admin@pedcare.com      / admin123
Doctor:   dr.williams@pedcare.com / admin123
Patient:  tommy.johnson@email.com / admin123
```

## How It Works

1. **Middleware Detection**: `middleware.ts` detects the subdomain and sets headers
2. **Runtime Config**: `lib/runtimeConfig.ts` reads subdomain and returns appropriate config
3. **Auto Organization**: Login form automatically uses the correct `organizationId`
4. **Hidden Selector**: Configuration selector is hidden on subdomains

## Production Setup

For production domains, update `lib/runtimeConfig.ts`:

```typescript
const domainConfig: Record<string, HospitalType> = {
  'clinic.localhost:3000': 'clinic',
  'hospital.localhost:3000': 'hospital',
  // Add production domains
  'clinic.yourdomain.com': 'clinic',
  'hospital.yourdomain.com': 'hospital',
};
```

## Benefits

- ✅ No manual configuration selection needed
- ✅ Direct URLs for each hospital
- ✅ Cleaner user experience
- ✅ Easier to share specific hospital links
- ✅ Maintains backward compatibility with localhost
