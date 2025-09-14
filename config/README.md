# Healthcare System Configuration

This system supports customizable features and text for different types of healthcare facilities.

## Hospital Types

### Small Clinic
- **Features**: Basic patient management, appointments, prescriptions
- **Roles**: Admin, Doctor, Patient only
- **UI**: Simplified interface with minimal features

### Hospital
- **Features**: Full patient management with most clinical features
- **Roles**: All roles available
- **UI**: Standard healthcare interface

### Big Hospital
- **Features**: Enterprise-level features with advanced analytics
- **Roles**: All roles with enhanced permissions
- **UI**: Advanced interface with comprehensive features

## Configuration Files

### TypeScript Configuration
- `features.ts` - Feature flag definitions
- `text-configs.ts` - Text customization for each hospital type
- `index.ts` - Main configuration loader

### JSON Examples
- `examples/small-clinic.json` - Small clinic configuration
- `examples/big-hospital.json` - Big hospital configuration

## Usage

### Environment Variable
Set `NEXT_PUBLIC_HOSPITAL_TYPE` to `clinic`, `hospital`, or `big-hospital`

### Runtime Switching
Use the ConfigSwitcher component or localStorage:
```javascript
localStorage.setItem('hospitalType', 'clinic');
```

### Custom Configuration
Create your own JSON configuration file and load it:
```javascript
import { loadConfigFromFile } from '../lib/configLoader';
const config = await loadConfigFromFile('/path/to/config.json');
```

## Feature Flags

### Core Features
- `patientManagement` - Patient records and management
- `appointmentSystem` - Appointment scheduling
- `clinicalInterface` - Clinical notes and records
- `prescriptionSystem` - Medication management
- `financialManagement` - Billing and payments

### Advanced Features
- `labResults` - Laboratory test results
- `vitalsTracking` - Vital signs monitoring
- `wardManagement` - Hospital ward management
- `insuranceManagement` - Insurance processing
- `securityLogs` - Security audit trails
- `analytics` - Business intelligence
- `reports` - Clinical and financial reports

### UI Features
- `notifications` - System notifications
- `twoFactorAuth` - Two-factor authentication
- `darkMode` - Dark mode support
- `mobileApp` - Mobile application features

## Text Customization

All text elements can be customized:
- System name and description
- Role names
- Navigation labels
- Button text
- Messages and notifications

## Adding New Hospital Types

1. Create configuration in `text-configs.ts`
2. Add feature configuration in `features.ts`
3. Update the `configs` object in `index.ts`
4. Add to ConfigSwitcher component options