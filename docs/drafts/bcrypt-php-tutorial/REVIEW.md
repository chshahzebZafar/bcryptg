# Review notes: "Bcrypt in PHP" (rewrite, 2026-10-26)

Why: Search Console listed this page as **Crawled – currently not indexed** (validation failed 2026-10-24). The old version mostly repeated php.net, said the default cost was 10 (12 since PHP 8.4), used cut-off placeholder hashes, and had a buggy MD5 migration (`!==` comparison, double-quoted SQL literal, MD5 hashes left for inactive users).

## Test environment
| PHP | Source |
|---|---|
| 8.0.30 | XAMPP (end-of-life; deliberately kept to show pre-fix behaviour) |
| 8.5.12 | Official windows.php.net zip, SHA-256 verified, temporary (deleted after testing) |

Run: `php tests/php-behaviour.php` and `php tests/php-snippets.php` (8.5 needs `-d extension=pdo_sqlite -d extension=sodium` when run without a php.ini).

## Claims and evidence
| Claim | Evidence |
|---|---|
| PASSWORD_DEFAULT and PASSWORD_BCRYPT are both '2y' | php-behaviour.php (8.0, 8.5) |
| Default cost 10 on 8.0, 12 on 8.5; changed in 8.4 | php-behaviour.php; php.net password_hash changelog |
| needs_rehash(cost-10 hash, PASSWORD_DEFAULT) true on 8.5, false on 8.0 | php-behaviour.php |
| >72 bytes silently truncated on both versions | php-behaviour.php; php.net caution |
| 8.0 truncates at null byte; 8.5 throws ValueError (exact message) | php-behaviour.php |
| Null-byte fix = CVE-2024-3096, in 8.1.28 / 8.2.18 / 8.3.6 | php.net ChangeLog-8 |
| 11.5% of raw HMAC-SHA256 outputs contain \0 | php-behaviour.php (20,000 samples) |
| base64 pepper: 44 bytes, 3,000 samples, no errors | php-behaviour.php, php-snippets.php |
| verify accepts $2b$/$2a$; get_info says 'unknown' for them | php-behaviour.php, laravel.php |
| Argon2id hash 97 chars; needs_rehash bcrypt→argon2id true | php-behaviour.php |
| Register/login, dummy hash timing (~290 vs ~300 ms), rehash upgrade, 72-byte guard | php-snippets.php (SQLite) |
| MD5 wrap migration (both steps), dormant accounts stay wrapped | php-snippets.php |
| Laravel HASH_VERIFY default true; RuntimeException message | laravel/framework 12.x source (BcryptHasher.php, config/hashing.php) |
| $2b$→$2y$ fix; preg_replace pitfall | laravel-fix.php |

## Not tested locally
- Laravel `Hash::make/check/needsRehash` snippet (no Laravel install); standard documented API.
- MySQL/PostgreSQL: SQL tested on SQLite only (prepared statements, single-quoted literals).
