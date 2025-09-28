import { Patient, Doctor } from '@/lib/types';
import QRCode from 'qrcode';

// Generate QR code data URL for patient identification
const generatePatientQRCode = async (patient: Patient): Promise<string> => {
  const patientData = {
    type: 'HEALTHCARE_PATIENT_ID',
    version: '1.0',
    id: patient.id,
    name: `${patient.firstName} ${patient.lastName}`,
    dob: patient.dateOfBirth,
    gender: patient.gender,
    phone: patient.phone || '',
    emergency: patient.emergencyContactPhone || '',
    bloodType: (patient as any).bloodType || '',
    allergies: (patient as any).allergies || '',
    insurance: patient.insuranceProvider || '',
    redirectUrl: `/patient/${patient.id}`,
    timestamp: new Date().toISOString(),
    facility: 'Healthcare Management System'
  };
  
  const qrData = JSON.stringify(patientData);
  
  try {
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 120,
      margin: 2,
      color: {
        dark: '#030213',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Fallback to external service
    return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`;
  }
};

// Simple HTML to PDF conversion using browser's print functionality
export const generatePatientHTML = async (patient: Patient, assignedDoctor: Doctor | null): Promise<string> => {
  const currentDate = new Date();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Patient Report - ${patient.firstName} ${patient.lastName}</title>
      <style>
        @page {
          margin: 20mm;
          size: A4;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          background: white;
        }
        
        .header {
          border-bottom: 3px solid #030213;
          padding-bottom: 20px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .hospital-info h1 {
          color: #030213;
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }
        
        .hospital-info p {
          color: #666;
          margin: 5px 0 0 0;
          font-size: 14px;
        }
        
        .report-meta {
          text-align: right;
          color: #666;
          font-size: 12px;
        }
        
        .section {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #fafafa;
        }
        
        .section-title {
          color: #030213;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
        }
        
        .info-label {
          font-weight: 600;
          color: #374151;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        
        .info-value {
          color: #1f2937;
          font-size: 14px;
        }
        
        .patient-name {
          font-size: 20px;
          font-weight: bold;
          color: #030213;
          margin-bottom: 5px;
        }
        
        .patient-id {
          color: #6b7280;
          font-size: 14px;
        }
        
        .qr-section {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          margin-top: 20px;
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 12px;
          border: 2px solid #030213;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .qr-code {
          flex-shrink: 0;
        }
        
        .qr-code img {
          width: 120px;
          height: 120px;
          border: 3px solid #030213;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          background: white;
          padding: 4px;
        }
        
        .qr-info {
          flex: 1;
        }
        
        .qr-title {
          font-weight: bold;
          color: #030213;
          margin-bottom: 8px;
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .qr-description {
          color: #374151;
          font-size: 12px;
          line-height: 1.5;
        }
        
        .qr-security {
          margin-top: 12px;
          padding: 8px;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          font-size: 11px;
          color: #92400e;
        }
        
        .qr-data-preview {
          margin-top: 10px;
          padding: 8px;
          background: #f3f4f6;
          border-radius: 4px;
          font-family: monospace;
          font-size: 10px;
          color: #4b5563;
          max-height: 60px;
          overflow-y: auto;
        }
        
        .status-active {
          color: #059669;
          font-weight: bold;
        }
        
        .emergency-contact {
          color: #dc2626;
          font-weight: 600;
        }
        
        .notes-section {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #030213;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }
        
        .confidential {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 10px;
          border-radius: 6px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 10px;
        }
        
        .footer-text {
          color: #9ca3af;
          font-size: 11px;
        }
        
        @media print {
          body { margin: 0; }
          .section { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="hospital-info">
          <h1>🏥 Healthcare Management System</h1>
          <p>Patient Information Report</p>
        </div>
        <div class="report-meta">
          <div>Date: ${currentDate.toLocaleDateString()}</div>
          <div>Time: ${currentDate.toLocaleTimeString()}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          👤 Patient Information
        </div>
        <div class="patient-name">${patient.firstName} ${patient.lastName}</div>
        <div class="patient-id">Patient ID: ${patient.id}</div>
        
        <div class="qr-section">
          <div class="qr-code">
            <img src="${await generatePatientQRCode(patient)}" alt="Patient QR Code" />
          </div>
          <div class="qr-info">
            <div class="qr-title">
              🔍 Patient Identification QR Code
            </div>
            <div class="qr-description">
              <strong>Secure Patient ID:</strong> Scan this QR code to quickly access patient information including ID, name, date of birth, and emergency contact details.<br><br>
              <strong>Usage:</strong> Emergency identification, appointment check-in, medical record access, insurance verification.<br><br>
              <strong>Generated:</strong> ${currentDate.toLocaleString()}
            </div>
            <div class="qr-security">
              ⚠️ <strong>Security Notice:</strong> This QR code contains protected health information (PHI). Use only for authorized medical purposes.
            </div>
            <div class="qr-data-preview">
              <strong>Data Preview:</strong><br>
              Patient: ${patient.firstName} ${patient.lastName}<br>
              ID: ${patient.id}<br>
              DOB: ${patient.dateOfBirth}<br>
              Emergency: ${patient.emergencyContactPhone || 'N/A'}
            </div>
          </div>
        </div>
        
        <div class="info-grid" style="margin-top: 20px;">
          <div class="info-item">
            <div class="info-label">Date of Birth</div>
            <div class="info-value">${patient.dateOfBirth || 'Not provided'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Gender</div>
            <div class="info-value">${patient.gender?.charAt(0).toUpperCase() + patient.gender?.slice(1) || 'Not specified'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value status-active">Active Patient</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          📞 Contact Information
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Email Address</div>
            <div class="info-value">${patient.email || 'Not provided'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Phone Number</div>
            <div class="info-value">${patient.phone || 'Not provided'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Emergency Contact</div>
            <div class="info-value emergency-contact">${patient.emergencyContactPhone || 'Not provided'}</div>
          </div>
        </div>
        <div class="info-item" style="margin-top: 15px;">
          <div class="info-label">Address</div>
          <div class="info-value">${patient.address || 'Not provided'}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          🩺 Medical Information
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Attending Physician</div>
            <div class="info-value">${assignedDoctor?.name || 'Not assigned'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Department</div>
            <div class="info-value">${assignedDoctor?.department || 'General Medicine'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Insurance Provider</div>
            <div class="info-value">${patient.insuranceProvider || 'Not provided'}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          📋 Medical Notes
        </div>
        <div class="notes-section">
          <p>Patient record generated from Healthcare Management System.</p>
          <p>For complete medical history and recent visits, please refer to the electronic health record system.</p>
          <p><strong>Last updated:</strong> ${currentDate.toLocaleString()}</p>
        </div>
      </div>

      <div class="footer">
        <div class="confidential">
          ⚠️ CONFIDENTIAL PATIENT INFORMATION
        </div>
        <div class="footer-text">
          This document contains protected health information (PHI). Handle according to HIPAA guidelines and institutional policies.
        </div>
      </div>
    </body>
    </html>
  `;
};

export const downloadPatientPDF = async (
  patient: Patient,
  assignedDoctor: Doctor | null
): Promise<void> => {
  try {
    const htmlContent = await generatePatientHTML(patient, assignedDoctor);
    
    // Create a new window with the HTML content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please check popup blocker settings.');
    }
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Alternative: Direct HTML download
export const downloadPatientHTML = async (
  patient: Patient,
  assignedDoctor: Doctor | null
): Promise<void> => {
  const htmlContent = await generatePatientHTML(patient, assignedDoctor);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `Patient-Report-${patient.firstName}-${patient.lastName}-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};