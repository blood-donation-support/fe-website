import { Routes, Route, NavLink, Outlet } from "react-router-dom";
import HeaderComponent from "../commons/header-component";
import FooterComponent from "../commons/footer-component";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function ProfileLayout() {
    const profile = useSelector((state: RootState) => state.users.profile);
    return (<>
    <HeaderComponent />
    <div className="min-h-screen bg-gray-50 flex flex-col mt-[5%]">
        <div className="flex mt-8 mb-2 w-full justify-center">
        <NavLink
            to="info"
            className={({ isActive }) =>
            `px-6 py-3 text-lg font-semibold rounded-t-lg transition ${
                isActive
                ? "bg-white border-b-2 border-blue-600 text-blue-600"
                : "bg-gray-100 text-gray-400"
            }`
            }
        >
            Thông tin cá nhân
        </NavLink>
        {profile?.role === "Customer" && ( <NavLink
            to="blood-history"
            className={({ isActive }) =>
            `px-6 py-3 text-lg font-semibold rounded-t-lg transition ${
                isActive
                ? "bg-white border-b-2 border-blue-600 text-blue-600"
                : "bg-gray-100 text-gray-400"
            }`
            }
        >
            Lịch sử đơn
        </NavLink>
    )}
        <NavLink
            to="change-password"
            className={({ isActive }) =>
            `px-6 py-3 text-lg font-semibold rounded-t-lg transition ${
                isActive
                ? "bg-white border-b-2 border-blue-600 text-blue-600"
                : "bg-gray-100 text-gray-400"
            }`
            }
        >
            Đổi mật khẩu
        </NavLink>
        {/* <NavLink
            to="notifications"
            className={({ isActive }) =>
            `px-6 py-3 text-lg font-semibold rounded-t-lg transition ${
                isActive
                ? "bg-white border-b-2 border-blue-600 text-blue-600"
                : "bg-gray-100 text-gray-400"
            }`
            }
        >
            Thông báo
        </NavLink> */}
        </div>
        <div className="mb-8">
            <Outlet />
        </div>
  </div>
  <FooterComponent />
  </>
)};
  