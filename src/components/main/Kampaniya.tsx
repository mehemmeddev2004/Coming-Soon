"use client"

import { useRouter } from "next/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"

const Kampaniya = () => {
  const router = useRouter()

  const slides = [
    {
      title: "Kişi geyimləri ilə bütün zövqlərə uyğun stil yarat",
      subtitle: "Münasib qiymət!",
      logoText: "Etor",
      desc: "Siz Etordan Magazasindan Yuksek keyfiyetli Mallar ala bilersiniz",
      btn: "İndi alış-veriş et →",
    },
    {
      title: "2025-in Yeni Kostyum Kolleksiyası ilə fərqlən",
      subtitle: "2025 Kolleksiyası",
      img: "/logos/logo1.png",
      desc: "Premium parçalarla hazırlanıb.",
      btn: "Kolleksiyaya bax",
    },
    {
      title: "Ofis & Casual geyimlər: Dəblə rahatlığı birləşdir",
      subtitle: "Hər zövqə uyğun",
      img: "/logos/logo2.png",
      desc: "Dəblə rahatlığı birləşdir.",
      btn: "Daha çox",
    },
  ]

  return (
    <div className="w-full max-w-[1280px] h-[500px] rounded-2xl bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden mx-auto shadow-2xl">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="h-full"
      >
        {slides.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="flex items-center justify-between h-full px-12 py-8">
              <div className="flex flex-col gap-y-6 max-w-[650px] animate-fade-in">
          {/* Subtitle Badge */}
<div className="inline-flex">
  <span className="
    relative px-4 py-2 rounded-full text-sm font-medium 
    text-white/90 bg-white/20 backdrop-blur-xl 
    border border-white/30 shadow-inner shadow-white/10
    transition-all duration-300
    hover:bg-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]
  ">
    {item.subtitle}
  </span>
</div>

                {/* Main Title */}
                <h2 className="text-white font-bold text-4xl md:text-5xl leading-tight tracking-tight text-balance">
                  {item.title}
                </h2>

                {/* Description */}
                <p className="text-white/80 text-lg leading-relaxed font-light max-w-[500px] text-pretty">
                  {item.desc}
                </p>

                {/* CTA Button */}
              <button
  className="
    group relative w-fit px-8 py-4 rounded-xl font-semibold text-white 
    bg-white/20 backdrop-blur-xl border border-white/30 
    shadow-inner shadow-white/10
    transition-all duration-300 
    hover:scale-105 hover:shadow-2xl hover:bg-white/30 active:scale-95 overflow-hidden
  "
  onClick={() => console.log(item.title)}
>
  <span className="relative z-10  flex items-center gap-2">{item.btn}</span>

  {/* Liquid glass shine effect */}
  <div className="
    absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-white/30 
    opacity-0 group-hover:opacity-100 transition-opacity duration-300
  " />
</button>

              </div>

              {/* Right Side Content */}
              <div className="flex items-center justify-center min-w-">
              
                {item.img && (
                  <div className="relative">
                    <img
                      src={item.img || "/placeholder.svg"}
                      alt={item.title}
                      className="w-40 h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-white/5 rounded-lg blur-3xl -z-10" />
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Kampaniya
