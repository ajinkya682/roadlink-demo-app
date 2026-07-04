import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Save, Trash2, Calendar, FileText } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAppData } from '../../context/AppContext';
import { useDialog } from '../../context/DialogContext';

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents, updateDocument, removeDocument } = useAppData();
  const { showConfirm } = useDialog();
  
  const [doc, setDoc] = useState(null);
  const [docType, setDocType] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const foundDoc = documents.find(d => d.id === id);
    if (foundDoc) {
      setDoc(foundDoc);
      setDocType(foundDoc.type || '');
      
      // format expiry date for input type="date"
      if (foundDoc.expiryDateValue) {
        const d = new Date(foundDoc.expiryDateValue);
        if (!isNaN(d.getTime())) {
          setExpiryDate(d.toISOString().split('T')[0]);
        }
      }
    } else {
      navigate('/document-vault', { replace: true });
    }
  }, [id, documents, navigate]);

  if (!doc) return null;

  const handleSave = async () => {
    if (!docType.trim()) {
      setError('Document name is required');
      return;
    }
    
    setSaving(true);
    setError(null);
    try {
      await updateDocument(doc.id, {
        type: docType,
        expiryDate: expiryDate || null
      });
      navigate('/document-vault');
    } catch (err) {
      setError('Failed to update document');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await showConfirm('Delete Document', 'Are you sure you want to permanently delete this document?');
    if (confirmed) {
      setDeleting(true);
      try {
        await removeDocument(doc.id);
        navigate('/document-vault', { replace: true });
      } catch (err) {
        setError('Failed to delete document');
        setDeleting(false);
      }
    }
  };

  const isPdf = doc.fileUrl && doc.fileUrl.toLowerCase().endsWith('.pdf');

  return (
    <div className="min-h-screen bg-fog pb-24">
      <AppHeader title="Document Details" showBack />
      
      <div className="px-5 pt-5 space-y-6">
        {/* Document Viewer */}
        <div className="bg-white rounded-2xl border border-outline-light overflow-hidden shadow-sm flex flex-col">
          <div className="bg-surface-low px-4 py-3 border-b border-outline-light flex items-center justify-between">
            <span className="font-body text-xs font-bold text-on-surface-muted uppercase tracking-widest">
              File Preview (Tap to expand)
            </span>
            <Shield size={14} className="text-verified-green" />
          </div>
          <div 
            className="bg-[#e8e9eb] relative min-h-[250px] max-h-[400px] flex items-center justify-center overflow-auto cursor-pointer"
            onClick={() => doc.fileUrl && setIsFullscreen(true)}
          >
            {doc.fileUrl ? (
              isPdf ? (
                <div className="relative w-full h-[400px] pointer-events-none">
                  {/* Pointer events none so click passes through to the container to open fullscreen */}
                  <iframe 
                    src={doc.fileUrl} 
                    className="w-full h-full" 
                    title="PDF Preview"
                  />
                </div>
              ) : (
                <img 
                  src={doc.fileUrl} 
                  alt={doc.type} 
                  className="max-w-full max-h-[400px] object-contain"
                />
              )
            ) : (
              <div className="flex flex-col items-center text-on-surface-muted opacity-50 p-10">
                <FileText size={48} className="mb-2" />
                <p className="font-body text-sm font-semibold">No file attached</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold text-on-surface mb-2">Edit Information</h3>
          
          {error && (
            <div className="bg-alert-red/10 border border-alert-red/20 text-alert-red font-body text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <Input
              label="Document Name"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              list="docTypes"
            />
            <datalist id="docTypes">
              <option value="RC Book" />
              <option value="Insurance" />
              <option value="PUC" />
              <option value="Driving License" />
              <option value="Service Record" />
            </datalist>
          </div>

          <Input
            label="Expiry Date (Optional)"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="pt-4 space-y-3">
          <Button 
            variant="primary" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleSave}
            loading={saving}
            disabled={deleting}
          >
            <Save size={18} /> Save Changes
          </Button>

          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 text-alert-red border-alert-red/30 hover:bg-alert-red/5"
            onClick={handleDelete}
            loading={deleting}
            disabled={saving}
          >
            <Trash2 size={18} /> Delete Document
          </Button>
        </div>

      </div>

      {/* Fullscreen Viewer Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent absolute top-0 w-full z-10">
            <p className="text-white font-body text-sm font-semibold truncate px-2 shadow-sm drop-shadow-md">{doc.type}</p>
            <button 
              onClick={() => setIsFullscreen(false)}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
            >
              <Trash2 size={0} className="hidden" />
              {/* using an inline svg for X to avoid import issues if X is missing from lucide-react in this file */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {/* Viewer Area */}
          <div className="flex-1 w-full h-full flex items-center justify-center p-2 pt-16 pb-safe">
            {isPdf ? (
              <iframe 
                src={doc.fileUrl} 
                className="w-full h-full rounded-xl bg-white" 
                title="PDF Fullscreen"
              />
            ) : (
              <img 
                src={doc.fileUrl} 
                alt={doc.type} 
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
