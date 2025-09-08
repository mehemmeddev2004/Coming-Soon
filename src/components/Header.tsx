"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Filter from "./ui/Filter";
import Bar from "./ui/Bar";

const Header = () => {
  const router = useRouter();
  const [toggleSearch, setToggleSearch] = useState(false);
  const [toggleBar, setToggleBar] = useState(false);
  const [userInitial, setUserInitial] = useState<string>("");
  const [userBoxOpen, setUserBoxOpen] = useState(false); // yeni state
  const [userData, setUserData] = useState<{email: string, username:string} | null>(null);

  const handleToggleSearch = () => setToggleSearch((prev) => !prev);
  const handleToggleBar = () => setToggleBar((prev) => !prev);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user); 
      setUserData(parsedUser);
      setUserInitial(parsedUser.email?.[0].toUpperCase() || "");
    }
  }, []);

  const icons = [
    { id: "1", img: "/img/search.svg", alt: "Search icon" },
    { id: "2", img: "/img/user.svg", alt: "User icon", link: "/login" },
    { id: "3", img: "/img/favorite.svg", alt: "Favorite icon" },
    { id: "4", img: "/img/bag.svg", alt: "Bag icon" },
  ];

  const category = [
    { id: "1", name: "Dresses" },
    { id: "2", name: "Trousers" },
    { id: "3", name: "Tops" },
    { id: "4", name: "Skirts" },
    { id: "5", name: "Coats" },
  ];

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <Filter isOpen={toggleSearch} onClose={() => setToggleSearch(false)} />

      <div className="max-w-[1325px] mx-auto flex items-center justify-between px-5 h-[50px] relative">
        <div className="flex items-center gap-12">
          <h2
            className="font-extrabold cursor-pointer text-3xl uppercase tracking-wide text-gray-900 select-none"
            onClick={() => router.push("/")}
          >
            Etor
          </h2>

          <nav>
            <ul className="flex space-x-6 text-gray-700 max-[991px]:hidden font-medium text-base cursor-pointer select-none">
              {category.map((item) => (
                <li
                  key={item.id}
                  className="hover:text-gray-900 transition-colors duration-200"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center max-[991px]:hidden gap-[3px] relative">
{icons.map((item) => (
        <div key={item.id} className="relative">
          <button
            onClick={() => {
              if (item.id === "1") handleToggleSearch()
              if (item.id === "2") {
                if (userData) setUserBoxOpen((prev) => !prev)
                else if (item.link) router.push(item.link)
              }
              if (item.id === "3" || item.id === "4") {
                if (item.link) router.push(item.link)
              }
            }}
            aria-label={item.alt}
            type="button"
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${
              (item.id === "2" || item.id === "3") && "max-lg:hidden"
            }`}
          >
            {item.id === "2" && userInitial ? (
              <span className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full text-sm font-medium shadow-sm">
                {userInitial}
              </span>
            ) : (
              <Image
                src={item.img || "/placeholder.svg"}
                alt={item.alt}
                width={20}
                height={20}
                className="w-[20px] h-[20px]"
              />
            )}
          </button>

          {item.id === "2" && userBoxOpen && userData && (
            <div className="absolute top-12 right-0 w-72 bg-white border border-gray-200 shadow-xl rounded-lg p-0 z-50 overflow-hidden">
              {/* User Info Section */}
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 flex items-center justify-center  bg-black text-white rounded-full text-sm font-medium">
                    {userInitial}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{userData.username}</p>
                    <p className="text-gray-600 truncate text-sm">{userData.email}</p>
                  </div>
                </div>
              </div>

             
              <div className="p-2 flex">
                <button
                  onClick={() => {
                    setUserBoxOpen(false)
         localStorage.removeItem("user");  
        setUserBoxOpen(false);             
        setUserData(null);                
        setUserInitial("");                
        router.push("/login");   
                    router.push("/login")
                  }}
                  className="w-full text-left px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-150 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Hesabdan çıx
                </button>
                <button     
                onClick={(() => router.push("/account"))}
                className="w-full  px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-150 flex items-center justify-end text-right gap-2">
                <img src="/img/user.svg" alt=""  className="w-[15px] h-[15px]"/>  Hesabim
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

        </div>

        <div className="hidden max-[991px]:block">
          <Bar onToggle={handleToggleBar} isOpen={toggleBar} />
        </div>
      </div>
    </header>
  );
};

export default Header;
