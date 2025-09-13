"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Filter from "./ui/header/Filter";
import Bar from "./ui/header/Bar";
import AccountMenu from "./ui/header/AccountMenu";
import BagMenu from "./ui/header/BagMenu";
import { getCategories } from "@/utils/fetchCategories";

const Header = () => {
  const router = useRouter();
  const [toggleSearch, setToggleSearch] = useState(false);
  const [toggleBar, setToggleBar] = useState(false);
  const [userInitial, setUserInitial] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [userBoxOpen, setUserBoxOpen] = useState(false); // user menu
  const [bagBoxOpen, setBagBoxOpen] = useState(false); // bag menu
  const [userData, setUserData] = useState<{ email: string; username: string } | null>(null);

  // user localStorage
  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        setUserInitial(parsedUser.email?.[0]?.toUpperCase() || "");
      }
    } catch (err) {
      console.error("User parse error:", err);
    }
  }, []);

  // categories fetch
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await getCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
          console.error("Categories is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategoriesData();
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
      setUserBoxOpen(prev => !prev);
      setBagBoxOpen(false);
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

      <div className="max-w-[1325px] mx-auto flex items-center justify-between px-5 h-[50px] relative">
        {/* Logo + Categories */}
        <div className="flex items-center gap-12">
          <h2
            className="font-extrabold cursor-pointer text-3xl uppercase tracking-wide text-gray-900 select-none"
            onClick={() => router.push("/")}
          >
            Etor
          </h2>

          <nav>
            <ul className="flex space-x-6 text-gray-700 max-[991px]:hidden font-medium text-base cursor-pointer select-none">
              {categories.map((item) => (
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

        {/* Right Icons */}
        <div className="flex items-center max-[991px]:hidden gap-[3px] relative">
          {icons.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => handleIconClick(item.id)}
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
              {item.id === "4" && bagBoxOpen && (
                <div className="absolute right-0 mt-2 z-50">
                  <BagMenu />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Bar */}
        <div className="hidden max-[991px]:block">
          <Bar onToggle={() => setToggleBar(prev => !prev)} isOpen={toggleBar} />
        </div>
      </div>
    </header>
  );
};

export default Header;
