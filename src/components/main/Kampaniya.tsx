"use client"

import { useEffect, useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import Image from "next/image"


const Kampaniya = () => {

  return (
    <div className="w-full ">
  <div className="flex justify-center mx-auto p-8 rounded-2xl  h-[800px]  ">
       <Image src="/img/Kampaniya.png" alt="" width={4320} height={500}  className="rounded-2xl" />
  </div>
     <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />



    </div>
  )
}

export default Kampaniya