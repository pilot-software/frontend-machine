# Healthcare Management System

A comprehensive healthcare management platform built with **Next.js 15**, **Tailwind CSS v4**, and **TypeScript**,
featuring role-based access control and complete patient management workflows.

## 🏥 Features

### Authentication & Security

- **Role-based Access Control** for 5 user types:
    - **Admin**: Full system access and user management
    - **Doctor**: Patient records, appointments, prescriptions, clinical data
    - **Nurse**: Patient care, vital signs, limited prescription access
    - **Patient**: Own records, appointments, limited data access
    - **Finance**: Billing, insurance, payment processing
- **Session Management** with automatic logout
- **Security Activity Logging** with audit trail
- **Password Recovery** functionality

### Patient Management

- **Comprehensive Patient Records** with medical history
- **Visit History** with detailed medical data categorization
- **Patient Overview** with clickable visit functionality
- **Medical Conditions** tracking and management
- **Vital Signs** monitoring and recording

### Clinical Interface

- **Appointment System** with priority levels and status tracking
- **Prescription Management** with medication tracking
- **Lab Results** integration and viewing
- **Clinical Workflow** optimization for healthcare providers

### Financial Management

- **Billing System** with payment processing
- **Insurance Management** and claims processing
- **Financial Reporting** and analytics

## 🚨 QUICK START WITH REAL API

**NEW: Real API Integration Available!**

```bash
# 1. Setup environment
cp .env.example .env.local

# 2. Start backend server (see API-INTEGRATION.md)
./start-backend.sh

# 3. Install dependencies
npm install --legacy-peer-deps

# 4. Start frontend
npm run dev
```

**For mock data only (legacy):**

```bash
npm install --legacy-peer-deps
npm run dev
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 20.10.0+** (Current: v20.19.4 recommended)
- **npm 10.8.2+**

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Open browser
http://localhost:3000
```

### Test Credentials

**With Real API (Recommended):**

```bash
# City General Hospital (hospital_org1)
Admin:    admin@hospital.com     / admin123
Doctor:   dr.smith@hospital.com  / admin123
Patient:  alice.brown@email.com  / admin123

# Pediatric Care Clinic (hospital_org2)  
Admin:    admin@pedcare.com      / admin123
Doctor:   dr.williams@pedcare.com / admin123
Patient:  tommy.johnson@email.com / admin123
```

**Legacy Mock Data:**

```bash
Admin:    admin@hospital.com    / admin123
Doctor:   doctor@hospital.com   / doctor123  
Nurse:    nurse@hospital.com    / nurse123
Patient:  patient@example.com   / patient123
Finance:  finance@hospital.com  / finance123
```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 Beta
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Forms**: React Hook Form + Zod validation
- **TypeScript**: 5.6.3 for type safety
- **Charts**: Recharts for data visualization

### Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Tailwind CSS v4 + Healthcare theme
│   ├── layout.tsx         # Root layout with Inter font
│   └── page.tsx           # Main application entry point
├── components/            # Healthcare-specific components
│   ├── ui/               # Shadcn/ui components (50+ components)
│   ├── AuthContext.tsx   # Authentication state management
│   ├── DashboardLayout.tsx # Main app layout
│   ├── PatientManagement.tsx
│   ├── AppointmentSystem.tsx
│   ├── ClinicalInterface.tsx
│   ├── PrescriptionSystem.tsx
│   └── FinancialManagement.tsx
├── lib/                   # Utility functions
└── Guidelines.md         # Healthcare development guidelines
```

## 🔌 API Integration

**NEW: Real Backend API Support**

- **JWT Authentication** with organization-based access
- **RESTful APIs** for all healthcare data
- **Real-time Data** instead of mock data
- **Error Handling** with automatic token refresh
- **Loading States** and user feedback
- **Production Ready** API architecture

See [API-INTEGRATION.md](./API-INTEGRATION.md) for complete setup guide.

### API Services

- **Authentication**: Login, logout, token management
- **Patient Management**: CRUD operations, search, medical records
- **Appointments**: Scheduling, updates, calendar integration
- **Dashboard Analytics**: Real-time statistics and metrics
- **Prescriptions**: Medication management (ready for integration)
- **Lab Results**: Test results and reports (ready for integration)

## 🎨 Design System

### Healthcare Theme

- **Primary Color**: #030213 (Healthcare Blue)
- **Base Font Size**: 14px (optimized for medical interfaces)
- **Typography**: Inter font family with healthcare-optimized spacing
- **Color System**: OKLCH color space with dark mode support
- **Component Sizing**: 3:1.2 aspect ratio for patient forms

### Accessibility

- **ARIA Labels** for screen readers
- **Keyboard Navigation** support
- **High Contrast** color ratios
- **Focus Management** for clinical workflows

## 📊 Database Schema

The system includes **12 core tables**:

- `users` - Authentication and role management
- `patients` - Patient demographic and contact information
- `appointments` - Scheduling with priority levels
- `visits` - Clinical encounters and medical data
- `medical_conditions` - Diagnosis and condition tracking
- `prescriptions` - Medication management
- `vitals` - Vital signs monitoring
- `lab_results` - Laboratory test results
- `billing` - Financial transactions
- `insurance` - Insurance coverage and claims
- `security_logs` - Audit trail and security events
- `user_sessions` - Session management and tracking

## 🔧 Development

### Available Scripts

```bash
npm run dev     # Development server with Turbopack
npm run build   # Production build
npm run start   # Production server  
npm run lint    # ESLint checking
npm run type-check # TypeScript validation
```

### Development Guidelines

- **Follow Healthcare Guidelines**: See `Guidelines.md` for medical data handling
- **Component Architecture**: Use Shadcn/ui as foundation
- **Role-based Development**: Maintain access control patterns
- **Medical Terminology**: Use proper healthcare terminology
- **HIPAA Compliance**: Follow established data protection patterns

### Code Quality

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Next.js recommended configuration
- **Component Testing**: Test role-based access and medical workflows
- **Responsive Design**: Mobile-first approach for healthcare workflows

## 🚀 Production Deployment

### Build Optimization

```bash
# Clean build
npm run clean
npm run build

# Start production server
npm run start
```

### Environment Variables

Set up the following for production:

- Database connection strings
- Authentication secrets
- External API keys (if applicable)
- Session encryption keys

## 📚 Documentation

- **Guidelines.md** - Complete development guidelines
- **database-schema.md** - Database structure documentation
- **Component Documentation** - Inline TypeScript documentation

## 🔒 Security & Compliance

- **Role-based Access Control** prevents unauthorized data access
- **Session Security** with automatic timeout
- **Audit Logging** for all medical data access
- **Data Encryption** for sensitive patient information
- **HIPAA-compliant** data handling patterns

## 🎯 Key Features

- ✅ **Next.js 15** with App Router and Turbopack
- ✅ **Tailwind CSS v4** Beta with healthcare color system
- ✅ **50+ Shadcn/ui Components** with medical optimizations
- ✅ **Role-based Authentication** for 5 user types
- ✅ **Comprehensive Patient Management** with visit history
- ✅ **Clinical Workflow Integration** for healthcare providers
- ✅ **Financial Management** with billing and insurance
- ✅ **Responsive Design** optimized for medical workflows
- ✅ **TypeScript** for type-safe medical data handling
- ✅ **Security Logging** and audit trails

---

**Built for healthcare professionals by healthcare-focused developers** 🏥

*This system provides a foundation for healthcare management with proper role-based access control, comprehensive
patient records, and clinical workflow optimization.*
