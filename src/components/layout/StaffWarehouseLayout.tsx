import Header from "../Header";
import { Outlet } from "react-router-dom";
import StaffWarehouseSidebar from "./sidebar/StaffWarehouseSidebar";

export default function StaffWarehouseLayout() {
  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      <div className="flex h-screen bg-[#fdfdfd]">
        <StaffWarehouseSidebar />
        <main className="flex-1 p-2 sm:p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
          <Header />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
