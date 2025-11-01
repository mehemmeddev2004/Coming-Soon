"use client"

import Image from "next/image"
import TextType from "../ui/motion/TextType"

const Welcome = () => {
  return (
    <div className="relative w-[1420px] mt-5 h-[800px] overflow-hidden rounded-2xl">
      {/* Background Image */}
      <Image
        src="/img/Kampaniya.png"
        alt="Arxa plan"
        fill
        className="object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div> {/* Burada 30% şəffaflıq var */}

      {/* Centered Content */}
      <div className="absolute bottom-[120px] left-[20px] z-10">
        <TextType 
          text={["Etor"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
          className="text-[23px] font-bold text-white"
        />
        <p className="text-white">Mağazamızın veb saytına xoş gəlmisiniz</p>
        <button className="border-white border-2 font-bold text-white p-2 mt-[15px] hover:bg-white hover:text-black transition-all duration-300">
          Productlarimizi Kesf edin
        </button>
      </div>
    </div>
  )
}

export default Welcome
