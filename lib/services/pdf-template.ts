import {generate} from '@pdfme/generator';
import {text} from '@pdfme/schemas';
import {Doctor, Patient} from '@/lib/types';

const plugins = { text };

// Healthcare-themed PDF template
const createPatientTemplate = () => ({
  basePdf: '',
  schemas: [
    {
      // Header with healthcare branding
      hospitalLogo: {
        type: 'text',
        position: { x: 20, y: 15 },
        width: 15,
        height: 15,
        fontSize: 20,
        fontColor: '#030213',
      },
      hospitalName: {
        type: 'text',
        position: { x: 40, y: 20 },
        width: 120,
        height: 10,
        fontSize: 16,
        fontColor: '#030213',
      },
      reportTitle: {
        type: 'text',
        position: { x: 40, y: 32 },
        width: 120,
        height: 8,
        fontSize: 12,
        fontColor: '#666666',
      },
      reportDate: {
        type: 'text',
        position: { x: 140, y: 20 },
        width: 50,
        height: 6,
        fontSize: 9,
        fontColor: '#666666',
        alignment: 'right',
      },
      reportTime: {
        type: 'text',
        position: { x: 140, y: 28 },
        width: 50,
        height: 6,
        fontSize: 9,
        fontColor: '#666666',
        alignment: 'right',
      },

      // Divider line
      divider1: {
        type: 'text',
        position: { x: 20, y: 45 },
        width: 170,
        height: 1,
        fontSize: 8,
        fontColor: '#E5E7EB',
      },

      // Patient Information Section
      patientInfoHeader: {
        type: 'text',
        position: { x: 20, y: 55 },
        width: 170,
        height: 8,
        fontSize: 12,
        fontColor: '#030213',
      },
      patientName: {
        type: 'text',
        position: { x: 20, y: 68 },
        width: 85,
        height: 6,
        fontSize: 11,
        fontColor: '#1F2937',
      },
      patientId: {
        type: 'text',
        position: { x: 110, y: 68 },
        width: 80,
        height: 6,
        fontSize: 10,
        fontColor: '#6B7280',
      },
      dateOfBirth: {
        type: 'text',
        position: { x: 20, y: 78 },
        width: 85,
        height: 6,
        fontSize: 10,
        fontColor: '#374151',
      },
      gender: {
        type: 'text',
        position: { x: 110, y: 78 },
        width: 80,
        height: 6,
        fontSize: 10,
        fontColor: '#374151',
      },
      patientStatus: {
        type: 'text',
        position: { x: 20, y: 88 },
        width: 85,
        height: 6,
        fontSize: 10,
        fontColor: '#059669',
      },

      // Contact Information Section
      contactInfoHeader: {
        type: 'text',
        position: { x: 20, y: 105 },
        width: 170,
        height: 8,
        fontSize: 12,
        fontColor: '#030213',
      },
      email: {
        type: 'text',
        position: { x: 20, y: 118 },
        width: 170,
        height: 6,
        fontSize: 10,
        fontColor: '#374151',
      },
      phone: {
        type: 'text',
        position: { x: 20, y: 128 },
        width: 85,
        height: 6,
        fontSize: 10,
        fontColor: '#374151',
      },
      emergencyContact: {
        type: 'text',
        position: { x: 110, y: 128 },
        width: 80,
        height: 6,
        fontSize: 10,
        fontColor: '#DC2626',
      },
      address: {
        type: 'text',
        position: { x: 20, y: 138 },
        width: 170,
        height: 12,
        fontSize: 10,
        fontColor: '#374151',
      },

      // Medical Information Section
      medicalInfoHeader: {
        type: 'text',
        position: { x: 20, y: 160 },
        width: 170,
        height: 8,
        fontSize: 12,
        fontColor: '#030213',
      },
      assignedDoctor: {
        type: 'text',
        position: { x: 20, y: 173 },
        width: 85,
        height: 6,
        fontSize: 10,
        fontColor: '#374151',
      },
      department: {
        type: 'text',
        position: { x: 110, y: 173 },
        width: 80,
        height: 6,
        fontSize: 10,
        fontColor: '#374151',
      },
      insuranceProvider: {
        type: 'text',
        position: { x: 20, y: 183 },
        width: 170,
        height: 6,
        fontSize: 10,
        fontColor: '#374151',
      },

      // Additional Medical Notes Section
      notesHeader: {
        type: 'text',
        position: { x: 20, y: 200 },
        width: 170,
        height: 8,
        fontSize: 12,
        fontColor: '#030213',
      },
      medicalNotes: {
        type: 'text',
        position: { x: 20, y: 213 },
        width: 170,
        height: 30,
        fontSize: 10,
        fontColor: '#374151',
      },

      // Footer with compliance info
      confidentialityNotice: {
        type: 'text',
        position: { x: 20, y: 260 },
        width: 170,
        height: 8,
        fontSize: 8,
        fontColor: '#DC2626',
        alignment: 'center',
      },
      footer: {
        type: 'text',
        position: { x: 20, y: 270 },
        width: 170,
        height: 6,
        fontSize: 8,
        fontColor: '#9CA3AF',
        alignment: 'center',
      },
    },
  ],
});

export const generatePatientPDF = async (
  patient: Patient,
  assignedDoctor: Doctor | null
): Promise<Uint8Array> => {
  const template = createPatientTemplate();

  const currentDate = new Date();
  const inputs = [
    {
      hospitalLogo: '🏥',
      hospitalName: 'Healthcare Management System',
      reportTitle: 'Patient Information Report',
      reportDate: `Date: ${currentDate.toLocaleDateString()}`,
      reportTime: `Time: ${currentDate.toLocaleTimeString()}`,
      divider1: '────────────────────────────────────────────────────────────────────────',

      patientInfoHeader: '👤 PATIENT INFORMATION',
      patientName: `Name: ${patient.firstName} ${patient.lastName}`,
      patientId: `ID: ${patient.id}`,
      dateOfBirth: `DOB: ${patient.dateOfBirth || 'N/A'}`,
      gender: `Gender: ${patient.gender?.charAt(0).toUpperCase() + patient.gender?.slice(1) || 'N/A'}`,
      patientStatus: 'Status: Active Patient',

      contactInfoHeader: '📞 CONTACT INFORMATION',
      email: `Email: ${patient.email || 'Not provided'}`,
      phone: `Phone: ${patient.phone || 'Not provided'}`,
      emergencyContact: `Emergency: ${patient.emergencyContactPhone || 'Not provided'}`,
      address: `Address: ${patient.address || 'Not provided'}`,

      medicalInfoHeader: '🩺 MEDICAL INFORMATION',
      assignedDoctor: `Attending Physician: ${assignedDoctor?.name || 'Not assigned'}`,
      department: `Department: ${assignedDoctor?.department || 'General Medicine'}`,
      insuranceProvider: `Insurance Provider: ${patient.insuranceProvider || 'Not provided'}`,

      notesHeader: '📋 MEDICAL NOTES',
      medicalNotes: 'Patient record generated from Healthcare Management System.\nFor complete medical history and recent visits, please refer to the electronic health record system.\n\nLast updated: ' + currentDate.toLocaleString(),

      confidentialityNotice: '⚠️ CONFIDENTIAL PATIENT INFORMATION',
      footer: 'This document contains protected health information (PHI). Handle according to HIPAA guidelines and institutional policies.',
    },
  ];

  try {
    const pdf = await generate({
      template,
      inputs,
      plugins,
    });

    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate patient PDF');
  }
};

export const downloadPatientPDF = async (
  patient: Patient,
  assignedDoctor: Doctor | null
): Promise<void> => {
  try {
    const pdfBytes = await generatePatientPDF(patient, assignedDoctor);

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Patient-Report-${patient.firstName}-${patient.lastName}-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};
