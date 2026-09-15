import {
  FacebookFilled,
  InstagramOutlined,
  WhatsAppOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const Copyright = () => {
  const { user } = useAuthContext();
  const year = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Facebook",
      icon: <FacebookFilled />,
      url: "https://facebook.com/AqibShabbir",
    },
    {
      name: "Instagram",
      icon: <InstagramOutlined />,
      url: "https://instagram.com/aqibshabbir876",
    },
    {
      name: "WhatsApp",
      icon: <WhatsAppOutlined />,
      url: "https://wa.me/923078244507",
    },
    {
      name: "LinkedIn",
      icon: <LinkedinOutlined />,
      url: "https://www.linkedin.com/in/aqib-shabbir-62a16a345",
    },
  ];

  const pageLinks = [
    { to: "/", label: "Public notes" },
    { to: "/about", label: "About the app" },
    { to: "/faq", label: "Frequently asked questions" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h2 className="text-base font-semibold text-white">
            UAF Notes Sharing App
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed">
            A free notes sharing platform where University of Agriculture
            Faisalabad students create, organise and download course notes.
          </p>
          {user?.email && (
            <p className="mt-3 text-sm">
              Signed in as{" "}
              <span className="font-medium text-slate-200">{user.email}</span>
            </p>
          )}
        </div>

        {/* Pages */}
        <nav aria-label="Footer pages">
          <h2 className="text-sm font-semibold text-white">Pages</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {pageLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <nav aria-label="Social media">
          <h2 className="text-sm font-semibold text-white">Contact</h2>
          <ul className="mt-3 flex gap-2">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.name} (opens in a new tab)`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-brand-600 hover:bg-brand-600 hover:text-white"
                >
                  <span aria-hidden="true" className="text-base">
                    {link.icon}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed">
            Independent student project, not an official University of
            Agriculture Faisalabad website.
          </p>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 px-6 py-4 text-xs sm:flex-row">
          <p>© {year} UAF Notes Sharing App</p>
          <p>Developed by Aqib Shabbir</p>
        </div>
      </div>
    </footer>
  );
};

export default Copyright;
