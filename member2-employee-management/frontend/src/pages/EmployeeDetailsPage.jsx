import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Edit3, FileText, Upload, Plus, Shield, User } from 'lucide-react';
import { useEmployee } from '../hooks/useEmployee';
import { getEmployeeDocuments, uploadDocument, deleteDocument } from '../services/documentApi';
import EmployeeProfileCard from '../components/EmployeeProfileCard';
import EmployeeDetails from '../components/EmployeeDetails';
import DocumentList from '../components/DocumentList';
import DocumentUploader from '../components/DocumentUploader';
import { ProfileSkeletonLoader } from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import Toast from '../components/Toast';

export default function EmployeeDetailsPage() {
  const { employeeId } = useParams();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'documents' ? 'documents' : 'details';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [showUploader, setShowUploader] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);

  const { employee, loading, error, refetch } = useEmployee(employeeId);

  // Load employee documents
  const fetchDocs = async () => {
    if (!employeeId) return;
    setLoadingDocs(true);
    try {
      const docList = await getEmployeeDocuments(employeeId);
      setDocuments(Array.isArray(docList) ? docList : []);
    } catch (err) {
      console.warn('Failed loading documents:', err);
      setDocuments([]);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [employeeId]);

  const handleUploadDocument = async (file, meta) => {
    setIsUploading(true);
    try {
      const newDoc = await uploadDocument(employeeId, file, meta);
      setToast({ type: 'success', message: `Document "${newDoc.name}" uploaded successfully.` });
      setShowUploader(false);
      fetchDocs();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to upload document.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await deleteDocument(docId);
      setToast({ type: 'success', message: 'Document removed successfully.' });
      fetchDocs();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete document.' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <ProfileSkeletonLoader />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <ErrorState
          title="Employee record not found"
          message={error || `Could not find employee record for "${employeeId}".`}
          onRetry={refetch}
        />
        <div className="text-center mt-4">
          <Link to="/admin/employees" className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200" id="admin-employee-details-page">
      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/employees"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#00ABE4] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Employee Directory</span>
        </Link>
      </div>

      {/* Profile Header Card */}
      <EmployeeProfileCard
        employee={employee}
        isOwnProfile={false}
        isAdminView={true}
      />

      {/* Tab Navigation: Details vs Document Management */}
      <div className="border-b border-slate-200 flex items-center gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`pb-3 text-sm font-semibold transition-all relative inline-flex items-center gap-2 ${
            activeTab === 'details'
              ? 'text-[#007EA7]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          id="tab-employee-details"
        >
          <User className="w-4 h-4" />
          <span>Employee Profile & Salary</span>
          {activeTab === 'details' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ABE4] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('documents')}
          className={`pb-3 text-sm font-semibold transition-all relative inline-flex items-center gap-2 ${
            activeTab === 'documents'
              ? 'text-[#007EA7]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          id="tab-employee-documents"
        >
          <FileText className="w-4 h-4" />
          <span>Employee Documents</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#E9F1FA] text-[#007EA7]">
            {documents.length}
          </span>
          {activeTab === 'documents' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ABE4] rounded-full" />
          )}
        </button>
      </div>

      {/* Tab 1: Profile & Compensation Details */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <EmployeeDetails
            employee={employee}
            isOwnProfile={false}
            isAdminView={true}
          />
        </div>
      )}

      {/* Tab 2: Document Management (Admin Full CRUD) */}
      {activeTab === 'documents' && (
        <div className="space-y-6" id="admin-document-management-section">
          {/* Uploader Card */}
          <div className="dayflow-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Manage Employee Documents</h3>
                <p className="text-xs text-slate-500">
                  Upload verification contracts, tax forms, or government IDs for {employee.fullName}.
                </p>
              </div>

              {!showUploader && (
                <button
                  type="button"
                  onClick={() => setShowUploader(true)}
                  className="btn-primary text-xs px-3.5 py-2 inline-flex items-center gap-1.5"
                  id="show-doc-uploader-btn"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload New Document</span>
                </button>
              )}
            </div>

            {showUploader && (
              <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl">
                <DocumentUploader
                  employeeId={employee.employeeId}
                  onUpload={handleUploadDocument}
                  onCancel={() => setShowUploader(false)}
                  isUploading={isUploading}
                />
              </div>
            )}

            <DocumentList
              documents={documents}
              isLoading={loadingDocs}
              canDelete={true} // Admin can delete documents
              onDeleteDocument={handleDeleteDocument}
              onUploadClick={() => setShowUploader(true)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
