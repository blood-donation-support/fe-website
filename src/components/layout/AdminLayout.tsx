import Header from "../Header";
import AdminSidebar from "./sidebar/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      <div className="flex h-screen bg-[#f8f9fa]">
        <AdminSidebar />
        <main className="flex-1 p-2 sm:p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
          <Header />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
