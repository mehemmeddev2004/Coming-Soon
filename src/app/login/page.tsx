

"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthPage = () => {
  const router = useRouter(); 
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");

  // ✅ Login funksiyası
  const loginHandler = async () => {
    if (!email || !password) {
      toast.error("Email və şifrə daxil et!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", { email, password });
      toast.success("Giriş uğurlu oldu!");

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      router.push("/");
    } catch (err: any) {
      if (err.response) {
        toast.error(`Xəta: ${err.response.data.message || "Düzgün məlumat daxil et"}`);
      } else {
        toast.error("Serverlə əlaqə alınmadı!");
      }
      console.error("Xəta:", err);
    }
  };

  // ✅ Register funksiyası
  const registerHandler = async () => {
    if (!username || !email || !password) {
      toast.error("Bütün xanalari doldurun!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Düzgün email daxil et!");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Şifrə minimum 6 simvol, bir böyük hərf və rəqəm içerməlidir!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/auth/register", {
        username,
        email,
        password,
      });

      toast.success("Qeydiyyat uğurlu oldu!");

      // Avtomatik login
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      router.push("/");

      setIsRegister(false);
      setEmail("");
      setPassword("");
      setUserName("");
    } catch (err: any) {
      if (err.response) {
        toast.error(`Xəta: ${err.response.data.message || "Düzgün məlumat daxil et"}`);
      } else {
        toast.error("Serverlə əlaqə alınmadı!");
      }
      console.error("Xəta:", err);
    }
  };

  return (
    <div className="flex h-[80vh] items-center justify-center p-4 bg-gray-100">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isRegister ? "Qeydiyyat" : "Giriş"}
          </h2>
          <p className="text-gray-600">
            {isRegister ? "Yeni hesab yaradın" : "Hesabınıza giriş edin"}
          </p>
        </div>

        <div className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Adınızı daxil edin"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="Email daxil edin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Şifrə</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="Şifrənizi daxil edin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="text-[#7e7e7edd] text-[10px] hover:underline"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Artıq hesabınız var? Daxil olun" : "Hesabınız yoxdur? Qeydiyyatdan keçin"}
            </button>
          </div>

          <button
            onClick={isRegister ? registerHandler : loginHandler}
            className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isRegister ? "Qeydiyyat ol" : "Giriş et"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
