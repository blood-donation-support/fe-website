import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaBell, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/authStore";
import UserDropdown from "../UserDropdown";
type HeaderComponentProps = {
  isHomepage?: boolean;
};
const HeaderComponent = ({ isHomepage = false }: HeaderComponentProps) => {
  const [offset, setOffset] = useState(0);
  const [blurActivation, setBlurActivation] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    logout();
    toast.success("Đăng xuất thành công!");
  };

  useEffect(() => {
    const onScroll = () => {
      setOffset(window.pageYOffset);
      setBlurActivation(window.pageYOffset > 5);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const headerClass = isHomepage
    ? "absolute bg-white/0 "
    : "fixed bg-white";
    const locationClass = isHomepage
    ? "bg-white":"bg-blue-50";
  return (
    <motion.header
      initial={{ opacity: 0, y: -32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.2,
        ease: [0, 0.05, 0.05, 0.1],
        delay: 0.08,
      }}
      className={`w-full px-4 pb-4 pt-2 flex items-center justify-between ${headerClass} transition  top-0 left-0 z-30`}
    >
      <div className="flex items-center gap-20">
        <Link to={'/'} className="flex items-center gap-2">
          <img src="src/assets/logo.png" alt="Donate Blood" className="w-8 h-8 rounded-full" />
          <span className="font-bold text-2xl text-blue-600">Donate Blood</span>
        </Link>
        <button className="md:hidden p-2 rounded-full hover:bg-gray-200">
          <FaBars size={20} />
        </button>
        <nav className="hidden md:flex items-center gap-3 ml-4">
          {[{context:"Chúng tôi",nav:"/"},{context:"Hiến máu",nav:"/donateBlood"} ,{context:"Chính sách",nav:"/"} ,{context: "Hỗ trợ",nav:"/"}].map((item) => (
            <Link to={item.nav}
              key={item.context}
              className="px-2 py-2 text-sm font-bold rounded-sm bg-white shadow-sm text-gray-700 hover:bg-blue-50 transition"
            >
              {item.context}
            </Link>
          ))}
        </nav>
      </div>
      {/* Phần user & action */}
      <div className="flex items-center gap-4">
        <div className={`hidden md:block text-2xl text-gray-500 mr-4 ${locationClass} rounded-full px-6 py-3`}>
          <span className="inline-block align-middle mr-1">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="10" r="6" stroke="#7C8DB0" strokeWidth="2" />
              <path d="M12 16v4" stroke="#7C8DB0" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          Nhà văn hóa sinh viên,Q9
        </div>
        <div className="flex gap-2">
          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-900 transition">
            <FaPhone size={16} />
          </button>
          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 hover:bg-blue-600 hover:text-white transition">
            <FaBell size={16} />
          </button>
          {user ? (
            <UserDropdown user={user} onLogout={handleLogout} />
          ) : (
            <Link
              to="/login"
              className="px-8 pt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-base font-semibold shadow transition"
            >
              Đăng nhập
            </Link>
           )} 
        </div>
      </div>
    </motion.header>
  );
};

export default HeaderComponent;
