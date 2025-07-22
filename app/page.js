// app/page.jsx
"use client";

import { useState, useEffect } from "react";
import Cards from "../components/Cards";
import Navbar from "../components/Navbar";
import axios from "axios";

const CatMatch = () => {
  const [userID, setUserID] = useState(null);
  // const userID = localStorage.getItem("userId");
  const [userCats, setUserCats] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [recommendedCats, setRecommendedCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [allCats, setAllCats] = useState([]);
  const [filteredAllCats, setFilteredAllCats] = useState([]);
  const [filters, setFilters] = useState({
    breed: "",
    minAge: "",
    maxAge: "",
    search: "",
  });
  const [showFilter, setShowFilter] = useState(false);

  // Dapatkan kucing milik user
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const userID = localStorage.getItem("userId");
      setUserID(userID);
      try {
        // Dapatkan kucing user
        if (userID) {
          const userCatsRes = await axios.get(
            `${process.env.API_URL}/api/cat/owner/${userID}`
          );

          const userCatsData = userCatsRes.data.cat;
          setUserCats(userCatsData);

          // Otomatis pilih kucing pertama jika ada
          if (userCatsData.length > 0) {
            setSelectedCat(userCatsData[0]._id);
          }
        }

        // Dapatkan semua kucing untuk bagian bawah
        const allCatsRes = await axios.get(`${process.env.API_URL}/api/cat/`);

        setAllCats(allCatsRes.data);
        // setFilteredAllCats(allCatsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userID]);

  // Dapatkan rekomendasi saat kucing dipilih
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (selectedCat) {
        setRecommendLoading(true);
        try {
          const res = await axios.get(
            `${process.env.API_URL}/api/cat/recommended/${selectedCat}`
          );

          setRecommendedCats(res.data);
        } catch (error) {
          console.error("Failed to fetch recommendations:", error);
        } finally {
          setRecommendLoading(false);
        }
      }
    };

    fetchRecommendations();
  }, [selectedCat]);

  // Fungsi untuk memfilter semua kucing
  useEffect(() => {
    const filtered = allCats.filter((cat) => {
      // Filter berdasarkan ras
      if (filters.breed && cat.ras !== filters.breed) return false;

      // Hitung umur kucing
      const age = Math.floor(
        (Date.now() - new Date(cat.tglLahir).getTime()) /
          (1000 * 60 * 60 * 24 * 30)
      );

      // Filter berdasarkan umur
      if (filters.minAge && age < parseInt(filters.minAge)) return false;
      if (filters.maxAge && age > parseInt(filters.maxAge)) return false;

      // Filter berdasarkan pencarian
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !cat.nama.toLowerCase().includes(searchLower) &&
          !cat.ras.toLowerCase().includes(searchLower) &&
          !cat.warna.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    });

    setFilteredAllCats(filtered);
  }, [filters, allCats]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      breed: "",
      minAge: "",
      maxAge: "",
      search: "",
    });
  };

  const catBreeds = [...new Set(allCats.map((cat) => cat.ras))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-pink-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-100">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Temukan Pasangan Sempurna untuk Kucing Anda
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Bergabunglah dengan komunitas pecinta kucing dan temukan pasangan
            yang cocok untuk kucing kesayangan Anda
          </p>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="container mx-auto px-4 py-8">
        {userID ? (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Pilih Kucing Anda
              </h2>

              {userCats.length > 0 ? (
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Kucing Milik Anda
                  </label>
                  <select
                    value={selectedCat || ""}
                    onChange={(e) => setSelectedCat(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {userCats.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.nama} ({cat.ras})
                      </option>
                    ))}
                  </select>

                  {selectedCat && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                      <h3 className="font-bold text-purple-700 mb-2">
                        Kucing yang Dipilih
                      </h3>
                      <p>
                        <span className="font-medium">Nama:</span>{" "}
                        {userCats.find((c) => c._id === selectedCat)?.nama}
                      </p>
                      <p>
                        <span className="font-medium">Ras:</span>{" "}
                        {userCats.find((c) => c._id === selectedCat)?.ras}
                      </p>
                      <p>
                        <span className="font-medium">Jenis Kelamin:</span>{" "}
                        {userCats.find((c) => c._id === selectedCat)
                          ?.jenisKelamin === "jantan"
                          ? "Jantan"
                          : "Betina"}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="mb-4">Anda belum memiliki kucing terdaftar</p>
                  <a
                    href="/profile"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-6 rounded-lg inline-block"
                  >
                    Tambah Kucing
                  </a>
                </div>
              )}
            </div>

            {/* Rekomendasi Pasangan */}
            {selectedCat && userCats.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Rekomendasi Pasangan
                  </h2>
                  <button
                    onClick={() =>
                      document.getElementById("info-modal").showModal()
                    }
                    className="text-purple-600 hover:text-purple-800"
                  >
                    ℹ️ Cara Menghitung Kecocokan
                  </button>
                </div>

                {recommendLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                    <span className="ml-4">Mencari pasangan terbaik...</span>
                  </div>
                ) : recommendedCats.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedCats.map((cat) => (
                      <Cards
                        key={cat._id}
                        cat={{
                          id: cat._id,
                          name: cat.nama,
                          breed: cat.ras,
                          age:
                            cat.age ||
                            Math.floor(
                              (Date.now() - new Date(cat.tglLahir).getTime()) /
                                (1000 * 60 * 60 * 24 * 30)
                            ),
                          color: cat.warna,
                          gender:
                            cat.jenisKelamin === "jantan" ? "Jantan" : "Betina",
                          description: cat.deskripsi,
                          image: cat.foto || "/default-cat.jpg",
                          matchScore: cat.matchScore,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      Belum ada rekomendasi pasangan yang tersedia saat ini.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Selamat Datang di CatMatch
            </h2>
            <p className="text-gray-600 mb-6">
              Untuk mulai mencari pasangan untuk kucing Anda, silakan login atau
              daftar terlebih dahulu.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="/login"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-lg font-medium"
              >
                Login
              </a>
              <a
                href="/register"
                className="bg-white border border-purple-500 text-purple-600 hover:bg-purple-50 py-3 px-8 rounded-lg font-medium"
              >
                Daftar
              </a>
            </div>
          </div>
        )}

        {/* Semua Kucing Tersedia */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Semua Kucing Tersedia
          </h2>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <p className="text-gray-600 mb-4 md:mb-0">
              Jelajahi semua kucing yang tersedia di platform kami
            </p>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center bg-purple-100 text-purple-700 hover:bg-purple-200 font-medium py-2 px-4 rounded-lg"
              >
                <span className="mr-2">🔍</span> Filter
              </button>
              <button
                onClick={resetFilters}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium py-2 px-4 rounded-lg"
              >
                Reset Filter
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-500">
              🔍
            </div>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Cari berdasarkan nama, ras, atau warna..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filter Options */}
          {showFilter && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 p-4 bg-purple-50 rounded-lg">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Ras
                </label>
                <select
                  name="breed"
                  value={filters.breed}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Semua Ras</option>
                  {catBreeds.map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Umur Minimal (bulan)
                </label>
                <input
                  type="number"
                  name="minAge"
                  value={filters.minAge}
                  onChange={handleFilterChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Umur Maksimal (bulan)
                </label>
                <input
                  type="number"
                  name="maxAge"
                  value={filters.maxAge}
                  onChange={handleFilterChange}
                  placeholder="20"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {filteredAllCats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAllCats.map((cat) => (
                <Cards
                  key={cat._id}
                  cat={{
                    id: cat._id,
                    name: cat.nama,
                    breed: cat.ras,
                    age: Math.floor(
                      (Date.now() - new Date(cat.tglLahir).getTime()) /
                        (1000 * 60 * 60 * 24 * 30)
                    ),
                    color: cat.warna,
                    gender: cat.jenisKelamin === "jantan" ? "Jantan" : "Betina",
                    description: cat.deskripsi,
                    image: cat.foto || "/default-cat.jpg",
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Tidak ada kucing yang cocok dengan filter Anda.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Informasi */}
      <dialog id="info-modal" className="modal ">
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="modal-box bg-white max-w-md mx-auto p-6 rounded-lg shadow-xl">
            <h3 className="font-bold text-lg text-purple-700">
              Cara Menghitung Kecocokan
            </h3>
            <p className="py-4">
              Sistem kami menghitung kecocokan pasangan kucing berdasarkan
              beberapa faktor:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">
                <strong>Jenis Kelamin (40%)</strong>: Harus berbeda
                (jantan-betina)
              </li>
              <li className="mb-2">
                <strong>Ras (30%)</strong>: Ras sama memberikan nilai tertinggi,
                ras mirip memberikan nilai sedang
              </li>
              <li className="mb-2">
                <strong>Umur (20%)</strong>: Selisih umur kecil memberikan nilai
                lebih tinggi
              </li>
              <li>
                <strong>Warna (10%)</strong>: Warna sama memberikan nilai
                tambahan
              </li>
            </ul>
            <p className="italic text-gray-600">
              Total skor maksimal adalah 100%. Semakin tinggi skor, semakin
              cocok pasangan tersebut.
            </p>
            <div className="modal-action">
              <form method="dialog">
                <button className="bg-purple-500 text-white py-2 px-4 rounded-lg">
                  Tutup
                </button>
              </form>
            </div>
          </div>
        </div>
      </dialog>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-8">
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} CatMatch. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CatMatch;
