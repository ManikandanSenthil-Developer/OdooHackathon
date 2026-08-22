import api from './api';

export const documentService = {
  getDocuments: async (employeeId: string) => {
    const res = await api.get(`/employees/${employeeId}/documents`);
    return res.data;
  },

  uploadDocument: async (employeeId: string, file: File, name: string) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('name', name);
    const res = await api.post(`/employees/${employeeId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteDocument: async (documentId: string) => {
    const res = await api.delete(`/documents/${documentId}`);
    return res.data;
  },
};
