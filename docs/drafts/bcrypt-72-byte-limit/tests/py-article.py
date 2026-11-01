# Python code blocks for the 72-byte article, run as published.
import base64
import hashlib
import hmac
import os
import sys

import bcrypt

legacy_hash = sys.argv[1].encode()
password = "correct horse battery staple " * 3  # 87 bytes, hashed earlier by bcrypt 4.0.1 (silently truncated)

# --- Option 1: enforce the limit ---------------------------------------
def check_length(password: str) -> None:
    if len(password.encode("utf-8")) > 72:
        raise ValueError("Password must be 72 bytes or fewer")

for p in ["a" * 72, "a" * 73, "🔐" * 19]:
    try:
        check_length(p); print("check ok", len(p.encode()))
    except ValueError:
        print("check rejected", len(p.encode()))

# --- Option 2: pre-hash with a pepper (OWASP recipe) -------------------
PEPPER = os.environ.get("PASSWORD_PEPPER", "demo-pepper-from-secret-store").encode()

def prepare(password: str) -> bytes:
    digest = hmac.new(PEPPER, password.encode("utf-8"), hashlib.sha384).digest()
    return base64.b64encode(digest)  # 64 bytes, no null bytes

hashed = bcrypt.hashpw(prepare(password), bcrypt.gensalt())
print("prepare length:", len(prepare(password)), "| verify:", bcrypt.checkpw(prepare(password), hashed),
      "| wrong:", bcrypt.checkpw(prepare(password + "x"), hashed))

# --- Upgrading: verifying hashes made by a truncating library ----------
def verify_legacy(password: str, stored: bytes) -> bool:
    # Old library ignored everything after byte 72, so do the same here
    return bcrypt.checkpw(password.encode("utf-8")[:72], stored)

try:
    print("bcrypt 5 checkpw(full 87-byte password, legacy):", bcrypt.checkpw(password.encode(), legacy_hash))
except ValueError as e:
    print("bcrypt 5 checkpw(full password, legacy): RAISED ValueError")
print("verify_legacy:", verify_legacy(password, legacy_hash), "| wrong first 72:", verify_legacy("x" + password, legacy_hash))

# --- pwdlib (what FastAPI's tutorial now uses) --------------------------
from pwdlib import PasswordHash
password_hash = PasswordHash.recommended()
h = password_hash.hash(password)
print("pwdlib recommended:", h[:10], "| verify 87-byte:", password_hash.verify(password, h))
