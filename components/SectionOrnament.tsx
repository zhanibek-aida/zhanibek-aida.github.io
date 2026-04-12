/** Декоративный разделитель между секциями (изображение из макета). */
export function SectionOrnament({
  flipped = false,
  className = "",
}: {
  flipped?: boolean
  className?: string
}) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || ""
  return (
    <div className={`flex justify-center ${className}`}>
      <div
        className={`w-full max-w-[min(100%,28rem)] px-2 md:max-w-lg ${flipped ? "rotate-180" : ""}`}
      >
        <img
          src={`${base}/section-ornament.png`}
          alt=""
          className="mx-auto h-auto w-full object-contain opacity-95"
        />
      </div>
    </div>
  )
}
