"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Filter from "./ui/header/Filter";
import Bar from "./ui/header/Bar";
import AccountMenu from "./ui/header/AccountMenu";
import BagMenu from "./ui/header/BagMenu";
import { useCategories } from "@/hooks/useCategories";
import Link from "next/link";

const Header = () => {
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const [toggleSearch, setToggleSearch] = useState(false);
  const [toggleBar, setToggleBar] = useState(false);
  const [userInitial, setUserInitial] = useState<string>("");
  const [userBoxOpen, setUserBoxOpen] = useState(false); // user menu
  const [bagBoxOpen, setBagBoxOpen] = useState(false); // bag menu
  const [userData, setUserData] = useState<{ email: string; username: string } | null>(null);

  // user localStorage
  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (user && token && user !== "undefined" && user !== "null") {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        setUserInitial(parsedUser.email?.[0]?.toUpperCase() || parsedUser.username?.[0]?.toUpperCase() || "U");
      } else {
        setUserData(null);
        setUserInitial("");
      }
    } catch (err) {
      console.error("User parse error - clearing localStorage:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUserData(null);
      setUserInitial("");
    }
  }, []);


  const icons = [
    { id: "1", img: "/img/search.svg", alt: "Search icon" },
    { id: "2", img: "/img/user.svg", alt: "User icon", link: "/login" },
    { id: "3", img: "/img/favorite.svg", alt: "Favorite icon" },
    { id: "4", img: "/img/bag.svg", alt: "Bag icon" },
  ];

  const handleIconClick = (id: string) => {
    if (id === "1") {
      setToggleSearch(prev => !prev);
      setUserBoxOpen(false);
      setBagBoxOpen(false);
    }
    if (id === "2") {
      if (!userData) {
        router.push("/login");
      } else {
        setUserBoxOpen(prev => !prev);
        setBagBoxOpen(false);
      }
    }
    if (id === "4") {
      setBagBoxOpen(prev => !prev);
      setUserBoxOpen(false);
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      {/* Search Filter */}
      <Filter isOpen={toggleSearch} onClose={() => setToggleSearch(false)} />

      <div className="mx-auto flex items-center justify-between px-5 h-[50px] relative">
        {/* Left: Categories */}
        <div className="flex items-center gap-12">
          <nav>
            
  {/* Mobile Bar */}
        <div className="hidden items-center max-[1280px]:block">
          <Bar onToggle={() => setToggleBar(prev => !prev)} isOpen={toggleBar} />
        </div>
        <ul className="flex space-x-6 text-gray-700 max-[1280px]:hidden font-medium text-base cursor-pointer select-none">
 {categories.map((item) => (
  <li key={item.id} className="relative pb-1 text-gray-700 hover:text-gray-900 transition-colors duration-200">
    <Link 
      href={`/products?category=${item.slug}`}
      className="block w-full h-full"
      onClick={() => setToggleBar(false)}
    >
      {item.name}
      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
    </Link>
  </li>
))}

</ul>

          </nav>
        </div>

        

        {/* Center: Logo */}
        <h2
          className="absolute left-1/2 transform -translate-x-1/2 font-extrabold cursor-pointer text-3xl uppercase tracking-wide text-gray-900 select-none"
          onClick={() => router.push("/")}
        >
          Etor
        </h2>

        {/* Right Icons */}
        <div className="flex items-center  gap-[3px] relative">
          {icons.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => handleIconClick(item.id)}
                aria-label={item.alt}
                type="button"
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center ${
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
                    priority={item.id === "1" || item.id === "2"}
                  />
                )}
              </button>

              {/* User Menu */}
              {item.id === "2" && userBoxOpen && userData && (
                <div className="absolute right-0 mt-2 z-50">
                  <AccountMenu
                    userInitial={userInitial}
                    userData={userData}
                    setUserBoxOpen={setUserBoxOpen}
                  />
                </div>
              )}

              {/* Bag Menu */}
              {item.id === "4" && (
                <BagMenu 
                  isOpen={bagBoxOpen}
                  onToggle={() => setBagBoxOpen(prev => !prev)}
                />
              )}
            </div>
          ))}
        </div>

      
      </div>
    </header>
  );
};

export default Header;
