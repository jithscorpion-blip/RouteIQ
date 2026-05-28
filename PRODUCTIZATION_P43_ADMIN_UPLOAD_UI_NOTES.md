# RouteIQ P43 — Admin Data Upload Workflow UI

## Scope completed
- Added a frontend admin upload validation console for pilot CSV files.
- Supports customer, order, route, and vehicle CSV upload.
- Parses CSV rows in-browser and validates against the existing pilot import contract.
- Shows file-level status, total rows, valid rows, errors, warnings, and a small data preview.
- Keeps workflow as validate-only; no database write or production commit behavior is introduced.
- Restricts upload action to Admin and Planner demo roles; Viewer can only see the panel.

## Validation coverage
- Required field checks.
- Numeric field checks.
- Empty-file warnings.
- Per-row issue reporting with row number, field, and message.

## UI location
The panel is rendered in the right-side planning workspace below the demo session panel.

## Notes
This closes the main frontend gap from P42: the backend had `/api/import/schemas` and `/api/import/validate`, plus staging sample CSVs, but the product UI did not yet expose a user-facing pilot upload workflow.

## Still intentionally pending
- Real database commit/import approval workflow.
- Backend multipart upload endpoint.
- Duplicate/customer-order cross-reference validation.
- Downloadable rejected-row error file.
