"use client"

import { motion } from "framer-motion"

const Pay = () => {
  return (
    <div className="relative w-full max-w-[1220px] mx-auto rounded-2xl  py-16 overflow-hidden px-4 sm:px-8">
      
      {/* Arxa fon effektləri */}
      <div className="absolute inset-0 px-4 z-0" />
      <div className="absolute top-0 right-0 w-96 h-96  rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 to-transparent rounded-full blur-3xl z-0" />

      {/* Kontent */}
      <div className="relative z-10 max-w-[1280px] mx-auto">
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between gap-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Yazı hissəsi */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Rahat ödəniş
            </motion.h2>

            <motion.p
              className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Sevdiyin kartlarla təhlükəsiz və sürətli ödəniş imkanı
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              {["✓ Təhlükəsiz", "✓ Sürətli", "✓ Rahat"].map((label, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/20"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-gray-700 font-medium">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Şəkil hissəsi */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
              <div className="p-6 sm:p-8 rounded-2xl flex justify-center">
                <img
                  src="/img/pay.svg"
                  alt="Ödəniş"
                  className="w-full max-w-[420px] object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Pay
