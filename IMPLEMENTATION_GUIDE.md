# Implementation Guide - Fix Project JSON Loading Performance

## Priority 1: Critical Fixes (30 minutes total)

These fixes will provide immediate 60-70% performance improvement.

---

### Fix 1: Remove Unnecessary API Route (5 minutes)

**Impact**: Eliminates 50-200ms latency per request

**Step 1**: Update `hooks/useProjects.ts`

**Before**:
```typescript
async function fetchProjects(): Promise<ProjectsResponse> {
  const response = await fetch(`/api/projects`);
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
}
```

**After**:
```typescript
async function fetchProjects(): Promise<ProjectsResponse> {
  const response = await fetch('/projects-data.json');
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
}
```

**Step 2**: Delete the API route
```bash
rm app/api/projects/route.ts
```

**Result**: Data now loads directly from static JSON file

---

### Fix 2: Optimize React Query Configuration (5 minutes)

**Impact**: Reduces unnecessary refetches, improves caching

**File**: `hooks/useProjects.ts`

**Before**:
```typescript
useQuery({
  queryKey: ["projects"],
  queryFn: fetchProjects,
  staleTime: 5 * 60 * 1000,
  retry: 3,
})
```

**After**:
```typescript
useQuery({
  queryKey: ["projects"],
  queryFn: fetchProjects,
  staleTime: 15 * 60 * 1000, // 15 minutes - static data
  cacheTime: 60 * 60 * 1000, // 1 hour in memory
  retry: 1, // Only retry once
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
})
```

---

### Fix 3: Optimize Investor Badge Lookup (5 minutes)

**Impact**: Reduces computational overhead in ProjectCard renders

**File**: `app/projects/components/ProjectCard.tsx`

**Before**:
```typescript
// Inside component - runs 64 times per render
const getInvestorBadgeColor = (name: string): string => {
  for (const [key, color] of Object.entries(investorBadgeColors)) {
    if (name.includes(key)) return color
  }
  return "bg-gray-500 text-white"
}
```

**After**:
```typescript
// Move outside component, above the default export
const getInvestorBadgeColor = (name: string): string => {
  // Direct lookup is fastest
  if (investorBadgeColors[name]) {
    return investorBadgeColors[name]
  }
  
  // Fallback to includes check
  for (const [key, color] of Object.entries(investorBadgeColors)) {
    if (name.includes(key)) return color
  }
  return "bg-gray-500 text-white"
}

// Then export component
export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  // ...
}
```

---

### Fix 4: Convert Filter Arrays to Sets (10 minutes)

**Impact**: O(n) → O(1) lookup for filter checks

**File**: `hooks/useProjects.ts`

**Add this new function**:
```typescript
export function useProjects(params: ProjectsQueryParams) {
  const {
    data,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 15 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  
  // Convert arrays to Sets for O(1) lookup
  const filterSets = useMemo(() => ({
    fundingSources: new Set(params.fundingSources),
    cohorts: new Set(params.cohorts),
    categories: new Set(params.categories),
  }), [params.fundingSources, params.cohorts, params.categories]);
  
  const filteredProjects = useMemo(() => {
    if (!data?.projects) return [];
    
    return data.projects.filter((project) => {
      const searchQuery = params.searchQuery?.toLowerCase() || "";
      const matchesSearch = 
        searchQuery === "" || 
        project.title.toLowerCase().includes(searchQuery) ||
        project.companyName.toLowerCase().includes(searchQuery);

      const matchesFunding = 
        filterSets.fundingSources.size === 0 || 
        (project.sectionType === "funding" && filterSets.fundingSources.has(project.sectionName));

      const matchesCohort = 
        filterSets.cohorts.size === 0 || 
        (project.sectionType === "cohort" && filterSets.cohorts.has(project.sectionName));

      const matchesCategory = 
        filterSets.categories.size === 0 || 
        project.categories.some((category) => filterSets.categories.has(category));

      return matchesSearch && matchesFunding && matchesCohort && matchesCategory;
    });
  }, [data, params.searchQuery, filterSets]);
  
  const filteredCount = useMemo(() => filteredProjects.length, [filteredProjects]);
  
  return {
    projects: filteredProjects,
    filterOptions: data?.filterOptions || {
      fundingSources: [],
      cohorts: [],
      categories: [],
    },
    totalProjects: data?.projects?.length || 0,
    filteredCount,
    isLoading,
    error: error as Error | null,
  };
}
```

---

### Fix 5: Add React.memo to ProjectCard (5 minutes)

**Impact**: Prevents unnecessary re-renders of unchanged cards

**File**: `app/projects/components/ProjectCard.tsx`

**Before**:
```typescript
export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  // ... component code
}
```

**After**:
```typescript
import { memo } from "react"

function ProjectCard({ project, onClick }: ProjectCardProps) {
  // ... existing component code
}

export default memo(ProjectCard, (prevProps, nextProps) => {
  // Only re-render if project id changed
  return prevProps.project.id === nextProps.project.id;
});
```

---

## Priority 2: High-Value Optimizations (1-2 hours total)

These provide additional 20-30% improvement with moderate effort.

---

### Fix 6: Add Gzip Compression (15 minutes)

**Impact**: Reduces transfer size from 55KB to ~8KB

**File**: `next.config.js` (or create if doesn't exist)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  
  // Ensure static files are compressed
  async headers() {
    return [
      {
        source: '/projects-data.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
          {
            key: 'Content-Type',
            value: 'application/json; charset=utf-8',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

---

### Fix 7: Optimize Image Loading (20 minutes)

**Impact**: Better LCP scores, reduced CLS

**File**: `app/projects/components/ProjectCard.tsx`

**Update the logo image**:
```typescript
<Image
  src={project.imageSrc}
  alt={project.companyName}
  fill
  className="object-cover"
  sizes="64px"
  quality={75}
  loading="lazy"
/>
```

**Update founder images**:
```typescript
<Image
  src={founder.imageSrc}
  alt={founder.name}
  fill
  className="object-cover"
  sizes="24px"
  quality={60}
  loading="lazy"
/>
```

---

### Fix 8: Add Loading Skeletons (30 minutes)

**Impact**: Better perceived performance, reduced CLS

**Create new file**: `app/projects/components/ProjectCardSkeleton.tsx`

```typescript
export default function ProjectCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 animate-pulse">
      <div className="flex items-start gap-4">
        {/* Logo skeleton */}
        <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-200" />
        
        {/* Content skeleton */}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-5 w-48 rounded bg-gray-200" />
          <div className="h-4 w-64 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          
          {/* Badges */}
          <div className="flex gap-2">
            <div className="h-6 w-24 rounded-full bg-gray-200" />
            <div className="h-6 w-20 rounded-full bg-gray-200" />
          </div>
          
          {/* Categories */}
          <div className="flex gap-1">
            <div className="h-6 w-16 rounded-md bg-gray-200" />
            <div className="h-6 w-20 rounded-md bg-gray-200" />
            <div className="h-6 w-16 rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Update**: `app/projects/components/ProjectDirectoryLayout.tsx`

```typescript
import ProjectCardSkeleton from './ProjectCardSkeleton'

// In the render section:
{isLoading ? (
  <div className="space-y-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <ProjectCardSkeleton key={i} />
    ))}
  </div>
) : (
  <ProjectList projects={projects} onProjectClick={onProjectClick} />
)}
```

---

### Fix 9: Simplify URL/State Synchronization (30 minutes)

**Impact**: Reduces re-render cycles

**File**: `app/projects/page.tsx`

**Replace the complex state sync with**:

```typescript
export default function ProjectDirectoryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Single source of truth from URL
  const filters = useMemo(() => ({
    searchQuery: searchParams?.get("search") || "",
    fundingSources: searchParams?.getAll("funding") || [],
    cohorts: searchParams?.getAll("cohort") || [],
    categories: searchParams?.getAll("category") || [],
  }), [searchParams])

  const { projects, filterOptions, isLoading, error } = useProjects(filters)

  // Simplified filter update function
  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    const params = new URLSearchParams()
    
    const merged = { ...filters, ...newFilters }
    
    if (merged.searchQuery) params.set("search", merged.searchQuery)
    merged.fundingSources.forEach(f => params.append("funding", f))
    merged.cohorts.forEach(c => params.append("cohort", c))
    merged.categories.forEach(c => params.append("category", c))
    
    router.push(`?${params.toString()}`, { scroll: false })
  }, [filters, router])

  const setSearchQuery = useCallback((query: string) => {
    updateFilters({ searchQuery: query })
  }, [updateFilters])

  const toggleFundingSource = useCallback((source: string) => {
    const current = filters.fundingSources
    const updated = current.includes(source)
      ? current.filter(s => s !== source)
      : [...current, source]
    updateFilters({ fundingSources: updated })
  }, [filters.fundingSources, updateFilters])

  const toggleCohort = useCallback((cohort: string) => {
    const current = filters.cohorts
    const updated = current.includes(cohort)
      ? current.filter(c => c !== cohort)
      : [...current, cohort]
    updateFilters({ cohorts: updated })
  }, [filters.cohorts, updateFilters])

  const toggleCategory = useCallback((category: string) => {
    const current = filters.categories
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category]
    updateFilters({ categories: updated })
  }, [filters.categories, updateFilters])

  const clearAllFilters = useCallback(() => {
    router.push("/projects", { scroll: false })
  }, [router])

  // ... rest of component
}
```

---

## Priority 3: Advanced Optimizations (Optional, 3+ hours)

### Fix 10: Convert to Server Component (3 hours)

**Impact**: 40-50% faster initial load, better SEO

This requires significant refactoring. Create new file `app/projects/page.server.tsx`:

```typescript
import { readFileSync } from 'fs'
import { join } from 'path'
import ProjectDirectoryClient from './components/ProjectDirectoryClient'

export const revalidate = 3600 // Revalidate every hour

export default async function ProjectDirectoryPage() {
  // Read data server-side
  const dataPath = join(process.cwd(), 'public', 'projects-data.json')
  const data = JSON.parse(readFileSync(dataPath, 'utf-8'))
  
  return (
    <ProjectDirectoryClient 
      initialData={data}
    />
  )
}
```

Then create client component for interactivity.

---

## Testing Checklist

After implementing fixes, test:

- [ ] Initial page load < 1 second
- [ ] Search typing feels instant
- [ ] Filter toggles < 100ms
- [ ] No console errors
- [ ] Images load progressively
- [ ] Mobile performance acceptable
- [ ] Network tab shows no redundant requests

---

## Performance Measurement

**Before fixes**:
```bash
# Run Lighthouse
npx lighthouse http://localhost:3000/projects --view

# Expected scores before:
Performance: 60-70
```

**After Priority 1 fixes**:
```bash
# Expected scores after:
Performance: 80-90
```

**After Priority 2 fixes**:
```bash
# Expected scores after:
Performance: 90-95
```

---

## Rollback Plan

If issues arise after deployment:

1. **Quick rollback**: Revert to API route
   ```bash
   git revert HEAD~3..HEAD
   git push
   ```

2. **Partial rollback**: Keep some fixes
   - Restore API route but keep other optimizations
   - Disable React.memo if causing issues

3. **Feature flag**: Add environment variable
   ```typescript
   const USE_DIRECT_JSON = process.env.NEXT_PUBLIC_USE_DIRECT_JSON === 'true'
   const endpoint = USE_DIRECT_JSON ? '/projects-data.json' : '/api/projects'
   ```

---

## Monitoring After Deployment

Add performance monitoring:

```typescript
// Add to app/projects/page.tsx
useEffect(() => {
  if (typeof window !== 'undefined' && window.performance) {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms')
    
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: 'projects_page_load',
        value: Math.round(perfData.loadEventEnd - perfData.fetchStart),
      })
    }
  }
}, [])
```

---

## Expected Results

### Load Time Improvements
| Metric | Before | After P1 | After P2 |
|--------|--------|----------|----------|
| FCP | 1.8s | 0.8s | 0.6s |
| LCP | 2.5s | 1.2s | 0.9s |
| TTI | 3.0s | 1.5s | 1.0s |
| Total | ~3s | ~1.5s | ~1s |

### User Experience
- Search feels instant
- Filters update smoothly
- Page loads significantly faster
- Reduced bandwidth usage

---

## Implementation Order

**Week 1** (30 min):
- [ ] Fix 1: Remove API route
- [ ] Fix 2: Optimize React Query
- [ ] Fix 3: Optimize badge lookup
- [ ] Fix 4: Convert to Sets
- [ ] Fix 5: Add React.memo

**Week 2** (2 hours):
- [ ] Fix 6: Add compression
- [ ] Fix 7: Optimize images
- [ ] Fix 8: Add skeletons
- [ ] Fix 9: Simplify state sync

**Week 3** (Optional, 3+ hours):
- [ ] Fix 10: Convert to Server Component
- [ ] Add virtualization
- [ ] Implement search service

---

*Ready to implement? Start with Priority 1 fixes for immediate impact.*
