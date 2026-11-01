# Review notes: "Bcrypt Max Password Length: The 72-Byte Limit Explained"

Draft: `src/content/blog/bcrypt-72-byte-limit.mdx` (`draft: true`). Preview: `npm run dev`, then open /blog/bcrypt-72-byte-limit.
Status: **Published 2026-11-01.** Inbound links added from the compare article, what-is-bcrypt, and the PHP and Python tutorials.

## Keyword choice
- **Primary: "bcrypt max password length"**. It appears in our own Search Console data (bcrypt max password length, bcrypt maximum password length), and Autocomplete shows the cluster (password length limit, 72 bytes limit, 72 characters).
- **Secondary, the error-message cluster** (Autocomplete, 2026-11-01): "valueerror password cannot be longer than 72 bytes", "fastapi password cannot be longer than 72 bytes", "could not hash the secret password cannot be longer than 72 bytes", "passlib bcrypt fastapi", "passlib bcrypt error". This is served by a dedicated H2 that quotes the exact error.
- Volume and difficulty: not verified (no keyword dataset).

## Test environment (2026-11-01)
Node 24.15.0 with bcrypt 6.0.0 and bcryptjs 3.0.3; Python 3.14.4 with bcrypt 5.0.0, passlib 1.7.4, Flask-Bcrypt 1.0.1 and pwdlib 0.3.1 (+argon2), plus a second environment with bcrypt 4.0.1 and passlib 1.7.4. PHP results come from `docs/drafts/bcrypt-php-tutorial/tests` (PHP 8.0.30 and 8.5.12).

## Claims and evidence
| Claim | Evidence |
|---|---|
| Node bcrypt/bcryptjs ignore bytes past 72; `bcryptjs.truncates()` | tests/node72.js |
| 19 emoji = 76 bytes; JS `.length` = 38 | tests/node72.js |
| pyca 5.0.0 raises in hashpw and checkpw (exact message) | tests/py72.py |
| pyca 4.0.1 ignores the extra bytes | tests/py72.py (py4 environment) |
| passlib + bcrypt 5.0 fails for a short password | tests/py72.py, tests/py-passlib.py |
| passlib self-test uses a 255-byte secret | passlib/handlers/bcrypt.py `detect_wrap_bug`: `(b"0123456789"*26)[:255]` |
| passlib works again with bcrypt==4.0.1 | tests/py-passlib.py |
| passlib 1.7.4 released 2020-10-08; bcrypt 5.0.0 released 2025-09-25 | PyPI JSON |
| Flask-Bcrypt 1.0.1 and pwdlib bcrypt raise over 72 bytes | tests/py72.py |
| FastAPI tutorial uses pwdlib + Argon2 (`PasswordHash.recommended()`) | fastapi.tiangolo.com/tutorial/security/oauth2-jwt/ |
| OWASP recipe `bcrypt(base64(hmac-sha384(password, pepper)))`; null-byte and shucking warnings | OWASP Password Storage Cheat Sheet |
| Pre-hash snippets (Node, Python): 64 bytes; correct passes, wrong fails | tests/node-article.mjs, tests/py-block.py |
| Legacy upgrade: 4.0.1 hash of an 87-byte password → 5.0 `checkpw` raises; `[:72]` verifies; wrong first 72 bytes rejected | tests/py-article.py |
| Go and Spring rows | Go pkg docs; spring.io CVE-2025-22228 (not tested; no Go or JVM here) |
| Okta incident facts | Okta advisory (the mechanism is our reading, worded as such) |
| Blowfish key setup = 18 × 32-bit subkeys = 72 bytes | Provos & Mazières 1999 / Blowfish design |

## On publish
- Remove `draft: true`; set `date` and `lastModified` to the publish day.
- Add inbound links: from cause #10 in `bcrypt-compare-returns-false.mdx`; from "The 72-byte limit" in `what-is-bcrypt.mdx`; from "Long passwords" in `bcrypt-php-tutorial.mdx`; from the Python tutorial.

## Follow-up found while researching
- `bcrypt-python-tutorial.mdx` recommends Flask-Bcrypt and the `bcrypt` library without mentioning that bcrypt 5.0 raises `ValueError` over 72 bytes, and that Flask-Bcrypt 1.0.1 does too. Refresh it next (this ties in with topic #10, Flask-Bcrypt vs Werkzeug).
