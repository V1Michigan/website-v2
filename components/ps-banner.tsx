export default function PSBanner({ enabled }: { enabled: boolean }) {
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
              Applications for Product Studio's Winter 2026 batch are now open!
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://v1michigan.com/apply?utm_source=website"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#191919] text-yellow-300 rounded-full text-sm font-inter font-bold hover:bg-[#000000] transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <span>Apply now</span>
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
              href="https://calendar.google.com/calendar/u/2?cid=Y183YjdmZGYyNWRmMjA5YTNjYjlhODAzNzhhYjk0MmIzMmRjZmZhYzQ1NTg5NTQzZDRiZDFhYzU1MWRjNTM3ZDZjQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-[#191919]/10 text-[#191919] rounded-full text-sm font-inter font-medium hover:bg-[#191919]/20 transition-all duration-200 border border-[#191919]/20 hover:border-[#191919]/40"
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
              <span>Calendar</span>
            </a>
            <a
              href="https://v1michigan.com/product-studio/faq?utm_source=website"
              className="inline-flex items-center gap-2 px-3 py-2 bg-[#191919]/10 text-[#191919] rounded-full text-sm font-inter font-medium hover:bg-[#191919]/20 transition-all duration-200 border border-[#191919]/20 hover:border-[#191919]/40"
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>FAQ</span>
            </a>
          </div>
        </div>
        </div>
    )
}