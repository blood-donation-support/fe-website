
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      <div className="flex min-h-screen bg-[#f8f9fa]">
        <Sidebar />
        <main className="flex-1 p-2 sm:p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
          <Header />
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}
