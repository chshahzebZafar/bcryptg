# Python and SQL code blocks from the article, run as published.
import sqlite3
import bcrypt

password = "correct horse battery staple"

class User:  # stand-in for an ORM model
    password_hash = None

user = User()
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
user.password_hash = hashed.decode()  # store a normal string

print("checkpw:", bcrypt.checkpw(password.encode(), user.password_hash.encode()))
print("stored type/len:", type(user.password_hash).__name__, len(user.password_hash))

db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, password_hash TEXT)")
db.executemany("INSERT INTO users (password_hash) VALUES (?)",
               [(user.password_hash,), (user.password_hash[:50],), (user.password_hash + "\n",)])
rows = db.execute("SELECT id, LENGTH(password_hash) FROM users WHERE LENGTH(password_hash) <> 60;").fetchall()
print("SQL flagged rows:", rows)
