/** Декоративный разделитель между секциями. */
export function SectionOrnament({
  flipped = false,
  className = "",
  /** 1 — күнтізбе және футер, 2 — той иелері */
  variant = "1",
}: {
  flipped?: boolean
  className?: string
  variant?: "1" | "2"
}) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || ""
  const src =
    variant === "2"
      ? `${base}/section-ornament-2.png`
      : `${base}/section-ornament-1.png`

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
