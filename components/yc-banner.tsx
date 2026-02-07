export default function YCBanner({ enabled }: { enabled: boolean }) {
  if (!enabled) {
    return (<></>);
  }

  return (
    <div
      className="bg-[#EA6F34] py-2 px-6 text-center shadow-lg"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-inter font-semibold text-white leading-relaxed">
            Y Combinator is coming to campus!
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.v1michigan.com/yc-w26?utm_source=website"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#191919] text-white rounded-full text-sm font-inter font-bold hover:bg-[#000000] transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg ring-1 ring-black/20 ring-inset"
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
          <a
            href="https://www.v1michigan.com/yc-w26-coffee-chats?utm_source=website"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-full text-sm font-inter font-medium hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30 ring-1 ring-white/15 ring-inset"
          >
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Meet YC Partners</span>
          </a>
        </div>
      </div>
    </div>
  )
}
