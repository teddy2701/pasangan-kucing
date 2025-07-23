// components/AddCatModal.jsx
import { useState, useRef } from "react";
import {
  FaCat,
  FaVenusMars,
  FaCalendar,
  FaPalette,
  FaImage,
  FaTrash,
  FaInfoCircle,
  FaTimes,
  FaSave,
} from "react-icons/fa";

const AddCatModal = ({ isOpen, onClose, onAddCat }) => {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    gender: "",
    birthDate: "",
    color: "",
    description: "",
  });
  const [catPhoto, setCatPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setError("File harus berupa gambar (JPG, PNG, atau GIF)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran file maksimal 2MB");
      return;
    }

    setCatPhoto(file);
    setError("");

    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const handleRemovePhoto = () => {
    setCatPhoto(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi
    if (
      !formData.name ||
      !formData.gender ||
      !formData.birthDate ||
      !formData.color
    ) {
      setError("Harap isi semua data yang diperlukan");
      return;
    }

    if (!catPhoto) {
      setError("Harap unggah foto kucing");
      return;
    }

    // Buat objek kucing baru
    const newCat = {
      id: Date.now(), // ID unik sementara
      ...formData,
      age: calculateAge(formData.birthDate),
      image: catPhoto,
    };

    // Panggil callback untuk menambahkan kucing
    onAddCat(newCat);

    // Reset form
    setFormData({
      name: "",
      breed: "",
      gender: "",
      birthDate: "",
      color: "",
      description: "",
    });
    handleRemovePhoto();
    onClose();
  };

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const months =
      (today.getFullYear() - birth.getFullYear()) * 12 +
      (today.getMonth() - birth.getMonth());
    return Math.max(1, months);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-purple-700">
              Tambah Kucing Baru
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                    name="name"
                    value={formData.name}
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
                    name="breed"
                    value={formData.breed}
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
                    name="gender"
                    value={formData.gender}
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
                    name="birthDate"
                    value={formData.birthDate}
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
                    name="color"
                    value={formData.color}
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
                  name="description"
                  value={formData.description}
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

            <div className="flex justify-end items-center gap-3 mt-6">
              {error && (
                <div className="bg-red-100 text-red-700 rounded-lg text-sm py-2 px-6">
                  {error}
                </div>
              )}{" "}
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-lg flex items-center"
              >
                <FaSave className="mr-2" /> Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCatModal;
