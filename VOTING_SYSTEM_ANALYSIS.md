# Voting System Analysis - "Hackelo" Site

## Summary
**Finding**: No voting system exists in this codebase.

## Investigation Details

### Search Terms Used:
- `vote`, `voting`, `poll`, `upvote`, `downvote`
- `elo`, `rating`, `rank`, `score`, `leaderboard`
- `hackathon`, `hack`, `competition`

### Files Checked:
- All API routes (`app/api/**/*.ts`)
- All page components (`app/**/*.tsx`)
- All React components (`components/**/*.tsx`)
- Database client files (`utils/supabaseClient.tsx`)
- Feature flags system (`hooks/useFlags.tsx`)
- Data files (`data/projects.ts`)

### Database Tables Identified:
1. `love_notes` - Valentine's card system
2. `v1-people` - People directory
3. `flags` - Feature flags
4. `dynamic_links` - URL redirects

**None of these tables implement voting functionality.**

---

## Why "Hackelo" in the URL?

The site is deployed at `hackelo.vercel.app`, which suggests:
1. **Possible Origin**: "Hack" + "Elo" (Elo rating system for hackathons)
2. **Current Reality**: The site is actually the V1 Michigan website (v1michigan.com)
3. **Theory**: May have been a separate project or planned feature that was never implemented

---

## What This Site Actually Does

### Primary Features:
1. **Valentine's Notes System** (`/valentines`)
   - Create and send digital Valentine's cards
   - Email notifications to recipients
   - View sent/received notes

2. **People Directory** (`/people`)
   - Profiles of V1 Michigan community members
   - Searchable directory
   - Editable profiles (own profile only)

3. **Projects Showcase** (`/projects`)
   - Display startup projects
   - Funding information
   - Company details

4. **Merchandise Store** (`/store`)
   - E-commerce with Stripe checkout
   - Shopping cart
   - Order processing

5. **Dynamic URL Redirects** (`/[...slug]`)
   - Short URL system
   - Redirects based on `dynamic_links` table

---

## If a Voting System is Needed

If you want to add voting functionality (e.g., for rating projects, hackathons, etc.), here's what you'd need to implement:

### Database Schema:

```sql
-- Projects/Hackathons table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  project_id UUID REFERENCES projects(id) NOT NULL,
  vote_value INTEGER CHECK (vote_value IN (-1, 1)), -- upvote/downvote
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, project_id) -- One vote per user per project
);

-- Or for Elo rating system:
CREATE TABLE elo_ratings (
  project_id UUID PRIMARY KEY REFERENCES projects(id),
  elo_score INTEGER DEFAULT 1500,
  total_matches INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0
);

CREATE TABLE elo_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  winner_id UUID REFERENCES projects(id) NOT NULL,
  loser_id UUID REFERENCES projects(id) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

### RLS Policies for Voting:

```sql
-- Users can only vote once per project
CREATE POLICY "Users can insert own votes"
ON votes FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND NOT EXISTS (
    SELECT 1 FROM votes 
    WHERE user_id = auth.uid() 
    AND project_id = NEW.project_id
  )
);

-- Users can see all votes (for counting)
CREATE POLICY "Votes are publicly viewable"
ON votes FOR SELECT
TO public
USING (true);

-- Users can update their own votes (change mind)
CREATE POLICY "Users can update own votes"
ON votes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own votes (remove vote)
CREATE POLICY "Users can delete own votes"
ON votes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### Rate Limiting for Voting:

```typescript
// Prevent vote spamming
export const voteRateLimiter = new RateLimiter(60 * 1000, 30); // 30 votes per minute

// In API route:
const { allowed } = voteRateLimiter.check(user.id);
if (!allowed) {
  return NextResponse.json({ error: 'Too many votes' }, { status: 429 });
}
```

### Preventing Vote Manipulation:

#### 1. Rate Limiting (implemented above)
- Limit votes per user per time period
- Prevents automated voting scripts

#### 2. Unique Constraint
- Database enforces one vote per user per project
- Prevents duplicate votes

#### 3. Vote Weight/Reputation System
- New users get lower vote weight
- Active community members get higher weight
- Prevents sockpuppet accounts

#### 4. IP + User ID Tracking
- Track both user_id AND IP address
- Flag suspicious patterns (many votes from same IP)
- Implement cooldown periods

#### 5. CAPTCHA for High-Volume Users
- If user votes > N times per day, require CAPTCHA
- Prevents automation

#### 6. Elo Algorithm Protection
For Elo rating systems, additional protections:

```typescript
// Prevent gaming by showing limited matchups
function selectMatchup(userId: string, projects: Project[]) {
  // Don't let users choose which projects to compare
  // Randomly select from projects with similar Elo scores
  const randomized = shuffleArray(projects);
  return {
    project1: randomized[0],
    project2: randomized[1]
  };
}

// Update Elo scores with K-factor that prevents rapid changes
function updateEloScores(winner: Project, loser: Project) {
  const K = 32; // Lower K = slower rating changes
  const expectedWinner = 1 / (1 + Math.pow(10, (loser.elo - winner.elo) / 400));
  const expectedLoser = 1 - expectedWinner;
  
  winner.elo += K * (1 - expectedWinner);
  loser.elo += K * (0 - expectedLoser);
}
```

#### 7. Vote Analysis & Detection
```typescript
// Detect suspicious voting patterns
async function detectVotingAnomalies(userId: string) {
  const votes = await getRecentVotes(userId, 24); // Last 24 hours
  
  // Red flags:
  if (votes.length > 100) return 'high_volume';
  if (votes.every(v => v.vote_value === 1)) return 'only_upvotes';
  if (votes.every(v => v.vote_value === -1)) return 'only_downvotes';
  
  const timeGaps = calculateTimeGaps(votes);
  if (timeGaps.every(gap => gap < 2000)) return 'automated_pattern'; // < 2s between votes
  
  return 'normal';
}
```

---

## Conclusion

**Current Status**: No voting system exists, so no voting-related vulnerabilities.

**If Adding Voting**: Follow the security measures outlined above to prevent:
- Vote spamming
- Sockpuppet accounts
- Automated voting scripts
- Elo score manipulation
- Sybil attacks

**Key Principles**:
1. One vote per user per project (database constraint)
2. Rate limiting (30 votes/minute)
3. Server-side validation (never trust client)
4. Audit logging (track all votes)
5. Anomaly detection (flag suspicious patterns)
6. CAPTCHA for high-volume voters

