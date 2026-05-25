'use client'
import { useState } from 'react'
import { CopyButton } from '@/components/ui/CopyButton'

const snippets = [
  {
    lang: 'Node.js',
    install: 'npm install bcryptjs',
    code: `const bcrypt = require('bcryptjs');

// Generate hash
const password = 'myPassword123';
const saltRounds = 12;
const hash = await bcrypt.hash(password, saltRounds);
console.log(hash); // $2b$12$...

// Verify password
const isMatch = await bcrypt.compare(password, hash);
console.log(isMatch); // true`,
  },
  {
    lang: 'PHP',
    install: '// Built into PHP 5.5+',
    code: `<?php
// Generate hash
$password = 'myPassword123';
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
echo $hash; // $2y$12$...

// Verify password
$isMatch = password_verify($password, $hash);
var_dump($isMatch); // bool(true)`,
  },
  {
    lang: 'Python',
    install: 'pip install bcrypt',
    code: `import bcrypt

# Generate hash
password = b'myPassword123'
salt = bcrypt.gensalt(rounds=12)
hashed = bcrypt.hashpw(password, salt)
print(hashed)  # b'$2b$12$...'

# Verify password
is_match = bcrypt.checkpw(password, hashed)
print(is_match)  # True`,
  },
  {
    lang: 'Java',
    install: '// Maven: org.mindrot:jbcrypt:0.4',
    code: `import org.mindrot.jbcrypt.BCrypt;

// Generate hash
String password = "myPassword123";
String hash = BCrypt.hashpw(password, BCrypt.gensalt(12));
System.out.println(hash); // $2a$12$...

// Verify password
boolean isMatch = BCrypt.checkpw(password, hash);
System.out.println(isMatch); // true`,
  },
  {
    lang: 'Go',
    install: 'go get golang.org/x/crypto/bcrypt',
    code: `import "golang.org/x/crypto/bcrypt"

// Generate hash
password := []byte("myPassword123")
hash, err := bcrypt.GenerateFromPassword(password, 12)
if err != nil { panic(err) }
fmt.Println(string(hash)) // $2a$12$...

// Verify password
err = bcrypt.CompareHashAndPassword(hash, password)
isMatch := err == nil
fmt.Println(isMatch) // true`,
  },
  {
    lang: 'Laravel',
    install: '// Built into Laravel',
    code: `use Illuminate\\Support\\Facades\\Hash;

// Generate hash
$hash = Hash::make('myPassword123', ['rounds' => 12]);

// Verify password
$isMatch = Hash::check('myPassword123', $hash);
// true

// Laravel also auto-hashes in User model
// App\\Models\\User uses $casts => ['password' => 'hashed']`,
  },
  {
    lang: 'Ruby',
    install: "gem install bcrypt",
    code: `require 'bcrypt'

# Generate hash
password = 'myPassword123'
hash = BCrypt::Password.create(password, cost: 12)
puts hash # $2a$12$...

# Verify password
bcrypt = BCrypt::Password.new(hash)
is_match = bcrypt == password
puts is_match # true`,
  },
]

export function CodeSnippets() {
  const [active, setActive] = useState(0)
  const snippet = snippets[active]

  return (
    <div className="mt-6 border border-slate-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300">Code Examples</h3>
        <CopyButton text={snippet.code} />
      </div>
      <div className="flex overflow-x-auto bg-slate-900 border-b border-slate-800 scrollbar-thin">
        {snippets.map((s, i) => (
          <button
            key={s.lang}
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
              i === active
                ? 'text-blue-400 border-blue-500 bg-slate-800'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {s.lang}
          </button>
        ))}
      </div>
      <div className="bg-slate-900 p-4">
        <div className="mb-3">
          <span className="text-xs text-slate-500 font-mono">Install</span>
          <div className="mt-1 font-mono text-xs text-amber-300 bg-slate-950 border border-slate-800 rounded px-3 py-2">
            {snippet.install}
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-mono">Usage</span>
          <pre className="mt-1 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded px-3 py-3 overflow-x-auto leading-relaxed font-mono">
            <code>{snippet.code}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
