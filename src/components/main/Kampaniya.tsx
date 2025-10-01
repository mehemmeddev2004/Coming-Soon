"use client"

import { useEffect, useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import MagnetButton from "../ui/motion/MagnetButton"
import BlurText from "../ui/motion/BlurText"

const Kampaniya = () => {
  const [hasPlayed, setHasPlayed] = useState(false)
  const videoRefs = useRef<HTMLVideoElement[]>([])

  const handleAnimationComplete = () => {
    console.log("Animation completed!")
  }

  useEffect(() => {
    const playedBefore = localStorage.getItem("kampaniyaVideoPlayed")
    if (playedBefore) setHasPlayed(true)
  }, [])

  const handleVideoEnd = () => {
    setHasPlayed(true)
    localStorage.setItem("kampaniyaVideoPlayed", "true")
  }

  const handleSlideChange = (swiper: any) => {
    const currentIndex = swiper.activeIndex

    // Tüm videoları durdur
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause()
        video.currentTime = 0
      }
    })

    // Aktif slide'daki videoyu başlat
    const activeVideo = videoRefs.current[currentIndex]
    if (activeVideo) activeVideo.play()
  }

  const items = [
    {
      id: 1,
      url: "/video/A_stylishly_dressed_202510011225.mp4",
      title: "Yeni Payız Trendini Kəşf Et Premium Kostyumlar",
      btn: "Məhsulları Kəşf Et",
      slug: "/products",
    },
    {
      id: 2,
      url: "/video/Untitled video - Made with Clipchamp.mp4",
      title: "Bizim mağazamızdan kostyumlar əldə edə bilərsiniz",
      btn: "Kostyum baxın",
      slug: "/products",
    },
  ]

  return (
    <div className="w-full relative">
      <Swiper className="mySwiper" onSlideChange={handleSlideChange}>
        {items.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div className="relative flex justify-center">
              {/* Video */}
              <video
                ref={(el) => {
                  if (el) videoRefs.current[index] = el
                }}
                autoPlay={!hasPlayed && index === 0}
                muted
                onEnded={handleVideoEnd}
                playsInline
                disablePictureInPicture
                {...({ controlsList: "nodownload nofullscreen noremoteplayback" } as any)}
                className="w-full object-cover h-[780px] sm:h-[900px] md:h-[900px] lg:h-[95vh]"
                style={{ pointerEvents: "none" }}
              >
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Overlay yuxarı */}
              <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

              {/* Overlay aşağı */}
              <div className="absolute bottom-0 left-0 w-full h-1/4 max-[991px]:h-2/3 bg-gradient-to-t from-black/20 max-[991px]:from-black/60 to-transparent pointer-events-none" />

              {/* Text & Button */}
              <div
                className="
                  absolute inset-0
                  flex flex-col items-start justify-center
                  text-orange-600
                  pointer-events-none
                  px-6 sm:px-10 md:px-20 lg:px-24
                  top-32
                  max-[991px]:items-center
                  max-[991px]:justify-center
                  max-[991px]:px-4
                  max-[991px]:text-center
                  max-[991px]:top-auto
                  max-[991px]:bottom-10
                "
              >
                <div className="w-full max-w-[970px] space-y-4 sm:space-y-6 md:space-y-8 flex flex-col items-start max-[991px]:items-center">
                  <h2 className="font-bold leading-tight sm:leading-snug tracking-wide sm:tracking-wider md:tracking-[0.15em] uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl max-[991px]:text-center">
                    <BlurText
                      text={item.title}
                      delay={150}
                      animateBy="words"
                      direction="top"
                      onAnimationComplete={handleAnimationComplete}
                      className="inline-block"
                    />
                  </h2>

                  <div className="pointer-events-auto">
                    <MagnetButton
                      padding={80}
                      disabled={false}
                      magnetStrength={0.4}
                      size="lg"
                      onClick={() => console.log("Button clicked!")}
                    >
                      {item.btn}
                    </MagnetButton>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Kampaniya
