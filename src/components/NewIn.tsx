"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { Heart, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"

const items = [
  { id: 1, title: "Arte Heart Logo T-Shirt", color: "White", price: "AZN111", category: "T-Shirts" },
  {
    id: 2,
    title: "Stone Island Canvas Weave Cotton Zip Shirt Jacket",
    color: "Desert",
    price: "AZN910",
    category: "Jackets",
  },
  { id: 3, title: "No Problemo Logo Cap", color: "Khaki", price: "AZN77", category: "Accessories" },
  { id: 4, title: "AMI Paris Corduroy Velvet Carrot Pants", color: "Bronze", price: "AZN519", category: "Pants" },
  { id: 5, title: "Drake's Brushed Shetland Crew Knit", color: "Cream", price: "AZN441", category: "Knitwear" },
  { id: 6, title: "Edwin Wide Fit Denim Jeans", color: "Blue Mid Used", price: "AZN288", category: "Denim" },
  { id: 7, title: "Miansai Stag Cuff Bracelet", color: "Gold", price: "AZN213", category: "Jewelry" },
  {
    id: 8,
    title: "Acne Studios Exford U Long Sleeve Gym Bro Layered Tee",
    color: "Dusty White",
    price: "AZN1002",
    category: "T-Shirts",
  },
  { id: 9, title: "Paraboot Chambord", color: "Cafe", price: "AZN774", category: "Shoes" },
  { id: 10, title: "Folk Patch Overshirt", color: "Olive Chunky Cord", price: "AZN315", category: "Shirts" },
]

const NewIn = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl  max-[991px]:text-center font-bold text-gray-900 mb-2 tracking-tight"
        >
          Yeni gələnlər <br />
          <span className="text-[20px] font-[300]">Ən son məhsullarımızı və trend parçaları kəşf edin.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 text-lg  max-[991px]:text-center"
        >
         
        </motion.p>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        spaceBetween={24}
        slidesPerView={1.2}
        breakpoints={{
          480: { slidesPerView: 1.5, spaceBetween: 20 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 2.5, spaceBetween: 24 },
          1024: { slidesPerView: 3.5, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="pb-4"
      >
        {items.map((item, index) => (
          <SwiperSlide key={item.id}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                y: -8,
                transition: { duration: 0.2 },
              }}
              className="group cursor-pointer"
            >
              <div className="bg-white h-full rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="relative h-[330px] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="text-6xl text-gray-300 font-light"
                    >
                      {item.category.charAt(0)}
                    </motion.div>
                  </div>

                  <div className="absolute top-3 left-3">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {item.category}
                    </motion.span>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-3 right-3 flex flex-col gap-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-sm transition-colors duration-200"
                    >
                      <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                    </motion.button>
                   
                  </motion.div>

                  <div className="absolute bottom-3 left-3">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className="bg-black text-white text-xs font-semibold px-2 py-1 rounded-full"
                    >
                      NEW
                    </motion.span>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="p-4"
                >
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors duration-200">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{item.color}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gray-300 border border-gray-200"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">{item.price}</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors duration-200"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="text-center mt-8">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-3 rounded-full transition-all duration-200"
        >
          View All New Arrivals
        </motion.button>
      </div>
    </div>
  )
}

export default NewIn
