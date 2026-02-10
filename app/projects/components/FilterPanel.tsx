import { memo } from "react"
import { Search, Building, Users, Tag } from "lucide-react"

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
  isLoading?: boolean
  showSearch?: boolean
}

function FilterPanel({
  filters,
  filterOptions,
  onSearchChange,
  onToggleFunding,
  onToggleCohort,
  onToggleCategory,
  isLoading = false,
  showSearch = true,
}: FilterPanelProps) {
  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-instrument text-xl font-semibold text-gray-900">Filters</h2>
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
              className={`flex items-center gap-2 rounded-md p-2 ${isLoading ? '' : 'cursor-pointer hover:bg-gray-50'}`}
            >
              <input
                type="checkbox"
                checked={filters.fundingSources.includes(source)}
                onChange={() => onToggleFunding(source)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isLoading}
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
                className={`flex items-center gap-2 rounded-md p-2 ${isLoading ? '' : 'cursor-pointer hover:bg-gray-50'}`}
              >
                <input
                  type="checkbox"
                  checked={filters.cohorts.includes(cohort)}
                  onChange={() => onToggleCohort(cohort)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  disabled={isLoading}
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
              className={`flex items-center gap-2 rounded-md p-2 ${isLoading ? '' : 'cursor-pointer hover:bg-gray-50'}`}
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => onToggleCategory(category)}
                className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(FilterPanel)
