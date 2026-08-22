import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldAlert, Sparkles, User, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEmployee } from '../hooks/useEmployee';
import { getEmployeeDocuments } from '../services/documentApi';
import EmployeeProfileCard from '../components/EmployeeProfileCard';
import EmployeeDetails from '../components/EmployeeDetails';
import DocumentList from '../components/DocumentList';
import { ProfileSkeletonLoader } from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function MyProfile() {
  const { employeeId } = useAuth();
  const { employee, loading, error, refetch } = useEmployee(employeeId);
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Load employee's documents
  useEffect(() => {
    let isMounted = true;
    async function loadDocs() {
      if (!employeeId) return;
      setLoadingDocs(true);
      try {
        const docs = await getEmployeeDocuments(employeeId);
        if (isMounted) setDocuments(Array.isArray(docs) ? docs : []);
      } catch (err) {
        console.warn('Failed loading documents:', err);
        if (isMounted) setDocuments([]);
      } finally {
        if (isMounted) setLoadingDocs(false);
      }
    }
    loadDocs();
    return () => {
      isMounted = false;
    };
  }, [employeeId]);

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
          title="Unable to load employee profile"
          message={error || 'The requested profile could not be loaded.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200" id="my-profile-page">
      {/* 1. Profile Header Card */}
      <EmployeeProfileCard
        employee={employee}
        isOwnProfile={true}
        isAdminView={false}
      />

      {/* 2. Personal, Job, and Salary Details */}
      <EmployeeDetails
        employee={employee}
        isOwnProfile={true}
        isAdminView={false}
      />

      {/* 3. Documents Section */}
      <div className="dayflow-card p-6 md:p-7 bg-white space-y-4" id="employee-documents-card">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E9F1FA] text-[#00ABE4] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Documents</h2>
              <p className="text-xs text-slate-500">Official verification, identity proofs, and contracts</p>
            </div>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            {documents.length} File{documents.length === 1 ? '' : 's'}
          </span>
        </div>

        <DocumentList
          documents={documents}
          isLoading={loadingDocs}
          canDelete={false} // Regular employees have read/download permissions
        />
      </div>
    </div>
  );
}
