import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Instrument_Serif } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import NotFoundPhoto from "./not-found-photo";
import styles from "./not-found.module.css";

const instrumentItalic = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  adjustFontFallback: false,
  variable: "--font-404-italic",
});

export default function NotFound() {
  return (
    <main className={`${styles.page} ${instrumentItalic.variable}`}>
      <div className={styles.frame}>
        <header className={styles.header}>
          <Link href="/" aria-label="V1 Michigan home" className={styles.brand}>
            <Image src="/v1-logo.png" width={27} height={36} alt="" loading="eager" />
          </Link>
        </header>

        <div className={styles.layout}>
          <div>
            <p className={styles.status}>Error 404</p>
            <h1 className={styles.title}>
              Page not <em>found.</em>
            </h1>
            <p className={styles.description}>
              This link may be broken, or the page may have moved.
            </p>

            <nav aria-label="Find your way back" className={styles.actions}>
              <Link href="/" className={styles.home}>
                <ArrowLeft size={17} aria-hidden="true" />
                Back to home
              </Link>
              <Link href="/projects" className={styles.projects}>
                Explore projects
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </nav>
          </div>

          <div className={styles.artwork} aria-hidden="true">
            <div className={styles.print}>
              <span className={styles.printCode}>404</span>
              <NotFoundPhoto />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
