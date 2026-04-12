/** Декоративный разделитель между секциями (SVG). */
export function SectionOrnament({
  flipped = false,
  className = "",
  /** 1 — Untitled.svg (күнтізбе және футер), 2 — Untitled (1).svg (той иелері) */
  variant = "1",
}: {
  flipped?: boolean
  className?: string
  variant?: "1" | "2"
}) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || ""
  const src =
    variant === "2"
      ? `${base}/section-ornament-2.svg`
      : `${base}/section-ornament-1.svg`

  return (
    <div className={`flex justify-center ${className}`}>
      <div
        className={`w-full max-w-[min(100%,36rem)] px-2 md:max-w-3xl ${flipped ? "rotate-180" : ""}`}
      >
        <img
          src={src}
          alt=""
          className="mx-auto h-auto w-full object-contain opacity-95"
        />
      </div>
    </div>
  )
}
