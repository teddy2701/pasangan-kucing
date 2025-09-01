"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Link from "next/link";

import {
  FaCat,
  FaVenusMars,
  FaCalendar,
  FaPalette,
  FaHeart,
  FaArrowLeft,
} from "react-icons/fa";
import axios from "axios";

const CatDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [cat, setCat] = useState(null);
  const [deteksi, setDeteksi] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulasi pengambilan data dari API
    // Di sini Anda bisa menggunakan fetch atau axios untuk mendapatkan data kucing berdasarkan I
    const fetchCatData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.API_URL}/api/cat/${id}`
        );

        const catData = response.data.cat;
        setCat(catData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching cat data:", error);
        setError("Kucing tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };
    fetchCatData();
  }, [id]);

  const addPasangan = async () => {
    const kucing1 = localStorage.getItem("selectedCat");
    const kucing2 = id;

    if (kucing1 === kucing2) {
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.API_URL}/api/cat/perjodohan/add`,
        {
          kucing1Id: kucing1,
          kucing2Id: kucing2,
        }
      );
      if (response.status === 200) {
        console.log("Berhasil menambahkan pasangan:", response.data);
        setDeteksi(true);
      }
    } catch (error) {
      console.error("Error adding pasangan:", error);
    }
  };

  if (loading || !cat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-pink-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-pink-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded-lg"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-6 cursor-pointer"
        >
          <FaArrowLeft className="mr-2" /> Kembali
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="h-96 overflow-hidden">
                {cat?.image ? (
                  <img
                    src={cat?.image}
                    alt={cat?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                    <FaCat className="text-6xl text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="md:w-1/2 p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                  {cat?.name}
                </h1>
              </div>

              <div className="flex items-center mb-4">
                <span className="bg-purple-100 text-purple-800 text-lg font-medium px-4 py-1 rounded mr-4">
                  {cat?.age} tahun
                </span>
                <span
                  className={`px-4 py-1 rounded-full text-lg font-medium ${
                    cat.gender === "Jantan"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-pink-100 text-pink-800"
                  }`}
                >
                  {cat?.gender}
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <FaCat className="text-purple-500 mr-3 text-xl" />
                  <div>
                    <h3 className="text-gray-500 text-sm">Ras</h3>
                    <p className="text-gray-800 font-medium">{cat?.breed}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaPalette className="text-purple-500 mr-3 text-xl" />
                  <div>
                    <h3 className="text-gray-500 text-sm">Warna</h3>
                    <div className="flex items-center">
                      <span
                        className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                        style={{ backgroundColor: cat?.color?.toLowerCase() }}
                      ></span>
                      <p className="text-gray-800 font-medium">{cat?.color}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaVenusMars className="text-purple-500 mr-3 text-xl" />
                  <div>
                    <h3 className="text-gray-500 text-sm">Jenis Kelamin</h3>
                    <p className="text-gray-800 font-medium">{cat?.gender}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaCalendar className="text-purple-500 mr-3 text-xl" />
                  <div>
                    <h3 className="text-gray-500 text-sm">Tanggal Lahir</h3>
                    <p className="text-gray-800 font-medium">
                      {cat?.birthDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Deskripsi
                </h3>
                <p className="text-gray-600">{cat?.description}</p>
              </div>

              <div className="flex gap-4">
                {!deteksi && (
                  <Link
                    href={`https://wa.me/${cat?.ownerPhone}`}
                    className="flex-1 bg-white border border-purple-500 text-purple-600 hover:bg-purple-50 font-bold py-3 px-6 rounded-lg"
                    target="_blank"
                    onClick={addPasangan}
                  >
                    <span className="flex items-center justify-center">
                      Hubungi Pemilik
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatDetailPage;
