"use client"

const items = {
  sneakers1: {
    title: "Air Pulse X",
    description: "High-performance sneakers designed for runners seeking speed and comfort.",
    imageUrl: "https://images.unsplash.com/photo-1618354691213-34a0b25ba0c3",
    releaseDate: "2025-07-15"
  },
  sneakers2: {
    title: "Urban Walk Pro",
    description: "Sleek everyday shoes perfect for city exploration and casual wear.",
    imageUrl: "https://images.unsplash.com/photo-1593032465174-53d5fd5f1fcb",
    releaseDate: "2025-08-01"
  },
  sneakers3: {
    title: "Retro Court 98",
    description: "Inspired by classic 90s court shoes, blending vintage style with modern comfort.",
    imageUrl: "https://images.unsplash.com/photo-1589987607627-7e5e5c0f95dd",
    releaseDate: "2025-08-25"
  }
}



const NewSeason = () => {
  
  return (
    <div className="pl-[10px] max-w-[1280px] mx-auto">
      <span className="block text-[24px] text-center font-semibold uppercase tracking-wide font-sans mb-8 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
       Yeni mövsüm / Yeniliklər
      </span>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 overflow-auto">
        {Object.values(items).map((item, index) => (
          <div
            key={index}
            className="flex flex-col bg-[#F7F8FB] rounded-xl overflow-hidden shadow-md"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-48 sm:h-52 object-cover"
            />

            <div className="p-4 text-left">
              <h2 className="text-lg md:text-xl font-bold">{item.title}</h2>
              <p className="text-sm text-gray-700 my-2">{item.description}</p>
              <p className="text-xs text-gray-500">Release: {item.releaseDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewSeason
