import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Header() {
  return (
    <nav className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
      <div className="flex-shrink-0">
        <Link href="/" className="font-medium">
          <Image src="/v1-logo.png" alt="V1 Logo" width={32} height={32} className="h-8 w-auto" />
        </Link>
      </div>

      <div className="flex items-center justify-end space-x-6">
        <Link href="https://v1michigan.com/projects" className="text-sm text-gray-700 hover:text-black">
          Product Studio
        </Link>
        <Link href="https://v1michigan.com/ship-it" className="text-sm text-gray-700 hover:text-black">
          Blue Blue
        </Link>
        <Link href="https://v1michigan.com/ship-it" className="text-sm text-gray-700 hover:text-black">
          Ship-it
        </Link>
        <Link href="https://startupfair.v1michigan.com/" className="text-sm text-gray-700 hover:text-black">
          Startup fair
        </Link>
        <Link href="/project-directory" className="text-sm text-gray-700 hover:text-black">
          Project directory
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center rounded-md bg-gray-800 px-3 py-1.5 text-xs text-white hover:bg-gray-700"
        >
          Connect with us
          <ArrowRight className="ml-1.5 h-3.5 w-3.5 -rotate-45" />
        </Link>
      </div>
    </nav>
  )
}
