"use client";
import { motion } from "framer-motion"
import { useRouter } from "next/navigation";

const Kampaniya = () => {
  const router = useRouter();
  
  return (
    <div className="w-full max-w-[1320px] mx-auto p-8">
      <div className="flex max-[991px]:flex-col  items-center gap-12  p-8">
        <motion.div
          className="flex-1 space-y-6 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block  px-5 py-2 bg-black text-white text-sm font-medium rounded-full">
            🇹🇷 Türkiyə İstehsalı
          </div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-black">Kişi geyimləri</span>
            <br />
            <span className="text-gray-600">münasib qiymət!</span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Kişilər üçün keyfiyyətli geyim – <span className="font-semibold text-black">Etor yetərlidir!</span>
          </motion.p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="px-5 py-3 bg-gray-50 rounded-full text-sm font-medium">🚚 Sürətli çatdırılma</div>
            <div className="px-5 py-3 bg-gray-50 rounded-full text-sm font-medium">✅ Keyfiyyət zəmanəti</div>
            <div className="px-5 py-3 bg-gray-50 rounded-full text-sm font-medium">💰 Münasib qiymət</div>
          </div>

          <motion.button
            className="mt-8 px-8 py-4 bg-black text-white rounded-2xl font-semibold text-lg hover:bg-gray-800 transition-colors duration-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/products")}
          >
            İndi alış-veriş et →
          </motion.button>
        </motion.div>

        <motion.div
          className="flex-shrink-0 flex items-center justify-center max-[991px]:hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative w-80 h-80 max-[991px]:hidden bg-gradient-to-br from-slate-900 via-black to-slate-800 rounded-3xl shadow-2xl border border-gray-700 flex items-center justify-center overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>

            {/* Main logo content */}
            <div className="relative text-center z-10">
              <div className="text-7xl font-black text-white mb-2 tracking-widest drop-shadow-lg">
                E<span className="text-gray-300">T</span>OR
              </div>
              <div className="w-16 h-0.5 bg-white mx-auto mb-3 opacity-80"></div>
              <div className="text-sm text-gray-300 font-light tracking-[0.3em] uppercase">Premium Men's</div>
              <div className="text-xs text-gray-400 font-light tracking-[0.2em] uppercase mt-1">Fashion</div>
            </div>

            {/* Subtle corner accent */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/20 rounded-bl-lg"></div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Kampaniya
