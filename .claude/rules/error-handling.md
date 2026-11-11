---
paths:
  - "apps/web/src/app/api/**"
---

# Error Handling

- Use typed errors that carry a code or variant, not a generic "something went wrong".
- Never swallow errors silently. Log or rethrow with added context about what operation failed.
- Handle every failed async operation. No fire-and-forget calls whose errors go nowhere.
- HTTP error responses: consistent shape (`{ error: { code, message } }`), correct status codes (400 validation, 401 auth, 404 not found, 500 unexpected).
- Never expose stack traces, internal paths, or raw database errors in production responses.
- Retry transient errors (network timeouts, rate limits) with exponential backoff. Fail fast on validation and auth errors. Don't retry them.
- Include correlation or request IDs in error logs when available.

<!-- lang:errors=typescript -->
**TypeScript / JavaScript:**

- Throw `Error` subclasses with a `code` and `cause` (`new AppError("load failed", { cause: err })`), never a bare string.
- Every promise is awaited, returned, or explicitly `void`-marked. `Promise.allSettled` when one rejection must not hide the rest.
- Silent failures: `catch {}`, `catch (e) { return null }`, `.catch(() => {})`, `?? []`/`|| 0` masking a failed fetch, `console.error` then continuing as success.
- Validate external data (requests, env, JSON) with a schema (`zod`) at the boundary; `catch (e: unknown)` and narrow before use.
<!-- /lang -->
