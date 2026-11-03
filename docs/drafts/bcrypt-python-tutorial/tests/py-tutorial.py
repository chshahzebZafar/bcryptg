# Tests for the Python bcrypt tutorial: behaviour facts + every code block, run as published.
import asyncio
import importlib.metadata as md
import inspect
import sys

print("Python", sys.version.split()[0], {p: md.version(p) for p in ["bcrypt", "flask-bcrypt", "django", "werkzeug", "pwdlib"]})
ok = lambda label, cond: print(("  PASS " if cond else "  FAIL ") + label)


def raises(fn):
    try:
        fn()
        return None
    except Exception as e:  # noqa: BLE001
        return f"{type(e).__name__}: {e}"


# ---------------- facts ----------------
import bcrypt

print("gensalt signature:", inspect.signature(bcrypt.gensalt))
print("default gensalt prefix/cost:", bcrypt.gensalt()[:7])
print("gensalt(prefix=b'2a'):", bcrypt.gensalt(rounds=10, prefix=b"2a")[:7])
print("checkpw(str):", raises(lambda: bcrypt.checkpw("x", bcrypt.hashpw(b"x", bcrypt.gensalt(4)))))
print("hashpw(str):", raises(lambda: bcrypt.hashpw("x", bcrypt.gensalt(4))))
h = bcrypt.hashpw(b"pw", bcrypt.gensalt(4))
print("checkpw(str(bytes) stored):", raises(lambda: bcrypt.checkpw(b"pw", str(h).encode())))
print("checkpw(truncated):", repr(bcrypt.checkpw(b"pw", h[:50])) if raises(lambda: bcrypt.checkpw(b"pw", h[:50])) is None else raises(lambda: bcrypt.checkpw(b"pw", h[:50])))
print("checkpw(wrong) returns:", repr(bcrypt.checkpw(b"nope", h)))
print("checkpw($2y$ php hash):", bcrypt.checkpw(b"correct horse battery staple", b"$2y$12$ISHee6aytH3uxUNZgjFAj.m6J4/CcIb/N77F0NJ/Nr.WCVU/SqWU6"))
print("checkpw(django bcrypt_sha256 string):", raises(lambda: bcrypt.checkpw(b"pw", b"bcrypt_sha256$$2b$12$abc")))
print("has get_rounds?", hasattr(bcrypt, "get_rounds"))

# ---------------- article: quick start ----------------
import bcrypt

password = "correct horse battery staple"

hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
print(hashed)  # b'$2b$12$...'

if bcrypt.checkpw(password.encode("utf-8"), hashed):
    print("Password is correct")
ok("quick start verifies", bcrypt.checkpw(password.encode("utf-8"), hashed))
ok("default cost is 12", hashed.startswith(b"$2b$12$"))

# ---------------- article: gensalt ----------------
salt = bcrypt.gensalt(rounds=12)                 # cost 12 (the default)
legacy_salt = bcrypt.gensalt(rounds=12, prefix=b"2a")  # $2a$ for very old systems
ok("gensalt rounds/prefix", salt.startswith(b"$2b$12$") and legacy_salt.startswith(b"$2a$12$"))

# ---------------- article: storing (str in DB) ----------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def check_password(password: str, stored_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8"))


stored = hash_password(password)
ok("stored is str, 60 chars", isinstance(stored, str) and len(stored) == 60)
ok("check_password true/false", check_password(password, stored) and not check_password("wrong", stored))

# ---------------- article: read cost / rehash ----------------
def get_cost(stored_hash: str) -> int:
    return int(stored_hash.split("$")[2])


TARGET_COST = 12

def login(password: str, stored_hash: str) -> tuple[bool, str]:
    if not check_password(password, stored_hash):
        return False, stored_hash
    if get_cost(stored_hash) < TARGET_COST:
        stored_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(TARGET_COST)).decode("utf-8")
        # save stored_hash to the database here
    return True, stored_hash


old = bcrypt.hashpw(password.encode(), bcrypt.gensalt(10)).decode()
okay, new = login(password, old)
ok("rehash upgrades cost 10 -> 12", okay and get_cost(new) == 12 and get_cost(old) == 10)
ok("rehash wrong password keeps hash", login("wrong", old) == (False, old))

# ---------------- article: asyncio ----------------
async def hash_password_async(password: str) -> str:
    return await asyncio.to_thread(hash_password, password)


async def main():
    results = await asyncio.gather(*(hash_password_async(password) for _ in range(4)))
    return all(check_password(password, r) for r in results)

ok("asyncio.to_thread hashes", asyncio.run(main()))

# ---------------- article: Flask-Bcrypt ----------------
from flask import Flask
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config["BCRYPT_LOG_ROUNDS"] = 12
flask_bcrypt = Bcrypt(app)

pw_hash = flask_bcrypt.generate_password_hash("correct horse battery staple").decode("utf-8")
flask_bcrypt.check_password_hash(pw_hash, "correct horse battery staple")  # True
ok("flask generate returns bytes", isinstance(flask_bcrypt.generate_password_hash("x"), bytes))
ok("flask check str hash", flask_bcrypt.check_password_hash(pw_hash, "correct horse battery staple") is True)
ok("flask check wrong", flask_bcrypt.check_password_hash(pw_hash, "nope") is False)
ok("flask uses cost 12", pw_hash.startswith("$2b$12$"))
print("flask 77-byte:", raises(lambda: flask_bcrypt.generate_password_hash("a" * 77)))
ok("flask hash verifies with plain bcrypt", check_password("correct horse battery staple", pw_hash))

# Werkzeug for comparison
from werkzeug.security import check_password_hash, generate_password_hash

w = generate_password_hash("correct horse battery staple")
ok("werkzeug default is scrypt", w.startswith("scrypt:"))
print("werkzeug hash length:", len(w))

# ---------------- article: Django ----------------
import django
from django.conf import settings

settings.configure(
    PASSWORD_HASHERS=[
        "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
        "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    ],
)
django.setup()
from django.contrib.auth.hashers import check_password as dj_check, make_password

dj = make_password("correct horse battery staple")
print("django hash prefix:", dj[:22], "| length:", len(dj))
ok("django check", dj_check("correct horse battery staple", dj))
long_pw = "correct horse battery staple " * 4  # 116 bytes
dj_long = make_password(long_pw)
ok("django BCryptSHA256 accepts >72 bytes", dj_check(long_pw, dj_long))
ok("django BCryptSHA256 distinguishes after byte 72", not dj_check(long_pw[:-1], dj_long))
print("plain bcrypt on django string:", raises(lambda: bcrypt.checkpw(b"x", dj.encode())))

# ---------------- article: FastAPI / pwdlib ----------------
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher
from pwdlib.hashers.bcrypt import BcryptHasher

password_hash = PasswordHash((Argon2Hasher(), BcryptHasher()))

def verify_and_upgrade(password: str, stored_hash: str) -> tuple[bool, str | None]:
    # Returns (valid, new_hash): new_hash is set when the stored hash should be replaced
    return password_hash.verify_and_update(password, stored_hash)


legacy_bcrypt = hash_password(password)
valid, upgraded = verify_and_upgrade(password, legacy_bcrypt)
ok("pwdlib verifies old bcrypt hash", valid)
ok("pwdlib offers argon2id upgrade", upgraded is not None and upgraded.startswith("$argon2id$"))
valid2, upgraded2 = verify_and_upgrade(password, upgraded)
ok("pwdlib argon2 hash needs no upgrade", valid2 and upgraded2 is None)
ok("pwdlib wrong password", verify_and_upgrade("nope", legacy_bcrypt) == (False, None))
