import * as React from "react";

const YCBannerBackground = (props: any) => (
  <svg
    width="10000"
    height="1000"
    viewBox="0 0 10000 1000"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
    {...props}
  >
    <defs>
      <filter id="grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="10"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <radialGradient id="orangeBlotch" cx="60%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#EA6F34" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#EA6F34" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="spot1" cx="20%" cy="25%" r="35%">
        <stop offset="0%" stopColor="#FFF59D" stopOpacity={0.4} />
        <stop offset="100%" stopColor="#FFF59D" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="spot2" cx="85%" cy="80%" r="40%">
        <stop offset="0%" stopColor="#FFEB3B" stopOpacity={0.3} />
        <stop offset="100%" stopColor="#FFEB3B" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="spot3" cx="50%" cy="10%" r="30%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.2} />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="#EA6F34" />
    <rect
      width="100%"
      height="100%"
      fill="url(#orangeBlotch)"
      style={{
        mixBlendMode: "multiply",
      }}
      opacity={0.6}
    />
    <g
      style={{
        isolation: "isolate",
      }}
    >
      <rect
        width="100%"
        height="100%"
        fill="url(#spot1)"
        style={{
          mixBlendMode: "screen",
        }}
      />
      <rect
        width="100%"
        height="100%"
        fill="url(#spot2)"
        style={{
          mixBlendMode: "screen",
        }}
      />
      <rect
        width="100%"
        height="100%"
        fill="url(#spot3)"
        style={{
          mixBlendMode: "screen",
        }}
      />
    </g>
    <rect
      width="100%"
      height="100%"
      filter="url(#grain)"
      opacity={0.60}
      style={{
        mixBlendMode: "overlay",
      }}
    />
  </svg>
);

export default YCBannerBackground;
