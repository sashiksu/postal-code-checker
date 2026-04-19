# Security Policy

## Supported versions

Security fixes are back-ported to the latest minor release of each supported major version. Older majors are best-effort.

| Version | Supported |
| --- | --- |
| 2.x     | ✅ |
| 1.x     | ✅ (patch releases for security only) |
| < 1.0   | ❌ |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security reports.**

Instead, use GitHub's [private vulnerability reporting](https://github.com/sashiksu/postal-code-checker/security/advisories/new) to submit the details. This keeps the report confidential until a fix is ready.

If you can't use that channel, email `sashiksu@gmail.com` with:

- A description of the issue and its impact.
- Steps to reproduce, ideally with a minimal code sample.
- The version(s) of `postal-code-checker` affected.
- Any suggested mitigation or patch, if you have one.

## What to expect

- **Acknowledgement** within 72 hours.
- **Triage + initial assessment** within 7 days.
- **Fix timeline** communicated once the scope is understood. Critical issues are prioritized; non-critical fixes ship with the next regular release.

You'll be credited in the release notes unless you prefer to stay anonymous.

## Scope

This package has **zero runtime dependencies** and performs local validation only — no network calls, no I/O, no user data leaves the machine. In practice this keeps the attack surface small: the two realistic concerns are ReDoS in the bundled regex patterns and integrity of the upstream data source.

- Regex patterns are sourced from Google's [`libaddressinput`](https://github.com/google/libaddressinput) and anchored at both ends by the sync pipeline. If you identify a pattern with super-linear runtime on crafted input, report it here.
- The package does not execute fetched data at install or runtime; there is no `postinstall` script.

Issues in upstream `libaddressinput` should be reported to Google directly.
