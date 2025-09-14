const escapeHtml = (str: string) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

export const printService = {
  printPatient: (data: any) => {
    const content = `
      <html>
        <head>
          <title>Patient Information - ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Patient Information</h1>
            <p>Generated on: ${escapeHtml(new Date().toLocaleDateString())}</p>
          </div>
          <div class="info-row"><span class="label">Name:</span> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</div>
          <div class="info-row"><span class="label">Case Number:</span> ${escapeHtml(data.caseNumber)}</div>
          <div class="info-row"><span class="label">Date of Birth:</span> ${escapeHtml(data.dateOfBirth)}</div>
          <div class="info-row"><span class="label">Gender:</span> ${escapeHtml(data.gender)}</div>
          <div class="info-row"><span class="label">Email:</span> ${escapeHtml(data.email)}</div>
          <div class="info-row"><span class="label">Phone:</span> ${escapeHtml(data.phone)}</div>
          <div class="info-row"><span class="label">Address:</span> ${escapeHtml(data.address)}</div>
          <div class="info-row"><span class="label">Emergency Contact:</span> ${escapeHtml(data.emergencyContact)}</div>
          <div class="info-row"><span class="label">Assigned Doctor:</span> ${escapeHtml(data.assignedDoctor)}</div>
          <div class="info-row"><span class="label">Department:</span> ${escapeHtml(data.department)}</div>
          <div class="info-row"><span class="label">Status:</span> ${escapeHtml(data.status)}</div>
          <div class="info-row"><span class="label">Last Visit:</span> ${escapeHtml(data.lastVisit)}</div>
          <div class="info-row"><span class="label">Insurance:</span> ${escapeHtml(data.insurance)}</div>
        </body>
      </html>
    `;
    openPrintWindow(content);
  },

  printDoctor: (data: any) => {
    const content = `
      <html>
        <head>
          <title>Doctor Information - ${escapeHtml(data.name)}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Doctor Information</h1>
            <p>Generated on: ${escapeHtml(new Date().toLocaleDateString())}</p>
          </div>
          <div class="info-row"><span class="label">Name:</span> ${escapeHtml(data.name)}</div>
          <div class="info-row"><span class="label">Specialization:</span> ${escapeHtml(data.specialization)}</div>
          <div class="info-row"><span class="label">Department:</span> ${escapeHtml(data.department)}</div>
          <div class="info-row"><span class="label">Email:</span> ${escapeHtml(data.email)}</div>
          <div class="info-row"><span class="label">Phone:</span> ${escapeHtml(data.phone)}</div>
          <div class="info-row"><span class="label">Patients:</span> ${escapeHtml(data.patients)}</div>
          <div class="info-row"><span class="label">Availability:</span> ${escapeHtml(data.availability)}</div>
        </body>
      </html>
    `;
    openPrintWindow(content);
  },

  printDepartment: (data: any) => {
    const content = `
      <html>
        <head>
          <title>Department Information - ${escapeHtml(data.name)}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Department Information</h1>
            <p>Generated on: ${escapeHtml(new Date().toLocaleDateString())}</p>
          </div>
          <div class="info-row"><span class="label">Department:</span> ${escapeHtml(data.name)}</div>
          <div class="info-row"><span class="label">Department Head:</span> ${escapeHtml(data.head)}</div>
          <div class="info-row"><span class="label">Location:</span> ${escapeHtml(data.location)}</div>
          <div class="info-row"><span class="label">Phone:</span> ${escapeHtml(data.phone)}</div>
          <div class="info-row"><span class="label">Total Patients:</span> ${escapeHtml(data.totalPatients)}</div>
          <div class="info-row"><span class="label">Active Staff:</span> ${escapeHtml(data.activeStaff)}</div>
          <div class="info-row"><span class="label">Status:</span> ${escapeHtml(data.status)}</div>
        </body>
      </html>
    `;
    openPrintWindow(content);
  }
};

function openPrintWindow(content: string) {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer');
  if (!printWindow) return;
  
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.print();
}