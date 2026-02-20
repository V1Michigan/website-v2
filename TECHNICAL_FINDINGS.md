# Technical Performance Findings - Deep Dive

## Code-Level Performance Issues

### Issue 1: ProjectCard Component - Inline Function Calls in Render
**File**: `app/projects/components/ProjectCard.tsx`  
**Lines**: 34-39, 52-54

```typescript
// Called on EVERY render for EVERY project card
const getInvestorBadgeColor = (name: string): string => {
  for (const [key, color] of Object.entries(investorBadgeColors)) {
    if (name.includes(key)) return color
  }
  return "bg-gray-500 text-white"
}
```

**Problem**:
- Function is defined inside component body, recreated on every render
- Object.entries() called repeatedly (30+ key-value pairs × 64 projects = 1,920+ iterations)
- String.includes() is relatively expensive for repeated calls

**Impact**: With 64 projects, this function runs 64+ times per render cycle

**Fix**:
```typescript
// Move outside component, create Map for O(1) lookup
const INVESTOR_BADGE_MAP = new Map(Object.entries(investorBadgeColors))

const getInvestorBadgeColor = (name: string): string => {
  for (const [key, color] of INVESTOR_BADGE_MAP) {
    if (name.includes(key)) return color
  }
  return "bg-gray-500 text-white"
}
```

**Better Fix** (O(1) lookup):
```typescript
const getInvestorBadgeColor = (name: string): string => {
  return investorBadgeColors[name] || "bg-gray-500 text-white"
}
```

---

### Issue 2: Uncached Image Components
**File**: `app/projects/components/ProjectCard.tsx`  
**Lines**: 69-74, 171-176

```typescript
<Image
  src={project.imageSrc}
  alt={project.companyName}
  fill
  className="object-cover"
/>
```

**Problem**:
- No priority hints for above-the-fold images
- No loading strategy specified (defaults to lazy)
- 64 images × 16KB avg = ~1MB of images
- Founder profile pictures also loaded for all cards

**Impact**: 
- First 3-4 cards should load eagerly
- Current implementation lazy-loads everything, causing CLS

**Fix**:
```typescript
<Image
  src={project.imageSrc}
  alt={project.companyName}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 64px, 96px"
  priority={index < 3} // First 3 cards
  quality={75}
/>
```

---

### Issue 3: Inefficient Filter Checking in FilterPanel
**File**: `app/projects/components/FilterPanel.tsx`  
**Lines**: 39-53

```typescript
{filterOptions.fundingSources.map((source) => (
  <label key={source}>
    <input
      checked={filters.fundingSources.includes(source)} // O(n) lookup per checkbox
      onChange={() => onToggleFunding(source)}
    />
  </label>
))}
```

**Problem**:
- `Array.includes()` is O(n) operation
- Called for every checkbox on every render
- With 10 funding sources + 15 cohorts + 30 categories = 55 O(n) operations

**Impact**: ~55 × average array length (5) = 275 comparisons per render

**Fix**:
```typescript
// Convert to Set in parent component
const fundingSourcesSet = useMemo(
  () => new Set(filters.fundingSources), 
  [filters.fundingSources]
)

// In FilterPanel
<input checked={fundingSourcesSet.has(source)} /> // O(1) lookup
```

---

### Issue 4: Missing Memoization in ProjectDirectoryLayout
**File**: `app/projects/components/ProjectDirectoryLayout.tsx`  
**Lines**: 44-51

```typescript
const hasActiveFilters = useMemo(
  () =>
    filters.searchQuery !== "" ||
    filters.fundingSources.length > 0 ||
    filters.cohorts.length > 0 ||
    filters.categories.length > 0,
  [filters.searchQuery, filters.fundingSources.length, filters.cohorts.length, filters.categories.length]
)
```

**Problem**:
- Dependencies use `.length` properties
- Array identity changes trigger re-computation even if length is same
- Not actually a performance issue, but shows pattern of defensive programming

**Note**: This is actually correct implementation. The real issue is elsewhere.

---

### Issue 5: Duplicate Search Inputs in Layout
**File**: `app/projects/components/ProjectDirectoryLayout.tsx`  
**Lines**: 91-97, 120-126

```typescript
// Desktop version
<input
  type="search"
  value={filters.searchQuery}
  onChange={(e) => onSearchChange(e.target.value)}
/>

// Mobile version (duplicate)
<input
  type="search"
  value={filters.searchQuery}
  onChange={(e) => onSearchChange(e.target.value)}
/>
```

**Problem**:
- Two controlled inputs with same value
- Both trigger same debounced function
- Potential for sync issues between mobile/desktop views

**Impact**: Low, but demonstrates code duplication

**Fix**: Extract to shared component

---

### Issue 6: Inline Array Operations in ProjectCard
**File**: `app/projects/components/ProjectCard.tsx`  
**Lines**: 106-113, 165-180

```typescript
{project.categories.slice(0, 3).map((category) => (
  <span key={category}>{category}</span>
))}
{project.categories.length > 3 && (
  <span>+{project.categories.length - 3}</span>
)}
```

**Problem**:
- `slice()` creates new array on every render
- Condition check runs on every render
- Repeated for categories, investors, founders

**Impact**: 64 cards × 3 slices × renders = hundreds of array allocations

**Fix**:
```typescript
// Memoize in parent or use React.memo with shallow compare
const visibleCategories = useMemo(
  () => project.categories.slice(0, 3),
  [project.categories]
)
```

---

### Issue 7: Lack of Virtualization for Large Lists
**File**: `app/projects/components/ProjectList.tsx`  
**Lines**: 24-34

```typescript
<div className="space-y-4">
  {projects.map((project) => (
    <ProjectCard key={project.id} project={project} onClick={() => onProjectClick(project)} />
  ))}
</div>
```

**Problem**:
- All 64 projects render at once
- No windowing/virtualization
- Each ProjectCard is ~100+ DOM nodes

**Impact**: 
- 64 cards × ~100 DOM nodes = 6,400+ DOM nodes
- Significant memory usage and initial render time

**Fix** (when dataset grows):
```typescript
import { FixedSizeList as VirtualList } from 'react-window'

<VirtualList
  height={600}
  itemCount={projects.length}
  itemSize={180}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <ProjectCard project={projects[index]} onClick={onProjectClick} />
    </div>
  )}
</VirtualList>
```

---

### Issue 8: Unnecessary Re-renders from URL State Sync
**File**: `app/projects/page.tsx`  
**Lines**: 39-46, 88-111

```typescript
// URL changes trigger filter state updates
useEffect(() => {
  setLocalFilters({
    searchQuery: urlSearchQuery,
    fundingSources: searchParams?.getAll("funding") || [],
    cohorts: searchParams?.getAll("cohort") || [],
    categories: searchParams?.getAll("category") || [],
  })
}, [urlSearchQuery, searchParams])

// Filter changes trigger URL updates
const updateFilters = useCallback((updates) => {
  const params = new URLSearchParams(searchParams?.toString() || "")
  // ... update params
  router.push(`?${params.toString()}`, { scroll: false })
}, [searchParams, router])
```

**Problem**:
- Circular dependency potential (URL → State → URL)
- Multiple state updates for single user action
- URLSearchParams creation on every filter toggle

**Impact**: 
- Extra re-renders: User clicks filter → localFilters update → URL update → searchParams change → localFilters update again
- 2-3x more renders than necessary

**Fix**:
```typescript
// Use a single source of truth - either URL or state, not both
// Option 1: URL as source of truth
const filters = useMemo(() => ({
  searchQuery: searchParams.get("search") || "",
  fundingSources: searchParams.getAll("funding"),
  cohorts: searchParams.getAll("cohort"),
  categories: searchParams.getAll("category"),
}), [searchParams])

// Option 2: State as source of truth, sync URL only on blur/submit
```

---

### Issue 9: React Query Not Leveraging Stale-While-Revalidate
**File**: `hooks/useProjects.ts`  
**Lines**: 41-46

```typescript
useQuery({
  queryKey: ["projects"],
  queryFn: fetchProjects,
  staleTime: 5 * 60 * 1000, // 5 minutes
  retry: 3,
})
```

**Problem**:
- `staleTime` of 5 minutes is good
- But no `cacheTime` specified (defaults to 5 minutes)
- No `refetchOnWindowFocus` control
- No `refetchOnMount` control

**Impact**: 
- May refetch unnecessarily when component remounts
- Aggressive retry (3x) on failure could compound issues

**Better Config**:
```typescript
useQuery({
  queryKey: ["projects"],
  queryFn: fetchProjects,
  staleTime: 10 * 60 * 1000, // 10 minutes - static data doesn't change often
  cacheTime: 30 * 60 * 1000, // 30 minutes in memory
  retry: 1, // Only retry once for static data
  refetchOnWindowFocus: false, // Don't refetch when user returns to tab
  refetchOnMount: false, // Use cache if available
})
```

---

### Issue 10: Missing Loading Skeletons
**File**: `app/projects/components/ProjectDirectoryLayout.tsx`  
**Lines**: 106-112

```typescript
{isLoading ? (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
  </div>
) : (
  <ProjectList projects={projects} onProjectClick={onProjectClick} />
)}
```

**Problem**:
- Generic spinner provides poor UX
- No skeleton screens for content layout
- Causes layout shift when content loads

**Impact**: 
- Poor perceived performance
- Higher CLS (Cumulative Layout Shift) score

**Fix**:
```typescript
{isLoading ? (
  <div className="space-y-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <ProjectCardSkeleton key={i} />
    ))}
  </div>
) : (
  <ProjectList projects={projects} onProjectClick={onProjectClick} />
)}
```

---

## Bundle Size Analysis

### Current Bundle (Estimated)
```
React Query:        ~13KB gzipped
Next.js Image:      ~8KB gzipped
Lucide Icons:       ~3KB gzipped (per icon)
Component code:     ~15KB gzipped
Total JS:           ~40KB gzipped

Static data:        55KB (uncompressed)
                    ~8KB (with gzip)
```

### Optimization Opportunities
1. **Code splitting**: Separate ProjectModal into lazy-loaded chunk
2. **Icon optimization**: Use inline SVGs for frequently used icons
3. **Dynamic imports**: Load filter panel only when needed on mobile

---

## Memory Profile (Estimated)

### JavaScript Heap
```
Initial page load:      ~5MB
After data fetch:       ~8MB
With all components:    ~12MB
Peak (with modal):      ~15MB
```

### DOM Nodes
```
Header/Footer:          ~200 nodes
Filter panel:           ~300 nodes
64 project cards:       ~6,400 nodes
Total:                  ~7,000 nodes
```

**Recommendation**: This is acceptable for desktop, but may cause issues on low-end mobile devices.

---

## Network Waterfall Analysis

### Current Request Flow
```
1. HTML (0-200ms)
2. CSS/JS chunks (200-500ms)
3. /api/projects (500-800ms)
   └─> /projects-data.json (600-900ms)
4. Images start loading (800ms+)
```

### Optimized Request Flow
```
1. HTML with inline data (0-200ms)
2. CSS/JS chunks (200-500ms)
3. Images start loading immediately (200ms+)
```

**Savings**: ~600ms from eliminating API hop

---

## React DevTools Profiler Insights

### Render Times (Estimated)
```
Initial mount:          200-400ms
Filter toggle:          50-150ms
Search typing:          10-30ms (per keystroke)
```

### Component Render Count (per filter change)
```
ProjectDirectoryPage:   1 render
ProjectDirectoryLayout: 1 render
FilterPanel:            1 render (memoized)
ProjectList:            1 render (memoized)
ProjectCard × 64:       64 renders (should be 0 with proper memo)
```

**Issue**: ProjectCard re-renders even when not in filtered results

**Fix**: Add React.memo with custom comparison function

---

## Performance Budget Recommendations

### Load Time Targets
- **FCP (First Contentful Paint)**: < 1.0s
- **LCP (Largest Contentful Paint)**: < 1.5s
- **TTI (Time to Interactive)**: < 2.0s
- **CLS (Cumulative Layout Shift)**: < 0.1

### Bundle Size Targets
- **Initial JS**: < 50KB gzipped
- **Initial CSS**: < 20KB gzipped
- **Total page weight**: < 200KB (before images)

### Runtime Performance Targets
- **Filter toggle**: < 50ms
- **Search response**: < 100ms
- **Scroll smoothness**: 60fps (16ms per frame)

---

## Quick Wins (Implementation Time < 30 min each)

1. ✅ **Move functions outside components** (5 min)
2. ✅ **Add Image priority hints** (10 min)
3. ✅ **Convert arrays to Sets for filtering** (15 min)
4. ✅ **Add React.memo to ProjectCard** (5 min)
5. ✅ **Update React Query config** (5 min)
6. ✅ **Remove API route** (20 min)

---

## Medium Effort Optimizations (1-3 hours each)

1. 🔄 **Implement skeleton loading states**
2. 🔄 **Add proper memoization strategy**
3. 🔄 **Refactor URL/state sync pattern**
4. 🔄 **Convert to Server Component**
5. 🔄 **Add compression middleware**

---

## Long-term Optimizations (4+ hours each)

1. ⏰ **Implement virtual scrolling**
2. ⏰ **Add full-text search service**
3. ⏰ **Implement pagination**
4. ⏰ **Add performance monitoring**
5. ⏰ **Setup CDN edge caching**

---

*Technical analysis by: Cursor Agent*  
*Date: February 20, 2026*
