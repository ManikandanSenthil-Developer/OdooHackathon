import apiClient from './api';
import { formatBytes } from '../utils/validation';

const mapDocumentFromAPI = (doc) => {
  return {
    id: doc.id,
    employeeId: doc.employee_id,
    name: doc.name || doc.file_name,
    type: doc.file_type || 'DOC',
    category: 'OTHER', // Backend doesn't store category explicitly right now
    fileSize: doc.file_size,
    fileSizeFormatted: formatBytes(doc.file_size || 0),
    uploadedAt: doc.uploaded_at,
    uploadedBy: 'Current User', 
    url: doc.file_url ? `http://localhost:5000${doc.file_url}` : '#' // Ideally the backend exposes a BASE URL env, hardcoding for local dev
  };
};

/**
 * Get all documents for a specific employee
 */
export async function getEmployeeDocuments(employeeId) {
  const response = await apiClient.get(`/employees/${employeeId}/documents`);
  const docs = response.data.data || [];
  return docs.map(mapDocumentFromAPI);
}

/**
 * Upload a new document for an employee
 */
export async function uploadDocument(employeeId, file, meta = {}) {
  const formData = new FormData();
  formData.append('document', file); // Matches the multer `upload.single('document')`
  if (meta.name) formData.append('name', meta.name);
  else formData.append('name', file.name);

  const response = await apiClient.post(`/employees/${employeeId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return mapDocumentFromAPI(response.data.data);
}

/**
 * Delete a document by ID
 */
export async function deleteDocument(documentId) {
  const response = await apiClient.delete(`/documents/${documentId}`);
  return response.data;
}

/**
 * Trigger document download / preview
 */
export function downloadDocument(document) {
  if (document.url && document.url !== '#') {
    window.open(document.url, '_blank');
    return;
  }
}
