# Domain-Based Configuration Setup

## Localhost Development

### Option 1: Using hosts file (Recommended)
Add to `/etc/hosts` (Mac/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1 clinic.localhost
127.0.0.1 hospital.localhost  
127.0.0.1 enterprise.localhost
```

Then access:
- `http://clinic.localhost:3000` - Small clinic config
- `http://hospital.localhost:3000` - Standard hospital config
- `http://enterprise.localhost:3000` - Big hospital config

### Option 2: Using ConfigSwitcher
The ConfigSwitcher component appears only on localhost for development testing.

## Production Domains

Update `lib/runtimeConfig.ts` with your domains:

```typescript
const domainConfig: Record<string, HospitalType> = {
  'smallclinic.com': 'clinic',
  'cityhospital.com': 'hospital', 
  'metrohealthsystem.com': 'big-hospital',
};
```

## Priority Order

1. **localStorage override** (development only)
2. **Domain mapping** (production)
3. **Default fallback** (hospital)

## Testing

```bash
# Test different configurations
npm run dev

# Visit different URLs:
# http://localhost:3000 (shows ConfigSwitcher)
# http://clinic.localhost:3000 (auto clinic config)
# http://enterprise.localhost:3000 (auto big hospital config)
```