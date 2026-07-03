// Report categories — used in ScanLanding + ReportDetail
// isAlert=true → alert-red styling, reserved for Theft & Emergency
export const reportCategories = [
  { id: 'wrong-parking',   label: 'Wrong Parking',     icon: 'local_parking',     isAlert: false },
  { id: 'blocking-road',   label: 'Blocking Road',     icon: 'block',             isAlert: false },
  { id: 'hit-and-run',     label: 'Hit & Run',         icon: 'car_crash',         isAlert: false },
  { id: 'vehicle-damage',  label: 'Vehicle Damage',    icon: 'build',             isAlert: false },
  { id: 'fire',            label: 'Fire',              icon: 'fire_truck',        isAlert: false },
  { id: 'vehicle-theft',   label: 'Vehicle Theft',     icon: 'lock_reset',        isAlert: true  },
  { id: 'tow-alert',       label: 'Tow Alert',         icon: 'minor_crash',       isAlert: false },
  { id: 'headlights-on',   label: 'Headlights On',     icon: 'light_mode',        isAlert: false },
  { id: 'windows-open',    label: 'Windows Open',      icon: 'sensor_window',     isAlert: false },
  { id: 'emergency',       label: 'Emergency',         icon: 'e911_emergency',    isAlert: true  },
  { id: 'lost-vehicle',    label: 'Lost Vehicle',      icon: 'location_searching',isAlert: false },
  { id: 'abandoned',       label: 'Abandoned Vehicle', icon: 'delete_forever',    isAlert: false },
  { id: 'accident-alert',  label: 'Accident Alert',    icon: 'emergency_share',   isAlert: false, fullWidth: true },
];
