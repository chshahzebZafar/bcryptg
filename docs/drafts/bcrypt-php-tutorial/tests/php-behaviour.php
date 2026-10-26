<?php
// Observed bcrypt behaviour of password_* functions. Run on each PHP version.
echo "=== PHP " . PHP_VERSION . "\n";
function show(string $label, callable $fn): void {
    try { $r = $fn(); echo "  $label: " . (is_string($r) ? $r : var_export($r, true)) . "\n"; }
    catch (Throwable $e) { echo "  $label: THREW " . get_class($e) . ": " . $e->getMessage() . "\n"; }
}
$pw = 'correct horse battery staple';

show('PASSWORD_DEFAULT', fn() => var_export(PASSWORD_DEFAULT, true));
show('PASSWORD_BCRYPT', fn() => var_export(PASSWORD_BCRYPT, true));
$d = password_hash($pw, PASSWORD_DEFAULT);
show('default hash prefix/len', fn() => substr($d, 0, 7) . ' / ' . strlen($d));
show('default cost (password_get_info)', fn() => password_get_info($d)['options']['cost']);
$b = password_hash($pw, PASSWORD_BCRYPT);
show('PASSWORD_BCRYPT default cost', fn() => password_get_info($b)['options']['cost']);

$c10 = password_hash($pw, PASSWORD_BCRYPT, ['cost' => 10]);
show('needs_rehash(cost10, DEFAULT, no options)', fn() => password_needs_rehash($c10, PASSWORD_DEFAULT));
show('needs_rehash(cost10, BCRYPT, cost 12)', fn() => password_needs_rehash($c10, PASSWORD_BCRYPT, ['cost' => 12]));
$c12 = password_hash($pw, PASSWORD_BCRYPT, ['cost' => 12]);
show('needs_rehash(cost12, BCRYPT, cost 12)', fn() => password_needs_rehash($c12, PASSWORD_BCRYPT, ['cost' => 12]));

// 72-byte limit
$long = str_repeat('a', 72);
$hl = password_hash($long, PASSWORD_BCRYPT, ['cost' => 4]);
show('verify(72 a + EXTRA, hash(72 a))', fn() => password_verify($long . 'EXTRA', $hl));
show('hash 100-byte password', fn() => substr(password_hash(str_repeat('b', 100), PASSWORD_BCRYPT, ['cost' => 4]), 0, 7));
$emoji = str_repeat('🔐', 19); // 76 bytes, 19 characters
show('emoji password: chars/bytes', fn() => mb_strlen($emoji) . ' chars / ' . strlen($emoji) . ' bytes');

// Null bytes
show('hash("abc\\0def")', fn() => substr(password_hash("abc\0def", PASSWORD_BCRYPT, ['cost' => 4]), 0, 7));
show('verify("abc", hash("abc\\0def"))', function () {
    $h = @password_hash("abc\0def", PASSWORD_BCRYPT, ['cost' => 4]);
    return password_verify('abc', $h);
});

// Raw binary pre-hash (pepper) pitfall: how often does a raw SHA-256 HMAC contain a null byte?
$withNull = 0; $n = 20000;
for ($i = 0; $i < $n; $i++) { if (str_contains(hash_hmac('sha256', "password$i", 'pepper', true), "\0")) $withNull++; }
show('raw HMAC-SHA256 outputs containing \\0', fn() => sprintf('%d of %d (%.1f%%)', $withNull, $n, 100 * $withNull / $n));
$found = null;
for ($i = 0; $i < 1000; $i++) { $raw = hash_hmac('sha256', "pw$i", 'pepper', true); if ($raw[0] === "\0") { $found = $raw; break; } }
if ($found !== null) {
    show('hash(raw HMAC starting with \\0)', fn() => substr(password_hash($found, PASSWORD_BCRYPT, ['cost' => 4]), 0, 7));
}
$encoded = base64_encode(hash_hmac('sha256', $pw, 'pepper', true));
show('base64(HMAC) length', fn() => strlen($encoded));

// Prefix compatibility
$body = substr($b, 4);
foreach (['$2y$', '$2b$', '$2a$'] as $p) {
    show("verify with $p prefix", fn() => password_verify($pw, $p . $body));
    show("password_get_info algoName $p", fn() => password_get_info($p . $body)['algoName']);
}

// Argon2id
if (defined('PASSWORD_ARGON2ID')) {
    $a = password_hash($pw, PASSWORD_ARGON2ID);
    show('argon2id prefix/len', fn() => substr($a, 0, 9) . ' / ' . strlen($a));
    show('argon2id verify', fn() => password_verify($pw, $a));
    show('needs_rehash(bcrypt, ARGON2ID)', fn() => password_needs_rehash($b, PASSWORD_ARGON2ID));
    show('verify bcrypt hash after switching default (no-op)', fn() => password_verify($pw, $b));
}

// Timing of verify (cost 12) for reference
$t = microtime(true); password_verify($pw, $c12); $ms = (microtime(true) - $t) * 1000;
show('verify at cost 12 (ms, this laptop, single run)', fn() => round($ms));
