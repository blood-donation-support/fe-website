// UserDropdown.tsx
import type { UserProfile } from "@/redux/slices/userSlice";
import type { User } from "@/types/user";
import React, { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

type Props = {
  user: UserProfile | null;
  onLogout: () => void;
};

const UserDropdown: React.FC<Props> = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(user);
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
        title={user.full_name}
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <FaUser size={20} />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-4 px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-lg">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-lg">
                {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span>{user.full_name?.charAt(0)?.toUpperCase() || "?"}</span>
                  )}
              </div>
            </div>
            <div>
              <div className="font-bold">{user.full_name}</div>
              <div className="text-gray-400 text-sm">{user.email}</div>
            </div>
          </div>
          <hr className="mb-4" />
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                to="/profile/info"
                className="block px-2 py-2 hover:bg-blue-50 rounded-md text-gray-700 font-medium"
                onClick={() => setOpen(false)}
              >
                Thông tin cá nhân
              </Link>
            </li>
            {user.role === "Customer" && (
              <li>
                <Link
                  to="/profile/customer-history"
                  className="block px-2 py-2 hover:bg-blue-50 rounded-md text-gray-700 font-medium"
                  onClick={() => setOpen(false)}
                >
                  Lịch sử đơn đăng kí 
                </Link>
              </li>
            )}
            {user.role === "Admin" && (
              <li>
                <Link
                  to="/dashboard-admin"
                  className="block px-2 py-2 hover:bg-blue-50 rounded-md text-gray-700 font-medium"
                  onClick={() => setOpen(false)}
                >
                  Quản lý quản trị viên
                </Link>
              </li>
            )}
            {(user.role === "Staff" ) && (
              <li>
                <Link
                  to="/dashboard-staff"
                  className="block px-2 py-2 hover:bg-blue-50 rounded-md text-gray-700 font-medium"
                  onClick={() => setOpen(false)}
                >
                  Quản lý nhân viên
                </Link>
              </li>
            )}
            {user.role === "Staff Warehouse" && (
              <li>
                <Link
                  to="/dashboard-staff-warehouse"
                  className="block px-2 py-2 hover:bg-blue-50 rounded-md text-gray-700 font-medium"
                  onClick={() => setOpen(false)}
                >
                  Quản lý kho
                </Link>
              </li>
            )}
            {/* <li>
              <Link
                to="/profile/blood-history"
                className="block px-2 py-2 hover:bg-blue-50 rounded-md text-gray-700 font-medium"
                onClick={() => setOpen(false)}
              >
                Lịch sử đơn đăng kí
              </Link>
            </li> */}
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
