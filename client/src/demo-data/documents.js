// Document vault per vehicle
// status: 'valid' | 'expiring' | 'expired' | 'missing'
export const documents = [
  {
    id: 'd1',
    vehicleId: 'v1',
    type: 'RC Book',
    number: 'MH14AB1234',
    status: 'valid',
    expiry: 'Lifetime',
    expiryDate: null,
    uploadedDate: 'Jun 2025',
    icon: 'FileText',
  },
  {
    id: 'd2',
    vehicleId: 'v1',
    type: 'Insurance',
    number: 'POL-987654321',
    status: 'expiring',
    expiry: '12 days left',
    expiryDate: '2026-07-15',
    uploadedDate: 'Jan 2026',
    icon: 'Shield',
  },
  {
    id: 'd3',
    vehicleId: 'v1',
    type: 'PUC',
    number: 'PUC-MH14-876',
    status: 'expired',
    expiry: 'Expired',
    expiryDate: '2026-06-01',
    uploadedDate: 'Mar 2026',
    icon: 'Wind',
  },
  {
    id: 'd4',
    vehicleId: 'v1',
    type: 'Driving License',
    number: '',
    status: 'missing',
    expiry: 'Not uploaded',
    expiryDate: null,
    uploadedDate: null,
    icon: 'CreditCard',
  },
];

export const documentStatusMeta = {
  valid: { label: 'Valid', color: '#1E8E5A', bg: '#f0fdf4', border: '#1E8E5A' },
  expiring: { label: 'Expiring Soon', color: '#F5A623', bg: '#fffbeb', border: '#F5A623' },
  expired: { label: 'Expired', color: '#D93025', bg: '#fff1f0', border: '#D93025' },
  missing: { label: 'Not Uploaded', color: '#737782', bg: '#f5f5f5', border: '#c3c6d2' },
};
