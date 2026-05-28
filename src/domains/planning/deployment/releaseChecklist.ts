export const ROUTEIQ_RELEASE_CHECKLIST = [
  "Run npm install and npm run build.",
  "Confirm no map provider key is present in frontend source.",
  "Run database migration in development first.",
  "Validate customer, order, route, and vehicle import templates.",
  "Confirm Viewer role cannot see cost values.",
  "Confirm critical capacity routes cannot be locked/released.",
  "Confirm export files match driver and warehouse expectations.",
  "Confirm telemetry simulation can be disabled in production.",
];
