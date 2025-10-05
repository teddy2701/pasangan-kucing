"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Link from "next/link";
import {
  FaCat,
  FaVenusMars,
  FaPalette,
  FaHome,
  FaArrowLeft,
} from "react-icons/fa";
import axios from "axios";

const CatDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [cat, setCat] = useState(null);
  const [prediksiAnak, setPrediksiAnak] = useState(null);
  const [errorPrediksi, setErrorPrediksi] = useState(null); // state khusus error prediksi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatData = async () => {
      setLoading(true);
      try {
        // ambil detail kucing
        const response = await axios.get(
          `${process.env.API_URL}/api/cat/${id}`
        );
        const catData = response.data.cat;
        setCat(catData);

        // ambil id kucing yang dipilih sebelumnya dari localStorage
        const kucing1 = localStorage.getItem("selectedCat");
        const kucing2 = id;

        if (kucing1 && kucing2) {
          try {
            const prediksiRes = await axios.post(
              `${process.env.API_URL}/api/cat/prediksi`,
              { kucing1Id: kucing1, kucing2Id: kucing2 }
            );
            setPrediksiAnak(prediksiRes.data.data);
            setErrorPrediksi(null); // reset error jika sukses
          } catch (err) {
            console.error("Error prediksi:", err.response?.data);
            setErrorPrediksi(
              err.response?.data?.message || "Gagal melakukan prediksi"
            );
            setPrediksiAnak(null);
          }
        }
      } catch (error) {
        console.error("Error fetching cat data:", error);
        setError("Kucing tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };
    fetchCatData();
  }, [id]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    if (phone.startsWith("0")) {
      return "+62" + phone.slice(1);
    }
    if (phone.startsWith("+62")) {
      return phone;
    }
    return phone;
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
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {cat?.name}
              </h1>

              <div className="flex items-center mb-4">
                <span className="bg-purple-100 text-purple-800 text-lg font-medium px-4 py-1 rounded mr-4">
                  {cat?.age} bulan
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
                  <FaHome className="text-purple-500 mr-3 text-xl" />
                  <div>
                    <h3 className="text-gray-500 text-sm">Alamat</h3>
                    <p className="text-gray-800 font-medium">
                      {cat?.ownerAddress}
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

              {/* Prediksi Anak atau Error */}
              {errorPrediksi && (
                <div className="mb-8 p-4 border border-red-300 rounded-lg bg-red-50">
                  <h3 className="text-xl font-bold text-red-700 mb-2">
                    Prediksi Gagal
                  </h3>
                  <p className="text-gray-800">{errorPrediksi}</p>
                </div>
              )}

              {prediksiAnak && (
                <div className="mb-8 p-4 border border-purple-300 rounded-lg bg-purple-50">
                  <h3 className="text-xl font-bold text-purple-700 mb-3">
                    Prediksi Anak
                  </h3>
                  <p className="text-gray-800">
                    <span className="font-semibold">Induk Jantan:</span>{" "}
                    {prediksiAnak.indukJantan}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-semibold">Induk Betina:</span>{" "}
                    {prediksiAnak.indukBetina}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-semibold">Ras Anak:</span>{" "}
                    {prediksiAnak.rasAnak}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-semibold">Warna Anak:</span>{" "}
                    {prediksiAnak.warnaAnak}
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <Link
                  href={`https://wa.me/${formatPhoneNumber(cat?.ownerPhone)}`}
                  className="flex-1 bg-white border border-purple-500 text-purple-600 hover:bg-purple-50 font-bold py-3 px-6 rounded-lg"
                  target="_blank"
                >
                  <span className="flex items-center justify-center">
                    Hubungi Pemilik
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatDetailPage;
