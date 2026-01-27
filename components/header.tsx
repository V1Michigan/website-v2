"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X, Compass, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-[#FAF7F2]">
      <div className="flex-shrink-0">
        <Link href="/" className="font-medium">
          <Image
            src="/v1-logo.png"
            alt="V1 Logo"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-end space-x-6">
        <Link
          href="https://v1michigan.com/apply?utm_source=website"
          className="text-sm text-gray-700 hover:text-black"
        >
          Product Studio
        </Link>
        <Link
          href="http://startupweek.v1michigan.com/"
          className="text-sm text-gray-700 hover:text-black"
        >
          Startup Week
        </Link>
        <Link
          href="https://v1michigan.com/ship-it"
          className="text-sm text-gray-700 hover:text-black"
        >
          Ship-it
        </Link>
        <Link
          href="https://v1michigan.com/events"
          className="text-sm text-gray-700 hover:text-black"
        >
          Events
        </Link>
        <Link
          href="/store"
          className="text-sm text-gray-700 hover:text-black"
        >
          Store
        </Link>
        {/* <Link
          href="/people"
          className="text-sm text-gray-700 hover:text-black"
        >
          People
        </Link> */}
        {/* <Link */}
        {/*   href="/north-star" */}
        {/*   className="inline-flex items-center rounded-md bg-gray-800 px-3 py-1.5 text-xs text-white hover:bg-gray-700" */}
        {/* > */}
        {/*   North Star */}
        {/*   <Compass className="ml-1.5 h-3.5 w-3.5" /> */}
        {/* </Link> */}
        {user ? (
          <div className="flex items-center space-x-4">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <button
              onClick={signOut}
              className="inline-flex items-center rounded-md bg-gray-600 px-3 py-1.5 text-xs text-white hover:bg-gray-700"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="inline-flex items-center rounded-md bg-gray-800 px-3 py-1.5 text-xs text-white hover:bg-gray-700"
            >
              Get Involved
              <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <Link
                    href="https://v1michigan.com/community?utm_source=website"
                    className="flex items-center px-4 py-2 text-sm text-white bg-[#4A154B] hover:bg-[#3a0f3c] rounded-md mx-2 my-1"
                    onClick={closeDropdown}
                  >
                    Join Slack!
                    <ArrowRight className="ml-auto h-3.5 w-3.5 -rotate-45" />
                  </Link>
                  <Link
                    href="https://v1michigan.com/join"
                    className="flex items-center px-4 py-2 text-sm text-white bg-gray-800 hover:bg-gray-700 rounded-md mx-2 my-1"
                    onClick={closeDropdown}
                  >
                    Join us!
                    <ArrowRight className="ml-auto h-3.5 w-3.5 -rotate-45" />
                  </Link>
                  <Link
                    href="/auth"
                    className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md mx-2 my-1"
                    onClick={closeDropdown}
                  >
                    Sign In
                    <ArrowRight className="ml-auto h-3.5 w-3.5 -rotate-45" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
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
              href="https://v1michigan.com/apply?utm_source=website"
              className="block py-2 text-sm text-gray-700 hover:text-black"
              onClick={closeMobileMenu}
            >
              Product Studio
            </Link>
            <Link
              href="/north-star"
              className="block py-2 text-sm text-gray-700 hover:text-black"
              onClick={closeMobileMenu}
            >
              North Star
            </Link>
            <Link
              href="/"
              className="block py-2 text-sm text-gray-700 hover:text-black"
              onClick={closeMobileMenu}
            >
              Startup Week
            </Link>

            <Link
              href="https://v1michigan.com/ship-it"
              className="block py-2 text-sm text-gray-700 hover:text-black"
              onClick={closeMobileMenu}
            >
              Ship-it
            </Link>
            <Link
              href="https://v1michigan.com/events"
              className="block py-2 text-sm text-gray-700 hover:text-black"
              onClick={closeMobileMenu}
            >
              Events
            </Link>
            <Link
              href="/store"
              className="block py-2 text-sm text-gray-700 hover:text-black"
              onClick={closeMobileMenu}
            >
              Store
            </Link>
            {/* <Link
              href="/people"
              className="block py-2 text-sm text-gray-700 hover:text-black"
              onClick={closeMobileMenu}
            >
              People
            </Link> */}
            {user ? (
              <div className="py-2 border-t">
                <div className="flex items-center space-x-2 mb-2">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-600">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    signOut();
                    closeMobileMenu();
                  }}
                  className="block text-sm text-gray-700 hover:text-black"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="py-2 border-t">
                <div className="text-sm font-medium text-gray-700 mb-2">Get Involved</div>
                <div className="flex flex-col space-y-2">
                  <Link
                    href="https://v1michigan.com/community?utm_source=website"
                    className="inline-flex w-fit items-center rounded-md bg-[#4A154B] px-3 py-1.5 text-xs text-white hover:bg-[#3a0f3c]"
                    onClick={closeMobileMenu}
                  >
                    Join Slack!
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 -rotate-45" />
                  </Link>
                  <Link
                    href="https://v1michigan.com/join"
                    className="inline-flex w-fit items-center rounded-md bg-gray-800 px-3 py-1.5 text-xs text-white hover:bg-gray-700"
                    onClick={closeMobileMenu}
                  >
                    Join us!
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 -rotate-45" />
                  </Link>
                  <Link
                    href="/auth"
                    className="inline-flex w-fit items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 -rotate-45" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}
