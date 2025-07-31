import Header from "../Header";
import StaffSidebar from "./sidebar/StaffSidebar";
import { Outlet } from "react-router-dom";

export default function StaffLayout() {
  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      <div className="flex h-screen bg-[#fdfdfd]">
        <StaffSidebar />
        <main className="flex-1 p-2 sm:p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
          <Header />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
