# 72-byte behaviour across Python bcrypt stacks. Run in each venv.
import importlib.metadata as md
import logging
import sys
import warnings

logging.basicConfig(level=logging.WARNING, format="  LOG %(name)s: %(message)s")
warnings.simplefilter("always")

import bcrypt

print("=== Python", sys.version.split()[0], "| bcrypt", bcrypt.__version__, "| passlib", md.version("passlib"))


def show(label, fn):
    try:
        r = fn()
        print(f"  {label}: {r!r}"[:220])
    except Exception as e:  # noqa: BLE001
        print(f"  {label}: RAISED {type(e).__name__}: {e}"[:300])


short = b"correct horse battery staple"
a72 = b"a" * 72
long = a72 + b"EXTRA"
print("pyca/bcrypt directly")
show("hashpw(72 bytes)", lambda: bcrypt.hashpw(a72, bcrypt.gensalt(4))[:7])
show("hashpw(77 bytes)", lambda: bcrypt.hashpw(long, bcrypt.gensalt(4))[:7])
h72 = bcrypt.hashpw(a72, bcrypt.gensalt(4))
show("checkpw(77 bytes, hash of first 72)", lambda: bcrypt.checkpw(long, h72))
show("hashpw(password[:72]) manual truncation", lambda: bcrypt.checkpw(long[:72], bcrypt.hashpw(long[:72], bcrypt.gensalt(4))))
emoji = ("🔐" * 19).encode()
show("19 emoji = bytes", lambda: len(emoji))
show("hashpw(19 emoji)", lambda: bcrypt.hashpw(emoji, bcrypt.gensalt(4))[:7])

print("passlib CryptContext(schemes=['bcrypt'])  (FastAPI tutorial pattern)")
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
show("hash(short password)", lambda: pwd_context.hash("correct horse battery staple")[:7])
show("hash(77-byte password)", lambda: pwd_context.hash((a72 + b"EXTRA").decode())[:7])
try:
    hp = pwd_context.hash("a" * 72)
    show("verify(77-byte password, hash of 72)", lambda: pwd_context.verify("a" * 72 + "EXTRA", hp))
except Exception as e:  # noqa: BLE001
    print(f"  (could not create 72-byte hash: {type(e).__name__}: {e})")

try:
    import flask_bcrypt  # noqa: F401
    from flask import Flask
    from flask_bcrypt import Bcrypt

    print("Flask-Bcrypt", md.version("flask-bcrypt"))
    fb = Bcrypt(Flask(__name__))
    show("generate_password_hash(77 bytes)", lambda: fb.generate_password_hash("a" * 72 + "EXTRA")[:7])
except ImportError:
    pass

try:
    from pwdlib import PasswordHash
    from pwdlib.hashers.bcrypt import BcryptHasher

    print("pwdlib", md.version("pwdlib"))
    ph = PasswordHash((BcryptHasher(),))
    show("pwdlib bcrypt hash(77 bytes)", lambda: ph.hash("a" * 72 + "EXTRA")[:7])
    show("pwdlib bcrypt hash(short)", lambda: ph.hash("correct horse battery staple")[:7])
except ImportError as e:
    print("pwdlib bcrypt hasher unavailable:", e)
