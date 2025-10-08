#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Common string patterns to replace with translation keys
const translations = {
  // Basic actions
  'Add': 't("add")',
  'Edit': 't("edit")',
  'Delete': 't("delete")',
  'Save': 't("save")',
  'Cancel': 't("cancel")',
  'Submit': 't("submit")',
  'Close': 't("close")',
  'View': 't("view")',
  'Search': 't("search")',
  'Filter': 't("filter")',
  'Loading...': 't("loading")',
  'No results found': 't("noResults")',
  'Error': 't("error")',
  'Success': 't("success")',
  
  // Form fields
  'First Name': 't("firstName")',
  'Last Name': 't("lastName")',
  'Email': 't("email")',
  'Phone': 't("phone")',
  'Address': 't("address")',
  'Date of Birth': 't("dateOfBirth")',
  'Gender': 't("gender")',
  'Male': 't("male")',
  'Female': 't("female")',
  'Other': 't("other")',
  
  // Medical terms
  'Patient': 't("patient")',
  'Doctor': 't("doctor")',
  'Nurse': 't("nurse")',
  'Admin': 't("admin")',
  'Appointment': 't("appointment")',
  'Prescription': 't("prescription")',
  'Medication': 't("medication")',
  'Blood Type': 't("bloodType")',
  'Allergies': 't("allergies")',
  'Vitals': 't("vitals")',
  'Lab Results': 't("labResults")',
  
  // Status
  'Active': 't("active")',
  'Inactive': 't("inactive")',
  'Critical': 't("critical")',
  'Pending': 't("pending")',
  'Completed': 't("completed")',
  'Cancelled': 't("cancelled")',
  
  // Navigation
  'Dashboard': 't("dashboard")',
  'Patients': 't("patients")',
  'Appointments': 't("appointments")',
  'Clinical': 't("clinical")',
  'Prescriptions': 't("prescriptions")',
  'Financial': 't("financial")',
  'Settings': 't("settings")',
  'Profile': 't("profile")',
  'Logout': 't("logout")',
};

function addTranslationImport(content) {
  if (content.includes('useTranslations')) {
    return content;
  }
  
  const importMatch = content.match(/import React[^;]*;/);
  if (importMatch) {
    return content.replace(
      importMatch[0],
      `${importMatch[0]}\nimport { useTranslations } from "next-intl";`
    );
  }
  return content;
}

function addTranslationHook(content) {
  if (content.includes('useTranslations(')) {
    return content;
  }
  
  const functionMatch = content.match(/export function \w+\([^)]*\) \{/);
  if (functionMatch) {
    return content.replace(
      functionMatch[0],
      `${functionMatch[0]}\n  const t = useTranslations('common');`
    );
  }
  return content;
}

function replaceStrings(content) {
  let updatedContent = content;
  
  Object.entries(translations).forEach(([original, replacement]) => {
    // Replace in JSX text content
    const jsxPattern = new RegExp(`>\\s*${original}\\s*<`, 'g');
    updatedContent = updatedContent.replace(jsxPattern, `>{${replacement}}<`);
    
    // Replace in string literals
    const stringPattern = new RegExp(`"${original}"`, 'g');
    updatedContent = updatedContent.replace(stringPattern, `{${replacement}}`);
    
    // Replace in template literals
    const templatePattern = new RegExp(`'${original}'`, 'g');
    updatedContent = updatedContent.replace(templatePattern, `{${replacement}}`);
  });
  
  return updatedContent;
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has extensive translations
    if (content.includes('useTranslations') && content.split('t(').length > 5) {
      console.log(`Skipping ${filePath} - already translated`);
      return;
    }
    
    content = addTranslationImport(content);
    content = addTranslationHook(content);
    content = replaceStrings(content);
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      processDirectory(fullPath);
    } else if (item.endsWith('.tsx') && !item.includes('.test.')) {
      processFile(fullPath);
    }
  });
}

// Process components directory
const componentsDir = path.join(__dirname, '../components');
if (fs.existsSync(componentsDir)) {
  console.log('Processing components directory...');
  processDirectory(componentsDir);
  console.log('Translation application complete!');
} else {
  console.error('Components directory not found');
}