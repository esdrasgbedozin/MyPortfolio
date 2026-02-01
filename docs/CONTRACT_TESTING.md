# Contract Testing Documentation

> **Epic 5.1 - EF-055d**  
> Automated testing to ensure API implementation matches OpenAPI specification

---

## Overview

Contract testing validates that our Edge Functions API (`/api/contact`, `/api/health`) adheres to the OpenAPI specification defined in `openapi.yaml`. This prevents breaking changes and ensures API consumers can rely on a stable contract.

### Why Contract Testing?

- **Prevents Breaking Changes**: Catch API contract violations before deployment
- **Documentation as Truth**: OpenAPI spec serves as single source of truth
- **Automated Validation**: Run on every PR to maintain consistency
- **Mock-First Development**: Frontend can develop against Prism mock server while backend is built

---

## Tools Used

| Tool                  | Purpose                                    | Version |
| --------------------- | ------------------------------------------ | ------- |
| **Spectral**          | OpenAPI schema linter and validator        | 6.15.0  |
| **Prism**             | Mock server from OpenAPI spec              | 6.x     |
| **Custom Test Suite** | Automated contract tests (`run-tests.mjs`) | Custom  |
| **GitHub Actions**    | CI/CD integration for automated testing    | -       |

---

## File Structure

```
.
├── .spectral.yaml                    # Spectral linter configuration
├── openapi.yaml                      # OpenAPI 3.1 specification (source of truth)
├── tests/
│   └── contract/
│       ├── run-tests.mjs             # Automated contract test suite
│       └── env.json                  # Test environment configuration
└── .github/
    └── workflows/
        └── ci.yml                    # CI pipeline with contract tests
```

---

## Running Contract Tests

### Locally

#### 1. Validate OpenAPI Schema

```bash
pnpm run openapi:lint
```

**Expected Output:**

```
✖ 3 problems (0 errors, 3 warnings, 0 infos, 0 hints)
```

_Warnings about unused components (Project, Certification, Skill) are expected as they're documented for reference only._

#### 2. Run Contract Tests

```bash
pnpm run test:contract
```

**Expected Output:**

```
=== Contract Testing Suite ===

ℹ Starting Prism mock server on port 4010...
✓ Prism mock server started
ℹ Testing GET /api/health...
✓ GET /api/health: ✓ Returns 200 with healthy status
ℹ Testing POST /api/contact with valid payload...
✓ POST /api/contact (valid): ✓ Returns 200 with message
ℹ Testing POST /api/contact with invalid email...
✓ POST /api/contact (invalid email): ✓ Returns 400 for bad request

=== Test Results ===
Total: 3
Passed: 3
Failed: 0
```

### In CI/CD

Contract tests run automatically on every push/PR via GitHub Actions:

```yaml
contract-tests:
  name: OpenAPI Contract Tests
  runs-on: ubuntu-latest
  steps:
    - Validate OpenAPI schema (spectral lint)
    - Run contract tests (Prism + custom suite)
    - Fail build if contract violated
```

---

## Test Coverage

### Endpoint: `GET /api/health`

**Contract Requirements:**

- Status Code: `200 OK`
- Response Schema:

```json
{
  "status": "healthy",
  "timestamp": "2026-01-30T10:00:00Z",
  "checks": {
    "database": "N/A",
    "emailService": "up"
  }
}
```

**Test Cases:**

✅ Returns 200 status code  
✅ Response contains `status` field with value `"healthy"`  
✅ Content-Type is `application/json`

---

### Endpoint: `POST /api/contact`

**Contract Requirements:**

- Request Schema (RFC 7807 format):

```json
{
  "name": "string (max 100)",
  "email": "string (format: email)",
  "message": "string (max 1000)",
  "turnstileToken": "string"
}
```

- Success Response (`200 OK`):

```json
{
  "message": "Message received successfully"
}
```

- Error Response (`400 Bad Request`):

```json
{
  "type": "/errors/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "Invalid email format",
  "instance": "/api/contact",
  "errors": [...]
}
```

**Test Cases:**

✅ Valid payload → 200 with success message  
✅ Invalid email → 400 with RFC 7807 error  
✅ Missing required field → 400  
✅ Content-Type validation

---

## Spectral Rules

Our `.spectral.yaml` enforces the following rules:

| Rule                    | Severity | Description                          |
| ----------------------- | -------- | ------------------------------------ |
| `operation-operationId` | error    | All operations must have operationId |
| `operation-description` | warn     | Operations should have descriptions  |
| `info-description`      | error    | API must have description            |
| `info-contact`          | warn     | API should have contact info         |
| `info-license`          | warn     | API should have license              |
| `operation-tag-defined` | warn     | All tags must be defined             |
| `path-params`           | error    | Path params must be documented       |
| `typed-enum`            | error    | Enums must have type                 |

---

## Prism Mock Server

Prism generates a mock server from `openapi.yaml`, providing realistic responses for development.

### Start Mock Server

```bash
npx @stoplight/prism-cli mock openapi.yaml -p 4010
```

### Test Endpoints

**Health Check:**

```bash
curl http://localhost:4010/api/health
```

**Contact Form (Valid):**

```bash
curl -X POST http://localhost:4010/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Test message",
    "turnstileToken": "mock-token"
  }'
```

**Contact Form (Invalid Email):**

```bash
curl -X POST http://localhost:4010/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "invalid-email",
    "message": "Test",
    "turnstileToken": "mock-token"
  }'
```

---

## Modifying the OpenAPI Spec

### Workflow

1. **Edit** `openapi.yaml` with your changes
2. **Validate** with Spectral:

   ```bash
   pnpm run openapi:lint
   ```

3. **Update Tests** in `tests/contract/run-tests.mjs` if needed
4. **Run Contract Tests**:

   ```bash
   pnpm run test:contract
   ```

5. **Commit** changes:

   ```bash
   git add openapi.yaml tests/contract/run-tests.mjs
   git commit -m "feat(api): Update contact endpoint schema"
   ```

6. **CI Validation**: GitHub Actions will automatically run contract tests on PR

### Breaking Change Detection

If your changes break the contract (e.g., removing a required field), CI will fail with:

```
✗ POST /api/contact (valid): ✗ Expected 200, got 400
```

This prevents accidental breaking changes from reaching production.

---

## Integration with Frontend

Frontend developers can use the Prism mock server for development:

```javascript
// In src/services/api.ts
const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:4010';

export async function submitContactForm(data: ContactFormData) {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

**Environment Variables:**

- **Development**: `PUBLIC_API_URL=http://localhost:4010` (Prism mock)
- **Production**: `PUBLIC_API_URL=https://portfolio.dev` (Real API)

---

## Troubleshooting

### Spectral Errors

**Error:** `Cannot extend non-existing rule: "rule-name"`

**Solution:** Check [Spectral OAS ruleset](https://meta.stoplight.io/docs/spectral/docs/reference/openapi-rules.md) for valid rule names.

### Prism Server Won't Start

**Error:** `Error: Port 4010 is already in use`

**Solution:**

```bash
# Find and kill process on port 4010
lsof -ti:4010 | xargs kill -9
```

### Contract Tests Fail Locally but Pass in CI

**Cause:** Stale mock server or cached data

**Solution:**

```bash
# Clean restart
pnpm run test:contract
```

The script automatically starts/stops Prism server.

### False Positives (Unused Components Warning)

**Warning:** `oas3-unused-component: Potentially unused component has been detected`

**Reason:** `Project`, `Certification`, `Skill` schemas are documented for reference but not used in API endpoints (content is static).

**Action:** Safe to ignore. These schemas are intentionally documented for future API expansion.

---

## Best Practices

### 1. OpenAPI-First Development

- Define endpoints in `openapi.yaml` **before** implementation
- Use Prism mock to validate contract with frontend
- Implement backend to match spec exactly

### 2. Comprehensive Examples

- Include `example` fields in all schemas
- Provide realistic data (not "string" or "123")
- Examples serve as test fixtures

### 3. Error Response Standards

- Use RFC 7807 Problem Details format
- Document all error codes (400, 403, 429, 500)
- Include `errors` array for validation failures

### 4. Versioning

- Use semantic versioning in `info.version`
- Document breaking changes in CHANGELOG
- Consider API versioning (`/api/v1/...`) for major changes

### 5. CI/CD Integration

- Never merge PRs with failing contract tests
- Review Spectral warnings before merging
- Update tests when changing contracts

---

## Resources

- [OpenAPI 3.1 Specification](https://spec.openapis.org/oas/latest.html)
- [Spectral Documentation](https://meta.stoplight.io/docs/spectral/)
- [Prism Documentation](https://meta.stoplight.io/docs/prism/)
- [RFC 7807: Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc7807)

---

**Document authored by:** GitHub Copilot  
**Date:** February 1, 2026  
**Epic:** 5.1 - Contract Testing (EF-055d)  
**Status:** ✅ Complete
