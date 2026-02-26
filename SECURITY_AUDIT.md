# Security Audit Report - V1 Michigan Website
**Date**: February 26, 2026  
**Audited Site**: hackelo.vercel.app (v1michigan.com)  
**Severity Scale**: 🔴 Critical | 🟡 High | 🟠 Medium | 🟢 Low

---

## Executive Summary

This security audit identified **7 critical vulnerabilities** and **3 high-priority issues** in the V1 Michigan website. The most severe issues include:
- XSS vulnerability in email notifications
- Complete lack of server-side authorization
- No rate limiting on any endpoints
- Missing Row Level Security policies
- Email bombing vulnerability

**No voting system was found** in the codebase, so voting-related vulnerabilities do not apply.

---

## 🔴 CRITICAL VULNERABILITIES

### 1. XSS in Email Notifications (CRITICAL)
**File**: `app/api/love-notes/send/route.ts` (Line 30)  
**Issue**: User-controlled `senderName` is directly embedded into HTML email without sanitization.

```typescript
// VULNERABLE CODE:
html: `
  <p style="...">
    Hey there :) You have received a letter from <strong>${senderName}</strong>.
  </p>
`
```

**Attack Vector**:
```javascript
// Attacker sends:
senderName: "<script>alert('XSS')</script>" 
// Or: "<img src=x onerror=alert(document.cookie)>"
```

**Impact**: 
- Email clients may execute malicious scripts
- Potential data theft if email client doesn't sanitize
- Phishing attacks by injecting malicious links

**Fix**: Escape HTML entities or use a template library with auto-escaping

---

### 2. No Row Level Security (RLS) Policies (CRITICAL)
**Files**: All database operations using Supabase client  
**Issue**: No RLS policies enforced at database level. All security relies on client-side checks.

**Vulnerable Tables**:
- `love_notes` - Anyone can read/write/delete any love note
- `v1-people` - Anyone can modify any profile
- `flags` - Anyone can modify feature flags
- `dynamic_links` - Anyone can modify URL redirects

**Attack Vector**:
```javascript
// Attacker can directly query Supabase:
const { data } = await supabase
  .from('love_notes')
  .select('*')  // Read ALL love notes from everyone

// Or modify anyone's profile:
await supabase
  .from('v1-people')
  .update({ role: 'Admin', name: 'Hacker' })
  .eq('id', 'victim-user-id')
```

**Impact**: 
- Complete data breach - read any user's private love notes
- Modify any user's profile
- Delete any user's data
- Manipulate feature flags
- Modify URL redirects for phishing

**Fix**: Implement RLS policies in Supabase dashboard for every table

---

### 3. No Rate Limiting (CRITICAL)
**Files**: All API routes  
**Issue**: No rate limiting on any endpoint

**Vulnerable Endpoints**:
- `/api/love-notes/send` - Email bombing
- `/api/checkout` - Payment spam
- All Supabase queries - Data scraping

**Attack Vector**:
```javascript
// Spam 1000 emails:
for (let i = 0; i < 1000; i++) {
  fetch('/api/love-notes/send', {
    method: 'POST',
    body: JSON.stringify({
      recipientEmail: 'victim@example.com',
      senderName: 'Spammer ' + i
    })
  })
}
```

**Impact**:
- Email bombing/harassment
- API cost explosion (Resend charges per email)
- Denial of service
- Stripe checkout spam

**Fix**: Implement rate limiting middleware (e.g., `upstash/ratelimit`, `express-rate-limit`)

---

### 4. Client-Side Only Authorization (CRITICAL)
**Files**: 
- `app/people/edit/page.tsx`
- `app/valentines/2026/page.tsx`
- `components/valentines/canvas-editor.tsx`

**Issue**: Authorization checks only happen client-side. No server-side validation.

**Example in canvas-editor.tsx** (Line 150-160):
```typescript
// Client provides user_id - no server verification!
await supabase.from("love_notes").insert({
  user_id: userId,  // ⚠️ Controlled by client
  sender_name: senderName,
  sender_email: senderEmail,
  // ...
})
```

**Attack Vector**:
1. Open DevTools
2. Modify `userId` variable to another user's ID
3. Create love notes as that user
4. Bypass all client-side checks by calling Supabase directly

**Impact**:
- Impersonate any user
- Create content as other users
- Bypass authentication entirely

**Fix**: Move database operations to API routes with server-side session validation

---

### 5. Email Bombing Vulnerability (CRITICAL)
**File**: `app/api/love-notes/send/route.ts`  
**Issue**: No validation, rate limiting, or verification for email sending

**Problems**:
- No rate limiting (can send 1000s of emails)
- No email validation (can send to any address)
- No CAPTCHA or human verification
- No cost control
- No unsubscribe mechanism

**Attack Vector**:
```bash
# Automated email bombing:
while true; do
  curl -X POST https://hackelo.vercel.app/api/love-notes/send \
    -H "Content-Type: application/json" \
    -d '{"recipientEmail":"victim@example.com","senderName":"Spammer"}'
done
```

**Impact**:
- Harassment via email spam
- Reputation damage (sender domain blacklisted)
- Financial cost (Resend API charges)
- Legal liability (CAN-SPAM Act violations)

**Fix**: Add rate limiting, email verification, CAPTCHA, and recipient consent

---

### 6. Exposed Supabase Anonymous Key (HIGH)
**File**: `utils/supabaseClient.tsx`  
**Issue**: Client-side Supabase client exposes anon key to all users

**Current Setup**:
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export default createClient(supabaseUrl, supabaseAnonKey);
```

**Problem**: 
- `NEXT_PUBLIC_*` variables are bundled in client JS (visible to everyone)
- Combined with no RLS = complete database access
- Attackers can bypass your frontend entirely

**Impact**:
- Direct database access for anyone who inspects the code
- Can't revoke access without redeploying
- No audit trail of malicious activity

**Fix**: This is normal for Supabase, BUT requires RLS policies to be secure

---

### 7. No CSRF Protection (HIGH)
**Files**: All API routes  
**Issue**: No CSRF tokens or SameSite cookie protection visible

**Attack Vector**:
```html
<!-- Malicious site: -->
<form action="https://hackelo.vercel.app/api/love-notes/send" method="POST">
  <input name="recipientEmail" value="victim@example.com">
  <input name="senderName" value="Attacker">
</form>
<script>document.forms[0].submit()</script>
```

**Impact**: 
- Cross-site request forgery
- Unwanted actions on behalf of authenticated users

**Note**: Next.js may provide some default protection, but not verified in code

---

## 🟡 HIGH PRIORITY ISSUES

### 8. SQL Injection Risk in Search (LOW-MEDIUM)
**File**: `components/people-content.tsx` (Line 37)  
**Code**:
```typescript
query = query.ilike('name', `%${searchQuery.trim()}%`);
```

**Assessment**: 
- Supabase properly parameterizes queries (safe from SQL injection)
- However, no input validation or length limits
- Could cause performance issues with malicious patterns

**Recommendation**: Add input validation and length limits

---

### 9. Client-Side Profile Ownership Bypass (HIGH)
**File**: `app/people/edit/page.tsx`  
**Issue**: Only client-side check prevents editing other profiles

**Current Check** (Line 53):
```typescript
.from('v1-people')
.select('...')
.eq('id', user.id)  // ⚠️ Client can modify this
```

**Attack Vector**:
1. Intercept the request
2. Change `user.id` to another user's ID
3. Modify that user's profile

**Impact**: Edit anyone's profile information

**Fix**: Server-side API route that validates session and user ownership

---

### 10. No Input Validation (HIGH)
**Files**: Multiple components  
**Issue**: Minimal input validation on user-provided data

**Examples**:
- Love note messages: Only length check (400 chars), no content validation
- Profile bios: No validation at all
- Social media URLs: No validation
- Tags: Basic special char removal only (line 180 in edit page)

**Attack Vectors**:
- Store malicious payloads in database
- Inject excessive data to cause DoS
- Unicode/emoji attacks

**Fix**: Implement comprehensive input validation with libraries like `zod` (already installed)

---

## 🟠 MEDIUM PRIORITY ISSUES

### 11. No Content Security Policy (MEDIUM)
**Issue**: No CSP headers to prevent XSS

**Fix**: Add CSP headers in `next.config.mjs`:
```javascript
headers: [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline'; ..."
  }
]
```

---

### 12. Unvalidated File Uploads (MEDIUM)
**File**: `components/valentines/canvas-editor.tsx`  
**Issue**: File upload only checks MIME type on client

**Code** (Line 321):
```typescript
accept="image/jpeg,image/png"
```

**Problems**:
- Client-side only validation
- No server-side file type verification
- No malware scanning
- No file size limits enforced server-side
- File storage path uses client-provided userId

**Attack Vector**:
- Upload malicious files disguised as images
- Upload massive files to exhaust storage
- Upload files as other users

---

### 13. Environment Variables Not Validated (MEDIUM)
**File**: `utils/supabaseClient.tsx`  
**Issue**: Basic check but no validation of format

**Current**:
```typescript
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}
```

**Better**: Validate format and structure

---

## 🟢 LOWER PRIORITY ISSUES

### 14. Console Logging Errors (INFO)
Multiple files log errors to console which exposes information in production.

### 15. No Security Headers (MEDIUM)
Missing headers:
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Strict-Transport-Security`
- `Referrer-Policy`

---

## VOTING SYSTEM ANALYSIS

**Finding**: No voting system exists in the codebase.

I searched for:
- vote, voting, poll, upvote, downvote
- elo, rating, rank, score, leaderboard
- hackathon-related voting features

**Conclusion**: The site name "hackelo" suggests there may have been plans for an Elo rating system for hackathons, but it's not currently implemented. Therefore, no voting-related vulnerabilities exist.

---

## RECOMMENDATIONS BY PRIORITY

### Immediate Actions (Within 24 hours):
1. ✅ **Implement RLS policies in Supabase** for all tables
2. ✅ **Add rate limiting** to all API routes
3. ✅ **Sanitize HTML** in email notifications
4. ✅ **Move database operations** to API routes with session validation

### Short Term (Within 1 week):
5. Add input validation with Zod schemas
6. Implement server-side file validation
7. Add security headers
8. Set up monitoring and alerting

### Medium Term (Within 1 month):
9. Add CAPTCHA to form submissions
10. Implement audit logging
11. Add email verification/consent
12. Set up automated security scanning

---

## EXAMPLE RLS POLICIES NEEDED

### For `love_notes` table:
```sql
-- Users can only insert with their own user_id
CREATE POLICY "Users can insert own love notes"
ON love_notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can read notes they sent
CREATE POLICY "Users can read own sent notes"
ON love_notes FOR SELECT
USING (auth.uid() = user_id);

-- Users can read notes sent to their email
CREATE POLICY "Users can read received notes"
ON love_notes FOR SELECT
USING (auth.email() = recipient_email);

-- Users can only delete their own notes
CREATE POLICY "Users can delete own notes"
ON love_notes FOR DELETE
USING (auth.uid() = user_id);
```

### For `v1-people` table:
```sql
-- Everyone can read all profiles
CREATE POLICY "Public profiles are viewable"
ON "v1-people" FOR SELECT
USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON "v1-people" FOR UPDATE
USING (auth.uid() = id);
```

### For `flags` table:
```sql
-- Everyone can read flags
CREATE POLICY "Flags are publicly readable"
ON flags FOR SELECT
USING (true);

-- Only authenticated users can update (or restrict to admins)
CREATE POLICY "Only admins can update flags"
ON flags FOR UPDATE
USING (auth.uid() IN (
  SELECT id FROM "v1-people" WHERE role = 'Admin'
));
```

---

## SECURITY TESTING COMMANDS

### Test XSS:
```bash
curl -X POST https://hackelo.vercel.app/api/love-notes/send \
  -H "Content-Type: application/json" \
  -d '{"recipientEmail":"test@example.com","senderName":"<script>alert(\"XSS\")</script>"}'
```

### Test Rate Limiting (should be blocked after N requests):
```bash
for i in {1..100}; do
  curl -X POST https://hackelo.vercel.app/api/love-notes/send \
    -H "Content-Type: application/json" \
    -d '{"recipientEmail":"test@example.com","senderName":"Test"}' &
done
```

### Test SQL Injection (Supabase should protect, but verify):
```bash
# Try malicious search:
# Visit: /people?q='; DROP TABLE "v1-people"; --
```

---

## COMPLIANCE CONCERNS

### CAN-SPAM Act Violations
The email notification system may violate CAN-SPAM Act:
- ❌ No unsubscribe mechanism
- ❌ No physical address in emails
- ❌ No clear identification it's an advertisement
- ❌ No opt-in consent from recipients

### GDPR Concerns (if applicable)
- ❌ No privacy policy visible
- ❌ No data retention policy
- ❌ No user data export functionality
- ❌ No right to deletion (for received notes)

---

## ADDITIONAL NOTES

1. **Positive Security Measures Found**:
   - Using Supabase Auth (OAuth with Google)
   - HTTPS enforced (Vercel default)
   - Environment variables for secrets
   - Basic client-side input validation

2. **Dependencies**: All dependencies appear up-to-date (checked package.json)

3. **Authentication**: Google OAuth through Supabase is secure, but needs server-side session validation

4. **File Storage**: Supabase Storage is used appropriately, but needs server-side validation

---

## CONCLUSION

The application has significant security vulnerabilities that could be exploited by malicious actors. The most critical issues stem from:
1. Complete lack of server-side authorization
2. No rate limiting
3. Missing RLS policies
4. XSS vulnerabilities

**Recommended**: Address all CRITICAL vulnerabilities before allowing public access to sensitive features.
