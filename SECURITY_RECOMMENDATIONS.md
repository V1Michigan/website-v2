# Security Recommendations & Action Plan

## 🚨 IMMEDIATE ACTIONS REQUIRED (DO NOW)

### 1. Apply Row Level Security Policies
**Priority**: CRITICAL 🔴  
**Time Required**: 15 minutes  
**Risk if Not Done**: Complete database compromise

**Steps**:
1. Open Supabase Dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT
2. Navigate to SQL Editor
3. Copy contents of `supabase/rls-policies.sql`
4. Execute the SQL
5. Verify RLS is enabled:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables 
   WHERE tablename IN ('love_notes', 'v1-people', 'flags', 'dynamic_links');
   ```
6. Test that unauthorized access is blocked

**Why This Matters**:
Currently, anyone with your Supabase URL and anon key (which is public in your JavaScript bundle) can read, modify, or delete ALL data in your database. This includes:
- All love notes (private messages)
- All user profiles
- Feature flags
- URL redirects

---

### 2. Deploy Security Fixes
**Priority**: CRITICAL 🔴  
**Time Required**: 5 minutes  
**Files Changed**: 
- `app/api/love-notes/send/route.ts` (XSS fix + rate limiting)
- `app/api/checkout/route.ts` (rate limiting)
- `next.config.mjs` (security headers)
- `lib/rate-limit.ts` (new utility)
- `lib/validations.ts` (new validation schemas)

**Deploy**:
```bash
git add .
git commit -m "security: fix XSS, add rate limiting, security headers, and input validation"
git push
```

**Verify After Deploy**:
- Test rate limiting (6+ rapid requests should be blocked)
- Test XSS payload is escaped in emails
- Check security headers with `curl -I`

---

### 3. Update Admin Configuration
**Priority**: HIGH 🟡  
**Time Required**: 10 minutes

**Steps**:
1. Identify which users should be admins
2. Set their role to 'Admin' in `v1-people` table:
   ```sql
   UPDATE "v1-people" 
   SET role = 'Admin' 
   WHERE id = 'user-uuid-here';
   ```
3. Or update the RLS policies to hardcode admin UUIDs
4. Test that non-admins can't modify flags or dynamic links

---

## 📋 SHORT-TERM IMPROVEMENTS (WITHIN 1 WEEK)

### 4. Move Database Operations to API Routes
**Priority**: CRITICAL 🔴  
**Current Issue**: All database operations happen client-side

**Create These API Routes**:

#### `/app/api/love-notes/create/route.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  // 1. Create server-side Supabase client with user session
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )
  
  // 2. Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // 3. Validate input with Zod
  const validated = loveNoteSchema.parse(await request.json())
  
  // 4. Insert with VERIFIED user_id (not client-provided)
  const { error } = await supabase.from('love_notes').insert({
    ...validated,
    user_id: user.id,  // ✅ Server-controlled, can't be spoofed
    sender_email: user.email,
  })
  
  // 5. Return result
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
```

#### `/app/api/profile/update/route.ts`
Similar pattern for profile updates.

**Benefits**:
- Can't spoof user_id
- Server-side session validation
- Additional business logic validation
- Better error handling
- Audit logging capability

---

### 5. Add Input Sanitization to People Search
**File**: `components/people-content.tsx`  
**Priority**: MEDIUM 🟠

**Current Code**:
```typescript
query = query.ilike('name', `%${searchQuery.trim()}%`);
```

**Issues**:
- No length limit (can search with 10,000 char string)
- No character validation
- Could cause performance issues

**Fix**:
```typescript
// Validate search query
const validated = searchQuerySchema.parse({ q: searchQuery });
const sanitized = validated.q?.trim() ?? '';

// Add length check
if (sanitized.length > 100) {
  return [];
}

query = query.ilike('name', `%${sanitized}%`);
```

---

### 6. Add File Upload Validation API
**Priority**: HIGH 🟡

**Create**: `/app/api/upload/validate/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  // Validate
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
  
  // Check file type by magic bytes, not just extension
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  
  // JPEG: FF D8 FF
  // PNG: 89 50 4E 47
  const isJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF
  const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47
  
  if (!isJPEG && !isPNG) {
    return NextResponse.json({ error: 'Invalid file type. Only JPEG and PNG allowed.' }, { status: 400 })
  }
  
  // Upload to Supabase Storage
  // ... rest of logic
}
```

---

### 7. Implement Audit Logging
**Priority**: MEDIUM 🟠

**Create**: `lib/audit-log.ts`

```typescript
export async function logSecurityEvent(event: {
  userId: string | null;
  action: string;
  resource: string;
  ip: string;
  success: boolean;
  metadata?: Record<string, any>;
}) {
  // Log to Supabase table or external service
  await supabase.from('audit_logs').insert({
    user_id: event.userId,
    action: event.action,
    resource: event.resource,
    ip_address: event.ip,
    success: event.success,
    metadata: event.metadata,
    timestamp: new Date().toISOString(),
  });
}

// Usage in API routes:
await logSecurityEvent({
  userId: user.id,
  action: 'love_note.create',
  resource: 'love_notes',
  ip: getClientIdentifier(request),
  success: true,
  metadata: { recipientEmail: note.recipient_email }
});
```

---

## 🔮 LONG-TERM IMPROVEMENTS (WITHIN 1 MONTH)

### 8. Implement CAPTCHA
**Recommended**: Cloudflare Turnstile (free, invisible)

**Add to**:
- Love note creation form
- Profile edit form
- Any public form submissions

**Implementation**:
```bash
pnpm add @marsidev/react-turnstile
```

```typescript
// In component:
import { Turnstile } from '@marsidev/react-turnstile';

<Turnstile
  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
  onSuccess={(token) => setCaptchaToken(token)}
/>

// In API route:
const turnstileResponse = await fetch(
  'https://challenges.cloudflare.com/turnstile/v0/siteverify',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: captchaToken,
    }),
  }
);
```

---

### 9. Email Consent System
**Priority**: HIGH 🟡 (Legal requirement)

**Database Changes**:
```sql
CREATE TABLE email_preferences (
  email TEXT PRIMARY KEY,
  opted_in BOOLEAN DEFAULT false,
  opted_in_at TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  unsubscribe_token UUID DEFAULT uuid_generate_v4()
);

CREATE TABLE email_blocklist (
  email TEXT PRIMARY KEY,
  reason TEXT,
  blocked_at TIMESTAMP DEFAULT now()
);
```

**Logic**:
1. First email to address asks for consent
2. Recipient clicks "Allow" or "Block" in email
3. Store preference in database
4. Check preference before sending future emails
5. Include unsubscribe link in all emails

---

### 10. Upgrade to Production-Grade Rate Limiting
**Recommended**: Upstash Rate Limit

**Why**:
- Current implementation uses in-memory Map (lost on server restart)
- Doesn't work across multiple server instances
- Can be bypassed by changing IP

**Implementation**:
```bash
pnpm add @upstash/ratelimit @upstash/redis
```

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
});

// In API route:
const { success, remaining } = await ratelimit.limit(identifier);
if (!success) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
}
```

---

### 11. Content Security Policy (CSP)
**Priority**: MEDIUM 🟠

**Challenge**: Requires cataloging all external resources

**Process**:
1. Add CSP in report-only mode first
2. Monitor CSP violation reports
3. Adjust policy to allow legitimate resources
4. Switch to enforce mode

**Implementation**:
```javascript
// next.config.mjs
{
  key: 'Content-Security-Policy-Report-Only',
  value: "default-src 'self'; report-uri /api/csp-report"
}
```

---

### 12. Automated Security Scanning
**Tools to Integrate**:

1. **Dependabot** (GitHub)
   - Automatic dependency updates
   - Security vulnerability alerts
   - Free for public repos

2. **Snyk** (snyk.io)
   - Scans code and dependencies
   - Free tier available
   - CI/CD integration

3. **OWASP ZAP** (zaproxy.org)
   - Automated security testing
   - Can run in CI/CD
   - Free and open source

**Setup**:
```bash
# Add to GitHub Actions:
- name: Run Snyk Security Scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

---

## 🎓 SECURITY TRAINING FOR TEAM

### Required Knowledge:

1. **OWASP Top 10**:
   - Injection attacks
   - Broken authentication
   - Sensitive data exposure
   - XSS
   - Broken access control

2. **Secure Coding Practices**:
   - Never trust client input
   - Validate on server
   - Use parameterized queries
   - Escape output
   - Principle of least privilege

3. **Supabase Security**:
   - RLS policies
   - Auth helpers
   - Storage security
   - Service role key vs anon key

### Code Review Checklist:

Before merging PRs, verify:
- [ ] User input is validated (Zod schema)
- [ ] Output is properly escaped/sanitized
- [ ] Authentication is checked server-side
- [ ] Authorization is enforced (RLS + server logic)
- [ ] Rate limiting is applied
- [ ] No sensitive data in logs
- [ ] Error messages don't expose details
- [ ] Dependencies are up-to-date

---

## 📈 MONITORING & ALERTING

### Metrics to Track:

1. **Security Events**:
   - Failed login attempts
   - Rate limit violations
   - Validation errors
   - Unauthorized access attempts

2. **Performance**:
   - API response times
   - Rate limit hit rates
   - Database query performance

3. **Business Logic**:
   - Love notes sent per day
   - Email deliverability rate
   - User signup rate

### Alert Triggers:

- 🚨 More than 10 rate limit violations per minute
- 🚨 More than 50 validation errors per hour
- 🚨 Unusual spike in API usage
- 🚨 Failed authentication attempts > 100/hour
- 🚨 Database errors > 10/minute

### Tools:

1. **Supabase Dashboard** - Built-in monitoring
2. **Vercel Analytics** - Performance metrics
3. **PostHog** (already integrated) - Product analytics
4. **Sentry** (recommended) - Error tracking and alerting
5. **Uptime Robot** (free) - Uptime monitoring

---

## 🔒 COMPLIANCE CONSIDERATIONS

### CAN-SPAM Act (US Email Law)

**Current Violations**:
- ❌ No unsubscribe mechanism
- ❌ No physical address in emails
- ❌ No clear identification

**Required Fixes**:
```html
<!-- Add to email template: -->
<p style="font-size: 11px; color: #999; margin-top: 32px;">
  V1 @ Michigan<br>
  123 University Ave, Ann Arbor, MI 48109<br>
  <a href="https://v1michigan.com/unsubscribe?token=UNSUBSCRIBE_TOKEN">Unsubscribe</a>
</p>
```

### GDPR (if serving EU users)

**Requirements**:
- ✅ Privacy policy
- ✅ Cookie consent banner
- ✅ Right to access data
- ✅ Right to deletion
- ✅ Right to data portability
- ✅ Data breach notification (within 72 hours)

**Implementation Needed**:
- Create privacy policy page
- Add cookie consent (if using tracking cookies)
- Build data export feature
- Build data deletion feature

### CCPA (California Privacy Rights)

Similar to GDPR but for California residents.

---

## 🧪 PENETRATION TESTING CHECKLIST

### Manual Testing:

#### 1. Authentication & Authorization:
- [ ] Try accessing `/people/edit` without login → Should redirect to `/auth`
- [ ] Try editing another user's profile → Should be blocked by RLS
- [ ] Try creating love note as another user → Should be blocked
- [ ] Try accessing API routes without auth → Should return 401

#### 2. Input Validation:
- [ ] Submit empty form fields → Should show validation errors
- [ ] Submit excessively long inputs → Should reject
- [ ] Submit invalid email formats → Should reject
- [ ] Submit SQL injection payloads → Should be sanitized

#### 3. XSS Testing:
- [ ] Enter `<script>alert('XSS')</script>` in name fields
- [ ] Enter `<img src=x onerror=alert(1)>` in text areas
- [ ] Enter `javascript:alert(1)` in URL fields
- [ ] Check that all are escaped/sanitized

#### 4. Rate Limiting:
- [ ] Make 6+ rapid requests to email API → 6th should fail with 429
- [ ] Wait 1 minute, try again → Should work
- [ ] Check rate limit headers in response

#### 5. File Uploads:
- [ ] Try uploading non-image file → Should reject
- [ ] Try uploading file > 10MB → Should reject (if limit added)
- [ ] Try uploading to another user's folder → Should be blocked by RLS

#### 6. CSRF:
- [ ] Create malicious form on external site
- [ ] Try to submit to your API
- [ ] Should be blocked (or verify SameSite cookies)

---

## 🛠️ SECURITY TOOLS TO INTEGRATE

### 1. SAST (Static Application Security Testing)
**Tool**: Semgrep  
**Cost**: Free  
**Setup**:
```bash
pnpm add -D semgrep
# Create .github/workflows/security.yml
```

### 2. Dependency Scanning
**Tool**: `pnpm audit` + Dependabot  
**Cost**: Free  
**Setup**:
```bash
pnpm audit --audit-level=moderate
# Enable Dependabot in GitHub settings
```

### 3. Secret Scanning
**Tool**: GitHub Secret Scanning  
**Cost**: Free for public repos  
**Setup**: Enable in repository settings

### 4. Runtime Security
**Tool**: Sentry  
**Cost**: Free tier available  
**Setup**:
```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 5. API Security Testing
**Tool**: OWASP ZAP  
**Cost**: Free  
**Setup**: Docker container in CI/CD

---

## 📞 CONTACT & SUPPORT

### If You Need Help:

1. **Supabase Support**: https://supabase.com/dashboard/support
2. **Next.js Security**: https://nextjs.org/docs/app/building-your-application/configuring/security-headers
3. **Security Community**: https://www.reddit.com/r/netsec/

### Report Security Issues:

If you discover additional vulnerabilities:
1. Do NOT create a public GitHub issue
2. Email: security@v1michigan.com (create this email)
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

---

## 🎯 30-DAY SECURITY ROADMAP

### Week 1:
- [x] Fix XSS vulnerabilities
- [x] Add rate limiting
- [x] Create RLS policies
- [ ] **Apply RLS policies** ← DO THIS
- [ ] Deploy security fixes
- [ ] Verify fixes in production

### Week 2:
- [ ] Move database operations to API routes
- [ ] Add server-side session validation
- [ ] Implement file upload validation
- [ ] Add audit logging

### Week 3:
- [ ] Integrate CAPTCHA
- [ ] Implement email consent system
- [ ] Add unsubscribe functionality
- [ ] Create privacy policy

### Week 4:
- [ ] Upgrade to Upstash rate limiting
- [ ] Add Content Security Policy
- [ ] Set up security monitoring
- [ ] Conduct penetration testing
- [ ] Document security procedures

---

## ✅ SUCCESS CRITERIA

You'll know security is improved when:

1. ✅ All RLS policies are active and tested
2. ✅ Rate limiting blocks excessive requests
3. ✅ XSS payloads are escaped in output
4. ✅ Invalid input is rejected with clear errors
5. ✅ Security headers are present in all responses
6. ✅ Database operations require authentication
7. ✅ File uploads are validated server-side
8. ✅ Monitoring and alerting is active
9. ✅ Team is trained on secure coding practices
10. ✅ Regular security audits are scheduled

---

## 🚀 CONCLUSION

Security is not a one-time task but an ongoing process. These recommendations provide a roadmap from critical fixes (NOW) to long-term security posture.

**Current Status**: 🟡 Moderate Risk (after fixes deployed + RLS applied)  
**Target Status**: 🟢 Low Risk (after all recommendations implemented)

**Remember**: The most critical action is applying RLS policies. Without RLS, your entire database is accessible to anyone with your public Supabase URL.

