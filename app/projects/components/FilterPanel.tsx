import { memo, useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  onClearFilters: () => void
  hasActiveFilters: boolean
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
  onClearFilters,
  hasActiveFilters,
  isLoading = false,
  showSearch = true,
}: FilterPanelProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const filterPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: PointerEvent) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target as Node)) {
        setOpenFilter(null)
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick)
    return () => document.removeEventListener("pointerdown", handleOutsideClick)
  }, [])

  const filterGroups = [
    {
      label: "Funding",
      options: filterOptions.fundingSources,
      selected: filters.fundingSources,
      onToggle: onToggleFunding,
      color: "text-blue-600",
      format: (value: string) => value,
    },
    {
      label: "Cohorts",
      options: filterOptions.cohorts,
      selected: filters.cohorts,
      onToggle: onToggleCohort,
      color: "text-purple-600",
      format: (value: string) => value.replace(" Product Studio Cohort", ""),
    },
    {
      label: "Categories",
      options: filterOptions.categories,
      selected: filters.categories,
      onToggle: onToggleCategory,
      color: "text-gray-600",
      format: (value: string) => value,
    },
  ]

  return (
    <div ref={filterPanelRef}>
      {showSearch && (
        <div className="flex items-center gap-3 border-b border-gray-200 p-3">
          <input
            type="search"
            placeholder="Search companies..."
            value={filters.searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            disabled={!hasActiveFilters || isLoading}
            className="h-9 flex-shrink-0 px-2 text-xs text-gray-600"
          >
            Clear all
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-3">
        {filterGroups.map((group) => {
          const isOpen = openFilter === group.label
          const selectedLabel = group.selected.map(group.format).join(", ") || group.label

          return (
            <details
              key={group.label}
              open={isOpen}
              className="group relative min-w-0"
            >
              <summary
                onClick={(event) => {
                  event.preventDefault()
                  setOpenFilter(isOpen ? null : group.label)
                }}
                className="flex cursor-pointer list-none items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 [&::-webkit-details-marker]:hidden"
              >
                <span className={`min-w-0 flex-1 truncate ${group.selected.length > 0 ? group.color : ""}`}>
                  {selectedLabel}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="absolute left-0 top-full z-20 mt-0 max-h-64 w-full overflow-y-auto rounded-b-md border border-gray-200 bg-white p-2 shadow-lg">
                {group.options.length > 0 ? group.options.map((option) => (
                  <label
                    key={option}
                    className={`flex items-start gap-2 rounded-md px-2 py-2 ${isLoading ? "" : "cursor-pointer hover:bg-gray-50"}`}
                  >
                    <input
                      type="checkbox"
                      checked={group.selected.includes(option)}
                      onChange={() => group.onToggle(option)}
                      className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <span className="text-sm leading-5 text-gray-700">{group.format(option)}</span>
                  </label>
                )) : (
                  <p className="px-2 py-2 text-sm text-gray-500">No options available</p>
                )}
              </div>
            </details>
          )
        })}
      </div>
    </div>
  )
}

export default memo(FilterPanel)
