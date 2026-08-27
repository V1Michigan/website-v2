const LINKS = [
  { label: "Website", href: "https://v1michigan.com/" },
  { label: "Instagram", href: "https://www.instagram.com/v1michigan/" },
  { label: "LinkedIn", href: "https://linkedin.com/company/v1-michigan" },
  { label: "X", href: "https://x.com/V1Michigan" },
  { label: "Substack", href: "https://v1network.substack.com/" },
] as const;

export default function JoinFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`relative z-20 w-full bg-black px-4 py-7 sm:px-6 sm:py-8 ${className}`}
    >
      <nav
        aria-label="V1 social links"
        className="mx-auto flex max-w-lg flex-wrap items-center justify-center gap-x-4 gap-y-2.5"
      >
        {LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mona text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-70 sm:text-[0.75rem]"
          >
            {label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
