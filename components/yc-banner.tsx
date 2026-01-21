export default function YCBanner({ enabled }: { enabled: boolean }) {
  if (!enabled) {
    return (<></>);
  }

  return (
    <div
      className="bg-gradient-to-r from-yellow-400 to-yellow-300 py-2 px-6 text-center shadow-lg border-b border-yellow-500/20"
      style={{ background: 'linear-gradient(to right, rgb(250 204 21), rgb(253 224 71))' }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-inter font-semibold text-[#191919] leading-relaxed">
            Y Combinator is coming to campus!
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* TODO : change this link to be the shortened link */}
          <a
            href="https://www.v1michigan.com/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#191919] text-yellow-300 rounded-full text-sm font-inter font-bold hover:bg-[#000000] transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <span>RSVP Here</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
