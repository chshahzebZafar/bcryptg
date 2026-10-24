# BcryptGenerator.org — SEO Content Strategy (October 2026)

Status: **Topics approved 2026-10-24. Revised 2026-10-25 with Search Console data (Part 9b): topic #10 changed from htpasswd to Flask-Bcrypt vs Werkzeug.**
Prepared: 2026-10-24. All drafts produced from this plan must be fact-checked, code-tested and approved by a human editor (Shahzeb Zafar) before publication.

> **Data integrity note.** No keyword tool (Ahrefs, Semrush, Keyword Planner, DataForSEO) was available. Every search volume and keyword difficulty in this document is marked **Not verified (NV)**. Demand evidence comes from two real sources:
> 1. **Google Autocomplete** (public suggest endpoint, `hl=en`, `gl=us`, queried 2026-10-24). A phrase appearing in Autocomplete shows people search it; it says nothing about volume.
> 2. **Live search results** (web search, US, 2026-10-24) for the main target queries.
> Competition levels below are **my estimates from the observed results**, not tool metrics.

---

## PART 1 — Website and existing content audit

### Verified tools (live, checked 2026-10-24)

| URL | What it actually does | Primary target |
|---|---|---|
| `/` | bcrypt hash generator (cost 4–14, bcryptjs, client-side), quick hash check, code snippets in 7 languages, 72-byte warning | "bcrypt generator" |
| `/verify` | bcrypt checker: verifies a password against `$2a$/$2b$/$2y$` hashes, shows version/cost/rating, refuses cost > 16; hash anatomy, 7 failure causes, code, FAQ | "bcrypt checker / verify bcrypt hash" |
| `/tools/md5` | MD5 of UTF-8 text; test vectors, mismatch causes, CLI/code, FAQ | "md5 generator" |
| `/tools/sha256` | SHA-256 via Web Crypto; test vectors, SHA-256 vs MD5 vs bcrypt table, CLI/code, FAQ | "sha256 generator" |
| `/tools/password-strength` | Heuristic strength score (length thresholds, character classes, common patterns); NIST SP 800-63B-4 summary | "password strength checker" |
| `/tools` | Hub with "which tool do you need" table | — |

Not features (do not claim): file hashing, an API (`/api-docs` is a noindexed "coming soon" page), htpasswd output, Argon2/scrypt/PBKDF2 generators.

### Existing articles

| Slug | Words | Main sections | Internal links out |
|---|---|---|---|
| what-is-bcrypt | ~780 | how it works, Blowfish, salting, why slow, vs MD5/SHA-256, cost, verifying | `/`, rounds |
| how-many-bcrypt-rounds | ~740 | cost factor table, OWASP, benchmark script, attacker impact | `/`, vs-argon2 |
| bcrypt-vs-argon2 | ~700 | comparison table, memory hardness, 72-byte limit, OWASP settings, code | `/`, rounds |
| bcrypt-nodejs-tutorial | ~760 | bcryptjs install, async/sync, Express, TS, getRounds, mistakes | `/`, rounds |
| bcrypt-php-tutorial | ~730 | password_hash/verify, needs_rehash, login example, Laravel, **migrating from MD5** | `/`, node |
| bcrypt-python-tutorial | ~690 | install, encoding, rounds, Flask, Django, FastAPI, mistakes | `/`, rounds |

### Findings

1. **Internal linking is thin and one-directional.** No article links to `/verify`, `/tools/sha256`, `/tools/md5` or `/tools/password-strength`. Articles only link to `/` and one sibling.
2. **Thin coverage of troubleshooting intent.** The highest-signal Autocomplete clusters ("compare returns false", "72 bytes", "decrypt", "length varchar") have no dedicated article.
3. **Content needs a refresh against 2025–26 library changes.** pyca/bcrypt 5.0.0 now raises `ValueError` for passwords over 72 bytes; Spring Security patched CVE-2025-22228; PHP 8.4 raised the default cost to 12. The Python tutorial in particular should be checked.
4. **Indexing is the bottleneck.** Search Console (seen 2026-10-23) shows only 5 indexed URLs, 3 of them still on `www`. New articles will only pay off once crawl frequency improves, so internal links and a few genuine external links matter as much as new posts.
5. **Cannibalisation risks to manage** (details in Part 6):
   - `/verify` failure list vs a "compare returns false" article
   - `what-is-bcrypt` salting section vs a salt explainer
   - `/tools/sha256` comparison table and `what-is-bcrypt` vs a "bcrypt vs SHA-256" article
   - PHP tutorial "Migrating from MD5" vs a standalone migration article (deferred for that reason)

### Problems the site solves (from the tools)
Create a bcrypt hash for seeding/testing; check whether a password matches a stored hash; understand hash format and cost; compare hash types; judge password strength. Topics that end in "…so check/generate a hash" convert naturally to tool use.

---

## PART 2 — Competitor and search intent analysis (observed 2026-10-24)

| Query | What ranks (observed) | Intent | Gap / opportunity |
|---|---|---|---|
| bcrypt compare always returns false | GitHub issue (bcrypt.js #131), Auth0 community thread, dev.to, Habr Q&A, masteringjs, mojoauth, Meteor forum | Troubleshooting | **No single authoritative guide.** Answers are scattered across threads. One ranking guide states compare "will always fail" if salt rounds differ, which is wrong because compare reads the cost from the hash. A structured, correct, multi-language checklist is a genuine improvement. |
| bcrypt 72 byte limit | Monterail blog, enamya blog, Go crypto commit, mojoauth programmatic pages, g5cybersecurity | Informational / technical | Existing pages explain truncation but **none tabulate current per-library behaviour** (Go rejects, pyca 5.0 raises, Spring throws after CVE fix, node bcrypt and PHP truncate). The Okta 2024 incident and Spring CVE give real-world stakes. |
| bcrypt decrypt | Wikipedia, mojoauth, Clerk blog, dev.to, a GitHub brute-forcer, and the *unrelated* `bcrypt` file-encryption CLI | Mixed (many want to "reverse" a hash) | Results don't serve the person who lost a password or inherited a database. Opportunity: answer "no" in one line, then the useful paths (reset, verify a guess, why "decrypt" sites are lookup tables), plus disambiguating the `.bfe` file tool. |
| bcrypt 2a vs 2b vs 2y | Wikipedia, passlib source, tool sites (miniwebtool, captaindns), BouncyCastle source | Informational | Mostly secondary sources and code. Opportunity: plain-English history plus a **compatibility table by language/library** and safe prefix-rewrite guidance. |
| bcrypt hash length varchar mysql/postgres | mojoauth (contradictory advice), techearl, g5cybersecurity, mkyong | Practical how-to | Advice conflicts (CHAR(60) vs VARCHAR(255) vs text). Opportunity: one clear recommendation with reasoning (algorithm migration, PHP's own 255 guidance), collation/case-sensitivity notes, and migrations for widening a truncating column. |
| bcrypt vs sha256 | mojoauth (2 pages), ssojet, rietta, NordVPN | Comparison | Dominated by vendor programmatic pages. Opportunity: concrete attack-cost reasoning, the "SHA-256 then bcrypt" pre-hash nuance (null-byte pitfall), and where SHA-256 *is* right. Must avoid unverifiable speed numbers. |
| bcrypt spring boot | mkyong, mastertheboss, javadevjournal, appsdeveloperblog, dev.to, NashTech | Tutorial | Tutorials are older and **none mention CVE-2025-22228** or the new 72-byte exception, `DelegatingPasswordEncoder`/`{bcrypt}` prefixes, or upgrade paths. |
| golang bcrypt | example-code.com, mojoauth, educative, ssojet, slingacademy, couchbase | Tutorial | Thin, generic. Few cover `ErrPasswordTooLong`, `Cost()`, constant-time compare semantics, or HTTP handler integration. |
| why bcrypt generates different hashes | Medium, freeCodeCamp, g5cybersecurity, Treehouse, pentesterlab | Explainer | One ranking source wrongly advises storing the salt separately. Opportunity: short, exact, visual answer (salt in characters 8–29) with a live demo via our generator/checker. |
| htpasswd bcrypt nginx | nginx mailing list (2017), getpagespeed, htpasswd generator tools, dev.to | How-to | **Conflicting claims about nginx bcrypt support.** Opportunity: clear guidance with the official nginx/Apache docs, `htpasswd -B -C`, and how to test support on your own build. |
| bcrypt generator online (tool SERP) | ciphersonline, javainuse, openreplay, devtoollab, qubittool, imageonline, filestash, captaindns | Tool | Crowded with near-identical tools. Differentiation has to come from trust content and depth, not the tool alone. |

**Competitive pattern.** Auth vendors (MojoAuth, SSOJet) publish large numbers of templated "bcrypt in X" / "bcrypt vs X" pages. They rank on breadth, but they are generic and sometimes inaccurate. We can't match their scale, and Google's scaled-content-abuse policy says we shouldn't try. We win on **accuracy, current library behaviour, and tool integration**.

---

## PART 3 — Keyword research (52 candidates)

Volume and difficulty: **NV = Not verified** for every row (no keyword dataset available). "AC" = phrase or close variant observed in Google Autocomplete on 2026-10-24. Competition is estimated from observed results. Market: global English, Autocomplete pulled with US settings.

| # | Keyword | Cluster | Intent | Evidence | Est. competition | Relevance | Content type |
|---|---|---|---|---|---|---|---|
| 1 | bcrypt compare always returns false | D | Troubleshooting | AC | Low | High | Troubleshooting guide |
| 2 | bcrypt compare not working | D | Troubleshooting | AC | Low | High | (same article) |
| 3 | bcrypt compare password | E | How-to | AC | Medium | High | (same article / tutorials) |
| 4 | how does bcrypt compare work | E | Informational | AC | Low | High | Salt explainer |
| 5 | bcrypt 72 bytes limit | D | Informational | AC | Low–Med | High | Deep-dive |
| 6 | bcrypt max password length | D | Informational | AC | Low–Med | High | (same) |
| 7 | bcrypt 72 bytes error | D | Troubleshooting | AC | Low | High | (same) |
| 8 | passlib bcrypt 72 bytes | D | Troubleshooting | AC | Low | Medium | (same, Python section) |
| 9 | bcrypt max input length | D | Informational | AC | Low | High | (same) |
| 10 | bcrypt decrypt | E | Mixed | AC | Medium | High | Explainer |
| 11 | bcrypt decrypt online | E | Mixed (tool) | AC | Medium | High | (same, honest answer) |
| 12 | is bcrypt reversible | E | Informational | AC | Low | High | (same) |
| 13 | bcrypt decrypt laravel | E | Mixed | AC | Low | Medium | (same) |
| 14 | why bcrypt generates different hashes | E | Informational | AC | Low | High | Salt explainer |
| 15 | how does bcrypt know the salt | E | Informational | AC | Low | High | (same) |
| 16 | bcrypt salt rounds meaning | A | Informational | AC | Low–Med | High | (same; links rounds post) |
| 17 | bcrypt salt length | A | Informational | AC | Low | High | (same) |
| 18 | bcrypt hash format | D | Informational | AC | Low | High | Format article |
| 19 | bcrypt 2a vs 2b | D | Informational | AC | Low | High | (same) |
| 20 | bcrypt 2a 2b 2y | D | Informational | AC | Low | High | (same) |
| 21 | bcrypt 2y | D | Informational | AC | Low | High | (same) |
| 22 | bcrypt length varchar | D | How-to | AC | Low | High | DB storage guide |
| 23 | bcrypt length mysql | D | How-to | AC | Low | High | (same) |
| 24 | bcrypt postgresql data type | D | How-to | AC | Low | High | (same) |
| 25 | bcrypt hash length | D | Informational | AC (bcrypt max hash length / output length) | Low | High | (same) |
| 26 | bcrypt vs sha256 | B | Comparison | AC | Medium | High | Comparison |
| 27 | why is bcrypt better than sha256 | B | Comparison | AC | Low–Med | High | (same) |
| 28 | bcrypt vs sha256 for password | B | Comparison | AC | Medium | High | (same) |
| 29 | bcrypt java spring boot | C | Tutorial | AC | Medium | High | Tutorial |
| 30 | bcrypt spring security | C | Tutorial | AC | Medium | High | (same) |
| 31 | spring bcrypt password encoder | C | Tutorial | AC | Medium | High | (same) |
| 32 | bcrypt java maven | C | How-to | AC | Low | Medium | (same) |
| 33 | bcrypt golang | C | Tutorial | AC | Medium | High | Tutorial |
| 34 | golang bcrypt compare hash and password | C | How-to | AC | Low | High | (same) |
| 35 | bcrypt golang install | C | How-to | AC | Low | Medium | (same) |
| 36 | htpasswd bcrypt | C | How-to | AC | Low–Med | Medium–High | How-to |
| 37 | nginx htpasswd bcrypt | C | How-to | AC | Low–Med | Medium–High | (same) |
| 38 | htpasswd bcrypt generator | C | Tool | AC | Medium | High | (same; future tool option) |
| 39 | bcryptjs vs bcrypt | C | Comparison | AC | Low–Med | High | Comparison (backlog #11) |
| 40 | bcrypt c# .net core | C | Tutorial | AC | Medium | High | Tutorial (backlog) |
| 41 | bcrypt net next | C | How-to | AC | Low–Med | Medium | (backlog) |
| 42 | bcrypt vs scrypt | B | Comparison | AC | Medium | Medium | Comparison (backlog) |
| 43 | bcrypt vs pbkdf2 | B | Comparison | AC | Medium | Medium | Comparison (backlog) |
| 44 | bcrypt vs argon2id | B | Comparison | AC | Medium | High | **Existing post** (refresh) |
| 45 | bcrypt cost factor recommendation | A | Informational | AC | Medium | High | **Existing post** (refresh) |
| 46 | bcrypt rounds best practice | A | Informational | AC | Medium | High | **Existing post** |
| 47 | is bcrypt secure 2026 | E | Informational | AC | Medium | High | **Existing posts** (avoid new page) |
| 48 | is bcrypt deprecated | E | Informational | AC | Low–Med | High | Section in vs-argon2 refresh |
| 49 | bcrypt laravel | C | Tutorial / tool | AC | Medium | Medium | **Existing PHP post** |
| 50 | bcrypt rust | C | Tutorial | AC | Low–Med | Medium | Tutorial (backlog) |
| 51 | convert md5 to bcrypt | D | How-to | AC (weak, single suggestion) | Low | Medium | Backlog (overlaps PHP post) |
| 52 | bcrypt pepper / salt and pepper bcrypt | A | Informational | AC (weak) | Low | Medium | Backlog |

---

## PART 4 — Ranked top 10 blog topics

Ranking weighs relevance, observed demand signals (Autocomplete breadth), the weakness of current results, original-value potential, and conversion to `/verify` or `/`. **Volume and difficulty are NV for all ten.**

| Priority | Title | Primary keyword | Slug | Why this rank |
|---|---|---|---|---|
| 1 | Why bcrypt.compare() Returns False (and How to Fix It) | bcrypt compare returns false | `/blog/bcrypt-compare-returns-false` | Strongest troubleshooting signal; results are forum threads with a wrong claim among them; converts directly to `/verify` |
| 2 | Bcrypt's 72-Byte Password Limit: What Every Library Does Now | bcrypt 72 byte limit | `/blog/bcrypt-72-byte-limit` | Broad AC cluster (limit, max length, error, passlib); 2024–25 library changes not covered elsewhere; real incidents (Okta, Spring CVE) |
| 3 | Can You Decrypt a Bcrypt Hash? What to Do Instead | bcrypt decrypt | `/blog/can-bcrypt-be-decrypted` | Large mixed-intent cluster; current results don't serve the real need; strong `/verify` tie-in |
| 4 | How Bcrypt Salts Work: Why Every Hash Is Different | why bcrypt generates different hashes | `/blog/bcrypt-salt-explained` | Many AC question variants; a ranking source gives wrong advice; demo with our tools |
| 5 | $2a$, $2b$, $2y$: Bcrypt Hash Versions Explained | bcrypt 2a vs 2b vs 2y | `/blog/bcrypt-2a-2b-2y` | Clean AC cluster, weak results; complements `/verify` |
| 6 | How to Store Bcrypt Hashes in MySQL and PostgreSQL | bcrypt hash length varchar | `/blog/store-bcrypt-hash-database` | Conflicting advice in results; very practical; prevents "compare returns false" (truncation) |
| 7 | Bcrypt vs SHA-256 for Passwords | bcrypt vs sha256 | `/blog/bcrypt-vs-sha256` | Core comparison; vendor-dominated results; links both tools |
| 8 | Bcrypt in Spring Boot: BCryptPasswordEncoder Done Right | bcrypt spring boot | `/blog/bcrypt-spring-boot` | Strong AC; results are outdated and miss CVE-2025-22228 |
| 9 | Bcrypt in Go with golang.org/x/crypto/bcrypt | bcrypt golang | `/blog/bcrypt-golang` | Strong AC; thin results; completes the language cluster |
| 10 | Flask-Bcrypt vs Werkzeug: Which Should Hash Your Passwords? | flask bcrypt | `/blog/flask-bcrypt-vs-werkzeug` | Seen in our own Search Console data (several Flask-Bcrypt/Werkzeug queries, including a direct "which is best" question); tested findings no competitor covers. Replaces htpasswd, which showed no Search Console signal |

**Backlog (next wave):** htpasswd/nginx basic auth (moved from #10), bcrypt vs bcryptjs (Node), bcrypt in C#/.NET (BCrypt.Net-Next), bcrypt vs scrypt vs PBKDF2, bcrypt in Rust, migrating legacy MD5/SHA-1 hashes (would need the PHP post's section trimmed first), peppering.

### Topic detail tables

#### 1. Why bcrypt.compare() Returns False (and How to Fix It)
| Field | Detail |
|---|---|
| Primary keyword | bcrypt compare returns false |
| Secondary | bcrypt compare not working, bcrypt compare always false, bcrypt comparesync false, bcrypt checkpw false, password_verify returns false, bcrypt hash mismatch, bcrypt login fails |
| Long-tail | bcrypt compare always returns false node js · bcrypt compare returns false mongoose · password_verify always returns false php · bcrypt checkpw returns false python · bcrypt compare false after saving user |
| Intent | Informational / troubleshooting |
| Volume / KD | NV / NV |
| Ranking opportunity | Results are forum threads and GitHub issues; no structured, cross-language guide observed; one ranking guide gives an incorrect cause |
| Audience | Backend developers debugging a failing login |
| Angle | Ordered diagnostic checklist (most likely cause first), each with a minimal reproducing snippet and a fix; covers Node, PHP, Python; corrects the "salt rounds must match" myth |
| Word count | ~1,600–2,000 (driven by number of verified causes) |
| Internal links | `/verify` (primary CTA), `/blog/store-bcrypt-hash-database`, `/blog/bcrypt-72-byte-limit`, `/blog/bcrypt-nodejs-tutorial` |
| Justification | Highest-intent problem query in our niche; directly feeds tool use |

#### 2. Bcrypt's 72-Byte Password Limit
| Field | Detail |
|---|---|
| Primary keyword | bcrypt 72 byte limit |
| Secondary | bcrypt max password length, bcrypt max input length, bcrypt 72 characters, bcrypt password too long, ErrPasswordTooLong, password cannot be more than 72 bytes |
| Long-tail | bcrypt 72 bytes error python · passlib bcrypt 72 bytes · bcrypt password longer than 72 bytes · bcrypt emoji password length · spring bcrypt 72 bytes |
| Intent | Informational / troubleshooting |
| Volume / KD | NV / NV |
| Ranking opportunity | Existing pages explain truncation; none observed with a current per-library behaviour table |
| Audience | Developers, security engineers, people hitting new exceptions after upgrades |
| Angle | Bytes vs characters with UTF-8 examples; per-library table (Go, pyca 5.0+, Spring post-CVE, node bcrypt, bcryptjs, PHP); real incidents; safe options (limit input, pre-hash correctly, or Argon2id) |
| Word count | ~1,800–2,200 |
| Internal links | `/` (generator warns at 72 bytes), `/blog/bcrypt-vs-argon2`, `/blog/bcrypt-python-tutorial`, `/tools/password-strength` |
| Justification | Topical authority piece; refreshes our own outdated Python guidance |

#### 3. Can You Decrypt a Bcrypt Hash?
| Field | Detail |
|---|---|
| Primary keyword | bcrypt decrypt |
| Secondary | bcrypt decrypt online, is bcrypt reversible, bcrypt decoder, decrypt bcrypt hash, bcrypt hash to text, bcrypt decrypt laravel |
| Long-tail | can bcrypt hash be decrypted · how to decrypt bcrypt password · bcrypt decrypt online free · is bcrypt encryption or hashing · forgot password bcrypt hash database |
| Intent | Mixed (many expect a decrypt tool) |
| Volume / KD | NV / NV |
| Ranking opportunity | Results don't serve the real job (regain access / check a guess) |
| Audience | Developers and admins who inherited a DB or lost an admin password; students |
| Angle | One-line answer; what "decrypt" sites really do; legitimate paths (reset via app or SQL with a freshly generated hash, verify a candidate); why cracking is slow by design (conceptual, no attack walkthrough); disambiguate the `bcrypt` file-encryption CLI |
| Word count | ~1,200–1,500 |
| Internal links | `/verify`, `/` (generate a replacement hash), `/blog/bcrypt-salt-explained`, `/blog/how-many-bcrypt-rounds` |
| Justification | Captures high-demand, misunderstood intent honestly; converts to both tools |

#### 4. How Bcrypt Salts Work
| Field | Detail |
|---|---|
| Primary keyword | why bcrypt generates different hashes |
| Secondary | how does bcrypt know the salt, bcrypt salt, bcrypt salt length, bcrypt salt rounds meaning, how does bcrypt compare work, where is bcrypt salt stored |
| Long-tail | do I need to store the salt with bcrypt · bcrypt same password different hash · bcrypt salt rounds vs cost · bcrypt salt 16 bytes 22 characters · bcrypt gensalt explained |
| Intent | Informational |
| Volume / KD | NV / NV |
| Ranking opportunity | Many AC variants; one ranking page recommends storing salt separately (incorrect for bcrypt's format) |
| Audience | Junior–mid developers, students |
| Angle | Annotated hash breakdown; "salt rounds" naming confusion (it's a cost, not a count of salts); try-it-yourself with our generator (hash twice) and checker (both verify) |
| Word count | ~1,100–1,400 |
| Internal links | `/` and `/verify` (demo), `/blog/how-many-bcrypt-rounds`, `/blog/what-is-bcrypt` |
| Cannibalisation | Trim `what-is-bcrypt` "Why Salting Matters" to a summary that links here |

#### 5. $2a$, $2b$, $2y$: Bcrypt Hash Versions Explained
| Field | Detail |
|---|---|
| Primary keyword | bcrypt 2a vs 2b vs 2y |
| Secondary | bcrypt hash format, bcrypt 2y, bcrypt version, bcrypt hash type, bcrypt prefix, $2x$ |
| Long-tail | bcrypt 2a vs 2b difference · convert 2y to 2b bcrypt · php 2y bcrypt node compatibility · htpasswd 2y bcrypt · bcrypt hash example format |
| Intent | Informational |
| Volume / KD | NV / NV |
| Ranking opportunity | Results are Wikipedia, library source code and tool pages |
| Audience | Developers migrating between stacks (PHP→Node, etc.) |
| Angle | Plain-English history with the two bugs (2011 crypt_blowfish 8-bit bug; 2014 OpenBSD length wraparound); per-library accept/produce table; when rewriting `$2y$`→`$2b$` is safe and when it isn't (`$2x$`) |
| Word count | ~1,200–1,500 |
| Internal links | `/verify` (anatomy section), `/blog/bcrypt-php-tutorial`, `/blog/bcrypt-compare-returns-false` |

#### 6. How to Store Bcrypt Hashes in MySQL and PostgreSQL
| Field | Detail |
|---|---|
| Primary keyword | bcrypt hash length varchar |
| Secondary | bcrypt length mysql, bcrypt postgresql data type, bcrypt hash length, password column type, char(60) vs varchar(255) |
| Long-tail | what column type for bcrypt hash · bcrypt hash truncated in database · prisma bcrypt password field · laravel password column length · postgres text vs varchar password |
| Intent | How-to |
| Volume / KD | NV / NV |
| Ranking opportunity | Conflicting advice in observed results |
| Audience | Backend devs designing schemas |
| Angle | One recommendation per DB with reasons; collation/case sensitivity (a case-insensitive collation doesn't break bcrypt verification but matters for comparisons in SQL); migration to widen a column; ORM snippets (Prisma, Laravel, Django) |
| Word count | ~1,200–1,500 |
| Internal links | `/blog/bcrypt-compare-returns-false`, `/blog/bcrypt-vs-argon2`, `/verify` |

#### 7. Bcrypt vs SHA-256 for Passwords
| Field | Detail |
|---|---|
| Primary keyword | bcrypt vs sha256 |
| Secondary | why is bcrypt better than sha256, sha256 for passwords, salted sha256 password, bcrypt or sha256, hmac sha256 password |
| Long-tail | is sha256 safe for passwords · sha256 with salt vs bcrypt · pre-hash sha256 before bcrypt · bcrypt vs sha256 speed · when to use sha256 instead of bcrypt |
| Intent | Comparison |
| Volume / KD | NV / NV |
| Ranking opportunity | Vendor programmatic pages dominate |
| Audience | Developers choosing a hash; students |
| Angle | Reasoning about attacker cost (no invented benchmark numbers; reproducible method instead); salted SHA-256 still fails; PBKDF2-HMAC-SHA256 as the FIPS path; pre-hash pitfalls (raw digest null bytes → encode as hex/base64) |
| Word count | ~1,300–1,600 |
| Internal links | `/tools/sha256`, `/`, `/blog/bcrypt-vs-argon2`, `/blog/bcrypt-72-byte-limit` |
| Cannibalisation | Keep the `/tools/sha256` table; that page targets the tool query. Shorten `what-is-bcrypt`'s comparison section and link here |

#### 8. Bcrypt in Spring Boot
| Field | Detail |
|---|---|
| Primary keyword | bcrypt spring boot |
| Secondary | BCryptPasswordEncoder, spring security bcrypt, spring bcrypt password encoder, DelegatingPasswordEncoder, bcrypt java |
| Long-tail | BCryptPasswordEncoder strength 12 · password cannot be more than 72 bytes spring · encoded password does not look like bcrypt · spring boot bcrypt maven dependency · upgrade bcrypt strength spring |
| Intent | Tutorial |
| Volume / KD | NV / NV |
| Ranking opportunity | Observed tutorials predate CVE-2025-22228 |
| Audience | Java/Spring developers |
| Angle | Current Spring Security versions; `PasswordEncoderFactories`/`{bcrypt}` prefix; strength choice; 72-byte exception and CVE upgrade note; "Encoded password does not look like BCrypt" fix; tests with JUnit |
| Word count | ~1,600–2,000 |
| Internal links | `/`, `/verify`, `/blog/bcrypt-72-byte-limit`, `/blog/how-many-bcrypt-rounds` |

#### 9. Bcrypt in Go
| Field | Detail |
|---|---|
| Primary keyword | bcrypt golang |
| Secondary | golang.org/x/crypto/bcrypt, GenerateFromPassword, CompareHashAndPassword, ErrPasswordTooLong, bcrypt.Cost |
| Long-tail | golang bcrypt compare hash and password · golang bcrypt default cost · go bcrypt password too long · golang bcrypt example http handler · go bcrypt upgrade cost |
| Intent | Tutorial |
| Volume / KD | NV / NV |
| Ranking opportunity | Thin, generic results |
| Audience | Go developers |
| Angle | Idiomatic, tested code; error handling (`ErrMismatchedHashAndPassword` vs other errors); rehash-on-login when cost changes; 72-byte rejection; tests |
| Word count | ~1,300–1,600 |
| Internal links | `/`, `/verify`, `/blog/bcrypt-72-byte-limit`, `/blog/how-many-bcrypt-rounds` |

#### 10. Flask-Bcrypt vs Werkzeug
| Field | Detail |
|---|---|
| Primary keyword | flask bcrypt |
| Secondary | flask_bcrypt, flask-bcrypt, werkzeug generate_password_hash, werkzeug check_password_hash, flask password hashing |
| Long-tail | flask-bcrypt generate_password_hash check_password_hash · flask bcrypt vs werkzeug security · flask-bcrypt password longer than 72 bytes · werkzeug scrypt hash length · migrate flask-bcrypt to werkzeug |
| Intent | Informational / comparison |
| Evidence | Search Console (Part 9b): "flask bcrypt", "flask_bcrypt", "bcrypt flask", three "flask-bcrypt … documentation" variants, and a 9-impression question asking whether Flask-Bcrypt and Werkzeug are the same and which is best |
| Volume / KD | NV / NV |
| Ranking opportunity | We already get impressions (positions 28–45) without a dedicated page |
| Audience | Flask developers |
| Angle | Tested behaviour (2026-10-25: Flask 3.1.3, Flask-Bcrypt 1.0.1, Werkzeug 3.1.9, bcrypt 5.0.0): Flask-Bcrypt returns `bytes`; with bcrypt 5.0 it **raises ValueError for passwords over 72 bytes** unless `BCRYPT_HANDLE_LONG_PASSWORDS` is set, which pre-hashes and makes existing hashes stop verifying; Werkzeug defaults to **scrypt** (`scrypt:32768:8:1`, 162-char hashes) and its pbkdf2 option uses 1,000,000 iterations; Werkzeug can't verify bcrypt hashes, so switching needs a migration |
| Word count | ~1,300–1,600 |
| Internal links | `/blog/bcrypt-python-tutorial`, `/`, `/verify`, `/blog/bcrypt-vs-argon2` |

---

## PART 5 — Content briefs

Common to every brief:
- **Author line:** Shahzeb Zafar. Publish only after Shahzeb has reviewed it and run the code.
- **Disclosure:** add a short line at the end: "Drafted with AI assistance; reviewed and tested by Shahzeb Zafar." This is in line with Google's guidance on being transparent about how content is made.
- **Schema:** existing Article + Breadcrumb (no FAQPage or HowTo).
- **Code:** every snippet executed in a pinned environment before publishing. Record the versions in the editorial notes.
- **Sources:** cited inline where a claim depends on them.

### Brief 1 — Why bcrypt.compare() Returns False
**A. Metadata**
- SEO title: `Why bcrypt.compare() Returns False — 9 Causes and Fixes` (≈52 chars)
- Meta description: `Login failing even with the right password? Work through the real reasons bcrypt compare returns false in Node, PHP and Python, with fixes for each.` (≈150)
- Slug `bcrypt-compare-returns-false` · Primary "bcrypt compare returns false" · Intent troubleshooting

**B. Structure**
- H1: Why bcrypt.compare() Returns False (and How to Fix It)
- Intro: the symptom (correct password, `false`) and a 30-second triage, *before* any theory
- H2 First, rule out the obvious (one test: hash a known password and compare it immediately; isolates library vs data problems)
- H2 The causes, most likely first. Each cause is an H3 with symptom → minimal repro → fix:
  - H3 You're comparing hashes instead of calling compare (`hash(pw) === stored`)
  - H3 The hash was re-hashed on save (Mongoose `pre('save')` without `isModified('password')`; Laravel `'hashed'` cast plus `Hash::make`)
  - H3 Arguments in the wrong order (`compare(hash, password)`)
  - H3 Missing `await`, a Promise compared as truthy/falsy, or callback misuse (the opposite failure: always *true*)
  - H3 The stored hash is truncated (column shorter than 60) → link Brief 6
  - H3 `$` characters lost in `.env`, shell or Docker Compose
  - H3 Whitespace/newline and encoding differences (Python `bytes` vs `str`, `.encode()`)
  - H3 Field not selected (`select: false` in Mongoose; ORM hidden attributes) → `undefined` hash → error or false depending on the library
  - H3 Passwords over 72 bytes after a library upgrade (now throws or rejects) → link Brief 2
- H2 Myth: "salt rounds must match": compare reads cost and salt from the hash (correcting an observed claim)
- H2 Debug it in 2 minutes with the bcrypt checker (CTA → `/verify`)
- Conclusion: a checklist box

**Developer questions answered:** why does compare work in tests but not in production; why does every login fail after I edited the user; does bcryptjs verify bcrypt hashes (yes, same format).

**C. Unique value:** an ordered diagnostic flow instead of an unordered list; tested repros for each cause in three languages; the myth correction; checker integration.

**D. Sources:** bcrypt npm README (truncation/version notes); bcryptjs README; Mongoose middleware docs (`isModified`); Laravel hashing docs (`hashed` cast); PHP `password_verify` manual; pyca/bcrypt README; Docker Compose variable-interpolation docs (`$$` escaping).

### Brief 2 — Bcrypt's 72-Byte Password Limit
**A. Metadata**
- SEO title: `Bcrypt's 72-Byte Limit: What Every Library Does in 2026` (≈55)
- Meta: `Bcrypt only uses 72 bytes of a password — but Go, Python, Spring, Node and PHP now handle longer input differently. See the behaviour and safe fixes.` (≈155)
- Slug `bcrypt-72-byte-limit`

**B. Structure**
- H1: Bcrypt's 72-Byte Password Limit, Explained
- H2 Where the limit comes from (Blowfish key schedule; Provos & Mazières 1999)
- H2 Bytes, not characters (UTF-8 table: ASCII 1 byte, `é` 2, CJK 3, emoji 4; worked examples; link to the generator's live warning)
- H2 What each library does today (table, version-pinned): Go `x/crypto` rejects in `GenerateFromPassword` (`ErrPasswordTooLong`), compare still accepts; pyca/bcrypt ≥5.0.0 `hashpw` raises `ValueError`; Spring Security fixed versions throw `IllegalArgumentException` (CVE-2025-22228); node `bcrypt` ignores extra bytes; bcryptjs truncates (exposes `truncates()`); PHP `password_hash` truncates (verify current behaviour per version)
- H2 When it becomes a vulnerability: the Spring CVE (matches true when the first 72 bytes match); Okta 2024 cache-key incident (bcrypt over userId+username+password, usernames ≥ 52 chars), using cautious wording that cites Okta's advisory for the facts
- H2 Your options
  - H3 Cap password length at 72 bytes (with a clear UI message)
  - H3 Pre-hash correctly (HMAC/SHA-256 → **encode** hex or base64 before bcrypt; the null-byte pitfall; note OWASP's caveat)
  - H3 Choose Argon2id for new systems
- H2 Upgrading safely (users who already have >72-byte passwords; verify old hashes before enforcing new limits)
- Conclusion

**C. Unique value:** a current per-library table with versions; worked UTF-8 byte examples; incident-based explanation of why silent truncation matters; a safe pre-hash recipe with the encoding pitfall.

**D. Sources:** OWASP Password Storage Cheat Sheet (72-byte limit, pre-hashing caveat); Go `x/crypto/bcrypt` docs; pyca/bcrypt CHANGELOG 5.0.0; spring.io CVE-2025-22228; kelektiv/node.bcrypt.js README; bcryptjs README/types; PHP `password_hash` manual; Okta security advisory (Nov 2024); Provos & Mazières USENIX 1999 paper.

### Brief 3 — Can You Decrypt a Bcrypt Hash?
**A. Metadata**
- SEO title: `Can You Decrypt a Bcrypt Hash? No — Here's What Works` (≈52)
- Meta: `Bcrypt hashes can't be decrypted. Here's why, what "bcrypt decrypt" sites really do, and how to reset or verify a password instead.` (≈135)
- Slug `can-bcrypt-be-decrypted`

**B. Structure**
- H1: Can You Decrypt a Bcrypt Hash?
- Intro: a direct "No", in two sentences
- H2 Hashing isn't encryption (no key to reverse with)
- H2 What "bcrypt decrypt online" tools actually do (guessing and lookup; why they only "work" on weak passwords)
- H2 What you probably need instead
  - H3 Check whether a password matches (→ `/verify`)
  - H3 Reset a forgotten password (app flow; or generate a new hash and update the row, with an SQL example and cautions)
  - H3 Moving users to a new system (bcrypt hashes are portable; no decrypting needed)
- H2 Why guessing is slow by design (cost factor doubling; conceptual, no attack tooling instructions)
- H2 Not the same thing: the `bcrypt` file-encryption utility (`.bfe` files)
- Conclusion

**C. Unique value:** serves the real underlying jobs; honest about "decrypt" tools; disambiguates the CLI tool, which ranks for the same word.

**D. Sources:** OWASP cheat sheet (hashing vs encryption); Provos & Mazières paper; PHP `password_hash`/`password_verify` manual; Debian `bcrypt` package/man page for the file utility.

### Brief 4 — How Bcrypt Salts Work
**A. Metadata**
- SEO title: `Why Bcrypt Hashes Are Different Every Time (Salts Explained)` (≈58)
- Meta: `Same password, different bcrypt hash? That's the salt. See where bcrypt stores it, how compare finds it, and what "salt rounds" really means.` (≈140)
- Slug `bcrypt-salt-explained`

**B. Structure**
- H1: How Bcrypt Salts Work
- H2 Try it: hash the same password twice (generator) and check both (checker)
- H2 Where the salt lives (annotated `$2b$12$` + 22 chars + 31 chars; 16 random bytes in bcrypt's Base64 variant)
- H2 How compare finds the salt (step by step)
- H2 "Salt rounds" is a misleading name (it's the cost: 2^cost iterations; one salt per hash)
- H2 Do I store the salt separately? (No, for bcrypt's standard format; why some guides say yes)
- H2 What salts protect against (and what they don't: weak passwords)
- H2 Salt vs pepper (brief; link backlog topic later)

**C. Unique value:** an interactive demo using our tools; corrects the "store salt separately" advice; clears up the naming confusion.

**D. Sources:** Provos & Mazières paper; OWASP cheat sheet (salting, peppering); bcryptjs / node bcrypt `genSalt` docs; pyca `gensalt` docs.

### Brief 5 — $2a$, $2b$, $2y$ Explained
**A. Metadata**
- SEO title: `Bcrypt $2a$ vs $2b$ vs $2y$: What the Prefixes Mean` (≈50)
- Meta: `Why bcrypt hashes start with $2a$, $2b$ or $2y$, which bugs created each version, and whether a hash from PHP will verify in Node or Python.` (≈145)
- Slug `bcrypt-2a-2b-2y`

**B. Structure**
- H1: $2a$, $2b$ and $2y$: Bcrypt Hash Versions Explained
- H2 Reading a bcrypt hash (link to the `/verify` anatomy rather than repeating it)
- H2 The history (2a spec revision; 2011 crypt_blowfish 8-bit bug → `$2x$`/`$2y$`; 2014 OpenBSD wraparound → `$2b$`)
- H2 Compatibility table (produces / accepts: PHP, node bcrypt, bcryptjs, pyca bcrypt, Go, Spring, htpasswd)
- H2 Converting `$2y$` ↔ `$2b$` (when safe; never "fix" `$2x$`)
- H2 Which prefix should new hashes use?

**C. Unique value:** a compatibility table built from library docs and tests; tested cross-language verification (PHP-made hash verified in Node/Python/Go).

**D. Sources:** OpenBSD `bcrypt(3)`/crypt docs; PHP crypt manual (`$2y$` note); CVE-2011-2483 (crypt_blowfish); passlib bcrypt docs (version history); library READMEs.

### Brief 6 — Storing Bcrypt Hashes in MySQL and PostgreSQL
**A. Metadata**
- SEO title: `Bcrypt Hash Length: Best Column Type for MySQL & Postgres` (≈56)
- Meta: `A bcrypt hash is 60 characters, but CHAR(60) isn't always the best column. Pick the right type for MySQL and PostgreSQL and avoid truncated hashes.` (≈150)
- Slug `store-bcrypt-hash-database`

**B. Structure**
- H1: How to Store Bcrypt Hashes in MySQL and PostgreSQL
- H2 Short answer (MySQL `VARCHAR(255)`; Postgres `text`; never under 60)
- H2 Why 255 and not 60 (algorithm upgrades; PHP's guidance for `PASSWORD_DEFAULT`)
- H2 MySQL details (charset/collation; `VARCHAR` vs `CHAR` vs `BINARY`)
- H2 PostgreSQL details (`text` vs `varchar(n)` vs `char(n)` blank-padding, citing the PG docs)
- H2 ORMs (Prisma, Laravel migrations, Django `password` field)
- H2 Fixing a column that already truncated hashes (widen, then force resets for affected rows: truncated hashes can't be recovered)
- H2 Don't store the salt or cost separately

**C. Unique value:** a resolved recommendation with reasoning instead of conflicting advice; a recovery procedure for truncated data; ORM snippets.

**D. Sources:** MySQL manual (CHAR/VARCHAR, collations); PostgreSQL manual (character types); PHP `password_hash` manual (recommends 255); Prisma/Laravel/Django docs.

### Brief 7 — Bcrypt vs SHA-256 for Passwords
**A. Metadata**
- SEO title: `Bcrypt vs SHA-256 for Passwords: Why Speed Matters` (≈50)
- Meta: `SHA-256 is fast by design, which is exactly why it's wrong for passwords. Compare it with bcrypt, and see when SHA-256 is the right tool.` (≈140)
- Slug `bcrypt-vs-sha256`

**B. Structure**
- H1: Bcrypt vs SHA-256 for Password Storage
- H2 The short version (comparison table)
- H2 Why fast hashes fail for passwords (attacker cost reasoning; a reproducible benchmark method readers can run instead of quoted GPU figures)
- H2 "But I salt my SHA-256" (salts stop precomputation, not guessing)
- H2 Iterated SHA-256: PBKDF2 (OWASP's FIPS option and its iteration guidance)
- H2 Combining them safely (pre-hashing for the 72-byte limit; encoding pitfall) → Brief 2
- H2 Where SHA-256 is the right choice (integrity, signatures, HMAC) → `/tools/sha256`
- H2 Migrating from SHA-256 password hashes (wrap existing hashes, then rehash on login)

**C. Unique value:** no invented benchmarks (a method instead); covers salted and iterated SHA-256 nuance; a migration pattern.

**D. Sources:** OWASP cheat sheet (algorithm list, PBKDF2 600k); NIST SP 800-63B-4 (password verifier requirements); hashcat example hashes (mode identifiers, for readers to benchmark themselves).

### Brief 8 — Bcrypt in Spring Boot
**A. Metadata**
- SEO title: `BCryptPasswordEncoder in Spring Boot: A Complete Guide` (≈53)
- Meta: `Hash and verify passwords with Spring Security's BCryptPasswordEncoder: setup, strength, the 72-byte exception from CVE-2025-22228, and common errors.` (≈155)
- Slug `bcrypt-spring-boot`

**B. Structure**
- H1: Bcrypt in Spring Boot with BCryptPasswordEncoder
- H2 Dependencies (pinned Spring Boot and Spring Security versions)
- H2 Define the encoder (plain `BCryptPasswordEncoder(12)` vs `PasswordEncoderFactories.createDelegatingPasswordEncoder()`)
- H2 Register and login (service + `matches`)
- H2 Choosing strength (benchmark on your hardware → rounds post)
- H2 The 72-byte limit and CVE-2025-22228 (affected and fixed versions; the new exception; validating input length)
- H2 Common errors ("Encoded password does not look like BCrypt"; `{bcrypt}` prefix mismatch; column too short)
- H2 Upgrading strength or algorithm (`upgradeEncoding`, `UserDetailsPasswordService`)
- H2 Testing with JUnit

**C. Unique value:** the only observed tutorial set to cover the CVE and the fixed behaviour; delegating encoder and upgrade path; tested on a pinned version.

**D. Sources:** Spring Security reference (password storage); spring.io CVE-2025-22228; Spring Security API docs for `BCryptPasswordEncoder` and `DelegatingPasswordEncoder`.

### Brief 9 — Bcrypt in Go
**A. Metadata**
- SEO title: `Bcrypt in Go: Hash and Verify Passwords with x/crypto` (≈51)
- Meta: `Use golang.org/x/crypto/bcrypt to hash and check passwords in Go: cost, error handling, the 72-byte ErrPasswordTooLong, and rehashing.` (≈135)
- Slug `bcrypt-golang`

**B. Structure**
- H1: Bcrypt in Go with golang.org/x/crypto/bcrypt
- H2 Install and import
- H2 Hash a password (`GenerateFromPassword`, `DefaultCost`, choosing a cost)
- H2 Check a password (`CompareHashAndPassword`; distinguishing `ErrMismatchedHashAndPassword` from other errors)
- H2 Passwords over 72 bytes (`ErrPasswordTooLong`; validate up front)
- H2 Rehash when you raise the cost (`bcrypt.Cost(hash)`)
- H2 An HTTP login handler example (no plaintext logging)
- H2 Tests (`go test`, a low cost in tests)

**C. Unique value:** idiomatic, tested code; correct error semantics; a rehash pattern.

**D. Sources:** `pkg.go.dev/golang.org/x/crypto/bcrypt`; the Go crypto commit introducing the 72-byte rejection.

### Brief 10 — Flask-Bcrypt vs Werkzeug
**A. Metadata**
- SEO title: `Flask-Bcrypt vs Werkzeug: Which to Use for Passwords` (≈52)
- Meta: `Flask-Bcrypt and Werkzeug both hash passwords in Flask, but differently. Compare algorithms, defaults and pitfalls, and see how to migrate between them.` (≈150)
- Slug `flask-bcrypt-vs-werkzeug`

**B. Structure**
- H1: Flask-Bcrypt vs Werkzeug: Which Should Hash Your Passwords?
- Intro: the direct answer. They are different libraries with different algorithms; both are acceptable; how to choose
- H2 What each one is (Flask-Bcrypt: an extension wrapping pyca/bcrypt; Werkzeug's `generate_password_hash`: ships with Flask, defaults to scrypt)
- H2 Side-by-side (algorithm, default cost/parameters, output type and length, long-password behaviour, maintenance)
- H2 Using Flask-Bcrypt correctly (bytes vs str storage, rounds config)
- H2 The 72-byte change in bcrypt 5.0 (tested `ValueError`; what `BCRYPT_HANDLE_LONG_PASSWORDS` does and why it isn't a drop-in fix)
- H2 Using Werkzeug's helpers correctly (method strings, column size for 162-char scrypt hashes)
- H2 Switching between them (dual verification at login, then rehash)
- H2 Which to choose (decision table)

**C. Unique value:** a tested version matrix; the bcrypt 5.0 breaking change for Flask-Bcrypt users; a migration recipe; a direct answer to the question users are actually asking.

**D. Sources:** Flask-Bcrypt docs/PyPI; Werkzeug `werkzeug.security` docs and changelog (default method history); pyca/bcrypt CHANGELOG 5.0.0; OWASP cheat sheet (scrypt and bcrypt parameters).

---

## PART 6 — Internal linking and topic clusters

**Hubs:** `/` (generator) and `/verify` (checker) are the money pages. `what-is-bcrypt` is the educational hub.

| Article | Links to (anchor ideas) | Placement | Tool CTA |
|---|---|---|---|
| 1 compare-returns-false | `/verify` ("paste the stored hash into the bcrypt checker"), Brief 6 ("hash column is too short"), Brief 2 ("over 72 bytes"), Node tutorial | In the triage section and the relevant causes | Checker box after triage |
| 2 72-byte-limit | `/` ("the generator warns when you pass 72 bytes"), vs-argon2, Python tutorial, `/tools/password-strength` | Bytes section, options section | Generator |
| 3 can-bcrypt-be-decrypted | `/verify` ("test a password guess"), `/` ("generate a replacement hash"), Brief 4, rounds post | "What you need instead" | Both |
| 4 salt-explained | `/` + `/verify` (demo), rounds post, what-is-bcrypt | "Try it" section first | Both |
| 5 2a-2b-2y | `/verify` (anatomy), PHP tutorial, Brief 1 | History and compatibility | Checker |
| 6 store-bcrypt-hash-database | Brief 1, vs-argon2 ("longer Argon2 hashes"), `/verify` | Short answer, fixing truncation | Checker |
| 7 bcrypt-vs-sha256 | `/tools/sha256`, `/`, vs-argon2, Brief 2 | Table, "where SHA-256 is right" | SHA-256 tool + generator |
| 8 spring-boot | `/`, `/verify`, Brief 2, rounds post | Strength and errors | Generator (test fixtures) |
| 9 golang | `/`, `/verify`, Brief 2, rounds post | Cost and errors | Generator |
| 10 flask-bcrypt-vs-werkzeug | Python tutorial, `/`, `/verify`, vs-argon2 | Side-by-side and migration | Generator |

**Existing pages to update as each article goes live:**
- `/verify` "Why a bcrypt check fails" → add "Full troubleshooting guide →" to Brief 1 (keep the list short, so the tool page stays tool-focused)
- `what-is-bcrypt`: trim the salting section and link to Brief 4; trim the comparison section and link to Brief 7
- Node/PHP/Python tutorials: add links to Brief 1 and Brief 2; check the Python post against pyca 5.0 behaviour
- `/tools/sha256`: link to Brief 7 from the comparison table
- Vary anchors; never more than one link to the same target per section

---

## PART 7 — 90-day publishing roadmap (from approval date)

| Weeks | Publish | Also do |
|---|---|---|
| 1–2 | #1 compare-returns-false, #2 72-byte-limit | Add internal links from `/verify` and all three tutorials; refresh the Python tutorial for pyca 5.0; request indexing for each new URL |
| 3–4 | #6 store-bcrypt-hash-database, #3 can-bcrypt-be-decrypted | Link #6 ↔ #1; check Search Console coverage for #1–#2 |
| 5–6 | #4 salt-explained, #5 2a-2b-2y | Trim `what-is-bcrypt` sections and link out |
| 7–8 | #7 bcrypt-vs-sha256, #10 flask-bcrypt-vs-werkzeug | Link `/tools/sha256` → #7 |
| 9–10 | #8 spring-boot, #9 golang | Language cluster complete; cross-link tutorials |
| 11–13 | No new topics. Measure, refresh, then pick backlog items using real Search Console query data | Update titles/descriptions where CTR is low; expand sections that get impressions for queries we don't yet answer |

**Editorial workflow per article:** draft → code executed in pinned environments (versions noted) → fact-check against cited sources → Shahzeb's edit and approval → publish → request indexing → add the inbound links listed in Part 6 → bump `lastModified` on any page that was updated.

**Measurement (Search Console + Vercel Analytics):**
- Impressions, clicks, CTR and average position per article and per query (filter page = article URL)
- Pages report: is each new URL indexed within 2–3 weeks? If "Crawled – currently not indexed", improve the content and internal links before requesting again
- Tool visits from blog pages: Vercel Analytics referrer/path data (blog → `/verify` and `/`)
- Leading indicators: new queries appearing for the target clusters; `/verify` impressions for "check/compare" queries
- **No ranking or traffic promises.** Review at day 30, 60 and 90, and change the plan based on actual query data.

---

## PART 8 — Google Search policy and technical accuracy checklist

**Google Search Central references (all verified as reachable 2026-10-24):**
- Search Essentials: https://developers.google.com/search/docs/essentials
- Creating helpful, reliable, people-first content (includes the E-E-A-T self-assessment and "Who, How, Why"): https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Guidance on using generative AI content: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- Spam policies (scaled content abuse, etc.): https://developers.google.com/search/docs/essentials/spam-policies
- Title links: https://developers.google.com/search/docs/appearance/title-link
- Snippets / meta descriptions: https://developers.google.com/search/docs/appearance/snippet
- Structured data general guidelines: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Article structured data: https://developers.google.com/search/docs/appearance/structured-data/article

**Per-article pre-publish checklist** (each item is Pass / Needs review / Fail, with a reason):

| Category | Check |
|---|---|
| Search intent | Answers the query in the first screen; no filler intro |
| Originality | Tested examples, tables or procedures not found in the observed results; no paraphrasing of competitor pages |
| Technical accuracy | Every security claim traced to a cited source; library behaviour version-pinned; code executed |
| Security hygiene | No plaintext password logging in samples; maintained libraries only; no absolute guarantees ("unbreakable", "100% secure"); no step-by-step cracking instructions |
| Readability | Short varied paragraphs; headings say what the section answers; none of the banned AI phrasings |
| SEO | Primary keyword in title/H1/intro naturally; meta description matches content; 2–4 contextual internal links; no stuffing |
| Trust | Real author who reviewed it; AI-assistance disclosure; sources linked; limitations stated |
| Google compliance | Written for readers; not part of templated mass production; no fake experience, benchmarks, quotes or statistics |

**Technical accuracy rules (applied to every draft):**
1. Bcrypt is hashing, not encryption.
2. Verification re-hashes with the salt and cost from the stored hash; nothing is decrypted.
3. The salt (16 bytes, 22 chars) is embedded in the 60-char hash.
4. Each +1 cost doubles the work.
5. The 72-**byte** input limit, with current per-library behaviour.
6. Cost recommendations are attributed: OWASP's minimum is a work factor of 10, and OWASP prefers Argon2id for new systems; "we recommend 12" is our own opinion, labelled as such.
7. Argon2id is described with OWASP's parameters.
8. SHA-256 and MD5 alone are never recommended for passwords.
9. No sample logs plaintext secrets.
10. Libraries are maintained, and versions are pinned in the editorial notes.

---

## PART 9 — Limitations, verified data and next steps

**Verified (primary sources, 2026-10-24):**
- pyca/bcrypt 5.0.0 changelog: `hashpw` raises `ValueError` for passwords over 72 bytes (previously silently truncated)
- Go `x/crypto/bcrypt` docs: `GenerateFromPassword` rejects over 72 bytes with `ErrPasswordTooLong`
- spring.io CVE-2025-22228: `BCryptPasswordEncoder.matches` returned true for passwords over 72 characters whose first 72 matched; open-source fixes in 6.3.8 and 6.4.4
- php.net `password_hash`: the PHP 8.4.0 default bcrypt cost rose from 10 to 12; the manual recommends 255-character storage for `PASSWORD_DEFAULT`
- kelektiv/node.bcrypt.js README: only the first 72 bytes are used, extra bytes are ignored; versions before 5.0.0 have a wraparound bug at 255+ characters
- Okta advisory (Nov 2024): a cache key built with bcrypt over userId+username+password; usernames of 52+ characters; affected Jul 23 – Oct 30, 2024; switched to PBKDF2. The advisory itself doesn't name the 72-byte limit, so articles must word the link carefully
- OWASP Password Storage Cheat Sheet: bcrypt work factor ≥ 10, a 72-byte limit, Argon2id preferred (checked earlier in this project)

**Not verified:**
- Search volumes and keyword difficulty, for all keywords
- Exact ranking positions (the search tool returns result sets, not position-tracked SERPs; results are US-only)
- People Also Ask boxes (not available through the tools used)
- nginx bcrypt support on specific builds (depends on the system `crypt()`; the article must tell readers how to test it)
- PHP's behaviour for passwords over 72 bytes in current versions (check before Brief 2 is published)

**Recommended next steps:**
1. **Approve, edit or reorder the 10 topics** (Part 4).
2. Optionally connect a keyword dataset (Search Console query data after 4–6 weeks is free and the most reliable; DataForSEO or Keyword Planner if available) to replace the NV fields.
3. After approval, draft Topic #1 with all code executed. Deliver it as an MDX file for your review; nothing is published without your sign-off.

---

## PART 9b — Search Console evidence (added 2026-10-25)

Query export pasted by the site owner on 2026-10-24 (date range not stated; Search Console's default is 3 months). Small numbers, average positions; treat as direction.

| Signal | Queries (impressions @ avg position) | Action |
|---|---|---|
| Page-2 informational head term | what is bcrypt (154 @ 13.4), what is bcrypt? (8 @ 10.8), bcrypt meaning (19 @ 12.5), bcrypt definition (5 @ 14.6), what is bcrypt used for (7 @ 27), how does bcrypt work (9 @ 40) | Refresh `what-is-bcrypt` (done in draft, 2026-10-25) |
| Already page 1 | bcrypt rounds (24 @ 7.3), bcrypt_rounds (4 @ 8.3), bcrypt salt rounds (5 @ 21.6) | Refresh rounds post; remove unsourced numbers (done in draft) |
| Tool head terms far back | bcrypt (296 @ 66), bcrypt hash generator (143 @ 44), bcrypt generator (124 @ 50) | Time, indexing, links; no content quick fix |
| Validates plan | Go cluster ≈19; decrypt/encrypt cluster; "what is the $2 b password?" (8); bcrypt compare; max password length; bcryptpasswordencoder online (5 @ 4.0); mysql bcrypt | Keep topics #1–#9 |
| New: Flask | flask bcrypt, flask_bcrypt, bcrypt flask, flask-bcrypt … documentation ×3, Flask-Bcrypt vs Werkzeug question (9) | New topic #10 |
| New: Laravel | laravel bcrypt password generator, bcrypt generator laravel, laravel (password) hash generator, laravel bcrypt, "this password does not use the bcrypt algorithm." | Laravel note on homepage and PHP post |
| Ignore | Typos (bycrypt, bycrpt, …), one-off long-tail | No pages for misspellings |
