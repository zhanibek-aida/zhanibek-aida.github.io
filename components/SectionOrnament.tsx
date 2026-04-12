import { Circle, Heart } from "lucide-react"
import { motion } from "framer-motion"

/**
 * Минималистичный разделитель: тонкие линии + символ (кольца / жүрек).
 * Вариант 4 — без растровых файлов, Lucide.
 */
export function SectionOrnament({
  flipped = false,
  className = "",
  /** 1 — екі шенбер (күнтізбе, футер), 2 — жүрек (той иелері) */
  variant = "1",
}: {
  flipped?: boolean
  className?: string
  variant?: "1" | "2"
}) {
  return (
    <div
      className={`flex items-center justify-center gap-3 px-4 md:gap-5 ${flipped ? "rotate-180" : ""} ${className}`}
      aria-hidden
    >
      <div className="h-px min-w-[2rem] flex-1 max-w-[12rem] bg-gradient-to-r from-transparent via-[#c4a574]/70 to-[#c4a574]/40" />
      <motion.div
        className="shrink-0"
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {variant === "2" ? (
          <Heart
            className="h-8 w-8 text-[#8b9a7c] md:h-9 md:w-9"
            strokeWidth={1.35}
            fill="none"
          />
        ) : (
          <div className="relative h-9 w-[3.25rem] md:h-10 md:w-14">
            <Circle
              className="absolute left-0 top-1/2 h-8 w-8 -translate-y-1/2 text-[#8b9a7c] md:h-9 md:w-9"
              strokeWidth={1.35}
            />
            <Circle
              className="absolute left-[0.85rem] top-1/2 h-8 w-8 -translate-y-1/2 text-[#c4a574] md:left-[1.1rem] md:h-9 md:w-9"
              strokeWidth={1.35}
            />
          </div>
        )}
      </motion.div>
      <div className="h-px min-w-[2rem] flex-1 max-w-[12rem] bg-gradient-to-l from-transparent via-[#c4a574]/70 to-[#c4a574]/40" />
    </div>
  )
}
