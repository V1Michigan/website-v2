import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Search, Building, Users, Tag } from "lucide-react"

interface FilterPanelProps {
  filters: {
    searchQuery: string
    fundingSources: string[]
    cohorts: string[]
    categories: string[]
  }
  filterOptions: {
    fundingSources: string[]
    cohorts: string[]
    categories: string[]
  }
  onSearchChange: (_query: string) => void
  onToggleFunding: (_source: string) => void
  onToggleCohort: (_cohort: string) => void
  onToggleCategory: (_category: string) => void
  onClearAll: () => void
  hasActiveFilters: boolean
}

export default function FilterPanel({
  filters,
  filterOptions,
  onSearchChange,
  onToggleFunding,
  onToggleCohort,
  onToggleCategory,
  onClearAll,
  hasActiveFilters,
}: FilterPanelProps) {
  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-instrument text-xl font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700"
          >
            <X className="mr-1 h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search companies..."
            value={filters.searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Funding Sources */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Funding</h3>
        </div>
        <div className="space-y-2">
          {filterOptions.fundingSources.map((source) => (
            <label
              key={source}
              className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={filters.fundingSources.includes(source)}
                onChange={() => onToggleFunding(source)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{source}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Product Studio Cohorts */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Cohorts</h3>
        </div>
        <div className="space-y-2">
          {filterOptions.cohorts.map((cohort) => {
            const displayName = cohort.replace(" Product Studio Cohort", "")
            return (
              <label
                key={cohort}
                className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={filters.cohorts.includes(cohort)}
                  onChange={() => onToggleCohort(cohort)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">{displayName}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Tag className="h-4 w-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Categories</h3>
        </div>
        <div className="space-y-2">
          {filterOptions.categories.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => onToggleCategory(category)}
                className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}