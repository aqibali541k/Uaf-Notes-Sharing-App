import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import Logo from "../../assets/logo.webp";

const navItems = [
  { to: "/", label: "Public Notes" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/dashboard/analytics", label: "Dashboard" },
];

const NavItem = ({ to, children, onClick }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-brand-50 text-brand-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { isAuth, handleLogout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center" aria-label="UAF Notes Sharing App home">
            <img
              src={Logo}
              alt="UAF Notes Sharing App logo"
              width={256}
              height={256}
              className="h-9 w-9 object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavItem to={item.to}>{item.label}</NavItem>
              </li>
            ))}
          </ul>

          {/* Auth actions */}
          <div className="hidden items-center gap-2 md:flex">
            {!isAuth ? (
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                <LoginOutlined />
                Login
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <LogoutOutlined />
                Logout
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-navigation"
        inert={!isOpen}
        className={`overflow-hidden border-t border-slate-100 transition-all duration-200 ease-in-out md:hidden ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="space-y-1 px-4 py-3">
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} onClick={close}>
              <span className="block py-1">{item.label}</span>
            </NavItem>
          ))}

          <div className="mt-2 border-t border-slate-100 pt-2">
            {!isAuth ? (
              <Link
                to="/auth/login"
                onClick={close}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                <LoginOutlined /> Login
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  close();
                }}
                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
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
