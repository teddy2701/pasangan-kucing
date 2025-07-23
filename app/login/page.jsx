"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCat, FaUser, FaLock, FaPaw } from "react-icons/fa";
import axios from "axios";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi sederhana
    if (!formData.username || !formData.password) {
      setError("Harap isi semua field");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.API_URL}/api/auth/login`,
        formData
      );
      if (response.status === 200) {
        console.log("Login successful:", response.data.user);
        // Simpan username dan gambar kucing ke localStorage
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("nama", response.data.user.name);
        localStorage.setItem("alamat", response.data.user.alamat);
        localStorage.setItem("noTelp", response.data.user.noTelp);
        router.push("/"); // Arahkan ke dashboard setelah login
      }
    } catch (error) {
      setError(error.response?.data.message || "");
      console.error("Login error:", error.response?.data || "");
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-pink-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-center">
          <div className="flex justify-center mb-4">
            <FaCat className="text-white text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-white">CatMatch</h1>
          <p className="text-purple-100 mt-2">
            Temukan pasangan untuk kucing kesayanganmu
          </p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-500">
                <FaUser />
              </span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-500">
                <FaLock />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Masukkan password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
          >
            <FaPaw className="mr-2" /> Login
          </button>

          <div className="mt-6 text-center text-gray-600">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-purple-600 font-medium hover:underline"
            >
              Daftar sekarang
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
