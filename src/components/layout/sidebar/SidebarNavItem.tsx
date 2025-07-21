import { NavLink } from "react-router-dom";
// import { cn } from "@/lib/utils"; // nếu bạn có className helper, hoặc bỏ `cn` dùng template string

interface SidebarNavItemProps {
  icon: string;
  label: string;
  path: string;
}

export default function SidebarNavItem({ icon, label, path }: SidebarNavItemProps) {
  return (
    <NavLink
      to={path}
    //   className={({ isActive }) =>
    //     cn(
    //       "flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition rounded-md",
    //       isActive ? "bg-gray-200 font-semibold text-primary" : "text-gray-700"
    //     )
    //   }
    className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-md ${isActive ? 'bg-[#f7f9ff] text-[#236afe] font-semibold' : 'text-gray-700'} hover:bg-gray-100`}

    >
      <i className={`fa-solid ${icon} w-5`}></i>
      <span>{label}</span>
    </NavLink>
  );
}
