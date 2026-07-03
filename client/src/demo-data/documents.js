// This file has been intentionally emptied.
// Demo document data has been removed — documents array starts empty in AppContext.
// Real document records will be fetched from GET /vehicles/:id/documents in Phase 3/4.

// documentStatusMeta is still relevant reference data — kept here for use by DocumentVault/DocumentUpload.
export const documentStatusMeta = {
  valid:    { label: 'Valid',          color: '#1E8E5A', bg: '#f0fdf4', border: '#1E8E5A' },
  expiring: { label: 'Expiring Soon',  color: '#F5A623', bg: '#fffbeb', border: '#F5A623' },
  expired:  { label: 'Expired',        color: '#D93025', bg: '#fff1f0', border: '#D93025' },
  missing:  { label: 'Not Uploaded',   color: '#737782', bg: '#f5f5f5', border: '#c3c6d2' },
};
