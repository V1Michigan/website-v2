import Image from "next/image"
import Link from "next/link"
import { Instagram, ListX, Twitter } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative my-4 mx-auto max-w-7xl overflow-hidden rounded-lg px-0">
      <div className="relative aspect-[16/9] w-full">
        <video
          src="/landing-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="rounded-lg object-cover w-full h-full"
          poster="/landing-video-img.png"
        />
        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8 lg:p-10 text-white">
          <h1 className="mb-6 md:mb-8 lg:mb-10 text-6xl md:text-7xl lg:text-8xl font-sans font-light">V1 @ Michigan</h1>
          <p className="max-w-3xl text-m md:text-sm lg:text-base">
            V1 is the premier builder community at the University of Michigan dedicated to supporting hackers and
            creators every step of the way.
          </p>
          <div className="mt-6 flex space-x-6 mb-40 md: mb-44 lg: mb-48">
            <Link href="https://x.com/v1michigan" aria-label="X" className="text-white hover:text-gray-200">
              <img src="./x.png" alt="X" className="h-6 w-6" />
            </Link>
            <Link href="https://www.instagram.com/v1michigan/" aria-label="Instagram" className="text-white hover:text-gray-200">
              <img src="./insta.png" className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Other" className="text-white hover:text-gray-200">
              <img src="./more.png" className="h-6 w-6" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
