import React from 'react'

const Collection = () => {
  const item = [
    { id: 1, img: "https://www.mariorusso.az/business.jpg?height=600&width=400" },
    { id: 2, img: "https://www.mariorusso.az/tuxedo.jpg?height=600&width=400" },
    { id: 3, img: "https://www.mariorusso.az/tuxedo.jpg?height=600&width=400" },
    { id: 4, img: "https://www.mariorusso.az/coat.jpeg?height=600&width=400" },
    { id: 5, img: "https://www.mariorusso.az/casual.jpg?height=600&width=400" },
    { id: 6, img: "https://www.mariorusso.az/accessories.jpg?height=600&width=400" }
  ]

  return (
    <div className="max-w-[1400px] mx-auto px-4">
      <span className="block text-[24px] text-center font-semibold uppercase tracking-wide font-sans mb-10 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Bizim Kolleksiyalarımız
      </span>

      {/* ✅ Grid Layout ilə daha responsiv düzülüş */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {item.map((item) => (
          <div
            key={item.id}
            className="w-full h-[400px] overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src={item.img}
              alt={`collection-${item.id}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Collection
