"use client"

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            İstifadəçi İdarəsi
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            İstifadəçiləri idarə edin və hesab məlumatlarını yoxlayın.
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-purple-100 mb-4">
              <svg className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              İstifadəçi İdarəsi Hazırlanır
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
              Bu bölmə hazırda inkişaf mərhələsindədir. Tezliklə istifadəçi idarəsi funksiyaları əlavə ediləcək.
            </p>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-100">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <h3 className="text-sm sm:text-base font-medium text-gray-900">İstifadəçi Siyahısı</h3>
                <p className="text-xs sm:text-sm text-gray-600">Bütün istifadəçiləri görüntülə</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-green-100">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"/>
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <h3 className="text-sm sm:text-base font-medium text-gray-900">Hesab İdarəsi</h3>
                <p className="text-xs sm:text-sm text-gray-600">İstifadəçi hesablarını idarə et</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-red-100">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/>
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <h3 className="text-sm sm:text-base font-medium text-gray-900">Təhlükəsizlik</h3>
                <p className="text-xs sm:text-sm text-gray-600">Hesab təhlükəsizliyi və icazələr</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}