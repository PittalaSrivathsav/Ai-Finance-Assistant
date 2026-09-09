import urllib.request, urllib.error, json

BASE_URL = 'http://127.0.0.1:8000/api/auth'

print("=" * 50)
print("AUTH FLOW VERIFICATION TEST")
print("=" * 50)

# Test 1: Wrong password
print("\n[Test 1] Login with wrong password...")
try:
    req = urllib.request.Request(
        f'{BASE_URL}/login',
        data=json.dumps({'email': 'srivathsav@example.com', 'password': 'wrongpassword'}).encode(),
        headers={'Content-Type': 'application/json'}
    )
    urllib.request.urlopen(req)
    print("  FAIL: Should have been rejected!")
except urllib.error.HTTPError as e:
    body = json.loads(e.read().decode())
    if e.code == 401 and 'Invalid email or password' in body.get('detail', ''):
        print(f"  PASS: HTTP {e.code} - {body.get('detail')}")
    else:
        print(f"  PARTIAL: HTTP {e.code} - {body.get('detail')} (expected 401 + 'Invalid email or password')")

# Test 2: Register with existing email
print("\n[Test 2] Register with already-registered email...")
try:
    req = urllib.request.Request(
        f'{BASE_URL}/register',
        data=json.dumps({'name': 'Test', 'email': 'srivathsav@example.com', 'password': 'abc123'}).encode(),
        headers={'Content-Type': 'application/json'}
    )
    urllib.request.urlopen(req)
    print("  FAIL: Should have been rejected!")
except urllib.error.HTTPError as e:
    body = json.loads(e.read().decode())
    if e.code == 400 and 'already registered' in body.get('detail', '').lower():
        print(f"  PASS: HTTP {e.code} - {body.get('detail')}")
    else:
        print(f"  PARTIAL: HTTP {e.code} - {body.get('detail')}")

# Test 3: Correct login
print("\n[Test 3] Login with correct credentials...")
try:
    req = urllib.request.Request(
        f'{BASE_URL}/login',
        data=json.dumps({'email': 'srivathsav@example.com', 'password': 'password123'}).encode(),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read().decode())
        user = data.get('user', {})
        token = data.get('access_token', '')
        print(f"  PASS: HTTP {r.status} - Logged in as '{user.get('name')}' ({user.get('email')})")
        print(f"  Token (first 40 chars): {token[:40]}...")
except urllib.error.HTTPError as e:
    body = json.loads(e.read().decode())
    print(f"  FAIL: HTTP {e.code} - {body.get('detail')}")

print("\n" + "=" * 50)
print("ALL TESTS COMPLETE")
print("=" * 50)
