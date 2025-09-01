import Link from "next/link";
import axios from "axios";
import { useState } from "react";

const Cards = ({
  cat: initialCat,
  textSize = "text-base",
  pasangan,
  selectedCat,
}) => {
  const cekPasangan = pasangan ? pasangan : false;
  const catIdOwner = selectedCat ? selectedCat : null;
  const [cat, setCat] = useState(initialCat); // state lokal

  const handleSimpanKonfirmasi = async (status) => {
    try {
      await axios.post(`${process.env.API_URL}/api/cat/perjodohan/update`, {
        kucing1: catIdOwner,
        kucing2: cat.id,
        status: status,
      });
      // update state lokal setelah sukses
      setCat((prev) => ({ ...prev, status: status ? "berhasil" : "gagal" }));

      window.alert("Stasus berhasil Di Update");
    } catch (error) {
      console.error("Error menyimpan konfirmasi:", error);
    }
  };

  return (
    <div className="bg-white h-full flex flex-col rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        <div className="h-32 overflow-hidden">
          {cat.image ? (
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
              <div className="text-4xl text-gray-400">🐱</div>
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              cat.gender === "Jantan"
                ? "bg-blue-100 text-blue-800"
                : "bg-pink-100 text-pink-800"
            }`}
          >
            {cat.gender}
          </div>
        </div>
      </div>

      <div className="p-4 flex-grow">
        {cat.matchScore !== undefined && (
          <div className="mb-3 bg-purple-50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-purple-700">Kecocokan:</span>
              <span className="font-bold text-purple-700">
                {cat.matchScore}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${cat.matchScore}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-bold text-gray-800 ${textSize} md:text-lg`}>
            {cat.name}
          </h3>
          <span
            className={`bg-purple-100 text-purple-800 ${textSize} font-medium px-2 py-1 rounded`}
          >
            {cat.age} bulan
          </span>
        </div>

        <div className={`flex items-center text-gray-600 mb-2 ${textSize}`}>
          <span className="mr-3">{cat.breed}</span>
          <span className="flex items-center">
            <span
              className="w-3 h-3 rounded-full mr-1 border border-gray-300"
              style={{ backgroundColor: cat.color.toLowerCase() }}
            ></span>
            {cat.color}
          </span>
        </div>

        {!cekPasangan && (
          <p className={`text-gray-600 mb-4 line-clamp-2 ${textSize}`}>
            {cat.description}
          </p>
        )}

        {cekPasangan && (
          <p className={`text-gray-600 mb-4 line-clamp-2 ${textSize}`}>
            Status Perjodohan:{" "}
            {cat.status === "pending"
              ? "Menunggu Konfirmasi"
              : cat.status === "berhasil"
              ? "Berhasil"
              : "Gagal"}
          </p>
        )}

        <div className="flex justify-start items-center ">
          {cekPasangan && cat.status == "pending" ? (
            <div className="flex justify-between items-center border-t pt-4 w-full gap-2">
              <button
                className="bg-red-300  font-medium py-2 px-4 rounded-lg  cursor-pointer"
                onClick={() => handleSimpanKonfirmasi(false)}
              >
                Gagal
              </button>
              <button
                className="bg-green-300 font-medium py-2 px-4 rounded-lg  cursor-pointer"
                onClick={() => handleSimpanKonfirmasi(true)}
              >
                Berhasil
              </button>
            </div>
          ) : (
            <Link
              href={`/cats/${cat.id}`}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg"
            >
              Lihat Detail
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cards;
