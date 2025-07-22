"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaCat,
  FaUser,
  FaLock,
  FaPaw,
  FaVenusMars,
  FaCalendar,
  FaPalette,
  FaPhone,
  FaHome,
  FaImage,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";
import axios from "axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    // Data Akun
    username: "",
    password: "",

    // Data Kucing
    catName: "",
    catGender: "",
    catBirthDate: "",
    catColor: "",
    catDescription: "", // Tambahkan deskripsi kucing
    catBreed: "", // Tambahkan ras kucing

    // Data Pemilik
    ownerName: "",
    phoneNumber: "",
    address: "",
  });

  const [catPhoto, setCatPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi untuk menangani unggah foto
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.match("image.*")) {
      setError("File harus berupa gambar (JPG, PNG, atau GIF)");
      return;
    }

    // Validasi ukuran file (maksimal 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran file maksimal 2MB");
      return;
    }

    setCatPhoto(file);
    setError("");

    // Buat URL untuk preview
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  // Fungsi untuk menghapus foto yang dipilih
  const handleRemovePhoto = () => {
    setCatPhoto(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const nextStep = () => {
    // Validasi step 1
    if (currentStep === 1 && (!formData.username || !formData.password)) {
      setError("Harap isi username dan password");
      return;
    }

    // Validasi step 2
    if (currentStep === 2) {
      if (
        !formData.catName ||
        !formData.catGender ||
        !formData.catBirthDate ||
        !formData.catColor
      ) {
        setError("Harap isi semua data kucing");
        return;
      }

      // Validasi foto kucing
      if (!catPhoto) {
        setError("Harap unggah foto kucing");
        return;
      }
    }

    setError("");
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError("");
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi step 3
    if (!formData.ownerName || !formData.phoneNumber || !formData.address) {
      setError("Harap isi semua data pemilik");
      return;
    }
    try {
      const dataSubmit = new FormData();
      // Tambahkan data akun
      dataSubmit.append("username", formData.username);
      dataSubmit.append("password", formData.password);
      dataSubmit.append("ownerName", formData.ownerName);
      dataSubmit.append("phoneNumber", formData.phoneNumber);
      dataSubmit.append("address", formData.address);
      // Tambahkan data kucing
      dataSubmit.append("catName", formData.catName);
      dataSubmit.append("catGender", formData.catGender);
      dataSubmit.append("catBirthDate", formData.catBirthDate);
      dataSubmit.append("catColor", formData.catColor);
      dataSubmit.append("catDescription", formData.catDescription);
      dataSubmit.append("catBreed", formData.catBreed);
      // Tambahkan foto kucing
      if (catPhoto) {
        dataSubmit.append("catPhoto", catPhoto);
      }
      const response = await axios.post(
        `${process.env.API_URL}/api/users/add`,
        dataSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        //simpan username dan gambar kucing ke localStorage
        localStorage.setItem("imgUrl", response.data.gambar);
        router.push("/register/success");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError(
        error.response?.data?.message ||
          "Terjadi kesalahan, silakan coba lagi nanti."
      );
    }
  };

  // Daftar ras kucing
  const catBreeds = [
    "Persian",
    "Siamese",
    "Maine Coon",
    "Ragdoll",
    "Bengal",
    "Sphynx",
    "British Shorthair",
    "Scottish Fold",
    "Abyssinian",
    "Burmese",
    "Lainnya",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 to-purple-100">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-center">
          <div className="flex justify-center mb-4">
            <FaCat className="text-white text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-white">Daftar CatMatch</h1>
          <p className="text-purple-100 mt-2">
            Buat akun untuk menemukan pasangan kucing
          </p>

          {/* Progress Bar */}
          <div className="mt-6 mb-4">
            <div className="flex justify-between mx-4 mb-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= step
                      ? "bg-white text-purple-600"
                      : "bg-purple-300 text-white"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="bg-purple-300 h-2 rounded-full mx-4">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep - 1) * 50}%` }}
              ></div>
            </div>
            <div className="flex justify-between mx-4 mt-1 text-xs text-purple-100 font-medium">
              <span>Akun</span>
              <span>Kucing</span>
              <span>Pemilik</span>
            </div>
          </div>
        </div>

        {/* Form Register */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-start">
              <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Data Akun */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
                <FaUser className="mr-2" /> Informasi Akun
              </h2>

              <div>
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
                    placeholder="Buat username"
                  />
                </div>
              </div>

              <div>
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
                    placeholder="Buat password (minimal 8 karakter)"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 flex items-center"
                >
                  Lanjut <FaPaw className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Data Kucing */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
                <FaCat className="mr-2" /> Data Kucing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Nama Kucing
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-500">
                      <FaCat />
                    </span>
                    <input
                      type="text"
                      name="catName"
                      value={formData.catName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Nama kucing kamu"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Ras Kucing
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-500">
                      <FaCat />
                    </span>
                    <select
                      name="catBreed"
                      value={formData.catBreed}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                    >
                      <option value="">Pilih ras kucing</option>
                      {catBreeds.map((breed) => (
                        <option key={breed} value={breed}>
                          {breed}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Jenis Kelamin
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-500">
                      <FaVenusMars />
                    </span>
                    <select
                      name="catGender"
                      value={formData.catGender}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="jantan">Jantan</option>
                      <option value="betina">Betina</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Tanggal Lahir
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-500">
                      <FaCalendar />
                    </span>
                    <input
                      type="date"
                      name="catBirthDate"
                      value={formData.catBirthDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Warna
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-500">
                      <FaPalette />
                    </span>
                    <input
                      type="text"
                      name="catColor"
                      value={formData.catColor}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Warna kucing"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Deskripsi Kucing
                  </label>
                  <textarea
                    name="catDescription"
                    value={formData.catDescription}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ceritakan tentang kepribadian, kebiasaan, dan hal lain tentang kucing kamu..."
                    rows="3"
                  ></textarea>
                </div>
              </div>

              {/* Unggah Foto Kucing */}
              <div className="mt-4">
                <label className="block text-gray-700 mb-2 font-medium">
                  Foto Kucing
                </label>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Area Unggah */}
                  <div
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-purple-50 transition-colors w-full md:w-1/2"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview foto kucing"
                          className="max-h-48 rounded-lg mb-4"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto();
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <FaImage className="text-4xl text-purple-500 mb-3" />
                        <p className="text-gray-600 text-center">
                          Klik untuk mengunggah foto kucing
                          <br />
                          <span className="text-sm text-gray-500">
                            Format: JPG, PNG (maks. 2MB)
                          </span>
                        </p>
                      </>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  {/* Panduan Foto */}
                  <div className="bg-purple-50 rounded-lg p-4 w-full md:w-1/2">
                    <h3 className="font-bold text-purple-700 mb-2 flex items-center">
                      <FaInfoCircle className="mr-2" />
                      Panduan Foto Kucing
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Foto harus jelas dan terlihat wajah kucing</li>
                      <li>• Pastikan pencahayaan cukup</li>
                      <li>• Hindari foto yang buram atau gelap</li>
                      <li>• Foto harus memperlihatkan kucing secara utuh</li>
                      <li>• Tidak mengandung konten yang tidak pantas</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-300"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 flex items-center"
                >
                  Lanjut <FaPaw className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Data Pemilik */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
                <FaUser className="mr-2" /> Data Pemilik
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Nama Pemilik
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-500">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Nama lengkap pemilik"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Nomor Telepon (whatsapp)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-500">
                      <FaPhone />
                    </span>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Nomor telepon yang aktif"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Alamat
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pt-3 text-purple-500">
                      <FaHome />
                    </span>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Alamat lengkap"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Preview Data Kucing */}
              <div className="mt-6 bg-purple-50 rounded-xl p-4 border border-purple-200">
                <h3 className="font-bold text-purple-700 mb-3">
                  Preview Data Kucing
                </h3>

                <div className="flex flex-col md:flex-row gap-4">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Foto kucing"
                      className="w-full md:w-1/3 h-48 object-cover rounded-lg border border-purple-300"
                    />
                  ) : (
                    <div className="w-full md:w-1/3 h-48 bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
                      <FaCat className="text-4xl text-gray-400" />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-gray-500 text-sm">Nama</p>
                        <p className="font-medium">{formData.catName || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Ras</p>
                        <p className="font-medium">
                          {formData.catBreed || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Jenis Kelamin</p>
                        <p className="font-medium">
                          {formData.catGender || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Warna</p>
                        <p className="font-medium">
                          {formData.catColor || "-"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm">Deskripsi</p>
                      <p className="font-medium">
                        {formData.catDescription || "Tidak ada deskripsi"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-300"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 flex items-center"
                >
                  Daftar <FaPaw className="ml-2" />
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-gray-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-purple-600 font-medium hover:underline"
            >
              Login disini
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
