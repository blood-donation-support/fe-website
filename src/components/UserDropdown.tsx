// UserDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

type User = {
  fullname: string;
  email: string;
  phone?: string;

};

type Props = {
  user: User | null;
  onLogout: () => void;
};

const UserDropdown: React.FC<Props> = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null; 

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 hover:bg-blue-600 hover:text-white transition"
        title={user.fullname}
      >
        <FaUser size={20} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-4 px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-lg">
              {user.fullname.charAt(0).toUpperCase()}

            </div>
            <div>
              <div className="font-bold">{user.fullname}</div>
              <div className="text-gray-400 text-sm">{user.email}</div>
            </div>
          </div>
          <hr className="mb-4" />
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                to="/profile"
                className="block px-2 py-2 hover:bg-blue-50 rounded-md text-gray-700 font-medium"
                onClick={() => setOpen(false)}
              >
                Thông tin cá nhân
              </Link>
            </li>
            <li>
              <Link
                to="/blood-history"
                className="block px-2 py-2 hover:bg-blue-50 rounded-md text-gray-700 font-medium"
                onClick={() => setOpen(false)}
              >
                Lịch sử nhận máu
              </Link>
            </li>
            <li>
              <Link
                to="/blood-history"
                className="block px-2 py-2 hover:bg-blue-50 rounded-md text-gray-700 font-medium"
                onClick={() => setOpen(false)}
              >
                Lịch sử hiến máu
              </Link>
            </li>
          </ul>
          <button
            onClick={onLogout}
            className="w-full mt-4 px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
