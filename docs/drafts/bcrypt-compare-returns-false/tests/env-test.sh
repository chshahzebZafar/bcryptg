#!/usr/bin/env bash
# What happens to a bcrypt hash's $ signs in a shell and in .env loaders.
cd "$(dirname "$0")"
H='$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
echo "original     : $H (${#H} chars)"

# Shell: double quotes expand $2 (positional parameter) — run with no positional args.
set --
eval 'DQ="$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"'
echo "double quotes: $DQ (${#DQ} chars)"
SQ='$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
echo "single quotes: $SQ (${#SQ} chars)"

# .env files
printf 'HASH_UNQUOTED=%s\nHASH_SINGLE='"'"'%s'"'"'\nHASH_ESCAPED=%s\n' "$H" "$H" "${H//\$/\\\$}" > .env.test
echo "--- .env.test:"; cat .env.test
node -e "
const dotenv=require('dotenv'), {expand}=require('dotenv-expand');
const parsed=dotenv.config({path:'.env.test', processEnv:{}}).parsed;
console.log('dotenv only      :', JSON.stringify(parsed));
const exp=expand({parsed:{...parsed}, processEnv:{}}).parsed;
console.log('dotenv + expand  :', JSON.stringify(exp));
for (const k of Object.keys(exp)) console.log('  ', k, exp[k].length, 'chars');
"
