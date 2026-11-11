---
paths:
  - "apps/web/src/app/api/**"
---

# Security

- Validate all user input at the system boundary. Never trust request parameters.
- Use parameterized queries. Never concatenate user input into SQL or shell commands.
- Sanitize output to prevent XSS. Use framework-provided escaping.
- Authentication tokens must be short-lived. Store refresh tokens server-side only.
- Never log secrets, tokens, passwords, or PII.
- Use constant-time comparison for secrets and tokens.
- Set appropriate CORS, CSP, and security headers.
- Rate-limit authentication endpoints.

<!-- lang:security=typescript -->
**TypeScript / JavaScript:**

- `npm audit` / `pnpm audit` / `bun audit`. Flag new deps with install scripts, typosquat names, or unpinned versions in CI.
- XSS sinks: `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, unescaped template output.
- Prototype pollution from merging untrusted objects; `child_process.exec` with interpolated input (use `execFile`).
- PII or secrets in logs (`console.log(user)`, `logger.info(req.body)`) or in client bundles (`NEXT_PUBLIC_*`).
<!-- /lang -->

<!-- agent-starter:codex-guidance -->
