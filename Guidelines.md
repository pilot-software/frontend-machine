# Healthcare Management System - Development Guidelines

## System Architecture

### Authentication & Security

* Maintain role-based access control for all features (Admin, Doctor, Nurse, Patient, Finance)
* Preserve existing authentication flow and user roles
* Keep existing test credentials working
* Follow established session management patterns
* Maintain security logging functionality
* Never expose sensitive patient data without proper authorization

### Database & Data Management

* Use the established database schema (12 tables: users, patients, appointments, visits, medical_conditions,
  prescriptions, vitals, lab_results, billing, insurance, security_logs, user_sessions)
* Maintain existing patient management with comprehensive medical records
* Preserve visit history categorization and medical data structure
* Keep appointment system with priority levels and status tracking
* Maintain prescription system with medication tracking
* Follow HIPAA-compliant data handling patterns

## Design System

### Typography

* Base font-size: 14px (defined in CSS variables)
* Font family: Inter (Google Fonts) with system fallbacks
* Headings: Medium weight (500) - **Do not override with Tailwind font classes**
* Body text: Normal weight (400) - **Do not override with Tailwind font classes**
* Line height: 1.5 for all text elements
* **IMPORTANT: Do not use Tailwind font size, weight, or line-height classes unless specifically requested**

### Color System

* Primary: #030213 (dark healthcare blue)
* Secondary: Light gray variants for neutral elements
* Destructive: #d4183d (red for critical actions)
* Success: Use chart colors for positive actions
* Follow the established color tokens from styles/globals.css
* Maintain dark mode support with OKLCH color space
* Use semantic color names (primary, secondary, destructive) rather than specific colors

### Layout Guidelines

* Use responsive layouts with flexbox and grid by default
* Avoid absolute positioning unless necessary for overlays/modals
* Maintain the established sidebar navigation pattern
* Keep modal sizes consistent (3:1.2 aspect ratio for patient forms)
* Optimize for both desktop and mobile healthcare workflows

## Component Guidelines

### Component Architecture

* Import UI components from `./components/ui/`
* Use Shadcn/ui components as the foundation
* Maintain existing component structure:
    - AuthContext for authentication state
    - DashboardLayout for main app structure
    - RoleDashboards for role-specific content
    - SessionManager for session handling
* Keep components modular and reusable
* Use TypeScript for all components with proper typing

### Forms and Modals

* Patient forms should maintain 3:1.2 aspect ratio for consistency
* Use React Hook Form with Zod validation for all forms
* Maintain existing form field structures for medical data
* Keep comprehensive validation for medical records
* Use established modal patterns for patient, appointment, and prescription management

### Data Tables and Lists

* Maintain existing table structures for patient lists, appointments, etc.
* Use consistent sorting and filtering patterns
* Keep established pagination patterns
* Maintain role-based data access restrictions in table views

## Medical Data Guidelines

### Patient Information

* Maintain comprehensive patient records structure
* Keep established medical history categorization
* Preserve visit history with detailed medical data
* Maintain proper date formatting for medical records
* Keep established vital signs tracking patterns

### Clinical Interface

* Preserve existing clinical workflow patterns
* Maintain medical condition tracking
* Keep established prescription management
* Preserve lab results integration patterns
* Maintain proper medical terminology usage

### Role-Based Access

* Admin: Full system access and user management
* Doctor: Patient records, appointments, prescriptions, clinical data
* Nurse: Patient care, vital signs, limited prescription access
* Patient: Own records, appointments, limited data access
* Finance: Billing, insurance, payment processing

## Healthcare Data Standards

### Medical Terminology

* Use ICD-10 codes for diagnoses and conditions
* Use CPT codes for procedures and services
* Maintain consistent medication naming (generic names preferred)
* Follow standard vital signs ranges and units
* Use proper medical abbreviations and terminology

### Date and Time Formats

* Medical dates: MM/DD/YYYY format for US healthcare
* Time: 12-hour format with AM/PM for appointments
* Duration: Use minutes for appointments, days for prescriptions
* Age calculation: Based on current date minus birth date

### Clinical Workflow Patterns

* Appointment → Visit → Clinical Documentation
* Visit → Vitals → Assessment → Plan → Prescriptions
* Lab Orders → Collection → Results → Interpretation
* Billing → Insurance → Payment → Collections

## Data Validation Rules

### Patient Data

* Date of birth must be in the past
* Age must be calculated correctly from birth date
* Emergency contact information is required
* Blood type must be valid ABO/Rh combination

### Appointment Data

* Cannot schedule appointments in the past
* Duration must be realistic (15-240 minutes)
* Priority levels must match urgency
* Status transitions must follow logical workflow

### Clinical Data

* Vital signs must be within realistic ranges
* Prescription dosages must be validated
* Lab results must include reference ranges
* Medical conditions require ICD-10 codes

### Financial Data

* Billing amounts must be positive
* Payment amounts cannot exceed charges
* Insurance deductibles must be realistic
* Invoice numbers must be unique

## Security Requirements

### Data Protection

* All patient data access must be logged
* Session tokens must expire within 24 hours
* Password requirements: minimum 8 characters
* Two-factor authentication for administrative access

### HIPAA Compliance

* Minimum necessary rule for data access
* Audit trails for all patient data access
* Secure data transmission (HTTPS)
* Regular security risk assessments

### Role-Based Security

* Admin: Can manage all users and system settings
* Doctor: Can access assigned patients only
* Nurse: Limited to clinical care functions
* Patient: Can only access own records
* Finance: Limited to billing and insurance data

## File Structure

* Keep components in `./components/` directory
* UI components in `./components/ui/` (Shadcn/ui only)
* Utility functions in `./lib/`
* Main CSS in `./styles/globals.css`
* Database documentation in root directory

## Performance Guidelines

### Database Queries

* Use indexes for common search patterns
* Implement pagination for large result sets
* Cache frequently accessed patient data
* Optimize appointment scheduling queries

### UI Performance

* Lazy load patient charts and images
* Implement virtual scrolling for large lists
* Use debounced search for patient lookup
* Minimize re-renders in clinical forms

## Testing Requirements

### Unit Testing

* Test role-based access control
* Validate medical data calculations
* Test form validation rules
* Verify security logging

### Integration Testing

* Test complete clinical workflows
* Verify appointment scheduling
* Test billing and payment processing
* Validate insurance claim processing

## Do Not Change

* Existing authentication flow and user roles
* Database schema structure and relationships
* Component functionality and behavior patterns
* Test credentials and login system
* Established UI patterns and layouts
* Role-based access control logic
* Medical data structures and categorization
* Base typography sizing (14px root)
* Color token system and variables
* Border radius and spacing systems

## Component Styling Override

Some of the base components may have styling (eg. gap/typography) baked in as defaults.
Make sure you explicitly set any styling information from these guidelines in the generated React code to override the
defaults.

## Test Credentials

* Admin: admin@hospital.com / admin123
* Doctor: doctor@hospital.com / doctor123
* Nurse: nurse@hospital.com / nurse123
* Patient: patient@example.com / patient123
* Finance: finance@hospital.com / finance123

## Healthcare Features Overview

### Patient Management

* Comprehensive demographic and medical information
* Emergency contact management
* Insurance information tracking
* Medical history and allergies
* Current medications and chronic conditions

### Clinical Workflow

* Appointment scheduling with priority levels
* Visit documentation with SOAP notes
* Vital signs monitoring and trending
* Lab order management and results
* Prescription management with refills

### Financial Management

* Service billing with CPT/ICD-10 codes
* Insurance claims processing
* Payment tracking and collections
* Financial reporting and analytics

### Administrative Features

* User management and role assignment
* Security audit logging
* Session management and timeout
* System configuration and settings

### Reporting and Analytics

* Patient census and demographics
* Appointment scheduling metrics
* Clinical quality indicators
* Financial performance reports
* Security and compliance auditing
