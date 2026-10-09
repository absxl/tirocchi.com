export function GlassFilter() {
  return (
    <svg className="glass-filter" aria-hidden="true" focusable="false">
      <filter
        id="lg-refract"
        x="-20%"
        y="-20%"
        width="140%"
        height="140%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.009 0.014"
          numOctaves="2"
          seed="7"
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation="1.5" result="soft" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="soft"
          scale="12"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
