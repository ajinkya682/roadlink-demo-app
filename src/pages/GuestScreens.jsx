import React from 'react';
import { Link } from 'react-router-dom';

export function PublicScanLanding() {
  return <div style={{ padding: '24px' }}><h1>1. Public Scan Landing</h1><Link to="/report-detail">Next</Link></div>;
}

export function ReportDetail() {
  return <div style={{ padding: '24px' }}><h1>2. Report Detail & Send</h1><Link to="/report-confirmation">Next</Link></div>;
}

export function ReportConfirmation() {
  return <div style={{ padding: '24px' }}><h1>3. Report Confirmation</h1><Link to="/">Back Home</Link></div>;
}

export function SearchVehicle() {
  return <div style={{ padding: '24px' }}><h1>4. Search Vehicle</h1><Link to="/search-result">Next</Link></div>;
}

export function SearchResult() {
  return <div style={{ padding: '24px' }}><h1>5. Search Result</h1><Link to="/report-detail">Report this vehicle</Link></div>;
}
