"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Menu, X } from "lucide-react"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-[#FAF7F2]">
      <div className="flex-shrink-0">
        <Link href="/" className="font-medium">
          <Image src="/v1-logo.png" alt="V1 Logo" width={32} height={32} className="h-8 w-auto" />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-end space-x-6">
        <Link href="https://v1michigan.com/projects" className="text-sm text-gray-700 hover:text-black">
          Product Studio
        </Link>
        <Link href="startup-week" className="text-sm text-gray-700 hover:text-black">
          Startup Week
        </Link>
        <Link href="https://v1michigan.com/events" className="text-sm text-gray-700 hover:text-black">
          Build Blue
        </Link>
        <Link href="https://v1michigan.com/ship-it" className="text-sm text-gray-700 hover:text-black">
          Ship-it
        </Link>
        <Link
          href="https://v1michigan.com/join"
          className="inline-flex items-center rounded-md bg-gray-800 px-3 py-1.5 text-xs text-white hover:bg-gray-700"
        >
          Join us!
          <ArrowRight className="ml-1.5 h-3.5 w-3.5 -rotate-45" />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-gray-700 hover:text-black"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#FAF7F2] border-b border-gray-200 md:hidden z-40">
          <div className="px-4 py-2 space-y-2">
            <Link
              href="https://v1michigan.com/projects"
              className="block py-2 text-sm text-gray-700 hover:text-black"
              onClick={closeMobileMenu}
            >
              Product Studio
            </Link>
             <Link
              href="startup-week"
              className="block py-2 text-sm text-gray-700 hover:text-black"
              onClick={closeMobileMenu}
            >
              Startup Week
            </Link>
            <Link
              href="https://v1michigan.com/events"
              className="block py-2 text-sm text-gray-700 hover:text-black"
              onClick={closeMobileMenu}
            >
              Build Blue
            </Link>
            <Link
              href="https://v1michigan.com/ship-it"
              className="block py-2 text-sm text-gray-700 hover:text-black"
              onClick={closeMobileMenu}
            >
              Ship-it
            </Link>
            <Link
              href="https://v1michigan.com/join"
              className="inline-flex items-center rounded-md bg-gray-800 px-3 py-1.5 text-xs text-white hover:bg-gray-700 mt-2"
              onClick={closeMobileMenu}
            >
              Join us
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 -rotate-45" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}