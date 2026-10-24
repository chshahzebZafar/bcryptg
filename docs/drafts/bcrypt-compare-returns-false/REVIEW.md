# Review notes: "Why bcrypt.compare() Returns False"

Draft: `src/content/blog/bcrypt-compare-returns-false.mdx` (`draft: true`, so it's hidden in production).
Preview: run `npm run dev`, then open http://localhost:3000/blog/bcrypt-compare-returns-false.
Status: **Published 2026-10-24** after review by Shahzeb Zafar. Inbound links added from /verify, the Node, PHP and Python tutorials, and the rounds post.

## Test environment (2026-10-24)

| Component | Version |
|---|---|
| Node.js | 24.15.0 |
| bcrypt (native, npm) | 6.0.0 |
| bcryptjs | 3.0.3 |
| mongoose / MongoDB (mongodb-memory-server) | 9.11.4 / 8.2.6. Result: without the guard, login fails after an unrelated profile edit; with the guard, it keeps working. `select: false` gives `undefined` → bcryptjs throws; `.select('+password')` → true |
| dotenv / dotenv-expand | 18.0.9 / 1000.0.0 |
| PHP | 8.0.30 (XAMPP). Note: older than current PHP; re-run on 8.3/8.4 if possible |
| Python / pyca bcrypt | 3.14.4 / 5.0.0 |
| TypeScript | 5.9.3 (strict) |

All scripts are in `tests/`. Re-run them with the commands at the top of each file.

## What each claim rests on

| Article claim | Evidence |
|---|---|
| Hashing twice gives different strings; compare works | `causes.js` §1, `causes.php`, `causes.py` |
| Double-hash on save breaks login; the `isModified` guard fixes it | `mongoose-test.js` (real MongoDB), plus `causes.js` §2 |
| Swapped arguments: Node and PHP return false, Python raises `Invalid salt` | `causes.js` §3, `causes.php`, `causes.py` |
| Missing await: `=== true` is never true; bare `if` is always true (even with a wrong password) | `causes.js` §4, `snippets.mjs` |
| TypeScript strict catches both (TS2367, TS2801) | `missing-await.ts` compiled with tsc 5.9.3 |
| Truncated / whitespace / `b'...'` hashes fail | `causes.js` §5–6, `causes.php`, `causes.py`, `snippets.py` (SQL check run in SQLite) |
| bash double quotes destroy a hash; dotenv keeps it; dotenv-expand cuts it to `$2b$10` even when single-quoted; `\$` survives expand | `env-test.sh` |
| Next.js expands `.env` variables; escape a literal `$` as `\$` | Next.js docs: `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md` (“Referencing Other Variables”) |
| Native `bcrypt` 6.0.0 rejects a real PHP `$2y$` hash; normalizing to `$2b$` fixes it; bcryptjs and pyca accept `$2y$`; PHP verifies Node hashes | `y2b.js`, `causes.js` §11, `causes.py`, `causes.php` |
| Hash field not loaded: Node libraries throw (exact messages quoted) | `causes.js` §7, `mongoose-test.js` |
| Extra bytes after 72 still match in node bcrypt and bcryptjs | `causes.js` §10 |
| pyca 5.0.0 raises in `hashpw` and `checkpw` over 72 bytes (exact message quoted) | `causes.py` |
| Spring Security throws over 72 bytes after the CVE-2025-22228 fix | spring.io advisory (not tested locally; no JVM) |
| compare ignores cost; bcrypt ↔ bcryptjs interoperate | `causes.js` §9 and cross-library |

## Not tested locally (cited only)
- **Docker Compose `$$` escaping:** Docker isn't installed here. Cited from the Compose file reference: https://docs.docker.com/reference/compose-file/interpolation/
- **Spring Security behaviour:** from the official advisory.
- Behaviour of Sequelize, TypeORM and Prisma hooks is mentioned only as "the same trap exists"; no specific API claims are made.

## Reviewer checklist
- [ ] Read the article end to end for tone and accuracy
- [ ] Re-run `tests/` (or spot-check §2, §6 and §7, the surprising findings)
- [ ] Confirm you're comfortable with the byline and the "reviewed and tested by Shahzeb Zafar" line
- [ ] Optional: re-run `causes.php` on PHP 8.3+ and update the table if anything differs
- [ ] Remove `draft: true`, set `date` and `lastModified` to the publish date, then commit
- [ ] After publishing: add a "Full troubleshooting guide →" link from `/verify` and links from the three tutorials (see strategy doc, Part 6)

## Planned links to add later
When Brief 2 (72-byte limit) and Brief 6 (database storage) are published, link them from causes 10 and 5 respectively.

## Also found while drafting (separate from this article)
- `how-many-bcrypt-rounds.mdx` contains benchmark numbers presented as measured output ("A typical output on a 2026 cloud instance…") and GPU guess rates (about 3,000/s at cost 12; about 10 billion/s for MD5) without a source. Under the content rules, these should be sourced, reproduced or removed in the refresh.
- `bcrypt-nodejs-tutorial.mdx` tells readers to install `@types/bcryptjs`. bcryptjs 3 ships its own types, so this step is outdated.
- When this article is published, add a link to it from the "Thinking the cost must match" mistake in `how-many-bcrypt-rounds.mdx` (removed for now so the live post doesn't link to a draft).
