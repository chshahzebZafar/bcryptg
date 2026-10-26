<?php
// Every PHP code block from the rewritten tutorial, run as published against SQLite.
echo "=== PHP " . PHP_VERSION . "\n";
$ok = fn(string $label, bool $cond) => print(($cond ? '  PASS ' : '  FAIL ') . $label . "\n");

// --- Quick start ---------------------------------------------------------
$password = 'correct horse battery staple';
$hash = password_hash($password, PASSWORD_DEFAULT);
$ok('quick start: verify', password_verify($password, $hash));

// --- Explicit cost ---------------------------------------------------------
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
$ok('explicit cost 12', password_get_info($hash)['options']['cost'] === 12);

// --- password_get_info -------------------------------------------------------
$info = password_get_info('$2y$12$ISHee6aytH3uxUNZgjFAj.m6J4/CcIb/N77F0NJ/Nr.WCVU/SqWU6');
$ok('get_info example', $info['algo'] === '2y' && $info['algoName'] === 'bcrypt' && $info['options'] === ['cost' => 12]);
$ok('example hash verifies', password_verify('correct horse battery staple', '$2y$12$ISHee6aytH3uxUNZgjFAj.m6J4/CcIb/N77F0NJ/Nr.WCVU/SqWU6'));

// --- Register and login (article code) ----------------------------------
const HASH_ALGO = PASSWORD_DEFAULT;
const HASH_OPTIONS = ['cost' => 12];
// A real bcrypt hash of a random string, used when the email isn't found
const DUMMY_HASH = '$2y$12$rf2avQLu/IGkd483xah99uIXqZN0sGUdwYaBCIIE2rE2OguXIv8HK';

function register(PDO $db, string $email, string $password): void
{
    if (strlen($password) > 72) {
        throw new InvalidArgumentException('Password must be 72 bytes or fewer.');
    }
    $hash = password_hash($password, HASH_ALGO, HASH_OPTIONS);
    $stmt = $db->prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
    $stmt->execute([$email, $hash]);
}

function login(PDO $db, string $email, string $password): ?int
{
    $stmt = $db->prepare('SELECT id, password_hash FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check against a dummy hash when the email doesn't exist, so an
    // unknown email takes as long to reject as a wrong password.
    $hash = $user ? $user['password_hash'] : DUMMY_HASH;
    if (!password_verify($password, $hash) || !$user) {
        return null;
    }

    if (password_needs_rehash($hash, HASH_ALGO, HASH_OPTIONS)) {
        $update = $db->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
        $update->execute([password_hash($password, HASH_ALGO, HASH_OPTIONS), $user['id']]);
    }

    return (int) $user['id'];
}
// --- end article code ----------------------------------------------------

$db = new PDO('sqlite::memory:');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec('CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password_hash VARCHAR(255) NOT NULL, hash_type VARCHAR(20) NOT NULL DEFAULT \'bcrypt\')');
register($db, 'ada@example.com', $password);
$ok('login correct', login($db, 'ada@example.com', $password) === 1);
$ok('login wrong password', login($db, 'ada@example.com', 'nope') === null);
$ok('login unknown email', login($db, 'nobody@example.com', $password) === null);
// Timing: unknown email vs wrong password
$t = microtime(true); login($db, 'nobody@example.com', 'x'); $unknown = microtime(true) - $t;
$t = microtime(true); login($db, 'ada@example.com', 'x'); $wrong = microtime(true) - $t;
printf("  INFO unknown-email %.0f ms vs wrong-password %.0f ms\n", $unknown * 1000, $wrong * 1000);
// Rehash upgrade from cost 10
$db->exec("UPDATE users SET password_hash = '" . password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]) . "' WHERE id = 1");
login($db, 'ada@example.com', $password);
$ok('rehash upgraded cost 10 -> 12', password_get_info($db->query('SELECT password_hash FROM users WHERE id = 1')->fetchColumn())['options']['cost'] === 12);
try { register($db, 'long@example.com', str_repeat('🔐', 19)); $ok('76-byte emoji password rejected', false); }
catch (InvalidArgumentException $e) { $ok('76-byte emoji password rejected', true); }

// --- Pepper, encoded (article code) ----------------------------------------
$pepper = 'load-this-from-a-secret-store';
$peppered = base64_encode(hash_hmac('sha256', $password, $pepper, true));
$hash = password_hash($peppered, PASSWORD_DEFAULT);
// at login: password_verify(base64_encode(hash_hmac('sha256', $input, $pepper, true)), $hash)
$ok('pepper verify', password_verify(base64_encode(hash_hmac('sha256', $password, $pepper, true)), $hash));
$fail = 0;
for ($i = 0; $i < 3000; $i++) {
    try { $h = password_hash(base64_encode(hash_hmac('sha256', "pw$i", $pepper, true)), PASSWORD_BCRYPT, ['cost' => 4]); }
    catch (ValueError $e) { $fail++; }
}
$ok('3000 base64 peppers, none throw', $fail === 0);

// --- MD5 migration (article code) ------------------------------------------
$db->exec("INSERT INTO users (email, password_hash, hash_type) VALUES ('legacy@example.com', '" . md5('old secret') . "', 'md5')");
$db->exec("INSERT INTO users (email, password_hash, hash_type) VALUES ('dormant@example.com', '" . md5('never logs in') . "', 'md5')");

// Step 1: one-time script, wraps every MD5 hash in bcrypt
$rows = $db->query("SELECT id, password_hash FROM users WHERE hash_type = 'md5'")->fetchAll(PDO::FETCH_ASSOC);
$update = $db->prepare("UPDATE users SET password_hash = ?, hash_type = 'bcrypt-md5' WHERE id = ?");
foreach ($rows as $row) {
    $update->execute([password_hash($row['password_hash'], PASSWORD_DEFAULT), $row['id']]);
}

// Step 2: at login
function verifyPassword(PDO $db, array $user, string $password): bool
{
    if ($user['hash_type'] === 'bcrypt-md5') {
        if (!password_verify(md5($password), $user['password_hash'])) {
            return false;
        }
        // Correct password: replace the wrapped hash with a normal one
        $update = $db->prepare("UPDATE users SET password_hash = ?, hash_type = 'bcrypt' WHERE id = ?");
        $update->execute([password_hash($password, PASSWORD_DEFAULT), $user['id']]);
        return true;
    }

    return password_verify($password, $user['password_hash']);
}
// --- end article code ------------------------------------------------------
$ok('no plain MD5 left after step 1', (int) $db->query("SELECT COUNT(*) FROM users WHERE hash_type = 'md5'")->fetchColumn() === 0);
$get = fn($e) => $db->query("SELECT id, password_hash, hash_type FROM users WHERE email = '$e'")->fetch(PDO::FETCH_ASSOC);
$ok('legacy wrong password', verifyPassword($db, $get('legacy@example.com'), 'wrong') === false);
$ok('legacy correct password', verifyPassword($db, $get('legacy@example.com'), 'old secret') === true);
$ok('legacy now plain bcrypt', $get('legacy@example.com')['hash_type'] === 'bcrypt');
$ok('legacy next login', verifyPassword($db, $get('legacy@example.com'), 'old secret') === true);
$ok('dormant stays wrapped', $get('dormant@example.com')['hash_type'] === 'bcrypt-md5' && str_starts_with($get('dormant@example.com')['password_hash'], '$2y$'));

// --- Argon2id switch ---------------------------------------------------
if (defined('PASSWORD_ARGON2ID')) {
    $old = password_hash($password, PASSWORD_BCRYPT);
    $ok('needs_rehash to argon2id', password_needs_rehash($old, PASSWORD_ARGON2ID) === true);
    $ok('old bcrypt still verifies', password_verify($password, $old));
}
