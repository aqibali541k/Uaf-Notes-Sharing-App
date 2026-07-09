import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import Logo from "../../assets/logo.webp";

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`text-sm font-medium transition-colors ${
        isActive
          ? "text-indigo-600"
          : "text-gray-600 hover:text-indigo-600"
      }`}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { isAuth, handleLogout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setIsOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={Logo}
              alt="NotesHub"
              className="h-8 sm:h-9 object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <NavLink to="/">Public</NavLink>
            </li>
            <li>
              <button
                onClick={() => navigate("/dashboard/analytics")}
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </button>
            </li>
          </ul>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuth ? (
              <Link to="/auth/login">
                <button className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <LoginOutlined />
                  Login
                </button>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <LogoutOutlined />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-t border-gray-100 overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? "max-h-64" : "max-h-0"
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          <Link
            to="/"
            onClick={close}
            className="block py-2 px-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Public
          </Link>
          <button
            className="w-full text-left py-2 px-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => { navigate("/dashboard/analytics"); close(); }}
          >
            Dashboard
          </button>
          <div className="pt-2 border-t border-gray-100">
            {!isAuth ? (
              <Link to="/auth/login" onClick={close}>
                <button className="w-full mt-2 flex items-center justify-center gap-1.5 text-sm font-medium py-2 px-4 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <LoginOutlined /> Login
                </button>
              </Link>
            ) : (
              <button
                onClick={() => { handleLogout(); close(); }}
                className="w-full mt-2 flex items-center justify-center gap-1.5 text-sm font-medium py-2 px-4 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <LogoutOutlined /> Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
