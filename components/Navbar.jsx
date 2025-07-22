import React from "react";
import {
  FaCat,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

import Link from "next/link";

const Navbar = () => {
  const router = useRouter();
  const cekLogin = localStorage.getItem("username");

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("imgUrl");
    router.push("/");
    window.location.reload();
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <FaCat className="text-white text-2xl mr-2" />
            <span className="text-white text-xl font-bold">CatMatch</span>
          </div>

          <div className="flex space-x-4">
            {!cekLogin ? (
              <>
                <Link
                  href="/login"
                  className="text-white hover:text-gray-200 flex items-center"
                >
                  <FaSignInAlt className="mr-1" />
                  <span>Login</span>
                </Link>

                <Link
                  href="/register"
                  className="bg-white text-purple-600 hover:bg-purple-100 font-medium py-2 px-4 rounded-lg flex items-center"
                >
                  <FaUserPlus className="mr-1" />
                  <span>Daftar</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="text-white hover:text-gray-200 flex items-center"
                >
                  <FaUser className="mr-1" />
                  <span>Profile </span>
                </Link>

                <button
                  onClick={logout}
                  className="text-white hover:text-gray-200 flex items-center cursor-pointer  "
                >
                  <FaSignOutAlt className="mr-1" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
