# API Integration Setup

This document explains how to set up and use the real API integration for the Healthcare Management System.

## 🚀 Quick Start

### 1. Environment Setup

Copy the environment variables:
```bash
cp .env.example .env.local
```

Update `.env.local` with your API configuration:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### 2. Start Backend Server

```bash
# Make the script executable (if not already)
chmod +x start-backend.sh

# Run the backend startup script
./start-backend.sh
```

### 3. Start Frontend

```bash
npm install --legacy-peer-deps
npm run dev
```

## 🔧 API Services

The application now uses real API services instead of mock data:

### Authentication Service (`lib/services/auth.ts`)
- `login()` - Authenticate with JWT tokens
- `logout()` - Secure logout
- `refreshToken()` - Token refresh
- `changePassword()` - Password management

### Patient Service (`lib/services/patient.ts`)
- `getPatients()` - Fetch all patients
- `getPatient(id)` - Get specific patient
- `searchPatients(name)` - Search functionality
- `createPatient()` - Add new patients
- `updatePatient()` - Update patient data
- `deletePatient()` - Remove patients
- `getPatientPrescriptions()` - Patient prescriptions
- `getPatientLabResults()` - Lab results

### Appointment Service (`lib/services/appointment.ts`)
- `getAppointments()` - Fetch appointments
- `createAppointment()` - Schedule new appointments
- `updateAppointment()` - Modify appointments

### Dashboard Service (`lib/services/dashboard.ts`)
- `getDashboardStats()` - Main dashboard metrics
- `getPatientStats()` - Patient analytics
- `getAppointmentStats()` - Appointment metrics
- `getFinancialStats()` - Financial data

## 🔐 Authentication

### Login Process
1. User enters credentials + organization ID
2. Frontend calls `/auth/login` API
3. Backend returns JWT token + user info
4. Token stored in localStorage
5. Token included in all subsequent API calls

### Test Credentials

**City General Hospital (hospital_org1):**
- Admin: `admin@hospital.com` / `admin123`
- Doctor: `dr.smith@hospital.com` / `admin123`
- Patient: `alice.brown@email.com` / `admin123`

**Pediatric Care Clinic (hospital_org2):**
- Admin: `admin@pedcare.com` / `admin123`
- Doctor: `dr.williams@pedcare.com` / `admin123`
- Patient: `tommy.johnson@email.com` / `admin123`

## 📊 Components Updated

### AuthContext (`components/AuthContext.tsx`)
- ✅ Removed mock user data
- ✅ Integrated real authentication API
- ✅ JWT token management
- ✅ Automatic logout on 401 errors

### PatientManagement (`components/PatientManagement.tsx`)
- ✅ Real patient data from API
- ✅ Search functionality
- ✅ Loading states
- ✅ Error handling

### AppointmentSystem (`components/AppointmentSystem.tsx`)
- ✅ Real appointment data
- ✅ API integration
- ✅ Loading states

### DashboardStats (`components/DashboardStats.tsx`)
- ✅ New component for real dashboard metrics
- ✅ Loading animations
- ✅ Error handling

## 🛠️ API Utilities

### Base API Service (`lib/api.ts`)
- Centralized HTTP client
- Automatic JWT token handling
- Error handling and 401 redirects
- Response parsing

### React Hook (`lib/hooks/useApi.ts`)
- Loading states
- Error handling
- Data management
- Reusable across components

## 🔄 Data Flow

```
Frontend Component
    ↓
useApi Hook
    ↓
Service Layer (auth.ts, patient.ts, etc.)
    ↓
Base API Service (api.ts)
    ↓
Backend API (localhost:8080)
```

## 🚨 Error Handling

### Automatic Handling
- **401 Unauthorized**: Automatic logout and redirect to login
- **Network Errors**: User-friendly error messages
- **Loading States**: Skeleton loaders and spinners

### Manual Handling
```typescript
const { execute, loading, error } = useApi();

const handleAction = async () => {
  try {
    await execute(() => patientService.getPatients());
  } catch (err) {
    // Handle specific errors
    console.error('Failed to fetch patients:', err);
  }
};
```

## 🔧 Development

### Adding New API Endpoints

1. **Add to service class:**
```typescript
// lib/services/patient.ts
async getPatientHistory(id: string): Promise<History[]> {
  return apiService.get<History[]>(`/patients/${id}/history`);
}
```

2. **Use in component:**
```typescript
const { execute: fetchHistory } = useApi<History[]>();

useEffect(() => {
  fetchHistory(() => patientService.getPatientHistory(patientId));
}, [patientId]);
```

### Environment Variables
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- Add new variables to `.env.local` and `.env.example`

## 🧪 Testing API Integration

### Test Authentication
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"admin123","organizationId":"hospital_org1"}'
```

### Test with Token
```bash
# Use token from login response
curl -X GET http://localhost:8080/api/patients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Swagger UI
Visit `http://localhost:8080/swagger-ui/index.html` for interactive API documentation.

## 🚀 Production Deployment

### Environment Variables
Set these in your production environment:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
```

### Security Considerations
- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- HTTPS required for production
- CORS configuration on backend
- Rate limiting and security headers

## 📝 Migration Notes

### Removed Mock Data
- `mockUsers` array in AuthContext
- `mockPatients` array in PatientManagement
- `mockAppointments` array in AppointmentSystem
- Static dashboard stats

### Added Real API Integration
- JWT authentication flow
- Dynamic data loading
- Error handling and loading states
- Automatic token refresh (ready for implementation)

## 🔍 Troubleshooting

### Common Issues

**Backend not running:**
```bash
# Check if backend is accessible
curl http://localhost:8080/api/health
```

**CORS errors:**
- Ensure backend allows frontend origin
- Check CORS configuration

**Authentication failures:**
- Verify credentials match backend data
- Check organization ID is correct
- Ensure backend is seeded with test data

**Network errors:**
- Check API base URL in environment variables
- Verify backend server is running
- Check browser network tab for detailed errors

### Debug Mode
Enable debug logging by adding to your component:
```typescript
console.log('API Response:', data);
console.log('Loading:', loading);
console.log('Error:', error);
```

## 📚 Next Steps

1. **Implement remaining endpoints** (prescriptions, lab results, etc.)
2. **Add real-time updates** with WebSockets
3. **Implement caching** for better performance
4. **Add offline support** with service workers
5. **Enhanced error handling** with retry logic
6. **Add unit tests** for API services
7. **Implement token refresh** mechanism
8. **Add request/response interceptors** for logging

---

The healthcare management system now uses real API integration instead of mock data, providing a production-ready foundation for healthcare applications.