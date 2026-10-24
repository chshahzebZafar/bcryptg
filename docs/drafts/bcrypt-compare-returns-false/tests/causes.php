<?php
// PHP side of the article's causes. Prints observed behaviour.
$pw = 'correct horse battery staple';
echo "PHP " . PHP_VERSION . "\n";
function show($label, $fn) {
    try { $r = $fn(); echo "  $label: " . var_export($r, true) . "\n"; }
    catch (Throwable $e) { echo "  $label: THREW " . get_class($e) . ": " . $e->getMessage() . "\n"; }
}
$hash = password_hash($pw, PASSWORD_BCRYPT);
echo "hash prefix: " . substr($hash, 0, 7) . " length " . strlen($hash) . "\n";
show('sanity password_verify($pw, $hash)', fn() => password_verify($pw, $hash));
show('comparing two hashes: password_hash($pw) === $hash', fn() => password_hash($pw, PASSWORD_BCRYPT) === $hash);
show('double hashed: password_verify($pw, password_hash($hash))', fn() => password_verify($pw, password_hash($hash, PASSWORD_BCRYPT)));
show('swapped: password_verify($hash, $pw)', fn() => password_verify($hash, $pw));
show('truncated: password_verify($pw, substr($hash,0,50))', fn() => password_verify($pw, substr($hash, 0, 50)));
show('trailing newline on hash', fn() => password_verify($pw, $hash . "\n"));
show('trailing newline on password', fn() => password_verify($pw . "\n", $hash));
show('null hash', fn() => password_verify($pw, null));
show('empty hash', fn() => password_verify($pw, ''));
show('$2y$ hash rewritten to $2b$', fn() => password_verify($pw, '$2b$' . substr($hash, 4)));
// Hash produced by Node (bcryptjs, $2b$) — inserted by the runner
$nodeHash = getenv('NODE_HASH');
if ($nodeHash) show('verify Node $2b$ hash in PHP', fn() => password_verify($pw, $nodeHash));
echo "PHP_HASH=" . $hash . "\n";
