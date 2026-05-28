# Railway Backend Setup

## Deploy service

Use Railway from GitHub or upload repo.

## Start command

```bash
npm run server:start
```

## Health check path

```txt
/api/health
```

## Recommended first mode

Start with memory mode:

```env
ROUTEIQ_DATABASE_MODE=memory
ROUTEIQ_ROUTING_PROVIDER=mock
ROUTEIQ_GOOGLE_ROUTES_ENABLED=false
```

After API smoke tests pass, switch to PostgreSQL mode.
