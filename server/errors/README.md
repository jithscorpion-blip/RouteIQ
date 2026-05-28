# RouteIQ API Error Catalog

This folder centralizes backend error codes so frontend, backend, and future API documentation use the same language.

Current catalog:

- `VALIDATION_FAILED`
- `INVALID_JSON_BODY`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `ROUTE_NOT_FOUND`
- `ORDER_NOT_FOUND`
- `ENDPOINT_NOT_FOUND`
- `DATABASE_UNAVAILABLE`
- `ROUTING_PROVIDER_UNAVAILABLE`
- `ROUTEIQ_SERVER_ERROR`

Every API error response should follow this shape:

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Request validation failed.",
    "details": []
  }
}
```
