import {
  FacebookFilled,
  InstagramOutlined,
  WhatsAppOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import React from "react";
import { useAuthContext } from "../../context/AuthContext";

const Copyright = () => {
  const { user } = useAuthContext();
  const year = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <FacebookFilled />,
      url: "https://facebook.com/AqibShabbir",
      color: "hover:text-blue-400",
    },
    {
      icon: <InstagramOutlined />,
      url: "https://instagram.com/aqibshabbir876",
      color: "hover:text-pink-400",
    },
    {
      icon: <WhatsAppOutlined />,
      url: "https://wa.me/923078244507",
      color: "hover:text-green-400",
    },
    {
      icon: <LinkedinOutlined />,
      url: "https://linkedin.com/in/AqibShabbir",
      color: "hover:text-blue-500",
    },
  ];

  return (
    <footer className=" bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg backdrop-blur-md w-full">
      <div className="  max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* About / Contact */}
        <div className="text-center md:text-left">
          <h3 className="font-semibold text-lg mb-1">Notes App</h3>
          <p className="text-sm text-gray-100/90 mb-2">
            Securely create & manage your notes with a sleek UI.
          </p>
          {user?.email && (
            <p className="text-sm">
              Email: <span className="font-medium">{user.email}</span>
            </p>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 text-2xl">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${link.color} transition-colors duration-300 transform hover:scale-110`}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-white/20 text-center py-3 text-sm text-gray-200">
        © {year} Notes App. Developed by Aqib Shabbir
      </div>
    </footer>
  );
};

export default Copyright;
