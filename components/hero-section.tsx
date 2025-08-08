import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative my-4 mx-auto sm:max-w-3xl md:max-w-4xl lg:max-w-5xl overflow-hidden rounded-lg px-0">
      <div className="relative aspect-[16/9] w-full">
        <video
          src="/landing-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="rounded-lg object-cover w-full h-full"
          poster="/landing-video-img.png"
        />
        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8 lg:p-10 text-white">
          <h1 className="mb-2 md:mb-8 lg:mb-10 text-4xl md:text-8xl lg:text-9xl font-instrument font-light" style={{ fontFamily: 'var(--font-instrument), "Instrument Serif", serif' }}>V1 @ Michigan</h1>
          <p className="max-w-3xl text-sm md:text-base lg:text-base">
            V1 is the premier builder community at the University of Michigan dedicated to supporting hackers and
            creators every step of the way.
          </p>
            <div className="mt-6 flex space-x-6 mb-3 md:mb-24 lg:mb-48">
            <Link href="https://x.com/v1michigan" aria-label="X" className="text-white hover:text-gray-200">
              <img src="./x.png" alt="X" className="h-6 w-6" />
            </Link>
            <Link href="https://www.instagram.com/v1michigan/" aria-label="Instagram" className="text-white hover:text-gray-200">
              <img src="./insta.png" className="h-6 w-6" />
            </Link>
            <Link href="https://v1network.substack.com/" aria-label="Contact" className="text-white hover:text-gray-200">
              <img src="./more.png" className="h-6 w-6" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
