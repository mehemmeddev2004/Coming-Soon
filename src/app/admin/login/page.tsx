"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { loginApi } from "@/utils/auth-login";

const AdminPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Login funksiyası
  const loginHandler = async () => {
    if (!email || !password) {
      toast.error("Email və şifrə daxil et!");
      return;
    }

    try {
      const data = await loginApi(email, password);

      // ✅ Rol yoxlaması
      if (!data?.user || data.user.role !== "admin") {
        toast.error(
          data?.user
            ? `Sizin rolunuz: ${data.user.role}. Yalnız admin daxil ola bilər!`
            : "İstifadəçi məlumatı tapılmadı!"
        );
        return;
      }

      // ✅ Token və istifadəçi məlumatını yadda saxla
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Giriş uğurlu oldu!");
      router.push("/admin"); // Admin panelinə yönləndir
    } catch (err: any) {
      toast.error(err.message || "Serverlə əlaqə alınmadı!");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex h-[80vh] items-center justify-center p-4">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Hesabınıza Daxil olun
          </h2>
          <p className="text-gray-600">
            Yalnız admin istifadəçiləri daxil ola bilər
          </p>
        </div>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="Email daxil edin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Şifrə */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifrə
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="Şifrənizi daxil edin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Giriş düyməsi */}
          <button
            onClick={loginHandler}
            className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Giriş et
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
