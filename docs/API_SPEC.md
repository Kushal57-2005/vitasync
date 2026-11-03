# VitaSync API Specification — Stage 1 Foundation

## Base URLs

- **Development**: `http://localhost:4000/api/v1`
- **Production**: Configured via environment variable `PORT` & `HOST`

## Standard Response Envelopes

### Success Envelope

Every successful response returns `2xx` HTTP status and the following JSON envelope:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "timestamp": "2026-11-04T01:00:00.000Z",
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalCount": 100,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### Error Envelope

Every failure returns `4xx` or `5xx` HTTP status and the following JSON envelope:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "dailyCalorieTarget",
        "message": "Minimum target is 1,000 kcal"
      }
    ]
  },
  "meta": {
    "requestId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "timestamp": "2026-11-04T01:00:00.000Z"
  }
}
```

## Foundation Endpoints

### 1. Readiness & Health Probe

- **Endpoint**: `GET /api/v1/health`
- **Headers**:
  - `x-request-id` (optional): Client-supplied UUID. Propagated back in response header and meta.
- **Response**: `200 OK`

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "service": "VitaSync API",
    "version": "0.1.0",
    "uptimeSeconds": 145,
    "timestamp": "2026-11-04T01:00:00.000Z",
    "environment": "development"
  },
  "meta": {
    "requestId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "timestamp": "2026-11-04T01:00:00.000Z"
  }
}
```

### 2. OpenAPI Scaffolding

- **Endpoint**: `GET /api/v1/docs`
- **Response**: `200 OK` (OpenAPI 3.0.3 specification JSON)
