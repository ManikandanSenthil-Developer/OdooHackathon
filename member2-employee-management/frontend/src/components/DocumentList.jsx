import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Image, File, Download, Trash2, Eye, ExternalLink, Calendar, HardDrive } from 'lucide-react';
import { formatDate } from '../utils/validation';
import { downloadDocument } from '../services/documentApi';
import EmptyState from './EmptyState';
import ConfirmDialog from './ConfirmDialog';

const getDocumentIcon = (type = '') => {
  const t = type.toUpperCase();
  if (t === 'PDF') {
    return <FileText className="w-5 h-5 text-red-500" />;
  }
  if (t === 'DOC' || t === 'DOCX') {
    return <FileText className="w-5 h-5 text-blue-500" />;
  }
  if (['PNG', 'JPG', 'JPEG', 'IMG', 'WEBP'].includes(t)) {
    return <Image className="w-5 h-5 text-emerald-500" />;
  }
  if (['XLS', 'XLSX', 'CSV'].includes(t)) {
    return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
  }
  return <File className="w-5 h-5 text-slate-500" />;
};

const getCategoryBadge = (category) => {
  const categoryLabels = {
    IDENTITY: 'Identity Proof',
    CONTRACT: 'Employment Contract',
    OFFER_LETTER: 'Offer Letter',
    TAX: 'Tax Document',
    EDUCATION: 'Education / Cert',
    OTHER: 'General Document'
  };
  return categoryLabels[category] || category || 'Document';
};

export default function DocumentList({
  documents = [],
  isLoading = false,
  canDelete = false,
  onDeleteDocument,
  onUploadClick
}) {
  const safeDocs = Array.isArray(documents)
    ? documents
    : Array.isArray(documents?.data)
    ? documents.data
    : Array.isArray(documents?.documents)
    ? documents.documents
    : [];

  const [selectedDocToDelete, setSelectedDocToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!selectedDocToDelete || !onDeleteDocument) return;
    setIsDeleting(true);
    try {
      await onDeleteDocument(selectedDocToDelete.id);
      setSelectedDocToDelete(null);
    } catch (err) {
      console.error('Delete document failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (safeDocs.length === 0 && !isLoading) {
    return (
      <EmptyState
        iconType="documents"
        title="No documents uploaded yet"
        description="Official employment contracts, identity proofs, and credentials will appear here."
        actionLabel={onUploadClick ? 'Upload First Document' : undefined}
        onAction={onUploadClick}
      />
    );
  }

  return (
    <div className="space-y-3" id="document-list-container">
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
        {safeDocs.map((doc) => (
          <div
            key={doc.id}
            id={`document-item-${doc.id}`}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
          >
            {/* Left: Icon and Name/Meta */}
            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-100/90 flex items-center justify-center shrink-0 border border-slate-200/60">
                {getDocumentIcon(doc.type)}
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800 truncate" title={doc.name}>
                    {doc.name}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#E9F1FA] text-[#007EA7]">
                    {getCategoryBadge(doc.category)}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">
                    {doc.type}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    <span>{doc.fileSizeFormatted || '1 MB'}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Uploaded {formatDate(doc.uploadedAt)}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => downloadDocument(doc)}
                className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5 hover:text-[#00ABE4]"
                title="View / Download document"
                id={`doc-download-btn-${doc.id}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>View</span>
              </button>

              {canDelete && (
                <button
                  type="button"
                  onClick={() => setSelectedDocToDelete(doc)}
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="Delete document"
                  aria-label={`Delete ${doc.name}`}
                  id={`doc-delete-btn-${doc.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog for Deleting Document */}
      <ConfirmDialog
        isOpen={!!selectedDocToDelete}
        title="Delete Document"
        message={`Are you sure you want to remove "${selectedDocToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Document"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setSelectedDocToDelete(null)}
      />
    </div>
  );
}
