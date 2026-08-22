/**
 * Validation utilities for Dayflow HRMS - Module 2
 */

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
export const MAX_IMAGE_SIZE_MB = 5;

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp'
];
export const MAX_DOCUMENT_SIZE_MB = 15;

/**
 * Validate phone number format (international and local friendly)
 */
export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return 'Phone number is required';
  }
  const cleanPhone = phone.trim().replace(/[\s\-()]/g, '');
  // Allow +country_code and 7 to 15 digits
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return 'Please enter a valid phone number (e.g. +1 (555) 234-5678)';
  }
  return null;
}

/**
 * Validate email address
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return 'Email address is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
}

/**
 * Validate required text
 */
export function validateRequired(value, fieldName = 'This field') {
  if (value === undefined || value === null || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validate positive number / salary
 */
export function validateNumber(value, fieldName = 'Amount', min = 0) {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`;
  }
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }
  if (num < min) {
    return `${fieldName} must be at least ${min}`;
  }
  return null;
}

/**
 * Validate profile picture file before upload
 */
export function validateProfilePicture(file) {
  if (!file) {
    return 'No file selected';
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only JPG, JPEG, PNG, and WEBP images are supported';
  }
  const sizeMb = file.size / (1024 * 1024);
  if (sizeMb > MAX_IMAGE_SIZE_MB) {
    return `Image size must be less than ${MAX_IMAGE_SIZE_MB}MB (Selected: ${sizeMb.toFixed(1)}MB)`;
  }
  return null;
}

/**
 * Validate document file before upload
 */
export function validateDocumentFile(file) {
  if (!file) {
    return 'No file selected';
  }
  const extension = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'];
  
  const isTypeValid = ALLOWED_DOCUMENT_TYPES.includes(file.type) || (extension && validExtensions.includes(extension));
  if (!isTypeValid) {
    return 'Supported formats: PDF, DOC, DOCX, JPG, PNG, WEBP';
  }
  const sizeMb = file.size / (1024 * 1024);
  if (sizeMb > MAX_DOCUMENT_SIZE_MB) {
    return `Document size must be under ${MAX_DOCUMENT_SIZE_MB}MB (Selected: ${sizeMb.toFixed(1)}MB)`;
  }
  return null;
}

/**
 * Format bytes to readable string (e.g. "1.2 MB", "850 KB")
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format currency amount
 */
export function formatCurrency(amount, currency = 'USD') {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 0
  }).format(Number(amount));
}

/**
 * Format date string to display format (e.g., "12 Aug 2026")
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}
