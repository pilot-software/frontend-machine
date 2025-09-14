# Healthcare Management System - Database Schema

## Overview

This document describes the complete database schema for the Healthcare Management System, designed to support
comprehensive patient care, appointment scheduling, clinical workflows, financial management, and security auditing.

## Database Tables (12 Core Tables)

### 1. users

**Purpose:** Core user authentication and role management

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor', 'nurse', 'patient', 'finance') NOT NULL,
  avatar VARCHAR(500),
  department VARCHAR(100),
  specialization VARCHAR(100),
  phone VARCHAR(20),
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
);
```

### 2. patients

**Purpose:** Comprehensive patient demographic and medical information

```sql
CREATE TABLE patients (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36), -- Links to users table for patient portal access
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender ENUM('male', 'female', 'other', 'prefer_not_to_say') NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(10),
  country VARCHAR(50) DEFAULT 'USA',
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relationship VARCHAR(50),
  blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
  allergies TEXT,
  chronic_conditions TEXT,
  current_medications TEXT,
  primary_doctor_id VARCHAR(36),
  status ENUM('active', 'inactive', 'deceased') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (primary_doctor_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_name (last_name, first_name),
  INDEX idx_doctor (primary_doctor_id),
  INDEX idx_status (status)
);
```

### 3. appointments

**Purpose:** Appointment scheduling with priority and status tracking

```sql
CREATE TABLE appointments (
  id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(36) NOT NULL,
  doctor_id VARCHAR(36) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INT DEFAULT 30,
  appointment_type ENUM('consultation', 'follow_up', 'emergency', 'surgery', 'diagnostic') NOT NULL,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
  chief_complaint TEXT,
  notes TEXT,
  room_number VARCHAR(20),
  created_by VARCHAR(36) NOT NULL,
  cancelled_by VARCHAR(36),
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (cancelled_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_date_time (appointment_date, appointment_time),
  INDEX idx_patient (patient_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
);
```

### 4. visits

**Purpose:** Clinical encounters and comprehensive medical data

```sql
CREATE TABLE visits (
  id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(36) NOT NULL,
  doctor_id VARCHAR(36) NOT NULL,
  appointment_id VARCHAR(36),
  visit_date DATE NOT NULL,
  visit_time TIME NOT NULL,
  visit_type ENUM('routine', 'emergency', 'follow_up', 'consultation', 'surgery') NOT NULL,
  chief_complaint TEXT,
  history_present_illness TEXT,
  physical_examination TEXT,
  assessment TEXT,
  plan TEXT,
  notes TEXT,
  discharge_instructions TEXT,
  follow_up_instructions TEXT,
  status ENUM('in_progress', 'completed', 'cancelled') DEFAULT 'in_progress',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
  INDEX idx_patient (patient_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_date (visit_date),
  INDEX idx_status (status)
);
```

### 5. medical_conditions

**Purpose:** Patient diagnosis and condition tracking

```sql
CREATE TABLE medical_conditions (
  id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(36) NOT NULL,
  visit_id VARCHAR(36),
  condition_name VARCHAR(255) NOT NULL,
  icd_10_code VARCHAR(20),
  diagnosis_date DATE NOT NULL,
  severity ENUM('mild', 'moderate', 'severe', 'critical') DEFAULT 'moderate',
  status ENUM('active', 'resolved', 'chronic', 'in_remission') DEFAULT 'active',
  notes TEXT,
  diagnosed_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE SET NULL,
  FOREIGN KEY (diagnosed_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_patient (patient_id),
  INDEX idx_condition (condition_name),
  INDEX idx_status (status),
  INDEX idx_icd_code (icd_10_code)
);
```

### 6. prescriptions

**Purpose:** Medication management and prescription tracking

```sql
CREATE TABLE prescriptions (
  id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(36) NOT NULL,
  doctor_id VARCHAR(36) NOT NULL,
  visit_id VARCHAR(36),
  medication_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  duration VARCHAR(100),
  quantity_prescribed INT,
  refills_remaining INT DEFAULT 0,
  instructions TEXT,
  indication VARCHAR(255),
  status ENUM('active', 'completed', 'cancelled', 'expired') DEFAULT 'active',
  prescribed_date DATE NOT NULL,
  start_date DATE,
  end_date DATE,
  pharmacy_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE SET NULL,
  INDEX idx_patient (patient_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_medication (medication_name),
  INDEX idx_status (status),
  INDEX idx_prescribed_date (prescribed_date)
);
```

### 7. vitals

**Purpose:** Vital signs monitoring and tracking

```sql
CREATE TABLE vitals (
  id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(36) NOT NULL,
  visit_id VARCHAR(36),
  recorded_by VARCHAR(36) NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  systolic_bp INT,
  diastolic_bp INT,
  heart_rate INT,
  respiratory_rate INT,
  temperature DECIMAL(4,1),
  temperature_unit ENUM('F', 'C') DEFAULT 'F',
  oxygen_saturation INT,
  weight DECIMAL(5,2),
  weight_unit ENUM('lbs', 'kg') DEFAULT 'lbs',
  height_feet INT,
  height_inches INT,
  height_cm INT,
  bmi DECIMAL(4,1),
  pain_scale INT CHECK (pain_scale BETWEEN 0 AND 10),
  notes TEXT,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE SET NULL,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_patient (patient_id),
  INDEX idx_visit (visit_id),
  INDEX idx_recorded_at (recorded_at)
);
```

### 8. lab_results

**Purpose:** Laboratory test results and diagnostic data

```sql
CREATE TABLE lab_results (
  id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(36) NOT NULL,
  visit_id VARCHAR(36),
  ordered_by VARCHAR(36) NOT NULL,
  test_name VARCHAR(255) NOT NULL,
  test_code VARCHAR(50),
  test_category ENUM('blood', 'urine', 'imaging', 'pathology', 'microbiology', 'other') NOT NULL,
  result_value VARCHAR(255),
  result_unit VARCHAR(50),
  reference_range VARCHAR(100),
  status ENUM('ordered', 'in_progress', 'completed', 'cancelled') DEFAULT 'ordered',
  abnormal_flag ENUM('normal', 'low', 'high', 'critical') DEFAULT 'normal',
  ordered_date DATE NOT NULL,
  collection_date DATE,
  result_date DATE,
  lab_comments TEXT,
  interpretation TEXT,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE SET NULL,
  FOREIGN KEY (ordered_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_patient (patient_id),
  INDEX idx_test_name (test_name),
  INDEX idx_status (status),
  INDEX idx_ordered_date (ordered_date),
  INDEX idx_abnormal_flag (abnormal_flag)
);
```

### 9. billing

**Purpose:** Financial transactions and billing management

```sql
CREATE TABLE billing (
  id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(36) NOT NULL,
  visit_id VARCHAR(36),
  appointment_id VARCHAR(36),
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  service_date DATE NOT NULL,
  service_description TEXT NOT NULL,
  procedure_codes TEXT, -- CPT codes
  diagnosis_codes TEXT, -- ICD-10 codes
  amount_charged DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0.00,
  amount_due DECIMAL(10,2) GENERATED ALWAYS AS (amount_charged - amount_paid) STORED,
  payment_status ENUM('pending', 'partial', 'paid', 'overdue', 'written_off') DEFAULT 'pending',
  billing_date DATE NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  payment_method ENUM('cash', 'check', 'credit_card', 'insurance', 'other'),
  notes TEXT,
  created_by VARCHAR(36) NOT NULL,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE SET NULL,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_patient (patient_id),
  INDEX idx_invoice (invoice_number),
  INDEX idx_payment_status (payment_status),
  INDEX idx_due_date (due_date),
  INDEX idx_service_date (service_date)
);
```

### 10. insurance

**Purpose:** Insurance coverage and claims management

```sql
CREATE TABLE insurance (
  id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(36) NOT NULL,
  insurance_company VARCHAR(255) NOT NULL,
  policy_number VARCHAR(100) NOT NULL,
  group_number VARCHAR(100),
  policy_holder_name VARCHAR(255) NOT NULL,
  relationship_to_patient ENUM('self', 'spouse', 'child', 'parent', 'other') NOT NULL,
  coverage_type ENUM('primary', 'secondary', 'tertiary') NOT NULL,
  effective_date DATE NOT NULL,
  expiration_date DATE,
  copay_amount DECIMAL(6,2),
  deductible_amount DECIMAL(8,2),
  deductible_met DECIMAL(8,2) DEFAULT 0.00,
  status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
  pre_auth_required BOOLEAN DEFAULT FALSE,
  notes TEXT,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  INDEX idx_patient (patient_id),
  INDEX idx_policy (policy_number),
  INDEX idx_coverage_type (coverage_type),
  INDEX idx_status (status),
  UNIQUE KEY unique_patient_coverage (patient_id, coverage_type)
);
```

### 11. security_logs

**Purpose:** Security activity tracking and audit trail

```sql
CREATE TABLE security_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(36),
  ip_address VARCHAR(45),
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  success BOOLEAN NOT NULL,
  failure_reason TEXT,
  additional_data JSON,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_timestamp (timestamp),
  INDEX idx_success (success),
  INDEX idx_resource (resource_type, resource_id)
);
```

### 12. user_sessions

**Purpose:** Session management and tracking

```sql
CREATE TABLE user_sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_token (session_token),
  INDEX idx_expires (expires_at),
  INDEX idx_active (is_active)
);
```

## Data Relationships

### Primary Relationships

- **Users → Patients**: One-to-many (doctor assignments)
- **Patients → Appointments**: One-to-many
- **Appointments → Visits**: One-to-one (optional)
- **Patients → Visits**: One-to-many
- **Visits → Medical Conditions**: One-to-many
- **Visits → Prescriptions**: One-to-many
- **Visits → Vitals**: One-to-many
- **Visits → Lab Results**: One-to-many
- **Patients → Billing**: One-to-many
- **Patients → Insurance**: One-to-many

### Role-Based Data Access

#### Admin

- Full access to all tables
- User management capabilities
- System configuration access

#### Doctor

- Full access to assigned patients' data
- Can create/modify: appointments, visits, prescriptions, lab orders
- Read access to billing information

#### Nurse

- Access to assigned patients' data
- Can create/modify: vitals, basic visit notes
- Limited prescription access (view only)

#### Patient

- Access to own medical records only
- Can view: appointments, visits, prescriptions, lab results, billing
- Cannot modify medical data

#### Finance

- Full access to billing and insurance tables
- Read-only access to patient demographics
- Limited access to clinical data

## Data Validation Rules

### Business Rules

1. **Appointments**: Cannot be scheduled in the past
2. **Prescriptions**: Must have valid dosage and frequency
3. **Vitals**: Values must be within realistic ranges
4. **Billing**: Amount due cannot be negative
5. **Insurance**: Only one primary coverage per patient
6. **Sessions**: Must expire within 24 hours of creation

### Data Integrity

- All foreign keys enforce referential integrity
- Soft deletes used for patient and user records
- Audit trails maintained for all critical data changes
- Cascading deletes protect data consistency

## Indexes and Performance

### Critical Indexes

- Patient name search (last_name, first_name)
- Appointment scheduling (date, time, doctor)
- Medical record lookups (patient_id, visit_date)
- Billing queries (due_date, payment_status)
- Security monitoring (timestamp, user_id)

### Query Optimization

- Composite indexes for common query patterns
- Partitioning by date for large tables (visits, lab_results)
- Regular maintenance of table statistics

## Security Considerations

### Data Protection

- Password hashes using bcrypt
- Session tokens with secure random generation
- Audit logging for all data access
- IP address tracking for security monitoring

### Compliance

- HIPAA-compliant data handling
- Audit trails for all patient data access
- Secure data transmission requirements
- Regular security assessments

## Backup and Recovery

### Backup Strategy

- Daily full backups
- Transaction log backups every 15 minutes
- Point-in-time recovery capability
- Offsite backup storage

### Disaster Recovery

- RTO: 4 hours
- RPO: 15 minutes
- Hot standby database
- Automated failover procedures
