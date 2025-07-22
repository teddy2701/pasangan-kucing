// app/profile/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaPhone,
  FaHome,
  FaCat,
  FaPlus,
  FaPaw,
  FaHeart,
  FaArrowLeft,
} from "react-icons/fa";
import Cards from "@/components/Cards";
import AddCatModal from "@/components/AddCatModal";
import axios from "axios";
import { set } from "mongoose";

const ProfilePage = () => {
  const [ownerData, setOwnerData] = useState({});
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const catOwner = async () => {
      setLoading(true);
      const dataUser = {
        id: localStorage.getItem("userId"),
        username: localStorage.getItem("username"),
        name: localStorage.getItem("nama"),
        address: localStorage.getItem("alamat"),
        phone: localStorage.getItem("noTelp"),
      };

      setOwnerData(dataUser);

      const response = await axios.get(
        `${process.env.API_URL}/api/cat/owner/${dataUser.id}`
      );
      setCats(response.data.cat);
      setLoading(false);
    };
    catOwner();
  }, []);

  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const router = useRouter();

  const handleAddCat = async (newCat) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", newCat.name);
      formData.append("gender", newCat.gender);
      formData.append("breed", newCat.breed);
      formData.append("color", newCat.color);
      formData.append("description", newCat.description);
      formData.append("birthDate", newCat.birthDate); // jika ada
      formData.append("ownerId", localStorage.getItem("userId"));

      if (newCat.image) {
        formData.append("catPhoto", newCat.image); // pastikan ini bertipe `File`
      }
      const response = await axios.post(
        `${process.env.API_URL}/api/cat/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        // Tambahkan kucing baru ke daftar kucing
        setCats((prevCats) => [...prevCats, response.data.cat]);
        setShowAddCatModal(false);
      }
      // setShowAddCatModal(false);
    } catch (error) {
      console.error("Error adding cat:", error);
      setError("Gagal menambahkan kucing. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Profil */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-center text-white relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => router.push("/")}
                className="bg-white cursor-pointer bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full"
              >
                <FaArrowLeft className="text-black" />
              </button>
            </div>

            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold">Profil Pemilik</h1>
              <p className="mt-1 text-purple-200">{ownerData.name}</p>
            </div>
          </div>

          {/* Bagian Data Pemilik */}
          <div className="p-8 border-b">
            <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center">
              <FaUser className="mr-2" /> Data Pemilik
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Nama Lengkap
                </label>
                <p className="py-3 px-4 bg-gray-50 rounded-lg">
                  {ownerData.name}
                </p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Nomor Telepon
                </label>
                <p className="py-3 px-4 bg-gray-50 rounded-lg">
                  {ownerData.phone}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2 font-medium">
                  Alamat
                </label>
                <p className="py-3 px-4 bg-gray-50 rounded-lg whitespace-pre-line">
                  {ownerData.address}
                </p>
              </div>
            </div>
          </div>

          {/* Bagian Kucing */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-700 flex items-center">
                <FaCat className="mr-2" /> Kucing Saya
              </h2>
              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <button
                onClick={() => setShowAddCatModal(true)}
                className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                <FaPlus className="mr-2" /> Tambah Kucing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cats.map((cat) => (
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
                  // showMatch={false}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg"
            onClick={() => router.push("/")}
          >
            <FaPaw className="inline mr-2" /> Cari Pasangan Kucing
          </button>
        </div>
      </div>

      {/* Modal Tambah Kucing */}
      <AddCatModal
        isOpen={showAddCatModal}
        onClose={() => setShowAddCatModal(false)}
        onAddCat={handleAddCat}
      />
    </div>
  );
};

export default ProfilePage;
