"use client";

import Link from "next/link";
import { FaCat, FaCheckCircle, FaHome, FaUser } from "react-icons/fa";

export default function RegisterSuccessPage() {
  const imgUrl = localStorage.getItem("imgUrl");
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 to-purple-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-center text-white">
          <FaCheckCircle className="text-6xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Pendaftaran Berhasil!</h1>
          <p className="mt-2">Akun Anda telah berhasil dibuat</p>
        </div>

        <div className="p-8 text-center">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt="Foto Kucing"
              className="w-32 h-32 object-cover rounded-full mx-auto mb-6 border-4 border-purple-200"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto flex items-center justify-center mb-6">
              <FaCat className="text-5xl text-gray-400" />
            </div>
          )}

          <p className="text-gray-600 mb-8">
            Selamat datang di CatMatch! Sekarang Anda dapat mulai mencari
            pasangan untuk kucing kesayangan Anda.
          </p>

          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              <FaHome className="mr-2" />
              Ke Beranda
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg border border-purple-200"
            >
              <FaUser className="mr-2" />
              Login Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
