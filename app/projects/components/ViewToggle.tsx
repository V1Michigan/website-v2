import { LayoutGrid, LayoutList } from "lucide-react"

interface ViewToggleProps {
  view: "list" | "grid"
  onViewChange: (_view: "list" | "grid") => void
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
      <button
        onClick={() => onViewChange("list")}
        className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          view === "list"
            ? "bg-gray-900 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <LayoutList className="h-4 w-4" />
        List
      </button>
      <button
        onClick={() => onViewChange("grid")}
        className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          view === "grid"
            ? "bg-gray-900 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
        Grid
      </button>
    </div>
  )
}
