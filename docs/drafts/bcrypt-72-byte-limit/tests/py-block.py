import os
os.environ["PASSWORD_PEPPER"] = "test-pepper-0123456789abcdef"
password = "correct horse battery staple " * 5
# --- article block ---
import base64, hashlib, hmac, os
import bcrypt

PEPPER = os.environ["PASSWORD_PEPPER"].encode()

def prepare(password: str) -> bytes:
    digest = hmac.new(PEPPER, password.encode("utf-8"), hashlib.sha384).digest()
    return base64.b64encode(digest)  # 64 bytes, no null bytes

hashed = bcrypt.hashpw(prepare(password), bcrypt.gensalt())
bcrypt.checkpw(prepare(password), hashed)
# --- end ---
print("python article prehash ok:", bcrypt.checkpw(prepare(password), hashed), "| wrong:", bcrypt.checkpw(prepare(password[:-1]), hashed))
