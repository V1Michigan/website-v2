export default function DevBanner({ enabled }: { enabled: boolean }) {
  if (!enabled || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="bg-purple-600 py-2 px-6 text-center shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-inter font-semibold text-white leading-relaxed">
            DEV BANNER - Testing flag toggle
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-inter text-white/80">
            Flag: SHOW_DEV_BANNER
          </span>
        </div>
      </div>
    </div>
  )
}
