# Python side of the article's causes (pyca/bcrypt). Prints observed behaviour.
import os
import sys
import bcrypt

pw = "correct horse battery staple"
print("pyca bcrypt", bcrypt.__version__, "| Python", sys.version.split()[0])


def show(label, fn):
    try:
        print(f"  {label}: {fn()!r}")
    except Exception as e:  # noqa: BLE001 - we want to print whatever is raised
        print(f"  {label}: RAISED {type(e).__name__}: {e}")


h = bcrypt.hashpw(pw.encode(), bcrypt.gensalt(rounds=10))
show("sanity checkpw(pw, h)", lambda: bcrypt.checkpw(pw.encode(), h))
show("comparing hashes: hashpw(pw, gensalt()) == h", lambda: bcrypt.hashpw(pw.encode(), bcrypt.gensalt(10)) == h)
show("str instead of bytes: checkpw(pw_str, h)", lambda: bcrypt.checkpw(pw, h))
show("hash stored as str: checkpw(pw, h.decode())", lambda: bcrypt.checkpw(pw.encode(), h.decode()))
show("hash str re-encoded: checkpw(pw, h.decode().encode())", lambda: bcrypt.checkpw(pw.encode(), h.decode().encode()))
show("str(bytes) bug: checkpw(pw, str(h).encode())", lambda: bcrypt.checkpw(pw.encode(), str(h).encode()))
show("swapped: checkpw(h, pw)", lambda: bcrypt.checkpw(h, pw.encode()))
show("double hashed", lambda: bcrypt.checkpw(pw.encode(), bcrypt.hashpw(h, bcrypt.gensalt(10))))
show("truncated hash", lambda: bcrypt.checkpw(pw.encode(), h[:50]))
show("trailing newline on hash", lambda: bcrypt.checkpw(pw.encode(), h + b"\n"))
show("trailing newline on password", lambda: bcrypt.checkpw((pw + "\n").encode(), h))
long = b"a" * 72
show("hashpw 73 bytes", lambda: bcrypt.hashpw(long + b"X", bcrypt.gensalt(4)))
hl = bcrypt.hashpw(long, bcrypt.gensalt(4))
show("checkpw 73 bytes vs hash of 72", lambda: bcrypt.checkpw(long + b"X", hl))
node_hash = os.environ.get("NODE_HASH")
php_hash = os.environ.get("PHP_HASH")
if node_hash:
    show("verify Node $2b$ hash", lambda: bcrypt.checkpw(pw.encode(), node_hash.encode()))
if php_hash:
    show("verify PHP $2y$ hash", lambda: bcrypt.checkpw(pw.encode(), php_hash.encode()))
