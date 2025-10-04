# next-intl Integration Guide

## Overview

The Healthcare Management System now supports internationalization (i18n) using **next-intl**. This implementation maintains the existing flow while adding multi-language support.

## Supported Languages

- **English (en)** - Default
- **Spanish (es)**
- **French (fr)**

## How It Works

### 1. Automatic Locale Detection

The middleware automatically detects and handles locale routing:
- Default: `/dashboard` → English
- Spanish: `/es/dashboard`
- French: `/fr/dashboard`

### 2. Translation Files

Located in `/messages/`:
- `en.json` - English translations
- `es.json` - Spanish translations
- `fr.json` - French translations

### 3. Using Translations in Components

```tsx
'use client';
import {useTranslations} from 'next-intl';

export function MyComponent() {
  const t = useTranslations('common');
  
  return <h1>{t('quickActions')}</h1>;
}
```

### 4. Language Switcher

Add the `<LanguageSwitcher />` component to any layout:

```tsx
import {LanguageSwitcher} from '@/components/LanguageSwitcher';

<LanguageSwitcher />
```

## Adding New Translations

### Step 1: Add to Translation Files

Edit `/messages/en.json`:
```json
{
  "common": {
    "newKey": "New Text"
  }
}
```

Edit `/messages/es.json`:
```json
{
  "common": {
    "newKey": "Nuevo Texto"
  }
}
```

Edit `/messages/fr.json`:
```json
{
  "common": {
    "newKey": "Nouveau Texte"
  }
}
```

### Step 2: Use in Component

```tsx
const t = useTranslations('common');
<span>{t('newKey')}</span>
```

## Adding New Languages

### 1. Create Translation File

Create `/messages/de.json` for German:
```json
{
  "common": {
    "quickActions": "Schnellaktionen",
    ...
  }
}
```

### 2. Update Middleware

Edit `middleware.ts`:
```ts
export default createMiddleware({
  locales: ['en', 'es', 'fr', 'de'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});
```

### 3. Update Language Switcher

Edit `components/LanguageSwitcher.tsx`:
```ts
const languages = [
  {code: 'en', name: 'English'},
  {code: 'es', name: 'Español'},
  {code: 'fr', name: 'Français'},
  {code: 'de', name: 'Deutsch'},
];
```

## Translation Namespaces

Organize translations by feature:

```json
{
  "common": { ... },
  "dashboard": { ... },
  "patients": { ... },
  "appointments": { ... }
}
```

Use in components:
```tsx
const t = useTranslations('dashboard');
```

## Best Practices

1. **Keep Keys Descriptive**: Use `addPatients` not `btn1`
2. **Group by Feature**: Use namespaces for organization
3. **Consistent Naming**: Use camelCase for keys
4. **Avoid Hardcoded Text**: Always use translation keys
5. **Test All Languages**: Verify UI doesn't break with longer text

## Server Components

For server components, use `getTranslations`:

```tsx
import {getTranslations} from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('common');
  
  return <h1>{t('title')}</h1>;
}
```

## Dynamic Values

Use interpolation for dynamic content:

```json
{
  "welcome": "Welcome, {name}!"
}
```

```tsx
t('welcome', {name: user.name})
```

## Pluralization

```json
{
  "patients": "{count, plural, =0 {No patients} =1 {1 patient} other {# patients}}"
}
```

```tsx
t('patients', {count: 5})
```

## Migration Strategy

### Priority Order:

**Phase 1 - Core Navigation (High Priority)**
1. Update menu items in PermissionStrategy
2. Translate all navigation labels
3. Update page titles and breadcrumbs

**Phase 2 - Common Components (Medium Priority)**
1. Dashboard widgets (Doctor, Patient, Nurse dashboards)
2. Common buttons and actions
3. Status badges and labels
4. Table headers

**Phase 3 - Feature Modules (Medium Priority)**
1. Patient Management module
2. Appointment System module
3. Prescription System module
4. Clinical Interface module
5. Financial Management module

**Phase 4 - Forms and Modals (Low Priority)**
1. All form labels and placeholders
2. Modal titles and content
3. Validation messages
4. Success/error messages

### How to Translate a Component:

1. **Add the import:**
```tsx
import {useTranslations} from 'next-intl';
```

2. **Get the translation function:**
```tsx
const t = useTranslations('common');
```

3. **Replace hardcoded text:**
```tsx
// Before
<button>Save</button>

// After
<button>{t('save')}</button>
```

4. **Add missing keys to translation files:**
If a key doesn't exist, add it to all three files:
- `/messages/en.json`
- `/messages/es.json`
- `/messages/fr.json`

## Current Implementation

✅ **Completed:**
- next-intl installed and configured
- Middleware setup with locale routing
- Translation files for en, es, fr (110+ keys)
- AdminDashboardWidgets component translated
- LoginForm component translated
- DashboardLayout header (Profile, Settings, Logout) translated
- LanguageSwitcher component in login and dashboard
- Root layout updated with NextIntlClientProvider

⚠️ **Partially Translated:**
- Only 3 components are currently using translations
- Most components still have hardcoded English text
- Menu items from PermissionStrategy are not translated

🔄 **To Translate (Manual Work Required):**
- Other dashboard widgets (DoctorDashboardWidgets, PatientDashboardWidgets)
- Patient management components (PatientManagement, PatientList, PatientSearch)
- Appointment system (AppointmentSystem, AppointmentFormModal)
- Clinical interface (ClinicalInterface)
- Financial management (FinancialManagement, BillingFormModal)
- Prescription system (PrescriptionSystem, PrescriptionFormModal)
- All forms and modals
- Navigation menu items
- Table headers and data
- Error messages and alerts
- Status badges and labels

## Testing

### Currently Translated Pages:
1. **Login Page** (`/[locale]/login`) - ✅ Fully translated
2. **Dashboard Header** - ✅ Profile, Settings, Logout translated
3. **Admin Dashboard Widgets** - ✅ Fully translated

### Test Language Switching:
1. Start dev server: `npm run dev`
2. Visit `http://localhost:3000/en/login`
3. Use LanguageSwitcher (globe icon) to change language
4. Verify URL changes to `/es/login` or `/fr/login`
5. Check that translated text updates
6. Login and check dashboard header translations

### Known Limitations:
- Most components still show English text regardless of locale
- Menu items are not translated (hardcoded in PermissionStrategy)
- Table data and dynamic content not translated
- Form validation messages not translated
- Each component needs manual update to use `useTranslations()`

## Troubleshooting

**Issue**: Translations not appearing
- Check translation key exists in all language files
- Verify namespace matches in `useTranslations()`
- Ensure component is wrapped in NextIntlClientProvider

**Issue**: Locale not switching
- Check middleware configuration
- Verify locale in URL path
- Clear browser cache

**Issue**: Build errors
- Ensure all translation files have matching keys
- Check for syntax errors in JSON files
- Verify i18n.ts configuration

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/)
