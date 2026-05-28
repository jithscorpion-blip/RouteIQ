# RouteIQ Production Cutover Sequence

1. Deploy backend to staging in memory mode.
2. Deploy frontend to staging in mock API mode.
3. Switch frontend to backend API mode.
4. Provision PostgreSQL staging database.
5. Run migrations in dry-run, then execution mode.
6. Seed sample data in staging.
7. Test route list, lock/release, order assignment, telemetry ping, import validation.
8. Replace demo auth with production auth provider.
9. Configure Google key, restrictions, quotas, and billing alerts.
10. Enable ROUTING_PROVIDER=google but keep ROUTEIQ_ENABLE_LIVE_GOOGLE_ROUTES=false.
11. Run mock routing in production-like flow.
12. Enable live Google routes for one controlled pilot route only.
13. Enable driver GPS browser ping for one pilot driver only.
14. Review cost, telemetry, and route accuracy before expansion.
