"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { SectionOrnament } from "@/components/SectionOrnament"

// Wedding date - 18 July 2026, 14:00
const WEDDING_DATE = new Date("2026-07-18T14:00:00")

// Google Apps Script URL for form submission
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbygonOMR8ADXKbePYDD8Oy00etV3Sx8kl4bXBu58yUPmtfOvHw79e4lPZqWQw8n5O5kPw/exec"

const PUBLIC_BASE = process.env.NEXT_PUBLIC_BASE_PATH || ""

const calculateTimeLeft = () => {
  const now = new Date()
  const difference = WEDDING_DATE.getTime() - now.getTime()

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }
  return { days: 0, hours: 0, minutes: 0, seconds: 0 }
}

export default function WeddingInvitation() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const [formData, setFormData] = useState({ name: "", attendance: "" })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const autoScrollRef = useRef<number | null>(null)
  const isPlayingRef = useRef(false)

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  const tryPlayMusic = useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current
    if (!audio) return false
    try {
      await audio.play()
      return true
    } catch {
      return false
    }
  }, [])

  // Fix hydration mismatch - only calculate time on client
  useEffect(() => {
    setIsMounted(true)
    setTimeLeft(calculateTimeLeft())
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Auto-scroll + music after first tap on the page (not on the music button)
  useEffect(() => {
    const onPointerDown = async (e: PointerEvent) => {
      const target = e.target
      if (!(target instanceof Element)) return
      if (target.closest("[data-music-control]")) return
      setIsAutoScrolling(true)
      if (!isPlayingRef.current) {
        const ok = await tryPlayMusic()
        if (ok) setIsPlaying(true)
      }
    }
    window.addEventListener("pointerdown", onPointerDown, true)
    return () => window.removeEventListener("pointerdown", onPointerDown, true)
  }, [tryPlayMusic])

  // Auto-scroll effect (half speed: 1 px every 2 frames)
  useEffect(() => {
    if (isAutoScrolling) {
      let frameCount = 0
      const scroll = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        if (window.scrollY < maxScroll) {
          frameCount++
          if (frameCount % 2 === 0) {
            window.scrollBy(0, 1)
          }
          autoScrollRef.current = requestAnimationFrame(scroll)
        } else {
          setIsAutoScrolling(false)
        }
      }
      autoScrollRef.current = requestAnimationFrame(scroll)
    } else {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current)
      }
    }

    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current)
      }
    }
  }, [isAutoScrolling])

  // Stop auto-scroll on user interaction
  useEffect(() => {
    const stopAutoScroll = () => {
      if (isAutoScrolling) {
        setIsAutoScrolling(false)
      }
    }

    window.addEventListener('wheel', stopAutoScroll)
    window.addEventListener('touchmove', stopAutoScroll)

    return () => {
      window.removeEventListener('wheel', stopAutoScroll)
      window.removeEventListener('touchmove', stopAutoScroll)
    }
  }, [isAutoScrolling])

  const toggleMusic = async () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      setIsAutoScrolling(false)
    } else {
      const ok = await tryPlayMusic()
      if (ok) {
        setIsPlaying(true)
      }
      setIsAutoScrolling(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const attendanceText = formData.attendance === "yes" 
        ? "Иә, келемін" 
        : "Жоқ, өкінішке орай келе алмаймын"

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          attendance: attendanceText,
        }),
      })

      setSubmitted(true)
    } catch (error) {
      console.log("Error submitting form:", error)
      // Still show success since no-cors doesn't return response
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calendar data for July 2026 (starts on Wednesday)
  const calendarDays = [
    [null, null, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, null, null],
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f0] font-serif">
      {/* Audio element - replace src with your music file */}
      <audio ref={audioRef} loop preload="auto">
        <source src={`${PUBLIC_BASE}/wedding-music.mp3`} type="audio/mpeg" />
      </audio>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-between py-8">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f5f0]/80 via-transparent to-[#f5f5f0]" />

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col items-center px-4">
          <h1 className="text-xl md:text-2xl tracking-[0.3em] text-[#4a4a4a] font-light mb-4">
            WEDDING DAY
          </h1>

          {/* Music Controls */}
          <div className="flex items-center gap-4">
            {/* Music Note Icon */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#4a4a4a] flex items-center justify-center bg-white/80">
              <svg
                className="w-7 h-7 md:w-8 md:h-8 text-[#4a4a4a]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>

            {/* Play/Pause Button with circular text */}
            <button
              type="button"
              data-music-control
              onClick={toggleMusic}
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#4a4a4a] flex items-center justify-center bg-white/80 hover:bg-white transition-colors"
            >
              {/* Circular Text */}
              <svg className="absolute w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                <defs>
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  />
                </defs>
                <text className="text-[8px] fill-[#4a4a4a]">
                  <textPath href="#circlePath">
                    • бірге-әуенді өмір-әуенді • бірге-әуенді өмір-әуенді
                  </textPath>
                </text>
              </svg>
              {/* Play/Pause Icon */}
              {isPlaying ? (
                <svg className="w-7 h-7 md:w-8 md:h-8 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-7 h-7 md:w-8 md:h-8 text-[#4a4a4a] ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Names at bottom of hero */}
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-4 md:gap-8 mb-4">
            <span className="text-6xl md:text-8xl font-names text-[#2a2a2a]">Ж</span>
            <span className="text-4xl md:text-6xl text-[#4a4a4a]">|</span>
            <span className="text-6xl md:text-8xl font-names text-[#2a2a2a]">А</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-names text-[#2a2a2a]">
            Жанибек & Аида
          </h2>
        </div>
      </section>

      {/* Invitation Text Section */}
      <section className="py-10 px-4 bg-[#f5f5f0]">
        <div className="max-w-md mx-auto text-center">
          <p className="text-[#5a5a5a] text-lg md:text-xl leading-relaxed mb-2">Құрметті</p>
          <p className="text-[#5a5a5a] text-lg md:text-xl leading-relaxed">Ағайын-туыс,бауырлар,</p>
          <p className="text-[#5a5a5a] text-lg md:text-xl leading-relaxed">нағашы-жиен,бөлелер,</p>
          <p className="text-[#5a5a5a] text-lg md:text-xl leading-relaxed">әпке-жезделер,</p>
          <p className="text-[#5a5a5a] text-lg md:text-xl leading-relaxed">құда-жекжат,</p>
          <p className="text-[#5a5a5a] text-lg md:text-xl leading-relaxed">дос-жарандар,</p>
          <p className="text-[#5a5a5a] text-lg md:text-xl leading-relaxed">құрбы-құрдас,көршілер,</p>
          <p className="text-[#5a5a5a] text-lg md:text-xl leading-relaxed">әріптестер!</p>
        </div>
      </section>

      {/* Wedding Couple Section */}
      <section className="py-10 px-4 bg-[#f5f5f0] border-t border-[#d4d4d4]">
        <div className="max-w-md mx-auto text-center">
          <p className="text-[#5a5a5a] text-lg md:text-xl mb-2">Сіздерді</p>
          <p className="text-[#5a5a5a] text-lg md:text-xl mb-4">ұлымыз бен келініміз</p>
          
          <h3 className="text-3xl md:text-4xl font-names text-[#6b5a3e] mb-2">Жанибек</h3>
          <p className="text-[#5a5a5a] text-lg mb-2">пен</p>
          <h3 className="text-3xl md:text-4xl font-names text-[#6b5a3e] mb-6">Аида</h3>
          
          <p className="text-[#5a5a5a] text-lg md:text-xl leading-relaxed">
            үйлену тойына арналған
          </p>
          <p className="text-[#5a5a5a] text-lg md:text-xl leading-relaxed">
            салтанатты ақ
          </p>
          <p className="text-[#5a5a5a] text-lg md:text-xl leading-relaxed">
            дастарханымыздың қадірлі
          </p>
          <p className="text-[#5a5a5a] text-lg md:text-xl leading-relaxed">
            қонағы болуға шақырамыз!
          </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-10 px-4 bg-[#f5f5f0] border-t border-[#d4d4d4]">
        <SectionOrnament className="mb-6" />

        <div className="max-w-sm mx-auto text-center">
          <h2 className="text-2xl md:text-3xl text-[#5a5a5a] mb-6">Той салтанаты:</h2>
          
          <p className="text-xl md:text-2xl font-script text-[#6b5a3e] mb-6 underline decoration-[#6b5a3e]">
            18 шілде 2026 жыл
          </p>

          {/* Calendar Grid */}
          <div className="mb-6">
            <div className="grid grid-cols-7 gap-2 md:gap-3 text-[#5a5a5a] mb-2">
              <span className="text-sm md:text-base">дс</span>
              <span className="text-sm md:text-base">сс</span>
              <span className="text-sm md:text-base">ср</span>
              <span className="text-sm md:text-base">бс</span>
              <span className="text-sm md:text-base">жм</span>
              <span className="text-sm md:text-base">сб</span>
              <span className="text-sm md:text-base">вс</span>
            </div>
            {calendarDays.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-2 md:gap-3 text-[#5a5a5a]">
                {week.map((day, dayIndex) => (
                  <span
                    key={dayIndex}
                    className={`text-sm md:text-base py-1 ${
                      day === 18
                        ? "bg-[#6b5a3e] text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center mx-auto"
                        : ""
                    }`}
                  >
                    {day || ""}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Wedding Rings Icon */}
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12 text-[#c5b698]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="24" r="10" />
              <circle cx="30" cy="24" r="10" />
            </svg>
          </div>

          <p className="text-lg md:text-xl text-[#5a5a5a]">Сағат 14:00-де басталады</p>
        </div>
      </section>

      {/* Venue Section */}
      <section className="py-10 px-4 bg-[#f5f5f0] border-t border-[#d4d4d4]">
        <div className="max-w-sm mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-script text-[#6b5a3e] mb-6">Мекен-жайымыз:</h2>
          
          <div className="border border-[#d4d4d4] rounded-lg p-6 mb-6">
            <p className="text-[#5a5a5a] text-lg mb-4">Кішкенекөл ауылы</p>
            <p className="text-2xl md:text-3xl font-script text-[#6b5a3e] mb-2">{'"'} Гаухартас {'"'}</p>
            <p className="text-[#5a5a5a] text-lg">мейрамханасы</p>
          </div>

          <a
            href="https://maps.app.goo.gl/FceHneyyBDBpAeCJA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#5a5040] text-white px-8 py-3 rounded-full text-lg hover:bg-[#4a4030] transition-colors font-script"
          >
            Картаны ашу
          </a>
        </div>
      </section>

      {/* Toastmaster Section */}
      <section className="py-10 px-4 bg-[#f5f5f0] border-t border-[#d4d4d4]">
        <SectionOrnament className="mb-6" />

        <div className="max-w-sm mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-script text-[#6b5a3e] mb-6">Той иелері:</h2>
          <p className="text-xl md:text-2xl text-[#5a5a5a]">Сабыржан-Шолпан</p>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-10 px-4 bg-[#f5f5f0] border-t border-[#d4d4d4]">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl md:text-3xl text-[#5a5a5a] mb-6">Той салтанатына дейін:</h2>
          
          <div className="flex justify-center items-center gap-2 md:gap-4 mb-8">
            <div className="text-center">
              <span className="text-4xl md:text-6xl font-light text-[#4a4a4a]">{isMounted ? timeLeft.days : "-"}</span>
              <p className="text-sm md:text-base text-[#5a5a5a]">күн</p>
            </div>
            <span className="text-4xl md:text-6xl text-[#4a4a4a]">:</span>
            <div className="text-center">
              <span className="text-4xl md:text-6xl font-light text-[#4a4a4a]">{isMounted ? timeLeft.hours : "-"}</span>
              <p className="text-sm md:text-base text-[#5a5a5a]">сағат</p>
            </div>
            <span className="text-4xl md:text-6xl text-[#4a4a4a]">:</span>
            <div className="text-center">
              <span className="text-4xl md:text-6xl font-light text-[#4a4a4a]">{isMounted ? timeLeft.minutes : "-"}</span>
              <p className="text-sm md:text-base text-[#5a5a5a]">минут</p>
            </div>
            <span className="text-4xl md:text-6xl text-[#4a4a4a]">:</span>
            <div className="text-center">
              <span className="text-4xl md:text-6xl font-light text-[#4a4a4a]">{isMounted ? timeLeft.seconds : "-"}</span>
              <p className="text-sm md:text-base text-[#5a5a5a]">секунд</p>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-10 px-4 bg-[#f5f5f0] border-t border-[#d4d4d4]">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl md:text-2xl text-[#5a5a5a] text-center mb-2">Тойға келуіңізді</h2>
          <h2 className="text-xl md:text-2xl text-[#5a5a5a] text-center mb-8">растауыңызды сұраймыз</h2>

          {submitted ? (
            <div className="text-center py-8">
              <p className="text-xl text-[#6b5a3e]">Рахмет! Сіздің жауабыңыз қабылданды.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[#5a5a5a] text-sm mb-2">
                  Аты-жөніңіз (жұбайыңызбен бірге келетін болсаңыз екі есімді де көрсетуіңізді сұраймыз)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-[#d4d4d4] rounded-md px-4 py-3 text-[#4a4a4a] focus:outline-none focus:border-[#6b5a3e]"
                  required
                />
              </div>

              <div>
                <p className="text-[#5a5a5a] text-sm mb-3">Тойға келесіз бе?</p>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="attendance"
                      value="yes"
                      checked={formData.attendance === "yes"}
                      onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                      className="w-5 h-5 text-[#6b5a3e] border-[#d4d4d4] focus:ring-[#6b5a3e]"
                    />
                    <span className="text-[#6b5a3e]">Иә, келемін</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="attendance"
                      value="no"
                      checked={formData.attendance === "no"}
                      onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                      className="w-5 h-5 text-[#6b5a3e] border-[#d4d4d4] focus:ring-[#6b5a3e]"
                    />
                    <span className="text-[#6b5a3e]">Жоқ, өкінішке орай келе алмаймын</span>
                  </label>
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#5a5040] text-white px-12 py-3 rounded-md text-lg hover:bg-[#4a4030] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Жіберілуде..." : "Жіберу"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Footer: тот же орнамент, перевёрнутый */}
      <section className="py-8 bg-[#f5f5f0]">
        <SectionOrnament flipped />
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:wght@300;400;500&family=Tangerine:wght@400;700&family=Marck+Script&display=swap');
        
        .font-script {
          font-family: 'Great Vibes', cursive;
        }

        .font-names {
          font-family: 'Marck Script', cursive;
        }
        
        body {
          font-family: 'Cormorant Garamond', serif;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  )
}
