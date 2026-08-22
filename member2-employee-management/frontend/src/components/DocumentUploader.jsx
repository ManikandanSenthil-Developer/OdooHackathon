import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { validateDocumentFile, formatBytes } from '../utils/validation';

const CATEGORIES = [
  { value: 'IDENTITY', label: 'Identity Proof (Passport / ID / SSN)' },
  { value: 'OFFER_LETTER', label: 'Offer Letter' },
  { value: 'CONTRACT', label: 'Employment Contract' },
  { value: 'EDUCATION', label: 'Education / Degree Certificate' },
  { value: 'TAX', label: 'Tax & Compliance Form' },
  { value: 'OTHER', label: 'Other Document' }
];

export default function DocumentUploader({
  employeeId,
  onUpload,
  onCancel,
  isUploading = false
}) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('IDENTITY');
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    const validationErr = validateDocumentFile(selectedFile);
    if (validationErr) {
      setError(validationErr);
      return;
    }

    setFile(selectedFile);
    if (!name) {
      setName(selectedFile.name);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    if (!name.trim()) {
      setError('Document name is required');
      return;
    }

    try {
      await onUpload(file, {
        name: name.trim(),
        category,
        uploadedBy: 'Admin / HR'
      });
      // reset
      setFile(null);
      setName('');
    } catch (err) {
      setError(err.message || 'Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" id="document-upload-form">
      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-[#00ABE4] bg-[#E9F1FA]/50'
            : file
            ? 'border-emerald-300 bg-emerald-50/30'
            : 'border-slate-300 hover:border-[#00ABE4] bg-slate-50/50 hover:bg-[#E9F1FA]/20'
        }`}
        id="drag-drop-zone"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
          id="document-file-input"
        />

        {file ? (
          <div className="flex items-center justify-center gap-3 text-emerald-800">
            <FileText className="w-8 h-8 text-emerald-600 shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setName('');
              }}
              className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 ml-2"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#E9F1FA] text-[#00ABE4] flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-800">
                <span className="text-[#00ABE4] font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-400">PDF, DOC, DOCX, PNG, JPG (Max 15MB)</p>
            </div>
          </div>
        )}
      </div>

      {/* Meta details inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700" htmlFor="doc-name-input">
            Document Title <span className="text-red-500">*</span>
          </label>
          <input
            id="doc-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Identity Proof Passport"
            className="dayflow-input w-full text-sm"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700" htmlFor="doc-category-select">
            Document Category
          </label>
          <select
            id="doc-category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="dayflow-input w-full text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            disabled={isUploading}
            onClick={onCancel}
            className="btn-secondary text-sm px-4 py-2"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!file || isUploading}
          className="btn-primary text-sm px-5 py-2 inline-flex items-center gap-2"
          id="upload-document-submit-btn"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <span>Upload Document</span>
          )}
        </button>
      </div>
    </form>
  );
}
