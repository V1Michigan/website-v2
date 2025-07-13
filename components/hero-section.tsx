import Image from "next/image"
import Link from "next/link"
import { Instagram, Twitter } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative mx-auto my-4 max-w-6xl overflow-hidden rounded-lg px-4 md:px-6 lg:px-8">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src="/placeholder.svg?height=600&width=1200"
          alt="V1 @ Michigan community event"
          fill
          className="rounded-lg object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8 lg:p-10 text-white">
          <h1 className="mb-3 text-4xl md:text-5xl lg:text-6xl font-serif">V1 @ Michigan</h1>
          <p className="max-w-2xl text-xs md:text-sm lg:text-base">
            V1 is the premier builder community at the University of Michigan dedicated to supporting hackers and
            creators every step of the way.
          </p>
          <div className="mt-4 flex space-x-5">
            <Link href="https://twitter.com" aria-label="Twitter" className="text-white hover:text-gray-200">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="https://instagram.com" aria-label="Instagram" className="text-white hover:text-gray-200">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Other" className="text-white hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
