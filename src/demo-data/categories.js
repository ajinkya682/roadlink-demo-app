// Report categories — used in ScanLanding + ReportDetail
// isAlert=true → alert-red styling, reserved for Theft & Emergency
export const reportCategories = [
  { id: 'wrong-parking',   label: 'Wrong Parking',   emoji: '🅿️', isAlert: false },
  { id: 'blocking-road',   label: 'Blocking Road',   emoji: '🚧', isAlert: false },
  { id: 'hit-and-run',     label: 'Hit & Run',       emoji: '💥', isAlert: false },
  { id: 'vehicle-damage',  label: 'Vehicle Damage',  emoji: '🔨', isAlert: false },
  { id: 'tow-alert',       label: 'Tow Alert',       emoji: '🚚', isAlert: false },
  { id: 'headlights-on',   label: 'Headlights On',   emoji: '💡', isAlert: false },
  { id: 'windows-open',    label: 'Windows Open',    emoji: '🪟', isAlert: false },
  { id: 'lost-vehicle',    label: 'Lost Vehicle',    emoji: '🔍', isAlert: false },
  { id: 'abandoned',       label: 'Abandoned',       emoji: '⚠️', isAlert: false },
  { id: 'accident-alert',  label: 'Accident Alert',  emoji: '🚑', isAlert: false },
  { id: 'vehicle-theft',   label: 'Vehicle Theft',   emoji: '🚨', isAlert: true  },
  { id: 'emergency',       label: 'Emergency',       emoji: '🆘', isAlert: true  },
];
