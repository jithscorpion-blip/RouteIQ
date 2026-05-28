# RouteIQ P42 — Pilot Data Import Workflow + Staging Smoke-Test Runner

## Completed

P42 adds a safe staging workflow to validate pilot data and confirm that the backend MVP endpoints are alive.

## Added

- `server/importWorkflow/csvParser.js`
- `server/importWorkflow/pilotDataImportWorkflow.js`
- `server/importWorkflow/README.md`
- `server/tests/stagingSmokeTestRunner.js`
- `server/tests/P42_STAGING_SMOKE_TEST_README.md`
- `staging/pilot-data/P42_IMPORT_WORKFLOW_GUIDE.md`

## New npm scripts

- `npm run staging:pilot-import`
- `npm run staging:smoke`
- `npm run staging:p42`

## Safety

- No database write.
- No Google Routes call.
- No GPS feed activation.
- No auth provider change.
- No frontend workflow change.

## Recommended next step

P43: Add admin data upload workflow UI for pilot CSV validation.
