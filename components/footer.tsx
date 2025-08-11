import Link from "next/link"
import { Instagram, X, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-6">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <p className="text-xs text-gray-600">
            © 2024 V1 @ Michigan |{" "}
            <a href="mailto:team@v1michigan.com" className="hover:underline">
              team@v1michigan.com
            </a>
          </p>
          <div className="flex space-x-4">
            <Link href="https://x.com/v1michigan" aria-label="Twitter">
              <X className="h-4 w-4 text-gray-600 hover:text-black" />
            </Link>
            <Link href="https://www.instagram.com/v1michigan/" aria-label="Instagram">
              <Instagram className="h-4 w-4 text-gray-600 hover:text-black" />
            </Link>
            <Link href="mailto:team@v1michigan.com" aria-label="Other" className="h-4 w-4 text-gray-600 hover:text-black">
              <Mail className="h-4 w-4 text-gray-600 hover:text-black" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
