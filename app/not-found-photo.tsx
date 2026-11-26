"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./not-found.module.css";

export default function NotFoundPhoto() {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src="/404-artwork.webp"
      alt=""
      width={1280}
      height={1599}
      unoptimized
      loading="eager"
      fetchPriority="high"
      className={styles.photo}
      data-loaded={loaded}
      onLoad={() => setLoaded(true)}
    />
  );
}
