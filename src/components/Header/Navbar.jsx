import React, { useState } from "react";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import Logo from "../../assets/logo.webp";

const Navbar = () => {
  const { isAuth, handleLogout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={Logo}
              alt="Logo"
              className="h-10 sm:h-12 md:h-14 object-contain rounded-lg"
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-8 text-lg font-medium">
            <li>
              <Link
                to="/"
                className="relative group cursor-pointer hover:text-yellow-300 transition-colors"
              >
                Public
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li
              className="relative group cursor-pointer hover:text-yellow-300 transition-colors"
              onClick={() => navigate("/dashboard/analytics")}
            >
              Dashboard
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </li>
          </ul>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuth ? (
              <Link to="/auth/login">
                <Button className="text-white! bg-green-600! border-none! rounded-2xl! hover:bg-green-500 transition-all">
                  <LoginOutlined />
                  <span className="ml-1">Login</span>
                </Button>
              </Link>
            ) : (
              <Button
                className="text-white! bg-red-600! border-none! rounded-2xl! hover:bg-red-500 transition-all"
                onClick={handleLogout}
              >
                <LogoutOutlined />
                <span className="ml-1">Logout</span>
              </Button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white! text-2xl! focus:outline-none!"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <FontAwesomeIcon icon={faTimes} />
            ) : (
              <FontAwesomeIcon icon={faBars} />
            )}
          </button>
        </div>

        {/* Mobile Menu with Smooth Slide */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 mt-4" : "max-h-0"
          }`}
        >
          <Link
            to="/"
            className="block text-white! text-lg! font-medium! py-2! px-4! rounded-lg! hover:bg-white/20 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Public
          </Link>

          <div
            className="block text-white! text-lg! font-medium! py-2! px-4! rounded-lg! hover:bg-white/20 transition-colors cursor-pointer"
            onClick={() => {
              navigate("/dashboard/analytics");
              setIsOpen(false);
            }}
          >
            Dashboard
          </div>

          {!isAuth ? (
            <Link to="/auth/login">
              <Button className="w-full mt-2 text-white! bg-green-600! border-none! rounded-2xl! hover:bg-green-500! transition-all!">
                Login
              </Button>
            </Link>
          ) : (
            <Button
              className="w-full text-white! mb-4! bg-red-600! border-none! rounded-2xl! hover:bg-red-500! transition-all!"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
