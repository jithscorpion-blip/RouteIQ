# Final RouteIQ Phase A to E Handoff Checklist

## Functional QA
- Depot filter works.
- Role switch works.
- Viewer cannot see cost fields.
- Viewer cannot edit route workflows.
- Critical route cannot be locked or released.
- Route can be locked/released by Admin/Planner when not critical.
- Stop move up/down works for selected route.
- Resequencing audit note appears after manual move.
- Assign order button moves order into selected route assignment.
- Unassign button removes order from selected route assignment.
- Driver CSV export downloads.
- Warehouse pick CSV export downloads.
- Actual vs planned panel shows variance where data exists.

## Architecture QA
- No backend added.
- No API added.
- No database dependency added.
- No reducer added prematurely.
- Components remain under `src/domains/planning/components`.
- State helpers/selectors remain under `src/domains/planning/state`.
- Utility helpers remain under `src/domains/planning/utils`.
- Domain data/types remain under `src/domains/planning`.

## Next Productization Phase
- Add real data import.
- Add backend persistence.
- Add map and routing provider.
- Add live ETA/actual GPS feed later.
- Add driver mobile app workflow.
